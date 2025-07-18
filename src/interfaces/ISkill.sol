// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC165} from "lib/openzeppelin-contracts/contracts/utils/introspection/IERC165.sol";

/**
 * @title ISkill
 * @notice Interface for Aminal skills that can be executed with energy/love costs
 * @dev Implements EIP-165 for standard interface detection
 * @dev To implement this interface with proper ERC165 support, extend the abstract Skill contract
 */
interface ISkill is IERC165 {
    /**
     * @notice Get the cost for executing a skill with the given calldata
     * @dev This function should be view/pure and return the cost without side effects
     * @dev The cost is deducted equally from both:
     *      - Energy: Global per Aminal (shared by all users)
     *      - Love: Per user per Aminal (each user's individual contribution)
     * @param data The encoded function call that will be executed
     * @return cost The amount of energy and love required to execute this skill
     */
    function skillCost(bytes calldata data) external view returns (uint256 cost);
}
