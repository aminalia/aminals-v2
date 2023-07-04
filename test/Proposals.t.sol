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
        uint256 proposalId = proposeAddSkill("Move Skill", address(moveSkill));
        voteYes(proposalId);
        uint256 proposalId2 = proposeRemoveSkill("No longer needed", address(moveSkill));
        voteYes(proposalId2);

        // wait time
        // check vote is closed
        // check execution successful
        // use new skill

    }

    function proposeAddSkill(string memory _skillName, address _skillAddress) public returns (uint proposalId) {
         proposalId = proposals.proposeAddSkill(_skillName, _skillAddress);
    }

    function proposeRemoveSkill(string memory _description, address _skillAddress) public  returns (uint proposalId) {
         proposalId = proposals.proposeRemoveSkill(_description, _skillAddress);
    }

    function voteYes(uint256 _proposalId) public {
        aminals.voteYes(_proposalId);
    }
    function voteNo(uint256 _proposalId) public {
        aminals.voteNo(_proposalId);
    }
}
