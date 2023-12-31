// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/console.sol";

import {Aminals} from "src/Aminals.sol";
import {IAminal} from "src/IAminal.sol";
import {ISkill} from "src/skills/ISkills.sol";

contract Move2D is ISkill {
    address public aminals;

    mapping(uint256 aminalId => Coordinates2D coords) public Coords2D;

    struct Coordinates2D {
        uint256 x;
        uint256 y;
    }

    constructor(address _aminals) {
        aminals = _aminals;
    }

    function useSkill(address, uint256 aminalId, bytes calldata data) public payable returns (uint256 squeak) {
        require(msg.sender == aminals);
        (uint256 x, uint256 y) = abi.decode(data, (uint256, uint256));
        console.log("request to move to x = ", x, " & y = ", y);
        return _move2D(aminalId, x, y);
    }

    // Getters
    function getSkillData(uint256 x, uint256 y) public pure returns (bytes memory data) {
        return abi.encode(x, y);
    }

    function getCoords(uint256 aminalID) public view returns (uint256, uint256) {
        return (Coords2D[aminalID].x, Coords2D[aminalID].y);
    }

    // Internal functions
    function _move2D(uint256 aminalID, uint256 x, uint256 y) internal returns (uint256 squeak) {
        // replace with squeak calc based on distance
        squeak = 2;

        Coords2D[aminalID].x = x;
        Coords2D[aminalID].y = y;
        console.log("still alive!");
        return squeak;
    }
}
