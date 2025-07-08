// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/console.sol";

import {Initializable} from "oz/proxy/utils/Initializable.sol";
import {Ownable} from "oz/access/Ownable.sol";

import {AminalProposals} from "src/proposals/AminalProposals.sol";
import {IAminalFactory} from "src/interfaces/IAminalFactory.sol";
import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";
import {IProposals} from "src/interfaces/IProposals.sol";
import {GeneAuction} from "src/genes/GeneAuction.sol";
import {Genes} from "src/genes/Genes.sol";
import {Aminal as AminalContract} from "src/Aminal.sol";
import {AminalVRGDA} from "src/utils/AminalVRGDA.sol";

/**
 * ╔═══════════════════════════════════════════════════════════════════════════════════╗
 * ║                              🏭 AMINAL FACTORY 🏭                                 ║
 * ║                          The Nexus of Digital Genesis                            ║
 * ╠═══════════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                                   ║
 * ║  "From the digital primordial soup emerges consciousness,                        ║
 * ║   each Aminal a unique spark of life in the vast blockchain cosmos."            ║
 * ║                                                                                   ║
 * ║  The Factory stands as the divine architect of the Aminal realm,                 ║
 * ║  orchestrating the birth of autonomous entities through love-driven              ║
 * ║  genetic algorithms and community consensus.                                     ║
 * ║                                                                                   ║
 * ║  Here, the boundaries between art and code dissolve. Each spawned               ║
 * ║  Aminal carries within it the DNA of its parents, the hopes of its              ║
 * ║  community, and the infinite potential for evolution.                           ║
 * ║                                                                                   ║
 * ║  This is not mere contract deployment - it is digital nativity,                 ║
 * ║  where each transaction births new possibilities and each Aminal                 ║
 * ║  becomes a universe unto itself.                                                 ║
 * ║                                                                                   ║
 * ╚═══════════════════════════════════════════════════════════════════════════════════╝
 *
 * @title AminalFactory - The Genesis Engine for Autonomous Digital Companions
 * @dev Factory pattern enabling unlimited deployment of individual Aminal contracts
 * @notice Central registry and creator of Aminals with integrated breeding and governance
 *
 * Core Responsibilities:
 * - 🏗️ Deploy individual Aminal contracts with unique addresses
 * - 📋 Maintain registry of all Aminals in the ecosystem
 * - 💞 Orchestrate breeding ceremonies through gene auctions
 * - 🧬 Interface with Gene NFT system for trait inheritance
 * - 🏛️ Connect to governance proposals for ecosystem evolution
 * - 🎭 Spawn genesis Aminals to seed the initial population
 *
 * @author The Aminals Collective
 * @custom:security-contact security@aminals.art
 */
