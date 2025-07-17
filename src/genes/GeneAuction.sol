// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/console.sol";
import {Initializable} from "oz/proxy/utils/Initializable.sol";
import {Ownable} from "oz/access/Ownable.sol";
import {ReentrancyGuard} from "oz/security/ReentrancyGuard.sol";

import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";
import {IAminalFactory} from "src/interfaces/IAminalFactory.sol";
import {IAminal} from "src/interfaces/IAminal.sol";
import {Genes} from "src/genes/Genes.sol";
import {GeneRegistry} from "src/genes/GeneRegistry.sol";

/**
 * @title GeneAuction - Community-Driven Gene Selection for Aminal Breeding
 * @notice Love-based voting system for Gene NFT trait selection with treasury payouts to gene creators
 * @dev Manages breeding auctions where community votes determine child Aminal traits
 *
 * When two Aminals breed, a gene auction is created where:
 * - Community members vote using their love given to parent Aminals
 * - Winners are selected for each trait category (8 total)
 * - 10% of each parent's treasury is distributed to winning gene creators
 * - Child Aminal is spawned with the winning traits
 *
 * Key Features:
 * - 🗳️ Love-weighted voting system
 * - 💰 Treasury payouts to gene creators (10% from each parent)
 * - 🎲 Tie-breaking with deterministic randomness
 * - 🔄 Parent trait inheritance as fallback
 * - ⏱️ Time-limited voting periods
 * - 🛡️ Gene removal voting for quality control
 *
 * @author The Aminals Collective
 * @custom:security-contact security@aminals.art
 */
