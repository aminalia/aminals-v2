// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/console.sol";

import {AminalFactory} from "src/AminalFactory.sol";
import {Skill} from "./Skill.sol";

contract Move2D is Skill {
    AminalFactory public factory;

    mapping(address aminalContract => Coordinates2D coords) public Coords2D;

    struct Coordinates2D {
        uint256 x;
        uint256 y;
    }

    constructor(address _factory) {
        factory = AminalFactory(_factory);
    }

    /**
     * @dev Move an Aminal to a new 2D position
     * @param x The x coordinate to move to
     * @param y The y coordinate to move to
     */
    function move(uint256 x, uint256 y) external {
        require(factory.isAminal(msg.sender), "Only Aminal contracts can call this");
        console.log("request to move to x = ", x, " & y = ", y);
        _move2D(msg.sender, x, y);
    }

    /**
     * @dev Calculate cost based on the movement distance
     * @param data The calldata being sent to this skill
     * @return The amount of energy and love required
     */
    function skillCost(bytes calldata data) external view override returns (uint256) {
        bytes4 selector = bytes4(data);

        if (selector == this.move.selector) {
            (uint256 x, uint256 y) = abi.decode(data[4:], (uint256, uint256));

            // Get current position
            uint256 currentX = Coords2D[msg.sender].x;
            uint256 currentY = Coords2D[msg.sender].y;

            // Calculate Manhattan distance
            uint256 deltaX = x > currentX ? x - currentX : currentX - x;
            uint256 deltaY = y > currentY ? y - currentY : currentY - y;
            uint256 distance = deltaX + deltaY;

            // Base cost of 1 + distance/10 (rounded up)
            return 1 + (distance + 9) / 10;
        }

        // Default cost for unknown actions
        return 1;
    }

    // Getters
    function getSkillData(uint256 x, uint256 y) public pure returns (bytes memory data) {
        return abi.encodeWithSelector(this.move.selector, x, y);
    }

    function getCoords(address aminalContract) public view returns (uint256, uint256) {
        return (Coords2D[aminalContract].x, Coords2D[aminalContract].y);
    }

    // Internal functions
    function _move2D(address aminalContract, uint256 x, uint256 y) internal {
        Coords2D[aminalContract].x = x;
        Coords2D[aminalContract].y = y;
        console.log("moved to coordinates: x=", x, " y=", y);
    }
}
