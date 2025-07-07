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
 * @title GeneAuction
 * @dev Love-based voting system for Gene NFT trait selection with energy rewards to Gene NFT owners
 */
contract GeneAuction is IAminalStructs, Initializable, Ownable, ReentrancyGuard {
    Genes public genes;
    GeneRegistry public geneRegistry;
    // TODO rename to aminalsFactoryContract, is this needed? Do we need to store both this and aminalFactory?
    address public aminalsContract;
    IAminalFactory public aminalFactory;

    // TODO: change to 7 days, set to 1 hour for testing
    /// @notice Duration of voting in seconds
    uint256 public constant VOTING_DURATION = 1 hours;

    /// @notice Percentage of parent energy transferred to gene owners (10%)
    uint256 public constant ENERGY_TRANSFER_PERCENTAGE = 10;

    struct Auction {
        uint256 aminalOne;
        uint256 aminalTwo;
        uint256 totalLove;
        uint256 startTime;
        uint256 endTime;
        bool settled;
        uint256 childAminalId;
        // Parent traits for inheritance (indexed by category)
        uint256[8] parentOneTraits;
        uint256[8] parentTwoTraits;
        // Votes for each trait category
        mapping(VisualsCat => CategoryVoting) categoryVotes;
    }

    struct CategoryVoting {
        uint256 highestVotes;
        uint256 winningGeneId;
        mapping(uint256 => uint256) geneVotes; // geneId => total vote power
        mapping(address => uint256) userVotedGene; // user => geneId they voted for
        mapping(address => uint256) userVoteWeight; // user => vote weight they cast
        mapping(address => bool) userHasVoted; // user => whether they have voted
        mapping(uint256 => uint256) geneRemovalVotes; // geneId => removal vote weight
        uint256[] proposedGenes; // Array of gene IDs proposed for this category
        uint256[] tiedGenes; // Array of genes with highest votes (for tie-breaking)
    }

    struct CategoryVoteInfo {
        uint256 highestVotes;
        uint256 winningGeneId;
        uint256[] proposedGenes;
        uint256[] tiedGenes;
    }

    mapping(uint256 => Auction) public auctions;
    uint256 public auctionCounter;

    event VotingCreated(
        uint256 indexed auctionId,
        uint256 indexed aminalOne,
        uint256 indexed aminalTwo,
        uint256 totalLove,
        uint256 startTime,
        uint256 endTime
    );

    event GeneVoteCast(uint256 indexed auctionId, VisualsCat indexed category, uint256 indexed geneId, address voter);

    event BulkVoteCast(uint256 indexed auctionId, address indexed voter, uint256[8] geneIds);

    event VotingSettled(
        uint256 indexed auctionId,
        uint256 indexed childAminalId,
        uint256[8] winningGeneIds,
        uint256 totalEnergyTransferred
    );

    event GeneProposed(
        uint256 indexed auctionId, VisualsCat indexed category, uint256 indexed geneId, address proposer
    );

    event GeneRemovalVote(
        uint256 indexed auctionId,
        VisualsCat indexed category,
        uint256 indexed geneId,
        address voter,
        uint256 voteWeight
    );

    event GeneRemoved(uint256 indexed auctionId, VisualsCat indexed category, uint256 indexed geneId);

    error VotingNotActive();
    error VotingAlreadySettled();
    error InvalidGene();
    error VotingNotEnded();
    error OnlyAminals();
    error InvalidCategory();
    error InsufficientLove();
    error EnergyTransferFailed();
    error GeneAlreadyRemoved();
    error NoVotingPower();

    modifier onlyAminals() {
        if (msg.sender != aminalsContract) revert OnlyAminals();
        _;
    }

    modifier validVoting(uint256 auctionId) {
        require(auctionId <= auctionCounter, "Voting does not exist");
        _;
    }

    constructor(address _Genes, address _geneRegistry) {
        genes = Genes(_Genes);
        geneRegistry = GeneRegistry(_geneRegistry);
    }

    // TODO do we need this setup function? Maybe just do everything in constructor? Also, doesn't need two variables.
    function setup(address _aminalsContract, address _aminalFactory) external initializer onlyOwner {
        aminalsContract = _aminalsContract;
        aminalFactory = IAminalFactory(_aminalFactory);
    }

    /**
     * @notice Create a new auction for breeding
     * @dev Called by the Aminals contract when breeding is initiated
     */
    function createAuction(uint256 aminalOne, uint256 aminalTwo, uint256 totalLove)
        external
        onlyAminals
        returns (uint256 auctionId)
    {
        auctionId = ++auctionCounter;

        Auction storage auction = auctions[auctionId];
        auction.aminalOne = aminalOne;
        auction.aminalTwo = aminalTwo;
        auction.totalLove = totalLove;
        auction.startTime = block.timestamp;
        auction.endTime = block.timestamp + VOTING_DURATION;
        auction.childAminalId = auctionId; // Use auction ID as child Aminal ID

        // Capture parent traits for inheritance
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

        emit VotingCreated(auctionId, aminalOne, aminalTwo, totalLove, auction.startTime, auction.endTime);

        return auctionId;
    }

    /**
     * @notice Propose a Gene NFT for a specific trait category in voting
     * @dev Anyone can propose genes they own or any valid gene
     */
    function proposeGene(uint256 auctionId, VisualsCat category, uint256 geneId) external validVoting(auctionId) {
        Auction storage auction = auctions[auctionId];

        if (block.timestamp >= auction.endTime) revert VotingNotActive();
        if (auction.settled) revert VotingAlreadySettled();
        if (uint256(category) >= 8) revert InvalidCategory();

        // Verify gene exists and is from the factory
        if (!geneRegistry.isValidGene(geneId)) revert InvalidGene();

        // Verify gene is in the correct category
        (, VisualsCat geneCategory,) = geneRegistry.getGeneInfo(geneId);
        if (geneCategory != category) revert InvalidCategory();

        CategoryVoting storage categoryVoting = auction.categoryVotes[category];

        // Check if gene is already proposed
        bool alreadyProposed = false;
        for (uint256 i = 0; i < categoryVoting.proposedGenes.length; i++) {
            if (categoryVoting.proposedGenes[i] == geneId) {
                alreadyProposed = true;
                break;
            }
        }

        if (!alreadyProposed) {
            categoryVoting.proposedGenes.push(geneId);
            emit GeneProposed(auctionId, category, geneId, msg.sender);
        }
    }

    /**
     * @notice Vote on a specific Gene NFT with full voting power
     * @dev Users vote with their full voting power based on love given to parent Aminals
     */
    function voteOnGene(uint256 auctionId, VisualsCat category, uint256 geneId) external validVoting(auctionId) {
        Auction storage auction = auctions[auctionId];

        if (block.timestamp >= auction.endTime) revert VotingNotActive();
        if (auction.settled) revert VotingAlreadySettled();
        if (uint256(category) >= 8) revert InvalidCategory();

        // Calculate user's voting power based on love given to parent Aminals
        uint256 userVotingPower = _calculateVotingPower(auction, msg.sender);
        if (userVotingPower == 0) revert NoVotingPower();

        CategoryVoting storage categoryVoting = auction.categoryVotes[category];

        // Verify gene is proposed for this category
        bool isProposed = false;
        for (uint256 i = 0; i < categoryVoting.proposedGenes.length; i++) {
            if (categoryVoting.proposedGenes[i] == geneId) {
                isProposed = true;
                break;
            }
        }
        if (!isProposed) revert InvalidGene();

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

        // Calculate user's voting power
        uint256 userVotingPower = _calculateVotingPower(auction, msg.sender);
        if (userVotingPower == 0) revert NoVotingPower();

        // Process votes for each category
        for (uint256 i = 0; i < 8; i++) {
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
        CategoryVoting storage categoryVoting = auction.categoryVotes[category];

        // Verify gene is proposed for this category
        bool isProposed = false;
        for (uint256 j = 0; j < categoryVoting.proposedGenes.length; j++) {
            if (categoryVoting.proposedGenes[j] == geneId) {
                isProposed = true;
                break;
            }
        }
        if (!isProposed) revert InvalidGene();

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
        if (uint256(category) >= 8) revert InvalidCategory();

        // Calculate user's voting power
        uint256 userVotingPower = _calculateVotingPower(auction, msg.sender);
        if (voteWeight > userVotingPower) revert InsufficientLove();

        CategoryVoting storage categoryVoting = auction.categoryVotes[category];

        // Verify gene is proposed for this category
        bool isProposed = false;
        for (uint256 i = 0; i < categoryVoting.proposedGenes.length; i++) {
            if (categoryVoting.proposedGenes[i] == geneId) {
                isProposed = true;
                break;
            }
        }
        if (!isProposed) revert InvalidGene();

        // Add removal vote
        categoryVoting.geneRemovalVotes[geneId] += voteWeight;

        emit GeneRemovalVote(auctionId, category, geneId, msg.sender, voteWeight);

        // Check if gene should be removed (1/3 of total love threshold)
        if (categoryVoting.geneRemovalVotes[geneId] >= auction.totalLove / 3) {
            _removeGeneFromCategory(auctionId, category, geneId);
        }
    }

    /**
     * @notice Internal function to remove a gene from a category
     */
    function _removeGeneFromCategory(uint256 auctionId, VisualsCat category, uint256 geneId) internal {
        CategoryVoting storage categoryVoting = auctions[auctionId].categoryVotes[category];

        // Find and remove from proposedGenes array
        for (uint256 i = 0; i < categoryVoting.proposedGenes.length; i++) {
            if (categoryVoting.proposedGenes[i] == geneId) {
                // Move last element to current position and pop
                categoryVoting.proposedGenes[i] = categoryVoting.proposedGenes[categoryVoting.proposedGenes.length - 1];
                categoryVoting.proposedGenes.pop();
                break;
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
            delete categoryVoting.tiedGenes;
            categoryVoting.tiedGenes.push(geneId);
        } else if (currentVotes == categoryVoting.highestVotes && currentVotes > 0) {
            // First vote or tie detected
            if (categoryVoting.tiedGenes.length == 0) {
                // First vote with this amount, initialize tiedGenes
                categoryVoting.tiedGenes.push(geneId);
                categoryVoting.winningGeneId = geneId;
            } else {
                // Tie detected, add to tied genes if not already present
                bool alreadyTied = false;
                for (uint256 i = 0; i < categoryVoting.tiedGenes.length; i++) {
                    if (categoryVoting.tiedGenes[i] == geneId) {
                        alreadyTied = true;
                        break;
                    }
                }
                if (!alreadyTied) categoryVoting.tiedGenes.push(geneId);
            }
        }
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
     * @notice Settle voting and transfer energy from parents to Gene NFT owners
     * @dev Can be called by anyone after voting ends
     */
    function settleAuction(uint256 auctionId) external validVoting(auctionId) nonReentrant {
        Auction storage auction = auctions[auctionId];

        if (block.timestamp < auction.endTime) revert VotingNotEnded();
        if (auction.settled) revert VotingAlreadySettled();

        auction.settled = true;

        uint256[8] memory winningGeneIds;
        uint256 totalEnergyTransferred = 0;

        // Get parent Aminal addresses
        address aminalOneAddress = aminalFactory.getAminalByIndex(auction.aminalOne);
        address aminalTwoAddress = aminalFactory.getAminalByIndex(auction.aminalTwo);

        // Calculate energy to transfer (10% from each parent)
        uint256 aminalOneEnergy = IAminal(aminalOneAddress).getEnergy();
        uint256 aminalTwoEnergy = IAminal(aminalTwoAddress).getEnergy();
        uint256 energyFromAminalOne = (aminalOneEnergy * ENERGY_TRANSFER_PERCENTAGE) / 100;
        uint256 energyFromAminalTwo = (aminalTwoEnergy * ENERGY_TRANSFER_PERCENTAGE) / 100;

        // Process each trait category
        for (uint256 i = 0; i < 8; i++) {
            VisualsCat category = VisualsCat(i);
            CategoryVoting storage categoryVoting = auction.categoryVotes[category];
            uint256 selectedGeneId = 0;

            // Step 1: Check if there are any votes
            if (categoryVoting.highestVotes > 0 && categoryVoting.tiedGenes.length > 0) {
                // Check for ties
                if (categoryVoting.tiedGenes.length > 1) {
                    // Handle tie with randomness
                    uint256 randomIndex = _generateRandomness(i, categoryVoting.tiedGenes.length);
                    selectedGeneId = categoryVoting.tiedGenes[randomIndex];
                } else {
                    // Clear winner - use the single tied gene (should be same as winningGeneId)
                    selectedGeneId = categoryVoting.tiedGenes[0];
                }
            } else {
                // Step 2: No votes cast, fall back to parent traits
                // Create array of available parent traits (excluding 0 which means no trait)
                uint256[] memory availableTraits = new uint256[](2);
                uint256 availableCount = 0;

                if (auction.parentOneTraits[i] != 0) {
                    availableTraits[availableCount] = auction.parentOneTraits[i];
                    availableCount++;
                }
                if (auction.parentTwoTraits[i] != 0 && auction.parentTwoTraits[i] != auction.parentOneTraits[i]) {
                    availableTraits[availableCount] = auction.parentTwoTraits[i];
                    availableCount++;
                }

                if (availableCount > 0) {
                    // Randomly select from available parent traits
                    uint256 randomIndex = _generateRandomness(i + 1000, availableCount);
                    selectedGeneId = availableTraits[randomIndex];
                }
                // If availableCount == 0, selectedGeneId remains 0 (no trait)
            }

            winningGeneIds[i] = selectedGeneId;

            // Transfer energy to gene owner if gene was selected and it's a valid Gene NFT
            if (selectedGeneId != 0) {
                // Check if this is a Gene NFT (not just a parent trait ID)
                if (geneRegistry.isValidGene(selectedGeneId)) {
                    uint256 energyPerGene = (energyFromAminalOne + energyFromAminalTwo) / 8;

                    if (energyPerGene > 0) {
                        address geneOwner = genes.ownerOf(selectedGeneId);

                        // Deduct energy from parents (split equally)
                        try IAminal(aminalOneAddress).transferEnergyToOwner(energyPerGene / 2, geneOwner) {
                            totalEnergyTransferred += energyPerGene / 2;
                        } catch {
                            // Energy transfer failed - continue with other genes
                        }

                        try IAminal(aminalTwoAddress).transferEnergyToOwner(energyPerGene / 2, geneOwner) {
                            totalEnergyTransferred += energyPerGene / 2;
                        } catch {
                            // Energy transfer failed - continue with other genes
                        }
                    }
                }
                // If it's a parent trait ID, no energy transfer occurs
            }
        }

        emit VotingSettled(auctionId, auction.childAminalId, winningGeneIds, totalEnergyTransferred);

        // Spawn the child Aminal with winning traits
        address momAddress = aminalFactory.getAminalByIndex(auction.aminalOne);
        address dadAddress = aminalFactory.getAminalByIndex(auction.aminalTwo);

        aminalFactory.spawnAminal(momAddress, dadAddress, winningGeneIds);

        // Update the child Aminal ID to the actual spawned Aminal index
        auction.childAminalId = aminalFactory.totalAminals() - 1;
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
            bool settled,
            uint256 childAminalId
        )
    {
        Auction storage auction = auctions[auctionId];
        return (
            auction.aminalOne,
            auction.aminalTwo,
            auction.totalLove,
            auction.startTime,
            auction.endTime,
            auction.settled,
            auction.childAminalId
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

    /**
     * @notice Emergency function for owner (only if contract is broken)
     */
    function emergencyStop() external onlyOwner {
        // Emergency stop functionality if needed
        // No ETH to withdraw since we use energy transfers
    }
}
