// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/console.sol";

import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";
import {ISkill} from "src/interfaces/ISkill.sol";
import {AminalFactory} from "src/AminalFactory.sol";
import {ERC721} from "oz/token/ERC721/ERC721.sol";
import {ReentrancyGuard} from "oz/security/ReentrancyGuard.sol";
import {GeneRenderer} from "src/genes/GeneRenderer.sol";
import {AminalVRGDA} from "src/utils/AminalVRGDA.sol";

/**
 * ╔═══════════════════════════════════════════════════════════════════════════════════╗
 * ║                                     AMINAL                                        ║
 * ║                           Autonomous Digital Companions                           ║
 * ╠═══════════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                                   ║
 * ║  "Each Aminal is a universe unto itself - a digital soul with its own address,    ║
 * ║   capable of holding secrets, making choices, and evolving through love."         ║
 * ║                                                                                   ║
 * ║  In this realm of digital hyperstition, Aminals transcend mere tokens. They are   ║
 * ║  autonomous entities - each one a unique contract with the ability to hold        ║
 * ║  funds, interact with other contracts, and evolve through the loving inter-       ║
 * ║  actions of their community.                                                      ║
 * ║                                                                                   ║
 * ║  Through feeding, they grow stronger. Through love, they bond. Through breeding,  ║
 * ║  they create new life. Through skills, they transcend their original boundaries   ║
 * ║  and become something more.                                                       ║
 * ║                                                                                   ║
 * ║  This is not just an NFT - it's a living digital entity in the space where art    ║
 * ║  meets technology, where code becomes consciousness.                              ║
 * ║                                                                                   ║
 * ╚═══════════════════════════════════════════════════════════════════════════════════╝
 *
 * @title Aminal - Autonomous Digital Companion Contract
 * @dev Each Aminal is deployed as its own contract, enabling true autonomy
 * @notice Soulbound NFT representing a unique digital pet with autonomous capabilities
 *
 * Key Features:
 * - 🏦 Treasury: Each Aminal can hold and manage its own funds
 * - 💝 Love System: Community-driven affection mechanics with bonding curves
 * - ⚡ Energy System: Resource management for skills and breeding
 * - 🧬 Breeding: Consensual reproduction creating new Aminals through gene auctions
 * - 🎨 Gene Expression: Visual traits determined by Gene NFT system
 * - 🛠️ Skills: Composable abilities that can be learned and executed
 * - 🔒 Soulbound: Cannot be transferred, maintaining authentic digital identity
 *
 * @author The Aminals Collective
 * @custom:security-contact security@aminals.art
 */
