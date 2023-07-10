// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/console.sol";
import "forge-std/Test.sol";

import "../IAminal.sol";
import "../Aminals.sol";

import "../skills/ISkills.sol";
import "./Move2D.sol";

contract MoveTwice is ISkill {
    address public aminals;
    address public mover;

    constructor(address _aminals, address _mover) {
        aminals = _aminals;
        mover = _mover;
    }

    function useSkill(address sender, uint256 aminalId, bytes calldata data) public payable returns (uint256 squeak) {
        require(msg.sender == aminals);
        (bytes memory data1, bytes memory data2) = abi.decode(data, (bytes, bytes));
        console.log("About to call the moveTwice function -- with msg.value = ", msg.value);
        return moveTwice(aminalId, sender, data1, data2);
    }

    // DELETE - for testing only
    function moveTwice(uint256 aminalID, address sender, bytes memory data1, bytes memory data2)
        public payable
        returns (uint256)
    {
        console.log("first movement ----");
        IAminal(aminals).callSkillInternal{value: msg.value}(sender, aminalID, mover, data1);

        console.log("second movement ----");
        IAminal(aminals).callSkillInternal{value: msg.value}(sender, aminalID, mover, data2);
        return 0;
    }

    // Getters
    function getSkillData(uint256 x1, uint256 y1, uint256 x2, uint256 y2) public pure returns (bytes memory data) {
        return abi.encode(abi.encode(x1, y1), abi.encode(x2, y2));
    }

    // function getCoords (uint256 aminalID) public returns (uint256, uint256) {
    //     return (Coords2D[aminalID].x, Coords2D[aminalID].y);
    // }
}