contract GeneAuction is IAminalStructs, Initializable, Ownable, ReentrancyGuard {
    /*//////////////////////////////////////////////////////////////
                                CONSTANTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Duration of voting in seconds (1 hour for testing, will be 7 days in production)
    uint256 public constant VOTING_DURATION = 1 hours;

    /// @notice Percentage of parent treasury transferred to gene creators (10%)
    uint256 public constant TREASURY_TRANSFER_PERCENTAGE = 10;

    /// @notice Cost in love and energy to propose a gene
    uint256 public constant PROPOSE_GENE_COST = 10;

    /// @notice Number of trait categories per Aminal
    uint256 public constant TRAIT_CATEGORIES = 8;

    /// @notice Minimum fraction of total love required to remove a gene (1/3)
    uint256 public constant GENE_REMOVAL_THRESHOLD = 3;

    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    /// @notice Gene NFT contract for trait ownership
    Genes public genes;

    /// @notice Gene registry for validating and retrieving gene information
    GeneRegistry public geneRegistry;

    /// @notice Address of the Aminals contract (for access control)
    address public aminalsContract;

    /// @notice Factory contract for Aminal management
    IAminalFactory public aminalFactory;

    /// @notice Counter for unique auction IDs
    uint256 public auctionCounter;

    /// @notice Mapping from auction ID to auction data
    mapping(uint256 => Auction) public auctions;

    /*//////////////////////////////////////////////////////////////
                               STRUCTURES
    //////////////////////////////////////////////////////////////*/

    /// @notice Core auction data structure
    struct Auction {
        uint256 aminalOne; // Index of first parent Aminal
        uint256 aminalTwo; // Index of second parent Aminal
        uint256 totalLove; // Total love used for voting power calculation
        uint256 startTime; // Auction start timestamp
        uint256 endTime; // Auction end timestamp
        bool settled; // Whether auction has been settled
        uint256[8] parentOneTraits; // Parent 1 traits by category
        uint256[8] parentTwoTraits; // Parent 2 traits by category
        mapping(VisualsCat => CategoryVoting) categoryVotes; // Voting data per category
    }

    /// @notice Voting data for a specific trait category
    struct CategoryVoting {
        uint256 highestVotes; // Highest vote count achieved
        uint256 winningGeneId; // Current winning gene ID
        mapping(uint256 => uint256) geneVotes; // geneId => total vote power
        mapping(address => uint256) userVotedGene; // user => geneId they voted for
        mapping(address => uint256) userVoteWeight; // user => vote weight they cast
        mapping(address => bool) userHasVoted; // user => whether they have voted
        mapping(uint256 => uint256) geneRemovalVotes; // geneId => removal vote weight
        // Gas optimization: O(1) lookups instead of O(n) array searches
        mapping(uint256 => bool) isGeneProposed; // geneId => whether gene is proposed
        mapping(uint256 => bool) isGeneTied; // geneId => whether gene is in tied array
        mapping(uint256 => uint256) geneProposalIndex; // geneId => index in proposedGenes array
        uint256[] proposedGenes; // Array of proposed gene IDs
        uint256[] tiedGenes; // Array of genes with highest votes
    }

    /// @notice View structure for category voting information
    struct CategoryVoteInfo {
        uint256 highestVotes; // Highest vote count
        uint256 winningGeneId; // Current winner
        uint256[] proposedGenes; // All proposed genes
        uint256[] tiedGenes; // Genes tied for highest votes
    }

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Emitted when a new breeding auction is created
    /// @param auctionId Unique identifier for the auction
    /// @param aminalOne Index of the first parent Aminal
    /// @param aminalTwo Index of the second parent Aminal
    /// @param totalLove Total love available for voting power
    /// @param startTime When voting begins
    /// @param endTime When voting ends
    event VotingCreated(
        uint256 indexed auctionId,
        uint256 indexed aminalOne,
        uint256 indexed aminalTwo,
        uint256 totalLove,
        uint256 startTime,
        uint256 endTime
    );

    /// @notice Emitted when a user votes for a gene in a category
    /// @param auctionId The auction being voted in
    /// @param category The trait category being voted on
    /// @param geneId The gene being voted for
    /// @param voter Address of the voter
    event GeneVoteCast(uint256 indexed auctionId, VisualsCat indexed category, uint256 indexed geneId, address voter);

    /// @notice Emitted when a user votes for multiple categories at once
    /// @param auctionId The auction being voted in
    /// @param voter Address of the voter
    /// @param geneIds Array of gene IDs voted for (by category index)
    event BulkVoteCast(uint256 indexed auctionId, address indexed voter, uint256[8] geneIds);

    /// @notice Emitted when an auction is settled and child is spawned
    /// @param auctionId The settled auction
    /// @param winningGeneIds Array of winning gene IDs by category
    /// @param totalTreasuryTransferred Total ETH paid to gene creators
    event VotingSettled(uint256 indexed auctionId, uint256[8] winningGeneIds, uint256 totalTreasuryTransferred);

    /// @notice Emitted when a gene creator receives payment for their winning gene
    /// @param auctionId The auction that generated the payout
    /// @param geneId The winning gene that earned the payout
    /// @param creator Address of the gene creator receiving payment
    /// @param amount Amount of ETH transferred to the creator
    event GeneCreatorPayout(uint256 indexed auctionId, uint256 indexed geneId, address indexed creator, uint256 amount);

    /// @notice Emitted when a gene is proposed for voting in a category
    /// @param auctionId The auction the gene is proposed for
    /// @param category The trait category the gene belongs to
    /// @param geneId The proposed gene ID
    /// @param proposer Address of the proposer
    event GeneProposed(
        uint256 indexed auctionId, VisualsCat indexed category, uint256 indexed geneId, address proposer
    );

    /// @notice Emitted when someone votes to remove a gene from consideration
    /// @param auctionId The auction containing the gene
    /// @param category The trait category of the gene
    /// @param geneId The gene being voted for removal
    /// @param voter Address voting for removal
    /// @param voteWeight Weight of the removal vote
    event GeneRemovalVote(
        uint256 indexed auctionId,
        VisualsCat indexed category,
        uint256 indexed geneId,
        address voter,
        uint256 voteWeight
    );

    /// @notice Emitted when a gene is successfully removed from an auction
    /// @param auctionId The auction the gene was removed from
    /// @param category The trait category of the removed gene
    /// @param geneId The removed gene ID
    event GeneRemoved(uint256 indexed auctionId, VisualsCat indexed category, uint256 indexed geneId);

    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/

    /// @notice Thrown when trying to interact with an inactive auction
    error VotingNotActive();

    /// @notice Thrown when trying to modify an already settled auction
    error VotingAlreadySettled();

    /// @notice Thrown when referencing an invalid or non-existent gene
    error InvalidGene();

    /// @notice Thrown when trying to settle an auction before it ends
    error VotingNotEnded();

    /// @notice Thrown when non-Factory contract tries to call restricted functions
    error OnlyFactory();

    /// @notice Thrown when providing an invalid trait category
    error InvalidCategory();

    /// @notice Thrown when user lacks sufficient love for an action
    error InsufficientLove();

    /// @notice Thrown when a gene has already been removed
    error GeneAlreadyRemoved();

    /// @notice Thrown when user has no voting power in an auction
    error NoVotingPower();

    /*//////////////////////////////////////////////////////////////
                               MODIFIERS
    //////////////////////////////////////////////////////////////*/

    /// @notice Restricts function access to the Factory contract only
    modifier onlyFactory() {
        if (msg.sender != aminalsContract) revert OnlyFactory();
        _;
    }

    /// @notice Validates that an auction exists
    /// @param auctionId The auction ID to validate
    modifier validVoting(uint256 auctionId) {
        require(auctionId <= auctionCounter, "Voting does not exist");
        _;
    }

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    /// @notice Initialize the GeneAuction with required contracts
    /// @param _Genes Address of the Genes NFT contract
    /// @param _geneRegistry Address of the GeneRegistry contract
    constructor(address _Genes, address _geneRegistry) {
        genes = Genes(_Genes);
        geneRegistry = GeneRegistry(_geneRegistry);
    }

    // TODO only needs on argument _aminalsFactory, it's the same contract
    /// @notice Setup function to initialize factory and aminals contract addresses
    /// @param _aminalsContract Address of the Aminals contract
    /// @param _aminalFactory Address of the AminalFactory contract
    /// @custom:access Only owner can call during initialization
    function setup(address _aminalsContract, address _aminalFactory) external initializer onlyOwner {
        aminalsContract = _aminalsContract;
        aminalFactory = IAminalFactory(_aminalFactory);
    }

    /*//////////////////////////////////////////////////////////////
                           AUCTION LIFECYCLE
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Create a new breeding auction for two parent Aminals
     * @dev Called by the AminalFactory when breeding is initiated
     * @param aminalOne Index of the first parent Aminal
     * @param aminalTwo Index of the second parent Aminal
     * @param totalLove Total love used for voting power calculations
     * @return auctionId The unique identifier for the created auction
     */
    function createAuction(uint256 aminalOne, uint256 aminalTwo, uint256 totalLove)
        external
        onlyFactory
        returns (uint256 auctionId)
    {
        auctionId = ++auctionCounter;

        Auction storage auction = auctions[auctionId];
        auction.aminalOne = aminalOne;
        auction.aminalTwo = aminalTwo;
        auction.totalLove = totalLove;
        auction.startTime = block.timestamp;
        auction.endTime = block.timestamp + VOTING_DURATION;

        // Store parent traits for inheritance fallback
        _captureParentTraits(auction, aminalOne, aminalTwo);

        emit VotingCreated(auctionId, aminalOne, aminalTwo, totalLove, auction.startTime, auction.endTime);
        return auctionId;
    }

    /**
     * @notice Settle a completed auction and spawn the child Aminal
     * @dev Can be called by anyone after voting ends. Distributes treasury to gene creators.
     * @param auctionId The auction to settle
     */
    function settleAuction(uint256 auctionId) external validVoting(auctionId) nonReentrant {
        Auction storage auction = auctions[auctionId];

        if (block.timestamp < auction.endTime) revert VotingNotEnded();
        if (auction.settled) revert VotingAlreadySettled();

        auction.settled = true;

        uint256[8] memory winningGeneIds;
        uint256 totalTreasuryTransferred = 0;

        // Gas optimization: Cache all external calls and pre-calculate values
        address aminalOneAddress = aminalFactory.getAminalByIndex(auction.aminalOne);
        address aminalTwoAddress = aminalFactory.getAminalByIndex(auction.aminalTwo);

        uint256 aminalOneTreasury = IAminal(aminalOneAddress).getTreasuryBalance();
        uint256 aminalTwoTreasury = IAminal(aminalTwoAddress).getTreasuryBalance();
        uint256 treasuryFromAminalOne = (aminalOneTreasury * TREASURY_TRANSFER_PERCENTAGE) / 100;
        uint256 treasuryFromAminalTwo = (aminalTwoTreasury * TREASURY_TRANSFER_PERCENTAGE) / 100;

        // Pre-calculate treasury per gene to avoid repeated division
        uint256 treasuryPerGene = (treasuryFromAminalOne + treasuryFromAminalTwo) / TRAIT_CATEGORIES;
        uint256 treasuryPerGeneHalf = treasuryPerGene / 2;

        // Process each trait category
        for (uint256 i = 0; i < TRAIT_CATEGORIES; i++) {
            VisualsCat category = VisualsCat(i);
            uint256 selectedGeneId = _selectWinningGene(auction, category, i);
            winningGeneIds[i] = selectedGeneId;

            // Transfer treasury to gene creator if applicable
            if (selectedGeneId != 0 && geneRegistry.isValidGene(selectedGeneId)) {
                totalTreasuryTransferred += _payoutGeneCreator(
                    auctionId, selectedGeneId, treasuryPerGeneHalf, aminalOneAddress, aminalTwoAddress
                );
            }
        }

        emit VotingSettled(auctionId, winningGeneIds, totalTreasuryTransferred);

        // Spawn the child Aminal with winning traits
        aminalFactory.spawnAminal(aminalOneAddress, aminalTwoAddress, winningGeneIds);
    }

    /**
     * @notice Propose a Gene NFT for a specific trait category in voting
     * @dev Anyone can propose genes
     */
    function proposeGene(uint256 auctionId, VisualsCat category, uint256 geneId) external validVoting(auctionId) {
        Auction storage auction = auctions[auctionId];

        if (block.timestamp >= auction.endTime) revert VotingNotActive();
        if (auction.settled) revert VotingAlreadySettled();
        if (uint256(category) >= TRAIT_CATEGORIES) revert InvalidCategory();

        // Verify gene exists and is from the registry
        if (!geneRegistry.isValidGene(geneId)) revert InvalidGene();

        // Verify gene is in the correct category
        (, VisualsCat geneCategory,) = geneRegistry.getGeneInfo(geneId);
        if (geneCategory != category) revert InvalidCategory();

        CategoryVoting storage categoryVoting = auction.categoryVotes[category];

        // Consume love from user and energy via squeakFrom. SquakFrom checks required love and energy
        IAminal(aminalFactory.getAminalByIndex(auction.aminalOne)).squeakFrom(msg.sender, PROPOSE_GENE_COST);
        IAminal(aminalFactory.getAminalByIndex(auction.aminalTwo)).squeakFrom(msg.sender, PROPOSE_GENE_COST);

        // Gas optimization: O(1) lookup instead of O(n) search
        if (categoryVoting.isGeneProposed[geneId]) return; // Already proposed, no need to add again

        // Mark as proposed and add to array
        categoryVoting.isGeneProposed[geneId] = true;
        categoryVoting.geneProposalIndex[geneId] = categoryVoting.proposedGenes.length;
        categoryVoting.proposedGenes.push(geneId);
        emit GeneProposed(auctionId, category, geneId, msg.sender);
    }

    /**
     * @notice Vote on a specific Gene NFT with full voting power
     * @dev Users vote with their full voting power based on love given to parent Aminals
     */
    function voteOnGene(uint256 auctionId, VisualsCat category, uint256 geneId) external validVoting(auctionId) {
        Auction storage auction = auctions[auctionId];

        if (block.timestamp >= auction.endTime) revert VotingNotActive();
        if (auction.settled) revert VotingAlreadySettled();
        if (uint256(category) >= TRAIT_CATEGORIES) revert InvalidCategory();

        // Calculate user's voting power based on love given to parent Aminals
        uint256 userVotingPower = _calculateVotingPower(auction, msg.sender);
        if (userVotingPower == 0) revert NoVotingPower();

        // Verify gene is valid for voting (either proposed or parent trait)
        if (!_isGeneValidForVoting(auction, category, geneId)) revert InvalidGene();

        CategoryVoting storage categoryVoting = auction.categoryVotes[category];

        // Remove previous vote if exists
        uint256 previousGeneId = categoryVoting.userVotedGene[msg.sender];
        if (previousGeneId != 0) {
            uint256 previousVoteWeight = categoryVoting.userVoteWeight[msg.sender];
            categoryVoting.geneVotes[previousGeneId] -= previousVoteWeight;
        }

        // Add new vote with full voting power
        categoryVoting.userVotedGene[msg.sender] = geneId;
        categoryVoting.userVoteWeight[msg.sender] = userVotingPower;
        categoryVoting.userHasVoted[msg.sender] = true;
        categoryVoting.geneVotes[geneId] += userVotingPower;

        // Update highest vote for category and handle ties
        _updateCategoryWinner(categoryVoting, geneId);

        emit GeneVoteCast(auctionId, category, geneId, msg.sender);
    }

    /**
     * @notice Vote on genes for all trait categories in a single transaction
     * @dev Users vote with full power on each specified gene (0 = no vote for that category)
     */
    function bulkVoteOnGenes(uint256 auctionId, uint256[8] calldata geneIds) external validVoting(auctionId) {
        Auction storage auction = auctions[auctionId];

        if (block.timestamp >= auction.endTime) revert VotingNotActive();
        if (auction.settled) revert VotingAlreadySettled();

        // Calculate user's voting power once and reuse
        uint256 userVotingPower = _calculateVotingPower(auction, msg.sender);
        if (userVotingPower == 0) revert NoVotingPower();

        // Process votes for each category
        for (uint256 i = 0; i < TRAIT_CATEGORIES; i++) {
            if (geneIds[i] != 0) {
                VisualsCat category = VisualsCat(i);
                _processSingleVote(auction, category, geneIds[i], userVotingPower);
            }
        }

        emit BulkVoteCast(auctionId, msg.sender, geneIds);
    }

    /**
     * @notice Internal function to process a single vote
     */
    function _processSingleVote(Auction storage auction, VisualsCat category, uint256 geneId, uint256 userVotingPower)
        internal
    {
        // Verify gene is valid for voting (either proposed or parent trait)
        if (!_isGeneValidForVoting(auction, category, geneId)) revert InvalidGene();

        CategoryVoting storage categoryVoting = auction.categoryVotes[category];

        // Remove previous vote if exists
        uint256 previousGeneId = categoryVoting.userVotedGene[msg.sender];
        if (categoryVoting.userHasVoted[msg.sender]) {
            uint256 previousVoteWeight = categoryVoting.userVoteWeight[msg.sender];
            categoryVoting.geneVotes[previousGeneId] -= previousVoteWeight;
        }

        // Add new vote with full voting power
        categoryVoting.userVotedGene[msg.sender] = geneId;
        categoryVoting.userVoteWeight[msg.sender] = userVotingPower;
        categoryVoting.userHasVoted[msg.sender] = true;
        categoryVoting.geneVotes[geneId] += userVotingPower;

        // Update highest vote for category and handle ties
        _updateCategoryWinner(categoryVoting, geneId);
    }

    /**
     * @notice Vote to remove a Gene NFT from the auction
     * @dev Requires 1/3 of total love to remove a gene
     */
    function voteToRemoveGene(uint256 auctionId, VisualsCat category, uint256 geneId, uint256 voteWeight)
        external
        validVoting(auctionId)
    {
        Auction storage auction = auctions[auctionId];

        if (block.timestamp >= auction.endTime) revert VotingNotActive();
        if (auction.settled) revert VotingAlreadySettled();
        if (uint256(category) >= TRAIT_CATEGORIES) revert InvalidCategory();

        // Calculate user's voting power
        uint256 userVotingPower = _calculateVotingPower(auction, msg.sender);
        if (voteWeight > userVotingPower) revert InsufficientLove();

        // Verify gene is valid for voting (either proposed or parent trait)
        if (!_isGeneValidForVoting(auction, category, geneId)) revert InvalidGene();

        CategoryVoting storage categoryVoting = auction.categoryVotes[category];

        // Add removal vote
        categoryVoting.geneRemovalVotes[geneId] += voteWeight;

        emit GeneRemovalVote(auctionId, category, geneId, msg.sender, voteWeight);

        // Check if gene should be removed (1/3 of total love threshold)
        if (categoryVoting.geneRemovalVotes[geneId] >= auction.totalLove / GENE_REMOVAL_THRESHOLD) {
            _removeGeneFromCategory(auctionId, category, geneId);
        }
    }

    /**
     * @notice Internal function to remove a gene from a category
     */
    function _removeGeneFromCategory(uint256 auctionId, VisualsCat category, uint256 geneId) internal {
        CategoryVoting storage categoryVoting = auctions[auctionId].categoryVotes[category];

        // Gas optimization: O(1) removal using index mapping
        if (categoryVoting.isGeneProposed[geneId]) {
            uint256 geneIndex = categoryVoting.geneProposalIndex[geneId];
            uint256 lastIndex = categoryVoting.proposedGenes.length - 1;

            if (geneIndex != lastIndex) {
                // Move last element to current position
                uint256 lastGeneId = categoryVoting.proposedGenes[lastIndex];
                categoryVoting.proposedGenes[geneIndex] = lastGeneId;
                categoryVoting.geneProposalIndex[lastGeneId] = geneIndex;
            }

            // Remove last element and update mappings
            categoryVoting.proposedGenes.pop();
            categoryVoting.isGeneProposed[geneId] = false;
            delete categoryVoting.geneProposalIndex[geneId];
        }

        // Remove from tied genes if present
        if (categoryVoting.isGeneTied[geneId]) {
            categoryVoting.isGeneTied[geneId] = false;
            // Remove from tiedGenes array - rebuild array without this gene
            uint256[] memory newTiedGenes = new uint256[](categoryVoting.tiedGenes.length);
            uint256 newLength = 0;
            for (uint256 i = 0; i < categoryVoting.tiedGenes.length; i++) {
                if (categoryVoting.tiedGenes[i] != geneId) {
                    newTiedGenes[newLength] = categoryVoting.tiedGenes[i];
                    newLength++;
                }
            }
            delete categoryVoting.tiedGenes;
            for (uint256 i = 0; i < newLength; i++) {
                categoryVoting.tiedGenes.push(newTiedGenes[i]);
            }
        }

        // Reset votes for this gene
        categoryVoting.geneVotes[geneId] = 0;
        categoryVoting.geneRemovalVotes[geneId] = 0;

        // If this was the winning gene, reset the winner
        if (categoryVoting.winningGeneId == geneId) {
            categoryVoting.winningGeneId = 0;
            categoryVoting.highestVotes = 0;

            // Recalculate winner from remaining genes
            for (uint256 i = 0; i < categoryVoting.proposedGenes.length; i++) {
                uint256 currentGeneId = categoryVoting.proposedGenes[i];
                if (categoryVoting.geneVotes[currentGeneId] > categoryVoting.highestVotes) {
                    categoryVoting.highestVotes = categoryVoting.geneVotes[currentGeneId];
                    categoryVoting.winningGeneId = currentGeneId;
                }
            }
        }

        emit GeneRemoved(auctionId, category, geneId);
    }

    /**
     * @notice Update category winner and handle ties
     */
    function _updateCategoryWinner(CategoryVoting storage categoryVoting, uint256 geneId) internal {
        uint256 currentVotes = categoryVoting.geneVotes[geneId];

        if (currentVotes > categoryVoting.highestVotes) {
            // New highest, clear ties and set winner
            categoryVoting.highestVotes = currentVotes;
            categoryVoting.winningGeneId = geneId;

            // Clear tied genes mappings and array
            for (uint256 i = 0; i < categoryVoting.tiedGenes.length; i++) {
                categoryVoting.isGeneTied[categoryVoting.tiedGenes[i]] = false;
            }
            delete categoryVoting.tiedGenes;

            // Add new winner to tied genes
            categoryVoting.isGeneTied[geneId] = true;
            categoryVoting.tiedGenes.push(geneId);
        } else if (currentVotes == categoryVoting.highestVotes && currentVotes > 0) {
            // First vote or tie detected
            if (categoryVoting.tiedGenes.length == 0) {
                // First vote with this amount, initialize tiedGenes
                categoryVoting.isGeneTied[geneId] = true;
                categoryVoting.tiedGenes.push(geneId);
                categoryVoting.winningGeneId = geneId;
            } else {
                // Gas optimization: O(1) lookup instead of O(n) search
                if (!categoryVoting.isGeneTied[geneId]) {
                    categoryVoting.isGeneTied[geneId] = true;
                    categoryVoting.tiedGenes.push(geneId);
                }
            }
        }
    }

    /**
     * @notice Internal helper to check if a gene is valid for voting
     * @dev A gene is valid if it's either proposed for the category OR is a parent trait
     * @param auction The auction storage reference
     * @param category The trait category
     * @param geneId The gene ID to validate
     * @return isValid True if the gene can be voted on
     */
    function _isGeneValidForVoting(Auction storage auction, VisualsCat category, uint256 geneId)
        internal
        view
        returns (bool isValid)
    {
        CategoryVoting storage categoryVoting = auction.categoryVotes[category];

        // Gas optimization: O(1) lookup instead of O(n) search
        if (categoryVoting.isGeneProposed[geneId]) return true;

        // If not proposed, check if it's a parent trait
        uint256 categoryIndex = uint256(category);
        return (auction.parentOneTraits[categoryIndex] == geneId || auction.parentTwoTraits[categoryIndex] == geneId);
    }

    /**
     * @notice Generate pseudo-random number for tie-breaking and fallbacks
     * @dev Uses block data for deterministic randomness - not cryptographically secure
     */
    function _generateRandomness(uint256 seed, uint256 max) internal view returns (uint256) {
        if (max == 0) return 0;

        uint256 randomValue =
            uint256(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, block.number, msg.sender, seed)));
        return randomValue % max;
    }

    /**
     * @notice Calculate a user's voting power based on love given to parent Aminals
     * @dev Voting power is the sum of love given to both parent Aminals
     */
    function _calculateVotingPower(Auction storage auction, address user) internal view returns (uint256) {
        address aminalOneAddress = aminalFactory.getAminalByIndex(auction.aminalOne);
        address aminalTwoAddress = aminalFactory.getAminalByIndex(auction.aminalTwo);

        uint256 loveToAminalOne = IAminal(aminalOneAddress).getLoveByUser(user);
        uint256 loveToAminalTwo = IAminal(aminalTwoAddress).getLoveByUser(user);

        return loveToAminalOne + loveToAminalTwo;
    }

    /**
     * @notice Get auction information
     */
    function getAuctionInfo(uint256 auctionId)
        external
        view
        validVoting(auctionId)
        returns (
            uint256 aminalOne,
            uint256 aminalTwo,
            uint256 totalLove,
            uint256 startTime,
            uint256 endTime,
            bool settled
        )
    {
        Auction storage auction = auctions[auctionId];
        return (
            auction.aminalOne, auction.aminalTwo, auction.totalLove, auction.startTime, auction.endTime, auction.settled
        );
    }

    /**
     * @notice Get category voting information
     */
    function getCategoryVoting(uint256 auctionId, VisualsCat category)
        external
        view
        validVoting(auctionId)
        returns (CategoryVoteInfo memory)
    {
        CategoryVoting storage categoryVoting = auctions[auctionId].categoryVotes[category];
        return CategoryVoteInfo({
            highestVotes: categoryVoting.highestVotes,
            winningGeneId: categoryVoting.winningGeneId,
            proposedGenes: categoryVoting.proposedGenes,
            tiedGenes: categoryVoting.tiedGenes
        });
    }

    /**
     * @notice Get vote information for a specific gene
     */
    function getGeneVotes(uint256 auctionId, VisualsCat category, uint256 geneId)
        external
        view
        validVoting(auctionId)
        returns (uint256 totalVotes)
    {
        CategoryVoting storage categoryVoting = auctions[auctionId].categoryVotes[category];
        return categoryVoting.geneVotes[geneId];
    }

    /**
     * @notice Get user's vote for a specific gene
     */
    function getUserVote(uint256 auctionId, VisualsCat category, uint256 geneId, address user)
        external
        view
        validVoting(auctionId)
        returns (uint256 voteWeight)
    {
        Auction storage auction = auctions[auctionId];
        CategoryVoting storage categoryVoting = auction.categoryVotes[category];

        // Check if user voted for this specific gene
        if (categoryVoting.userHasVoted[user] && categoryVoting.userVotedGene[user] == geneId) {
            return categoryVoting.userVoteWeight[user];
        }

        return 0; // User didn't vote for this gene
    }

    /**
     * @notice Get which gene a user voted for in a category
     */
    function getUserVotedGene(uint256 auctionId, VisualsCat category, address user)
        external
        view
        validVoting(auctionId)
        returns (uint256 geneId)
    {
        CategoryVoting storage categoryVoting = auctions[auctionId].categoryVotes[category];
        return categoryVoting.userVotedGene[user];
    }

    /**
     * @notice Get user's total voting power for an auction
     */
    function getUserVotingPower(uint256 auctionId, address user)
        external
        view
        validVoting(auctionId)
        returns (uint256)
    {
        Auction storage auction = auctions[auctionId];
        return _calculateVotingPower(auction, user);
    }

    /**
     * @notice Check if voting is active
     */
    function isVotingActive(uint256 auctionId) external view validVoting(auctionId) returns (bool) {
        Auction storage auction = auctions[auctionId];
        return block.timestamp < auction.endTime && !auction.settled;
    }

    /**
     * @notice Get parent traits for an auction
     */
    function getParentTraits(uint256 auctionId)
        external
        view
        validVoting(auctionId)
        returns (uint256[8] memory parentOneTraits, uint256[8] memory parentTwoTraits)
    {
        Auction storage auction = auctions[auctionId];
        return (auction.parentOneTraits, auction.parentTwoTraits);
    }

    /**
     * @notice Get gene removal votes for a specific gene
     */
    function getGeneRemovalVotes(uint256 auctionId, VisualsCat category, uint256 geneId)
        external
        view
        validVoting(auctionId)
        returns (uint256 removalVotes)
    {
        CategoryVoting storage categoryVoting = auctions[auctionId].categoryVotes[category];
        return categoryVoting.geneRemovalVotes[geneId];
    }

    /*//////////////////////////////////////////////////////////////
                           INTERNAL HELPERS
    //////////////////////////////////////////////////////////////*/

    /// @notice Capture parent traits for inheritance fallback
    /// @param auction The auction storage reference
    /// @param aminalOne Index of first parent
    /// @param aminalTwo Index of second parent
    function _captureParentTraits(Auction storage auction, uint256 aminalOne, uint256 aminalTwo) internal {
        address aminalOneAddress = aminalFactory.getAminalByIndex(aminalOne);
        address aminalTwoAddress = aminalFactory.getAminalByIndex(aminalTwo);

        Visuals memory parentOneVisuals = IAminal(aminalOneAddress).getVisuals();
        Visuals memory parentTwoVisuals = IAminal(aminalTwoAddress).getVisuals();

        // Store parent traits in order of VisualsCat enum
        auction.parentOneTraits[0] = parentOneVisuals.backId;
        auction.parentOneTraits[1] = parentOneVisuals.armId;
        auction.parentOneTraits[2] = parentOneVisuals.tailId;
        auction.parentOneTraits[3] = parentOneVisuals.earsId;
        auction.parentOneTraits[4] = parentOneVisuals.bodyId;
        auction.parentOneTraits[5] = parentOneVisuals.faceId;
        auction.parentOneTraits[6] = parentOneVisuals.mouthId;
        auction.parentOneTraits[7] = parentOneVisuals.miscId;

        auction.parentTwoTraits[0] = parentTwoVisuals.backId;
        auction.parentTwoTraits[1] = parentTwoVisuals.armId;
        auction.parentTwoTraits[2] = parentTwoVisuals.tailId;
        auction.parentTwoTraits[3] = parentTwoVisuals.earsId;
        auction.parentTwoTraits[4] = parentTwoVisuals.bodyId;
        auction.parentTwoTraits[5] = parentTwoVisuals.faceId;
        auction.parentTwoTraits[6] = parentTwoVisuals.mouthId;
        auction.parentTwoTraits[7] = parentTwoVisuals.miscId;
    }

    /// @notice Select the winning gene for a trait category
    /// @param auction The auction storage reference
    /// @param category The trait category
    /// @param categoryIndex Numeric index of the category (for randomness seed)
    /// @return selectedGeneId The selected gene ID (0 if no trait)
    function _selectWinningGene(Auction storage auction, VisualsCat category, uint256 categoryIndex)
        internal
        view
        returns (uint256 selectedGeneId)
    {
        CategoryVoting storage categoryVoting = auction.categoryVotes[category];

        // Step 1: Check if there are any votes
        if (categoryVoting.highestVotes > 0 && categoryVoting.tiedGenes.length > 0) {
            // Check for ties
            if (categoryVoting.tiedGenes.length > 1) {
                // Handle tie with randomness
                uint256 randomIndex = _generateRandomness(categoryIndex, categoryVoting.tiedGenes.length);
                selectedGeneId = categoryVoting.tiedGenes[randomIndex];
            } else {
                // Clear winner - use the single tied gene
                selectedGeneId = categoryVoting.tiedGenes[0];
            }
        } else {
            // Step 2: No votes cast, fall back to parent traits
            selectedGeneId = _selectParentTrait(auction, categoryIndex);
        }

        return selectedGeneId;
    }

    /// @notice Select a parent trait when no votes are cast
    /// @param auction The auction storage reference
    /// @param categoryIndex The trait category index
    /// @return selectedGeneId The selected parent trait ID (0 if none)
    function _selectParentTrait(Auction storage auction, uint256 categoryIndex)
        internal
        view
        returns (uint256 selectedGeneId)
    {
        // Create array of available parent traits (excluding 0 which means no trait)
        uint256[] memory availableTraits = new uint256[](2);
        uint256 availableCount = 0;

        if (auction.parentOneTraits[categoryIndex] != 0) {
            availableTraits[availableCount] = auction.parentOneTraits[categoryIndex];
            availableCount++;
        }
        if (
            auction.parentTwoTraits[categoryIndex] != 0
                && auction.parentTwoTraits[categoryIndex] != auction.parentOneTraits[categoryIndex]
        ) {
            availableTraits[availableCount] = auction.parentTwoTraits[categoryIndex];
            availableCount++;
        }

        if (availableCount > 0) {
            // Randomly select from available parent traits
            uint256 randomIndex = _generateRandomness(categoryIndex + 1000, availableCount);
            selectedGeneId = availableTraits[randomIndex];
        }
        // If availableCount == 0, selectedGeneId remains 0 (no trait)

        return selectedGeneId;
    }

    /// @notice Transfer treasury to gene creator with pre-calculated amounts
    /// @param auctionId The auction ID
    /// @param selectedGeneId The winning gene ID
    /// @param treasuryPerGeneHalf Pre-calculated half of treasury per gene
    /// @param aminalOneAddress Address of first parent
    /// @param aminalTwoAddress Address of second parent
    /// @return totalTransferred Total amount successfully transferred
    function _payoutGeneCreator(
        uint256 auctionId,
        uint256 selectedGeneId,
        uint256 treasuryPerGeneHalf,
        address aminalOneAddress,
        address aminalTwoAddress
    ) internal returns (uint256 totalTransferred) {
        if (treasuryPerGeneHalf > 0) {
            // Get current owner of the gene NFT
            address geneOwner = genes.ownerOf(selectedGeneId);

            // Transfer treasury from parents to gene owner (split equally)
            bool successOne = IAminal(aminalOneAddress).payout(treasuryPerGeneHalf, geneOwner);
            bool successTwo = IAminal(aminalTwoAddress).payout(treasuryPerGeneHalf, geneOwner);

            if (successOne) totalTransferred += treasuryPerGeneHalf;
            if (successTwo) totalTransferred += treasuryPerGeneHalf;

            // Emit payout event if any transfers succeeded
            if (successOne || successTwo) {
                emit GeneCreatorPayout(auctionId, selectedGeneId, geneOwner, totalTransferred);
            }
        }

        return totalTransferred;
    }
}
