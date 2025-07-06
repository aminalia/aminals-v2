// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/console.sol";

import {Initializable} from "oz/proxy/utils/Initializable.sol";
import {Ownable} from "oz/access/Ownable.sol";

import {AminalProposals} from "src/proposals/AminalProposals.sol";
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
contract AminalFactory is IAminalStructs, Initializable, Ownable {
    /// @notice Total number of Aminals ever spawned 📊
    uint256 public totalAminals;

    /// @notice Gene auction system for breeding mechanics 🧬
    GeneAuction public geneAuction;

    /// @notice Flag to ensure genesis Aminals are only spawned once 🌱
    bool public initialAminalSpawned;

    /// @notice Registry of all valid Aminal contract addresses 📋
    mapping(address => bool) public isAminal;

    /// @notice Maps Aminal indices to their contract addresses 🔍
    mapping(uint256 => address) public aminalsByIndex;

    /// @notice Governance system for ecosystem evolution 🏛️
    AminalProposals public proposals;

    /// @notice Gene NFT system for trait management 🎨
    Genes public genes;

    /// @notice VRGDA for calculating love based on energy levels 📈
    AminalVRGDA public loveVRGDA;

    event AminalSpawned(
        address indexed aminalAddress,
        uint256 indexed aminalIndex,
        uint256 indexed mom,
        uint256 dad,
        uint256 backId,
        uint256 armId,
        uint256 tailId,
        uint256 earsId,
        uint256 bodyId,
        uint256 faceId,
        uint256 mouthId,
        uint256 miscId
    );

    event BreedAminal(address indexed aminalOne, address indexed aminalTwo, uint256 auctionId);

    modifier onlyAminal() {
        require(isAminal[msg.sender], "Only Aminal contracts can call this");
        _;
    }

    modifier onlyAuction() {
        require(msg.sender == address(geneAuction), "Only auction contract can call this");
        _;
    }

    modifier onlyProposal() {
        require(msg.sender == address(proposals), "Only proposal contract can call this");
        _;
    }

    constructor() {
        _transferOwnership(msg.sender);
    }

    function initialize(address _geneAuction, address _aminalProposals, address _Genes)
        external
        initializer
        onlyOwner
    {
        geneAuction = GeneAuction(_geneAuction);
        genes = Genes(_Genes);
        proposals = AminalProposals(_aminalProposals);
    }

    function setup() external onlyOwner {
        // Deploy VRGDA with optimal parameters for love curves
        // Parameters: targetPrice, priceDecayPercent, logisticAsymptote, timeScale
        loveVRGDA = new AminalVRGDA(
            1 ether, // 1 ETH base price
            0.1 ether, // 10% price decay
            100 ether, // Logistic asymptote at 100 units
            20 ether // Time scale for curve smoothness
        );
    }

    /**
     * @notice Spawn the genesis Aminals to seed the ecosystem 🌱
     * @dev Can only be called once by the owner to create initial population
     * @param _visuals Array of visual DNA for genesis Aminals
     *
     * "In the beginning, there was code. From code came the first Aminals,
     *  the digital Adam and Eve of the blockchain paradise."
     */
    function spawnInitialAminals(Visuals[] calldata _visuals) external onlyOwner {
        require(!initialAminalSpawned, "Initial Aminals already spawned");
        initialAminalSpawned = true;
        for (uint256 i = 0; i < _visuals.length; i++) {
            _spawnAminal(
                address(0),
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

    function spawnAminal(address momAddress, address dadAddress, uint256[8] calldata winningGeneIds)
        external
        onlyAuction
        returns (address)
    {
        // Map winning gene IDs to trait IDs in Gene NFT system
        return _spawnAminal(
            momAddress,
            dadAddress,
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

    function _spawnAminal(
        address momAddress,
        address dadAddress,
        uint256 backId,
        uint256 armId,
        uint256 tailId,
        uint256 earsId,
        uint256 bodyId,
        uint256 faceId,
        uint256 mouthId,
        uint256 miscId
    ) internal returns (address) {
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

        AminalContract newAminal =
            new AminalContract(address(this), momAddress, dadAddress, visuals, totalAminals, address(loveVRGDA));

        address aminalAddress = address(newAminal);
        isAminal[aminalAddress] = true;
        aminalsByIndex[totalAminals] = aminalAddress;
        totalAminals++;

        emit AminalSpawned(
            aminalAddress,
            totalAminals - 1,
            momAddress == address(0) ? 0 : AminalContract(payable(momAddress)).aminalIndex(),
            dadAddress == address(0) ? 0 : AminalContract(payable(dadAddress)).aminalIndex(),
            backId,
            armId,
            tailId,
            earsId,
            bodyId,
            faceId,
            mouthId,
            miscId
        );

        return aminalAddress;
    }

    function getAminalByIndex(uint256 index) external view returns (address) {
        require(index < totalAminals, "Index out of bounds");
        return aminalsByIndex[index];
    }

    function getAminalVisualsByAddress(address aminalAddress) external view returns (Visuals memory) {
        require(isAminal[aminalAddress], "Not an Aminal contract");
        return AminalContract(payable(aminalAddress)).getVisuals();
    }

    /**
     * @notice Initiate breeding ceremony between two Aminals 💕
     * @dev Handles consent mechanics and launches gene auctions for offspring
     * @param aminalOne First parent Aminal
     * @param aminalTwo Second parent Aminal
     * @return auctionId The gene auction ID (0 if setting initial consent)
     *
     * "When two Aminals unite in love, their digital essence mingles
     *  through algorithms of affection, creating new life from pure emotion"
     */
    function breedAminals(address aminalOne, address aminalTwo) external payable returns (uint256 auctionId) {
        require(msg.value >= 0.001 ether, "Not enough ether");
        require(isAminal[aminalOne] && isAminal[aminalTwo], "Invalid Aminal addresses");

        AminalContract aminal1 = AminalContract(payable(aminalOne));
        AminalContract aminal2 = AminalContract(payable(aminalTwo));

        require(aminal1.getLoveByUser(msg.sender) >= 10, "Not enough love");

        // Check if mutual consent exists - if so, create auction
        if (aminal1.isBreedableWith(aminalTwo) && aminal2.isBreedableWith(aminalOne)) {
            require(aminal1.getEnergy() >= 10 && aminal2.getEnergy() >= 10, "Not enough energy");

            // Calculate total love for auction based on caller's love for both Aminals
            uint256 totalLove = aminal1.getLoveByUser(msg.sender) + aminal2.getLoveByUser(msg.sender);

            auctionId = geneAuction.createAuction(aminal1.aminalIndex(), aminal2.aminalIndex(), totalLove);
            emit BreedAminal(aminalOne, aminalTwo, auctionId);

            return auctionId;
        } else {
            // Set consent if not already set
            require(!aminal1.isBreedableWith(aminalTwo), "Already breedable");
            aminal1.setBreedableWith(msg.sender, aminalTwo, true);
            emit BreedAminal(aminalOne, aminalTwo, 0);
            return 0;
        }
    }
}
