// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

contract Aminals {
    mapping(uint256 aminalId => Aminal) public aminals;

    struct Aminal {
        uint8 totalLove;
        uint8 energy;
        mapping(address user => uint8 love) lovePerUser;
        Visuals visuals;
        mapping(uint8 => Skills) skills;
    }

    // TODO: Migrate to VisualsRegistry
    struct Visuals {
        string body;
        string hat;
        string eyes;
        string mouth;
        string nose;
        string limbs;
        string tail;
        string accessories;
    }

    // TODO: Migrate to SkillsRegistry
    struct Skills {
        string name;
        address contractAddress;
        // Human-readable ABI format
        string functionSignature;
    }

    function feed() public {}

    function breed() public {}

    function squeak() public {}

    function addSkill() public {}

    function addVisuals() public {}

    function callSkill(uint256 aminalId) public {
        aminals[aminalId].energy -= 1;
        // Call skill
    }
}
