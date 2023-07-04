// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Aminals.sol";
import "../src/proposals/AminalProposals.sol";
import "../src/proposals/IProposals.sol";
import "../src/skills/Move2D.sol";

import "../src/IAminal.sol";

contract ProposalsTest is Test {
    IProposals public proposals;
    Aminals public aminals;
    Move2D public moveSkill;

    function setUp() public {
        aminals = new Aminals();
        proposals = aminals.proposals();
        moveSkill = new Move2D(address(aminals));
    }

    function test_Run() public {
        uint256 a1 = aminals.spawnAminal(0, 0, 1, 1, 1, 1, 1, 1, 1, 1);
        uint256 a2 = aminals.spawnAminal(0, 0, 2, 2, 2, 2, 2, 2, 2, 2);

        uint256 proposalId = proposeAddSkill(a1, "Move Skill", address(moveSkill));
        voteYes(a1, proposalId);
        uint256 proposalId2 = proposeRemoveSkill(a1, "No longer needed", address(moveSkill));
        voteYes(a1, proposalId2);

        // wait time
        // check vote is closed
        // check execution successful
        // use new skill

    }

    function proposeAddSkill(uint256 aminalID, string memory _skillName, address _skillAddress) public returns (uint proposalId) {
         proposalId = proposals.proposeAddSkill(aminalID, _skillName, _skillAddress);
    }

    function proposeRemoveSkill(uint256 aminalID, string memory _description, address _skillAddress) public  returns (uint proposalId) {
         proposalId = proposals.proposeRemoveSkill(aminalID, _description, _skillAddress);
    }

    function voteYes(uint256 aminalID, uint256 _proposalId) public {
        aminals.voteYes(aminalID, _proposalId);
    }
    function voteNo(uint256 aminalID, uint256 _proposalId) public {
        aminals.voteNo(aminalID, _proposalId);
    }
}
