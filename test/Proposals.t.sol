// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {BaseTest} from "./BaseTest.sol";

import {AminalProposals} from "src/proposals/AminalProposals.sol";
import {Aminals} from "src/Aminals.sol";
import {IAminal} from "src/IAminal.sol";
import {IProposals} from "src/proposals/IProposals.sol";
import {Move2D} from "src/skills/Move2D.sol";

contract ProposalsTest is BaseTest {
    IProposals public proposals;
    Aminals public aminals;
    Move2D public moveSkill;

    function setUp() public {
        aminals = Aminals(deployAminals());
        proposals = aminals.proposals();
        moveSkill = new Move2D(address(aminals));
    }

    function test_Run() public {
        spawnInitialAminals(aminals);
        uint256 a1 = 1;
        uint256 a2 = 2;

        uint256 proposalId = proposeAddSkill(a1, "Move Skill", address(moveSkill));
        // voteYes(a1, proposalId);
        uint256 proposalId2 = proposeRemoveSkill(a1, "No longer needed", address(moveSkill));
        // voteYes(a1, proposalId2);

        // wait time
        // check vote is closed
        // check execution successful
        // use new skill
    }

    function proposeAddSkill(uint256 aminalID, string memory _skillName, address _skillAddress)
        public
        returns (uint256 proposalId)
    {
        vm.prank(address(aminals));
        proposalId = proposals.proposeAddSkill(aminalID, _skillName, _skillAddress);
    }

    function proposeRemoveSkill(uint256 aminalID, string memory _description, address _skillAddress)
        public
        returns (uint256 proposalId)
    {
        vm.prank(address(aminals));
        proposalId = proposals.proposeRemoveSkill(aminalID, _description, _skillAddress);
    }

    function voteYes(uint256 aminalID, uint256 _proposalId) public {
        // aminals.voteYes(aminalID, _proposalId);
    }

    function voteNo(uint256 aminalID, uint256 _proposalId) public {
        // aminals.voteNo(aminalID, _proposalId);
    }
}
