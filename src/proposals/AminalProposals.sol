pragma solidity ^0.8.20;

import {IProposals} from "src/proposals/IProposals.sol";
import {Initializable} from "oz/proxy/utils/Initializable.sol";
import {Ownable} from "oz/access/Ownable.sol";
import {Aminals} from "src/Aminals.sol";
import "forge-std/console.sol";

contract AminalProposals is IProposals, Initializable, Ownable {
    mapping(uint256 => mapping(uint256 => uint256)) voted;
    mapping(uint256 => mapping(address => uint256)) loveVotes;

    struct Proposal {
        ProposalType proposalType;
        address proposer;
        string description;
        address address1;
        address address2;
        uint256 amount;
        uint256 votedNo;
        uint256 votedYes;
        uint256 initiated;
        uint256 closed;
        bool pass;
    }

    struct LoveProposal {
        ProposalType proposalType;
        address proposer;
        string description;
        address address1;
        address address2;
        uint256 amount;
        uint256 votedNo;
        uint256 votedYes;
        uint256 initiated;
        uint256 closed;
        bool pass;
    }

    address public aminals;
    bool public initialised;
    Proposal[] public proposals;
    LoveProposal[] public loveProposals;


    uint256 public quorum = 80;
    uint256 public quorumDecayPerWeek = 10;
    uint256 public requiredMajority = 70;

    uint256 public LoveQuorum = 80;
    uint256 public LoveQuorumDecayPerWeek = 10;
    uint256 public LoveRequiredMajority = 50;


    event NewProposal(uint256 indexed proposalId, ProposalType indexed proposalType, address indexed proposer);
    event RemoveProposal(uint256 indexed proposalId, ProposalType indexed proposalType, address indexed proposer);

    event Voted(uint256 indexed proposalId, uint256 indexed aminalID, bool vote, uint256 votedYes, uint256 votedNo);
    event VoteResult(
        uint256 indexed proposalId,
        bool pass,
        uint256 votes,
        uint256 quorumPercent,
        uint256 membersLength,
        uint256 yesPercent,
        uint256 requiredMajority
    );


    event LoveVoted(uint256 indexed proposalId, uint256 indexed aminalID, bool vote, uint256 votedYes, uint256 votedNo);
    event LoveVoteResult(
        uint256 indexed proposalId,
        bool pass,
        uint256 votes,
        uint256 quorumPercent,
        uint256 membersLength,
        uint256 yesPercent,
        uint256 requiredMajority
    );

    constructor() {}

    function setup(address _aminals) external virtual initializer onlyOwner {
        aminals = _aminals;
    }

    // TODO: Do they require a threashold of love to propose?
    function proposeAddSkill(uint256 aminalID, string calldata skillName, address skillAddress)
        public
        returns (uint256 proposalId)
    {
        Proposal memory proposal = Proposal({
            proposalType: ProposalType.AddSkill,
            proposer: msg.sender,
            description: skillName,
            address1: skillAddress,
            address2: address(0),
            amount: 0,
            votedNo: 0,
            votedYes: 0,
            initiated: block.timestamp,
            closed: 0,
            pass: false
        });
        proposals.push(proposal);
        proposalId = proposals.length - 1;
        emit NewProposal(proposalId, proposal.proposalType, msg.sender);

        // set up for the love proposals too
        LoveProposal memory loveprop = LoveProposal({
            proposalType: ProposalType.AddSkill,
            proposer: msg.sender,
            description: skillName,
            address1: skillAddress,
            address2: address(0),
            amount: 0,
            votedNo: 0,
            votedYes: 0,
            initiated: block.timestamp,
            closed: 0,
            pass: false 
        });
        loveProposals.push(loveprop);
    }

    //  TODO: Do they require a threashold of love to propose?
    function proposeRemoveSkill(uint256 aminalID, string calldata description, address skillAddress)
        public
        returns (uint256 proposalId)
    {
        Proposal memory proposal = Proposal({
            proposalType: ProposalType.RemoveSkill,
            proposer: msg.sender,
            description: description,
            address1: skillAddress,
            address2: address(0),
            amount: 0,
            votedNo: 0,
            votedYes: 0,
            initiated: block.timestamp,
            closed: 0,
            pass: false
        });
        proposals.push(proposal);
        proposalId = proposals.length - 1;
        emit RemoveProposal(proposalId, proposal.proposalType, msg.sender);
    }

    // Check for underflows
    // Needs to be easier to read and easier to test invariants
    function getQuorum(uint256 proposalTime, uint256 currentTime) public view returns (uint256) {
        if (quorum > ((currentTime - proposalTime) * quorumDecayPerWeek) / (1 weeks)) {
            return ((quorum - currentTime - proposalTime) * quorumDecayPerWeek) / (1 weeks);
        } else {
            return 0;
        }
    }


    // THIS IS A DEMOCRACY OF AMINALS: ONE AMINAL ONE VOTE :)
    // TODO: change voted from 1/2 to signed int128 to represent yes/no
    function AminalVote(
        uint256 aminalID,
        uint256 proposalId,
        bool yesNo,
        uint256 membersLength,
        uint256 quorum,
        uint256 requiredMajority
    ) external {
        require(msg.sender == aminals);

        Proposal storage proposal = proposals[proposalId];
        require(proposal.closed == 0);
        // First vote
        if (voted[proposalId][aminalID] == 0) {
            if (yesNo) {
                proposal.votedYes++;
                voted[proposalId][aminalID] = 1;
            } else {
                proposal.votedNo++;
                voted[proposalId][aminalID] = 2;
            }
            emit Voted(proposalId, aminalID, yesNo, proposal.votedYes, proposal.votedNo);
            // Changing Yes to No
        } else if (voted[proposalId][aminalID] == 1 && !yesNo && proposal.votedYes > 0) {
            proposal.votedYes--;
            proposal.votedNo++;
            voted[proposalId][aminalID] = 2;
            emit Voted(proposalId, aminalID, yesNo, proposal.votedYes, proposal.votedNo);
            // Changing No to Yes
        } else if (voted[proposalId][aminalID] == 2 && yesNo && proposal.votedNo > 0) {
            proposal.votedYes++;
            proposal.votedNo--;
            voted[proposalId][aminalID] = 1;
            emit Voted(proposalId, aminalID, yesNo, proposal.votedYes, proposal.votedNo);
        }

        uint256 voteCount = proposal.votedYes + proposal.votedNo;
        if (voteCount * 100 >= quorum * membersLength) {
            uint256 yesPercent = proposal.votedYes * 100 / voteCount;
            proposal.pass = yesPercent >= requiredMajority;
            emit VoteResult(proposalId, proposal.pass, voteCount, quorum, membersLength, yesPercent, requiredMajority);
        }
    }
    // TODO - Issues:
    // 1. quorumReached is not accurate after the vote passes and accepts a new member
    //    Unless storing it as a storage variable, we can't accurately track the status before the proposal is executed
    // 2. To calculate required additional votes we need to apply a ceiling function which consumes gas
    function getVotingStatus(uint256 proposalId, uint256 membersLength, uint256 quorum, uint256 requiredMajority)
        public
        view
        returns (bool isOpen, bool quorumReached, uint256 _requiredMajority, uint256 yesPercent)
    {
        Proposal storage proposal = proposals[proposalId];
        isOpen = (proposal.closed == 0);
        uint256 voteCount = proposal.votedYes + proposal.votedNo;
        quorumReached = (voteCount * 100 >= quorum * membersLength);
        yesPercent = proposal.votedYes * 100 / voteCount;
        _requiredMajority = requiredMajority;
    }

    function getProposal(uint256 proposalId) public view returns (Proposal memory proposal) {
        return proposals[proposalId];
    }

    function getProposalType(uint256 proposalId) public view returns (ProposalType) {
        return proposals[proposalId].proposalType;
    }

    function getDescription(uint256 proposalId) public view returns (string memory) {
        return proposals[proposalId].description;
    }

    function getAddress1(uint256 proposalId) public view returns (address) {
        return proposals[proposalId].address1;
    }

    function getAmount(uint256 proposalId) public view returns (uint256) {
        return proposals[proposalId].amount;
    }

    function getInitiated(uint256 proposalId) public view returns (uint256) {
        return proposals[proposalId].initiated;
    }

    function isClosed(uint256 proposalId) public view returns (bool) {
        proposals[proposalId].closed;
    }

    function pass(uint256 proposalId) public view returns (bool) {
        return proposals[proposalId].pass;
    }

    function toExecute(uint256 proposalId) public view returns (bool) {
        return proposals[proposalId].pass && proposals[proposalId].closed == 0;
    }

    function close(uint256 proposalId) public {
        require(msg.sender == aminals);
        proposals[proposalId].closed = block.timestamp;
    }

    function proposalsCount() public view returns (uint256) {
        return proposals.length;
    }


      // THIS IS A MERITOCRACY BASED ON LOVE THAT AMINAL HAS FOR MSG.SENDER

    function LoveVote(
        uint256 aminalID,
        address sender,
        uint256 proposalId,
        bool yesNo,
        uint256 membersLength,
        uint256 quorum,
        uint256 requiredMajority
    ) external returns (uint256 squeak) {

        // replace with squeak calc based on proposal
        squeak = 2;

        // TODO: vote calc and execute when successful
        LoveProposal storage proposal = loveProposals[proposalId];
        require(proposal.closed == 0);

        uint256 love = Aminals(aminals).getAminalLoveByIdByUser(aminalID, sender);

        console.log("LOVE FOR LOVE VOTE = ", love);

        // first vote
        if (loveVotes[proposalId][sender] == 0) {
            if (yesNo) {
                proposal.votedYes += love;
                loveVotes[proposalId][sender] = 1;
            } else {
                proposal.votedNo += love;
                loveVotes[proposalId][sender] = 2;
            }
            emit LoveVoted(proposalId, aminalID, yesNo, proposal.votedYes, proposal.votedNo);

            // Changing Yes to No
        } else if (loveVotes[proposalId][sender] == 1 && !yesNo && proposal.votedYes >= love) {
            proposal.votedYes -= love;
            proposal.votedNo += love;
            loveVotes[proposalId][sender] = 2;
            emit LoveVoted(proposalId, aminalID, yesNo, proposal.votedYes, proposal.votedNo);
            // Changing No to Yes
        } else if (loveVotes[proposalId][sender] == 2 && yesNo && proposal.votedNo >= love) {
            proposal.votedYes += love;
            proposal.votedNo -= love;
            loveVotes[proposalId][sender] = 1;
            emit LoveVoted(proposalId, aminalID, yesNo, proposal.votedYes, proposal.votedNo);
        }

        uint256 voteCount = proposal.votedYes + proposal.votedNo;
        if (voteCount * 100 >= quorum * membersLength) {
            uint256 yesPercent = (proposal.votedYes * 100) / voteCount;
            proposal.pass = yesPercent >= requiredMajority;
            emit LoveVoteResult(
                proposalId, proposal.pass, voteCount, quorum, membersLength, yesPercent, requiredMajority
            );
            Aminals(aminals)._vote(aminalID, proposalId, proposal.pass);
            console.log("Aminal ", aminalID, " is voting for ", proposalId);
        }

        return squeak;
    } 



}
