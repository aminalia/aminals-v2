// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";

/**
 * @title IAminal - Interface for Autonomous Digital Companion Contracts
 * @notice Defines the external interface for interacting with Aminal contracts
 * @dev Each Aminal is a unique contract implementing this interface
 * @author The Aminals Collective
 */
interface IAminal is IAminalStructs {
    /*//////////////////////////////////////////////////////////////
                            FEEDING MECHANICS
    //////////////////////////////////////////////////////////////*/

    /// @notice Feed the Aminal with ETH to gain love and energy
    /// @return energyGained The amount of energy gained from this feeding
    function feed() external payable returns (uint256);

    /*//////////////////////////////////////////////////////////////
                           EXPRESSION MECHANICS
    //////////////////////////////////////////////////////////////*/

    /// @notice Express through the Aminal's voice by consuming love and energy
    /// @param amount The intensity of the squeak (love and energy required)
    /// @custom:deprecated This function may be deprecated in future versions
    function squeak(uint256 amount) external payable;

    /// @notice Factory-only function to consume love and energy on behalf of a user
    /// @param user The user whose love should be consumed
    /// @param amount The amount of love and energy to consume
    function squeakFrom(address user, uint256 amount) external;

    /*//////////////////////////////////////////////////////////////
                             SKILL SYSTEM
    //////////////////////////////////////////////////////////////*/

    /// @notice Execute a skill by calling an external contract
    /// @param target The skill contract address implementing ISkill
    /// @param data The ABI-encoded calldata for the skill function
    function useSkill(address target, bytes calldata data) external;

    /*//////////////////////////////////////////////////////////////
                           TREASURY MANAGEMENT
    //////////////////////////////////////////////////////////////*/

    /// @notice Transfer ETH from treasury to recipient (gene auction only)
    /// @param amount Amount of ETH to transfer in wei
    /// @param recipient Address to receive the ETH
    /// @return success True if transfer was successful
    function payout(uint256 amount, address recipient) external returns (bool success);

    /*//////////////////////////////////////////////////////////////
                             VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Get the visual traits of this Aminal
    /// @return visuals The Visuals struct containing all trait IDs
    function getVisuals() external view returns (Visuals memory);

    /// @notice Get a user's love balance for this Aminal
    /// @param user Address to check love balance for
    /// @return love The amount of love the user has given
    function getLoveByUser(address user) external view returns (uint256);

    /// @notice Get the total love this Aminal has received
    /// @return totalLove The cumulative love from all users
    function getTotalLove() external view returns (uint256);

    /// @notice Get the current energy level of this Aminal
    /// @return energy The current energy available for actions
    function getEnergy() external view returns (uint256);

    /// @notice Check if breeding is allowed with another Aminal
    /// @param partner Address of the potential breeding partner
    /// @return allowed True if breeding is allowed with the partner
    function isBreedableWith(address partner) external view returns (bool);

    /// @notice Get the current ETH balance of the Aminal's treasury
    /// @return balance The ETH balance in wei
    function getTreasuryBalance() external view returns (uint256 balance);

    /*//////////////////////////////////////////////////////////////
                             NFT FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Generate the token URI for this Aminal's NFT
    /// @return uri The complete token URI with metadata and image
    function tokenURI() external view returns (string memory);

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

    /// @notice Thrown when caller is not authorized (factory/auction only functions)
    error OnlyFactory();

    /// @notice Thrown when referenced Aminal does not exist
    error AminalDoesNotExist();

    /// @notice Thrown when Aminal has insufficient treasury balance for payout
    error InsufficientTreasury();

    /// @notice Thrown when treasury transfer to recipient fails
    error TreasuryTransferFailed();
}
