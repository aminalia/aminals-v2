// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

// TODO does this need to be separate from IAminal?
interface IAminalStructs {
    struct Aminal {
        uint256 momId;
        uint256 dadId;
        uint256 totalLove;
        uint256 energy;
        bool breeding;
        bool exists;
        mapping(uint256 aminalTwoId => bool readyToBreed) breedableWith;
        mapping(address user => uint256 love) lovePerUser;
        Visuals visuals;
        mapping(uint256 => Skills) skills;
    }

    // TODO rename to genes? Is this used much?
    struct Visuals {
        uint256 backId;
        uint256 armId;
        uint256 tailId;
        uint256 earsId;
        uint256 bodyId;
        uint256 faceId;
        uint256 mouthId;
        uint256 miscId;
    }

    // TODO rename to GenesCat?
    enum VisualsCat {
        BACK,
        ARM,
        TAIL,
        EARS,
        BODY,
        FACE,
        MOUTH,
        MISC
    }

    // TODO: Migrate to SkillsRegistry? Kill?
    struct Skills {
        string name;
        address contractAddress;
        // Human-readable ABI format
        string functionSignature;
    }
}
