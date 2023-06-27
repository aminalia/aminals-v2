// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

contract SkillRegistry {
    mapping(bytes32 skillId => Skill skill) public skills;

    struct Skill {
        bytes32 id;
        address contractAddress;
        // Human-readable ABI format
        string functionSignature;
    }

    function addSkill(address contractAddress, string calldata functionSignature) public {
        bytes32 id = getHashFromSkillData(contractAddress, functionSignature);
        skills[id] = Skill(id, contractAddress, functionSignature);
        // TODO: Check if function exists on contract
    }

    // Looks up Skills by ID and converts them to Skills
    function getSkill() public {}

    function getHashFromSkillData(address contractAddress, string calldata functionSignature)
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(contractAddress, functionSignature));
    }
}