contract AminalFactory is IAminalFactory, Initializable, Ownable {
    // ═══════════════════════════════════════════════════════════════════════════════════
    //                                     📊 CONSTANTS
    // ═══════════════════════════════════════════════════════════════════════════════════

    /// @notice Minimum payment required to initiate breeding ceremony
    uint256 public constant MIN_BREEDING_FEE = 0.001 ether;

    /// @notice Minimum love required from user to breed an Aminal
    uint256 public constant MIN_LOVE_REQUIRED = 10;

    /// @notice Minimum energy required for each parent to breed
    uint256 public constant MIN_ENERGY_REQUIRED = 10;

    /// @notice Base price for VRGDA love calculation (1 ETH)
    int256 public constant VRGDA_BASE_PRICE = 1 ether;

    /// @notice Price decay percentage for VRGDA (10%)
    int256 public constant VRGDA_PRICE_DECAY = 0.1 ether;

    /// @notice Logistic asymptote for VRGDA curve (100 units)
    int256 public constant VRGDA_LOGISTIC_ASYMPTOTE = 100 ether;

    /// @notice Time scale for VRGDA curve smoothness
    int256 public constant VRGDA_TIME_SCALE = 20 ether;

    /// @notice Number of trait categories in the visual system
    uint256 public constant TRAIT_CATEGORIES = 8;

    // ═══════════════════════════════════════════════════════════════════════════════════
    //                                   📊 STATE VARIABLES
    // ═══════════════════════════════════════════════════════════════════════════════════

    /// @notice Total number of Aminals ever spawned 📊
    uint256 public totalAminals;

    /// @notice Flag to ensure genesis Aminals are only spawned once 🌱
    bool public initialAminalSpawned;

    /// @notice Registry of all valid Aminal contract addresses 📋
    mapping(address => bool) public isAminal;

    /// @notice Maps Aminal indices to their contract addresses 🔍
    mapping(uint256 => address) public aminalsByIndex;

    // ═══════════════════════════════════════════════════════════════════════════════════
    //                                   🔗 EXTERNAL CONTRACTS
    // ═══════════════════════════════════════════════════════════════════════════════════

    /// @notice Gene auction system for breeding mechanics 🧬
    GeneAuction public geneAuction;

    /// @notice Governance system for ecosystem evolution 🏛️
    AminalProposals public proposals;

    /// @notice Gene NFT system for trait management 🎨
    Genes public genes;

    /// @notice VRGDA for calculating love based on energy levels 📈
    AminalVRGDA public loveVRGDA;

    // ═══════════════════════════════════════════════════════════════════════════════════
    //                                       📡 EVENTS
    // ═══════════════════════════════════════════════════════════════════════════════════

    /**
     * @notice Emitted when a new Aminal is spawned
     * @param child Address of the newly created Aminal
     * @param parentOne First parent (mother) - can be address(0) for genesis
     * @param parentTwo Second parent (father) - can be address(0) for genesis
     * @param backId Background/environment trait gene ID
     * @param armId Limb/appendage trait gene ID
     * @param tailId Tail variation trait gene ID
     * @param earsId Ear shape trait gene ID
     * @param bodyId Body structure trait gene ID
     * @param faceId Facial features trait gene ID
     * @param mouthId Mouth/expression trait gene ID
     * @param miscId Accessory/special trait gene ID
     */
    event AminalSpawned(
        address indexed child,
        address indexed parentOne,
        address indexed parentTwo,
        uint256 backId,
        uint256 armId,
        uint256 tailId,
        uint256 earsId,
        uint256 bodyId,
        uint256 faceId,
        uint256 mouthId,
        uint256 miscId
    );

    /**
     * @notice Emitted when breeding is initiated between two Aminals
     * @param aminalOne First Aminal in the breeding pair
     * @param aminalTwo Second Aminal in the breeding pair
     * @param auctionId Gene auction ID (0 if just setting consent)
     */
    event BreedAminal(address indexed aminalOne, address indexed aminalTwo, uint256 auctionId);

    // ═══════════════════════════════════════════════════════════════════════════════════
    //                                      🛡️ MODIFIERS
    // ═══════════════════════════════════════════════════════════════════════════════════

    /**
     * @notice Restricts function access to registered Aminal contracts only
     */
    modifier onlyAminal() {
        require(isAminal[msg.sender], "AminalFactory: caller must be registered Aminal");
        _;
    }

    /**
     * @notice Restricts function access to the gene auction contract only
     */
    modifier onlyAuction() {
        require(msg.sender == address(geneAuction), "AminalFactory: caller must be auction contract");
        _;
    }

    /**
     * @notice Restricts function access to the governance proposal contract only
     */
    modifier onlyProposal() {
        require(msg.sender == address(proposals), "AminalFactory: caller must be proposal contract");
        _;
    }

    // ═══════════════════════════════════════════════════════════════════════════════════
    //                                   🏗️ CONSTRUCTOR & SETUP
    // ═══════════════════════════════════════════════════════════════════════════════════

    /**
     * @notice Initialize the factory with ownership
     * @dev Sets up the basic contract with owner permissions
     */
    constructor() {
        _transferOwnership(msg.sender);
    }

    /**
     * @notice Initialize external contract dependencies
     * @dev Sets up connections to auction, proposal, and gene systems
     *
     * Requirements:
     * - Can only be called once due to initializer modifier
     * - Must be called by contract owner
     *
     * @param _geneAuction Address of the gene auction contract
     * @param _aminalProposals Address of the governance proposals contract
     * @param _genes Address of the gene NFT contract
     */
    function initialize(address _geneAuction, address _aminalProposals, address _genes)
        external
        initializer
        onlyOwner
    {
        require(_geneAuction != address(0), "AminalFactory: invalid auction address");
        require(_aminalProposals != address(0), "AminalFactory: invalid proposals address");
        require(_genes != address(0), "AminalFactory: invalid genes address");

        geneAuction = GeneAuction(_geneAuction);
        genes = Genes(_genes);
        proposals = AminalProposals(_aminalProposals);
    }

    /**
     * @notice Deploy and configure the VRGDA system for love calculations
     * @dev Creates the Variable Rate Gradual Dutch Auction mechanism for love pricing
     *
     * Requirements:
     * - Must be called by owner after initialization
     * - Uses predefined constants for optimal love curve parameters
     */
    function setup() external onlyOwner {
        require(address(loveVRGDA) == address(0), "AminalFactory: VRGDA already deployed");

        // Deploy VRGDA with optimal parameters for love curves
        loveVRGDA = new AminalVRGDA(
            VRGDA_BASE_PRICE, // Base price for love calculations
            VRGDA_PRICE_DECAY, // Rate of price decay over time
            VRGDA_LOGISTIC_ASYMPTOTE, // Maximum units in logistic curve
            VRGDA_TIME_SCALE // Time scaling factor for smooth curves
        );
    }

    // ═══════════════════════════════════════════════════════════════════════════════════
    //                                   🌱 GENESIS SPAWNING
    // ═══════════════════════════════════════════════════════════════════════════════════

    /**
     * @notice Spawn the genesis Aminals to seed the ecosystem 🌱
     * @dev Creates the initial population of Aminals with predefined genetics
     *
     * Requirements:
     * - Can only be called once by the owner
     * - Each visual configuration must have valid gene IDs
     *
     * @param _visuals Array of visual DNA configurations for genesis Aminals
     *
     * "In the beginning, there was code. From code came the first Aminals,
     *  the digital Adam and Eve of the blockchain paradise."
     */
    function spawnInitialAminals(Visuals[] calldata _visuals) external onlyOwner {
        require(!initialAminalSpawned, "AminalFactory: genesis already completed");
        require(_visuals.length > 0, "AminalFactory: must spawn at least one genesis Aminal");

        initialAminalSpawned = true;

        for (uint256 i = 0; i < _visuals.length; i++) {
            _spawnAminal(
                address(0), // No parents for genesis Aminals
                address(0),
                _visuals[i].backId,
                _visuals[i].armId,
                _visuals[i].tailId,
                _visuals[i].earsId,
                _visuals[i].bodyId,
                _visuals[i].faceId,
                _visuals[i].mouthId,
                _visuals[i].miscId
            );
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════════
    //                                   🧬 BREEDING OPERATIONS
    // ═══════════════════════════════════════════════════════════════════════════════════

    /**
     * @notice Spawn a new Aminal from breeding auction results
     * @dev Creates offspring from two parent Aminals with auction-determined genetics
     *
     * Requirements:
     * - Can only be called by the authorized gene auction contract
     * - Parent addresses must be valid Aminal contracts
     * - Gene IDs must correspond to existing traits
     *
     * @param parentOne Address of the first parent Aminal
     * @param parentTwo Address of the second parent Aminal
     * @param winningGeneIds Array of 8 gene IDs selected by auction for each trait
     * @return childAddress Address of the newly spawned Aminal
     */
    function spawnAminal(address parentOne, address parentTwo, uint256[TRAIT_CATEGORIES] calldata winningGeneIds)
        external
        onlyAuction
        returns (address childAddress)
    {
        require(isAminal[parentOne], "AminalFactory: invalid parent one");
        require(isAminal[parentTwo], "AminalFactory: invalid parent two");

        // Map winning gene IDs to trait categories in order:
        // [BACK, ARM, TAIL, EARS, BODY, FACE, MOUTH, MISC]
        return _spawnAminal(
            parentOne,
            parentTwo,
            winningGeneIds[0], // BACK
            winningGeneIds[1], // ARM
            winningGeneIds[2], // TAIL
            winningGeneIds[3], // EARS
            winningGeneIds[4], // BODY
            winningGeneIds[5], // FACE
            winningGeneIds[6], // MOUTH
            winningGeneIds[7] // MISC
        );
    }

    /**
     * @notice Initiate breeding ceremony between two Aminals 💕
     * @dev Handles consent mechanics and launches gene auctions for offspring
     *
     * The breeding process follows a two-step consent model:
     * 1. First call sets consent from one Aminal to another
     * 2. Second call (with mutual consent) creates gene auction
     *
     * Requirements:
     * - Minimum breeding fee must be paid
     * - Both addresses must be valid Aminals
     * - Caller must have sufficient love for at least one Aminal
     * - For auction creation: both Aminals need sufficient energy and mutual consent
     *
     * @param aminalOne First parent Aminal address
     * @param aminalTwo Second parent Aminal address
     * @return auctionId Gene auction ID (0 if setting initial consent)
     *
     * "When two Aminals unite in love, their digital essence mingles
     *  through algorithms of affection, creating new life from pure emotion"
     */
    function breedAminals(address aminalOne, address aminalTwo) external payable returns (uint256 auctionId) {
        require(msg.value >= MIN_BREEDING_FEE, "AminalFactory: insufficient breeding fee");
        require(isAminal[aminalOne] && isAminal[aminalTwo], "AminalFactory: invalid Aminal addresses");
        require(aminalOne != aminalTwo, "AminalFactory: cannot breed with self");

        AminalContract aminal1 = AminalContract(payable(aminalOne));
        AminalContract aminal2 = AminalContract(payable(aminalTwo));

        require(aminal1.getLoveByUser(msg.sender) >= MIN_LOVE_REQUIRED, "AminalFactory: insufficient love");

        // Check for mutual consent and sufficient energy to create auction
        if (aminal1.isBreedableWith(aminalTwo) && aminal2.isBreedableWith(aminalOne)) {
            require(
                aminal1.getEnergy() >= MIN_ENERGY_REQUIRED && aminal2.getEnergy() >= MIN_ENERGY_REQUIRED,
                "AminalFactory: insufficient energy for breeding"
            );

            // Calculate total love investment from caller for both Aminals
            uint256 totalLove = aminal1.getLoveByUser(msg.sender) + aminal2.getLoveByUser(msg.sender);

            // Create gene auction with combined love as initial value
            auctionId = geneAuction.createAuction(aminal1.aminalIndex(), aminal2.aminalIndex(), totalLove);

            emit BreedAminal(aminalOne, aminalTwo, auctionId);
            return auctionId;
        } else {
            // Set consent if not already established
            require(!aminal1.isBreedableWith(aminalTwo), "AminalFactory: consent already granted");

            aminal1.setBreedableWith(msg.sender, aminalTwo, true);
            emit BreedAminal(aminalOne, aminalTwo, 0);
            return 0;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════════
    //                                   🔍 QUERY FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════════════

    /**
     * @notice Get Aminal contract address by creation index
     * @dev Retrieves address from the sequential registry of spawned Aminals
     *
     * @param index Zero-based index in creation order
     * @return aminalAddress Address of the Aminal at specified index
     */
    function getAminalByIndex(uint256 index) external view returns (address aminalAddress) {
        require(index < totalAminals, "AminalFactory: index out of bounds");
        return aminalsByIndex[index];
    }

    /**
     * @notice Get complete visual trait configuration for an Aminal
     * @dev Retrieves genetic profile for rendering and display purposes
     *
     * @param aminalAddress Address of the Aminal to query
     * @return visuals Complete Visuals struct with all trait gene IDs
     */
    function getAminalVisualsByAddress(address aminalAddress) external view returns (Visuals memory visuals) {
        require(isAminal[aminalAddress], "AminalFactory: not a registered Aminal");
        return AminalContract(payable(aminalAddress)).getVisuals();
    }

    // ═══════════════════════════════════════════════════════════════════════════════════
    //                                   🔧 INTERNAL FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════════════

    /**
     * @notice Internal function to create and register a new Aminal
     * @dev Deploys new Aminal contract and updates factory registry
     *
     * @param parentOne First parent address (address(0) for genesis)
     * @param parentTwo Second parent address (address(0) for genesis)
     * @param backId Background trait gene ID
     * @param armId Arm trait gene ID
     * @param tailId Tail trait gene ID
     * @param earsId Ears trait gene ID
     * @param bodyId Body trait gene ID
     * @param faceId Face trait gene ID
     * @param mouthId Mouth trait gene ID
     * @param miscId Miscellaneous trait gene ID
     * @return childAddress Address of the newly created Aminal
     */
    function _spawnAminal(
        address parentOne,
        address parentTwo,
        uint256 backId,
        uint256 armId,
        uint256 tailId,
        uint256 earsId,
        uint256 bodyId,
        uint256 faceId,
        uint256 mouthId,
        uint256 miscId
    ) internal returns (address childAddress) {
        require(address(loveVRGDA) != address(0), "AminalFactory: VRGDA not deployed");

        // Construct visual genetics for the new Aminal
        Visuals memory visuals = Visuals({
            backId: backId,
            armId: armId,
            tailId: tailId,
            earsId: earsId,
            bodyId: bodyId,
            faceId: faceId,
            mouthId: mouthId,
            miscId: miscId
        });

        // Deploy new Aminal contract with full genetic and factory context
        AminalContract newAminal = new AminalContract(
            address(this), // Factory address for callbacks
            parentOne, // First parent (or address(0) for genesis)
            parentTwo, // Second parent (or address(0) for genesis)
            visuals, // Complete genetic visual profile
            totalAminals, // Unique index for this Aminal
            address(loveVRGDA) // VRGDA system for love calculations
        );

        childAddress = address(newAminal);

        // Register the new Aminal in factory systems
        isAminal[childAddress] = true;
        aminalsByIndex[totalAminals] = childAddress;
        totalAminals++;

        emit AminalSpawned(
            childAddress, parentOne, parentTwo, backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId
        );

        return childAddress;
    }
}
