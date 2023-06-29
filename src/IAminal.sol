// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

interface IAminal {
    struct Aminal {
        uint256 momId;
        uint256 dadId;
        uint256 totalLove;
        // TODO: Check whether gas usage is the same for a uint128
        uint256 energy;
        bool breeding;
        mapping(uint256 aminalTwoId => bool readyToBreed) breedableWith;
        mapping(address user => uint256 love) lovePerUser;
        Visuals visuals;
        mapping(uint8 => Skills) skills;
    }

    // TODO: Migrate to VisualsRegistry
    // Question: this should stay here, and reference the visuals in the VisualsRegistry, right ?

    struct Visuals {
        uint256 bodyId;
        uint256 hatId;
        uint256 eyesId;
        uint256 mouthId;
        uint256 noseId;
        uint256 limbsId;
        uint256 tailId;
        uint256 miscId;
    }

    // TODO: Migrate to SkillsRegistry
    struct Skills {
        string name;
        address contractAddress;
        // Human-readable ABI format
        string functionSignature;
    }

}
