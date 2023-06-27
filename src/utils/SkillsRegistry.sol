// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

// TODO: Consider migrating this to an interface of Constants that compatible
// smart contracts inherit. That lets us avoid SLOADs when looking up available
// functions. The upside is that this saves gas, the downside is that it means
// that all Aminals plug-ins have to build explicit contract compatibility.
// Aminals wouldn't be able to pull in other functions
contract SkillRegistry {
    mapping(address contractAddress => Skill skill) public skillsForContractAddress;

    struct Skill {
        // Human-readable ABI format
        // TODO: Consider a dynamically sized array
        mapping(uint256 index => string functionSignature) contractFunctions;
        uint256 contractFunctionMaxIndex;
    }

    function addSkill(address contractAddress, string calldata functionSignature) public {
        // TODO: Check if function exists on contract as a require statement
        Skill storage skill = skillsForContractAddress[contractAddress];
        // TODO: Check whteher ++skill.contractFunctionMaxIndex is more
        // gas efficient than skill.contractFunctionMaxIndex++
        skill.contractFunctionMaxIndex++;
        skill.contractFunctions[skill.contractFunctionMaxIndex] = functionSignature;
    }

    // Looks up Skills by index and converts them to Skills
    function getSkill(address contractAddress, uint256 skillIndex) public {}
}
