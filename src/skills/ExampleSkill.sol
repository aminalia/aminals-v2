// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Skill} from "./Skill.sol";

/**
 * @title ExampleSkill
 * @dev Example implementation of a skill that Aminals can use
 * @dev Shows how simple it is to create a skill using the abstract Skill contract
 */
contract ExampleSkill is Skill {
    event Greeted(address aminal, string message);
    event Danced(address aminal, uint256 intensity);

    /**
     * @dev Greet with a custom message
     * @param message The greeting message
     */
    function greet(string calldata message) external {
        emit Greeted(msg.sender, message);
    }

    /**
     * @dev Dance with varying intensity
     * @param intensity How intensely to dance (1-10)
     */
    function dance(uint256 intensity) external {
        require(intensity >= 1 && intensity <= 10, "Invalid intensity");
        emit Danced(msg.sender, intensity);
    }

    /**
     * @dev Calculate cost based on the action being performed
     * @dev The returned cost is deducted from both:
     *      - Energy (global per Aminal, shared by all users)
     *      - Love (per user per Aminal, from the calling user's balance)
     * @param data The calldata being sent to this skill
     * @return The amount of energy and love required
     */
    function skillCost(bytes calldata data) external pure override returns (uint256) {
        bytes4 selector = bytes4(data);

        if (selector == this.greet.selector) {
            // Greeting costs 10 energy
            return 10;
        } else if (selector == this.dance.selector) {
            // Dancing costs depend on intensity
            (, uint256 intensity) = abi.decode(data[4:], (string, uint256));
            return intensity * 5; // 5 energy per intensity level
        }

        // Default cost for unknown actions
        return 1;
    }
}
