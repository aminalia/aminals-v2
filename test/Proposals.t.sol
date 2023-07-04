// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Aminals.sol";
import "../src/proposals/AminalProposals.sol";
import "../src/proposals/IProposals.sol";

import "../src/IAminal.sol";

contract ProposalsTest is Test {
    IProposals public proposals;
    Aminals public aminals;
    Move2D public moveSkill;

    function setUp() public {
        aminals = new Aminals();
        proposals = aminals.proposals();
        moveSkill = new Move2D();
    }

    function test_Run() public {
        uint256 proposalId = proposeSkills(address(moveSkill));
        voteAddSkill(proposalId);
        voteRemoveSkill(proposalId);
    }

    function proposeSkills(address moveSkill) {}

    function voteAddSkill(uint256) {}

    function voteRemoveSkill(uint256) {}
}
