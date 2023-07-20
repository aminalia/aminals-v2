// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/console.sol";
import "forge-std/Test.sol";

import {Initializable} from "oz/proxy/utils/Initializable.sol";
import {Ownable} from "oz/access/Ownable.sol";

import {IAminal} from "src/IAminal.sol";
import {Aminals} from "src/Aminals.sol";

import {ISkill} from "src/skills/ISkills.sol";

import "../proposals/IProposals.sol";
import {AminalProposals} from "../proposals/AminalProposals.sol";

contract VoteSkill is ISkill, AminalProposals {
    uint256 public LoveQuorum = 80;
    uint256 public LoveQuorumDecayPerWeek = 10;
    uint256 public LoveRequiredMajority = 50;

    // constructor(address _aminals) AminalProposals(_aminals) {
    //     aminals = _aminals;
    // }
    constructor() {}

    function setup(address _aminals) external override initializer onlyOwner {
        aminals = _aminals;
    }

    function useSkill(
        address sender,
        uint256 aminalId,
        bytes calldata data
    ) public payable returns (uint256 squeak) {
        require(msg.sender == aminals);

        // Aminal amin = Aminals(aminals).getAminalById(aminalId);
        // console.log(amin.tokenURI(1));

        (uint256 proposalId, bool vote) = abi.decode(data, (uint256, bool));

        return
            _vote(
                aminalId,
                sender,
                proposalId,
                vote,
                Aminals(aminals).getAminalLoveTotal(aminalId),
                LoveQuorum,
                LoveRequiredMajority
            );
    }

    // function _vote(uint256 aminalID, address sender, uint256 proposalId, bool yesNo, uint256 membersLength, uint256 quorum, uint256 requiredMajority) internal returns (uint256 squeak) {

    // Getters
    function getSkillData(
        uint256 proposalId,
        bool vote
    ) public pure returns (bytes memory data) {
        return abi.encode(proposalId, vote);
    }

    event LoveVoted(
        uint256 indexed proposalId,
        uint256 indexed aminalID,
        bool vote,
        uint256 votedYes,
        uint256 votedNo
    );
    event LoveVoteResult(
        uint256 indexed proposalId,
        bool pass,
        uint256 votes,
        uint256 quorumPercent,
        uint256 membersLength,
        uint256 yesPercent,
        uint256 requiredMajority
    );

    // Internal functions

    // THIS IS A MERITOCRACY BASED ON LOVE THAT AMINAL HAS FOR MSG.SENDER

    function _vote(
        uint256 aminalID,
        address sender,
        uint256 proposalId,
        bool yesNo,
        uint256 membersLength,
        uint256 quorum,
        uint256 requiredMajority
    ) internal returns (uint256 squeak) {
        // replace with squeak calc based on proposal
        squeak = 2;

        // TODO: vote calc and execute when successful
        LoveProposal storage proposal = loveProposals[proposalId];
        require(proposal.closed == 0);

        // uint love = aminals[aminalID].lovePerUser[msg.sender];
        uint256 love = Aminals(aminals).getAminalLoveByIdByUser(
            aminalID,
            msg.sender
        );

        // first vote
        if (loveVotes[proposalId][msg.sender] == 0) {
            if (yesNo) {
                proposal.votedYes += love;
                loveVotes[proposalId][msg.sender] = 1;
            } else {
                proposal.votedNo += love;
                loveVotes[proposalId][msg.sender] = 2;
            }
            emit LoveVoted(
                proposalId,
                aminalID,
                yesNo,
                proposal.votedYes,
                proposal.votedNo
            );

            // Changing Yes to No
        } else if (
            loveVotes[proposalId][msg.sender] == 1 &&
            !yesNo &&
            proposal.votedYes > 0
        ) {
            proposal.votedYes--;
            proposal.votedNo++;
            loveVotes[proposalId][msg.sender] = 2;
            emit LoveVoted(
                proposalId,
                aminalID,
                yesNo,
                proposal.votedYes,
                proposal.votedNo
            );
            // Changing No to Yes
        } else if (
            loveVotes[proposalId][msg.sender] == 2 &&
            yesNo &&
            proposal.votedNo > 0
        ) {
            proposal.votedYes++;
            proposal.votedNo--;
            loveVotes[proposalId][msg.sender] = 1;
            emit LoveVoted(
                proposalId,
                aminalID,
                yesNo,
                proposal.votedYes,
                proposal.votedNo
            );
        }

        uint256 voteCount = proposal.votedYes + proposal.votedNo;
        if (voteCount * 100 >= quorum * membersLength) {
            uint256 yesPercent = (proposal.votedYes * 100) / voteCount;
            proposal.pass = yesPercent >= requiredMajority;
            emit LoveVoteResult(
                proposalId,
                proposal.pass,
                voteCount,
                quorum,
                membersLength,
                yesPercent,
                requiredMajority
            );
        }

        return squeak;
    }
}
