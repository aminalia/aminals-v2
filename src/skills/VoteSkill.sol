// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/console.sol";
import "forge-std/Test.sol";

import "../IAminal.sol";
import "../Aminals.sol";

import "../skills/ISkills.sol";

contract VoteSkill is ISkill {
    address public aminals;

    mapping(uint256 aminalId => Coordinates2D coords) public Coords2D;

    struct Coordinates2D {
        uint256 x;
        uint256 y;
    }

    constructor(address _aminals) {
        aminals = _aminals;
    }

    function useSkill(address sender, uint256 aminalId, bytes calldata data) public returns (uint256 squeak) {
        require(msg.sender == aminals);
        (uint256 proposalId) = abi.decode(data, (uint256));
        return _vote(aminalId, proposalId, sender);
    }

    // DELETE - for testing only
    function voteYes(uint256 aminalID, uint256 proposalId, address sender) public returns (uint256) {
        return _vote(aminalID, proposalId, sender);
    }

    // Getters
    function getSkillData(uint256 proposalId) public pure returns (bytes memory data) {
        return abi.encode(proposalId);
    }

    // Internal functions
    function _vote(uint256 aminalID, uint256 proposalId, address sender) internal returns (uint256 squeak) {
        // replace with squeak calc based on proposal
        squeak = 2;

        // TODO: vote calc and execute when successful

        return squeak;
    }
}