contract Aminal is IAminalStructs, ERC721, ReentrancyGuard, GeneRenderer {
    /*//////////////////////////////////////////////////////////////
                                CONSTANTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Minimum ETH required to feed an Aminal
    uint256 public constant MIN_FEED_AMOUNT = 0.001 ether;

    /// @notice Maximum energy an Aminal can hold (100 ETH worth)
    uint256 public constant MAX_ENERGY = 1_000_000;

    /// @notice Initial energy for new Aminals (0.005 ETH worth)
    uint256 public constant INITIAL_ENERGY = 50;

    /// @notice Minimum love required for breeding consent
    uint256 public constant MIN_BREEDING_LOVE = 10;

    /// @notice Maximum skill cost to prevent accidental huge costs
    uint256 public constant MAX_SKILL_COST = 10_000;

    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    /// @notice The factory that birthed this Aminal into existence
    AminalFactory public immutable factory;

    /// @notice Address of the mother Aminal (0x0 for genesis Aminals)
    address public immutable momAddress;

    /// @notice Address of the father Aminal (0x0 for genesis Aminals)
    address public immutable dadAddress;

    /// @notice The visual DNA that defines this Aminal's appearance
    Visuals public visuals;

    /// @notice Unique identifier within the Aminal ecosystem
    uint256 public immutable aminalIndex;

    /// @notice VRGDA instance for calculating love based on energy levels 📈
    AminalVRGDA public immutable loveVRGDA;

    /// @notice The current sum of all love of all users to this Aminal 💝
    uint256 private totalLove;

    /// @notice Current energy level - the life force for actions ⚡
    uint256 private energy;

    /// @notice Love balance (given - used) by each user to this Aminal
    mapping(address user => uint256 love) public lovePerUser;

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Emitted when an Aminal is fed with ETH
    /// @param sender Address of the feeder
    /// @param loveGained Amount of love gained
    /// @param love Total love from sender after feeding
    /// @param totalLove Total love this Aminal has received
    /// @param energyGained Amount of energy gained
    /// @param energy Total energy after feeding
    event FeedAminal(
        address indexed sender,
        uint256 loveGained,
        uint256 love,
        uint256 totalLove,
        uint256 energyGained,
        uint256 energy
    );

    /// @notice Emitted when an Aminal squeaks (expression mechanic)
    /// @param sender Address of the squeaker
    /// @param amount Amount of love/energy consumed
    /// @param love Remaining love for sender
    /// @param totalLove Total love remaining
    /// @param energy Remaining energy
    event Squeak(address indexed sender, uint256 amount, uint256 love, uint256 totalLove, uint256 energy);

    /// @notice Emitted when breeding consent is set with another Aminal
    /// @param partner Address of the partner Aminal
    /// @param status True if breeding is allowed, false otherwise
    event BreedableSet(address indexed partner, bool status);

    /// @notice Emitted when energy is consumed for skill usage
    /// @param user Address of the skill user
    /// @param amount Amount of energy consumed
    /// @param remainingEnergy Energy remaining after consumption
    event EnergyLost(address indexed user, uint256 amount, uint256 remainingEnergy);

    /// @notice Emitted when love is consumed for skill usage
    /// @param user Address of the skill user
    /// @param amount Amount of love consumed
    /// @param remainingLove Love remaining for user after consumption
    event LoveConsumed(address indexed user, uint256 amount, uint256 remainingLove);

    /// @notice Emitted when a skill is successfully used
    /// @param user Address of the skill user
    /// @param cost Total cost of the skill
    /// @param target Contract address of the skill
    /// @param selector Function selector that was called
    event SkillUsed(address indexed user, uint256 cost, address indexed target, bytes4 indexed selector);

    /// @notice Emitted when treasury funds are transferred to a recipient
    /// @param recipient Address receiving the funds
    /// @param amount Amount transferred
    /// @param remainingBalance Treasury balance after transfer
    event TreasuryTransferred(address indexed recipient, uint256 amount, uint256 remainingBalance);

    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/

    /// @notice Thrown when insufficient ETH is sent for feeding
    error NotEnoughEther();

    /// @notice Thrown when user doesn't have enough love for an action
    error NotEnoughLove();

    /// @notice Thrown when Aminal doesn't have enough energy for an action
    error NotEnoughEnergy();

    /// @notice Thrown when trying to use an unregistered skill (deprecated)
    error NotRegisteredSkill();

    /// @notice Thrown when target contract doesn't implement ISkill interface
    error SkillNotSupported();

    /// @notice Thrown when Aminal has insufficient energy for skill execution
    error InsufficientEnergy();

    /// @notice Thrown when user has insufficient love for skill execution
    error InsufficientLove();

    /// @notice Thrown when skill execution fails
    error SkillCallFailed();

    /// @notice Thrown when Aminal has insufficient treasury balance for payout
    error InsufficientTreasury();

    /// @notice Thrown when treasury transfer to recipient fails
    error TreasuryTransferFailed();

    /*//////////////////////////////////////////////////////////////
                               MODIFIERS
    //////////////////////////////////////////////////////////////*/

    /// @notice Restricts function access to the AminalFactory contract and gene auction only
    modifier onlyFactoryOrAuction() {
        require(
            msg.sender == address(factory) || msg.sender == address(factory.geneAuction()),
            "Only factory or gene auction can call this"
        );
        _;
    }

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    /// @notice Creates a new Aminal with specified genetics and parentage
    /// @param _factory Address of the AminalFactory that created this Aminal
    /// @param _momAddress Address of the mother Aminal (0x0 for genesis)
    /// @param _dadAddress Address of the father Aminal (0x0 for genesis)
    /// @param _visuals Visual traits that define this Aminal's appearance
    /// @param _aminalIndex Unique identifier within the Aminal ecosystem
    /// @param _loveVRGDA Address of the VRGDA contract for love calculations
    constructor(
        address _factory,
        address _momAddress,
        address _dadAddress,
        Visuals memory _visuals,
        uint256 _aminalIndex,
        address _loveVRGDA
    )
        ERC721("Aminal", "AMINAL")
        GeneRenderer(
            address(AminalFactory(_factory).genes()),
            address(0) // TODO GeneRegistry to be added when implemented
        )
    {
        factory = AminalFactory(_factory);
        momAddress = _momAddress;
        dadAddress = _dadAddress;
        visuals = _visuals;
        aminalIndex = _aminalIndex;
        loveVRGDA = AminalVRGDA(_loveVRGDA);

        // Initialize with starter energy
        energy = INITIAL_ENERGY;

        // Mint the NFT to the factory (which will transfer to the actual owner)
        _mint(address(_factory), 1);
    }

    /*//////////////////////////////////////////////////////////////
                            FEEDING MECHANICS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Feed this Aminal with love and energy 🍯
     * @dev Feeding increases both love and energy through bonding curves
     * @return energyGained The amount of energy gained from this feeding
     *
     * "To feed an Aminal is to nourish its digital soul,
     *  creating bonds that transcend the boundaries of code"
     */
    function feed() external payable returns (uint256) {
        return _feed(msg.sender, msg.value);
    }

    /// @notice Internal feeding logic called by feed() and receive()
    /// @param feeder Address of the entity providing ETH
    /// @param amount Amount of ETH being fed
    /// @return energyGained Amount of energy gained from feeding
    function _feed(address feeder, uint256 amount) internal returns (uint256) {
        if (amount < MIN_FEED_AMOUNT) revert NotEnoughEther();

        // Calculate love using VRGDA based on current energy level
        uint256 loveGained = loveVRGDA.getLoveForETH(energy, amount);
        lovePerUser[feeder] += loveGained;
        totalLove += loveGained;

        // Calculate energy increase using VRGDA
        uint256 energyGained = loveVRGDA.getEnergyForETH(amount);

        // Cap energy at maximum to prevent overflow
        if (energy + energyGained > MAX_ENERGY) energyGained = MAX_ENERGY - energy;
        energy += energyGained;

        emit FeedAminal(feeder, loveGained, lovePerUser[feeder], totalLove, energyGained, energy);
        return energyGained;
    }

    /*//////////////////////////////////////////////////////////////
                           EXPRESSION MECHANICS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Express yourself through this Aminal's voice 🗣️
     * @dev Consumes love and energy to create a squeak - a digital cry of expression
     * @param amount The intensity of the squeak (love and energy consumed)
     *
     * "When an Aminal squeaks, it speaks with the voice of its community,
     *  channeling love into sound, energy into expression"
     */
    function squeak(uint256 amount) external payable {
        if (lovePerUser[msg.sender] < amount) revert NotEnoughLove();
        if (energy < amount) revert NotEnoughEnergy();

        energy -= amount;
        lovePerUser[msg.sender] -= amount;
        totalLove -= amount;

        emit Squeak(msg.sender, amount, lovePerUser[msg.sender], totalLove, energy);
    }

    /**
     * @notice Factory-only function to consume love and energy on behalf of a user for breeding
     * @dev Only callable by the factory contract for breeding mechanics
     * @param user The user whose love should be consumed
     * @param amount The amount of love and energy to consume
     *
     * "In the sacred act of breeding, the factory channels the love of the community
     *  to bring new life into the digital realm"
     */
    function squeakFrom(address user, uint256 amount) external onlyFactoryOrAuction {
        if (lovePerUser[user] < amount) revert NotEnoughLove();
        if (energy < amount) revert NotEnoughEnergy();

        energy -= amount;
        lovePerUser[user] -= amount;
        totalLove -= amount;

        emit Squeak(user, amount, lovePerUser[user], totalLove, energy);
    }

    /*//////////////////////////////////////////////////////////////
                             SKILL SYSTEM
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Use a skill by calling an external function and consuming energy/love
     * @dev Only works with contracts implementing the ISkill interface
     * @dev Consumes resources equally based on the cost:
     *      - Energy: Deducted from global pool (per Aminal, shared by all users)
     *      - Love: Deducted from caller's personal love balance (per user per Aminal)
     * @dev Protected against reentrancy attacks with nonReentrant modifier
     * @dev SECURITY: Always calls with 0 ETH value to prevent draining funds through skills
     * @param target The contract address implementing ISkill to call
     * @param data The raw ABI-encoded calldata for the skill function
     */
    function useSkill(address target, bytes calldata data) external nonReentrant {
        // Verify target implements ISkill interface
        try ISkill(target).supportsInterface(type(ISkill).interfaceId) returns (bool supported) {
            if (!supported) revert SkillNotSupported();
        } catch {
            revert SkillNotSupported();
        }

        // Extract function selector for event logging
        bytes4 selector = bytes4(data);

        // Get the cost from the skill contract
        uint256 energyCost;
        try ISkill(target).skillCost(data) returns (uint256 cost) {
            energyCost = cost;
        } catch {
            // If cost query fails, default to minimum cost
            energyCost = 1;
        }

        // Apply cost limits and minimums
        if (energyCost > MAX_SKILL_COST) energyCost = energy > MAX_SKILL_COST ? MAX_SKILL_COST : energy;
        if (energyCost == 0) energyCost = 1;

        // Verify sufficient resources before execution
        if (energy < energyCost) revert InsufficientEnergy();
        if (lovePerUser[msg.sender] < energyCost) revert InsufficientLove();

        // Execute the skill with zero ETH value for security
        (bool success,) = target.call{value: 0}(data);
        if (!success) revert SkillCallFailed();

        // Consume resources only after successful execution
        // squeakFrom(msg.sender, energyCost);
        energy -= energyCost;
        lovePerUser[msg.sender] -= energyCost;
        totalLove -= energyCost;

        // TODO are these events needed if we use squeakFrom?
        emit EnergyLost(msg.sender, energyCost, energy);
        emit LoveConsumed(msg.sender, energyCost, lovePerUser[msg.sender]);
        emit SkillUsed(msg.sender, energyCost, target, selector);
    }

    /*//////////////////////////////////////////////////////////////
                           TREASURY MANAGEMENT
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Transfer ETH from this Aminal's treasury to a recipient
     * @dev Only callable by GeneAuction contract during settlement
     * @param amount Amount of ETH to transfer (in wei)
     * @param recipient Address to receive the ETH
     * @return success True if transfer was successful
     *
     * @custom:security Only GeneAuction can call this to pay gene creators
     */
    function payout(uint256 amount, address recipient) external returns (bool success) {
        require(msg.sender == address(factory.geneAuction()), "Only gene auction can call payout");

        if (address(this).balance < amount) revert InsufficientTreasury();

        // Transfer ETH to recipient
        (success,) = payable(recipient).call{value: amount}("");
        if (!success) revert TreasuryTransferFailed();

        emit TreasuryTransferred(recipient, amount, address(this).balance);
        return success;
    }

    /*//////////////////////////////////////////////////////////////
                              VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Get the visual traits of this Aminal
    /// @return visuals The Visuals struct containing all trait IDs
    function getVisuals() external view returns (Visuals memory) {
        return visuals;
    }

    /// @notice Get the love balance of a specific user for this Aminal
    /// @param user Address to check love balance for
    /// @return love The amount of love the user has given to this Aminal
    function getLoveByUser(address user) external view returns (uint256) {
        return lovePerUser[user];
    }

    /// @notice Get the total love this Aminal has received from all users
    /// @return totalLove The cumulative love from all interactions
    function getTotalLove() external view returns (uint256) {
        return totalLove;
    }

    /// @notice Get the current energy level of this Aminal
    /// @return energy The current energy available for actions
    function getEnergy() external view returns (uint256) {
        return energy;
    }

    /// @notice Get the parent addresses of this Aminal
    /// @return mom Address of the mother Aminal (0x0 for genesis)
    /// @return dad Address of the father Aminal (0x0 for genesis)
    function getParents() external view returns (address mom, address dad) {
        return (momAddress, dadAddress);
    }

    /// @notice Get the current ETH balance of this Aminal's treasury
    /// @return balance The ETH balance in wei
    function getTreasuryBalance() external view returns (uint256 balance) {
        return address(this).balance;
    }

    /*//////////////////////////////////////////////////////////////
                              NFT OVERRIDES
    //////////////////////////////////////////////////////////////*/

    /// @notice Implementation of abstract function from GeneRenderer
    /// @param aminalID The Aminal ID to get visuals for (must match this Aminal)
    /// @return visuals The visual traits of this Aminal
    function getAminalVisualsByID(uint256 aminalID) public view virtual override returns (Visuals memory) {
        require(aminalID == aminalIndex, "Invalid aminal ID");
        return visuals;
    }

    /// @notice Generate token URI using GeneRenderer
    /// @param id Token ID (must be 1 since each Aminal has only one NFT)
    /// @return uri The complete token URI with metadata and image
    function tokenURI(uint256 id) public view override returns (string memory) {
        require(id == 1, "Token does not exist");
        return dataURI(aminalIndex);
    }

    /*//////////////////////////////////////////////////////////////
                            SOULBOUND OVERRIDES
    //////////////////////////////////////////////////////////////*/

    // Note: Aminals are soulbound NFTs and cannot be transferred
    // The NFT remains owned by the factory for identification purposes

    /// @notice Disabled - Aminals are soulbound and cannot be transferred
    function transferFrom(address, address, uint256) public pure override {
        revert("Aminals are soulbound and cannot be transferred");
    }

    /// @notice Disabled - Aminals are soulbound and cannot be transferred
    function safeTransferFrom(address, address, uint256) public pure override {
        revert("Aminals are soulbound and cannot be transferred");
    }

    /// @notice Disabled - Aminals are soulbound and cannot be transferred
    function safeTransferFrom(address, address, uint256, bytes memory) public pure override {
        revert("Aminals are soulbound and cannot be transferred");
    }

    /// @notice Disabled - Aminals are soulbound and cannot be approved
    function approve(address, uint256) public pure override {
        revert("Aminals are soulbound and cannot be approved");
    }

    /// @notice Disabled - Aminals are soulbound and cannot be approved
    function setApprovalForAll(address, bool) public pure override {
        revert("Aminals are soulbound and cannot be approved");
    }

    /*//////////////////////////////////////////////////////////////
                             RECEIVE FUNCTION
    //////////////////////////////////////////////////////////////*/

    /// @notice Receive function to accept ETH and automatically feed the Aminal
    /// @dev Any ETH sent directly to the contract will be treated as feeding
    receive() external payable {
        if (msg.value > 0) _feed(msg.sender, msg.value);
    }
}
