// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Skill} from "./Skill.sol";

/**
 * @title SqueakSkill
 * @notice Core skill that allows Aminals to squeak, consuming energy and love
 * @dev This replaces the native squeak() function with a skill-based approach
 */
contract SqueakSkill is Skill {
    event Squeaked(address indexed aminal, uint256 amount);

    /**
     * @notice Make the Aminal squeak
     * @param amount The amount of energy and love to consume
     */
    function squeak(uint256 amount) external {
        emit Squeaked(msg.sender, amount);
    }

    /**
     * @notice Calculate the cost for squeaking
     * @dev Simply returns the amount parameter as the cost
     * @param data The encoded function call
     * @return The amount of energy and love required (equal to the amount parameter)
     */
    function skillCost(bytes calldata data) external pure override returns (uint256) {
        bytes4 selector = bytes4(data);

        if (selector == this.squeak.selector) {
            uint256 amount = abi.decode(data[4:], (uint256));
            return amount;
        }

        // Default cost if not squeak function
        return 1;
    }
}
