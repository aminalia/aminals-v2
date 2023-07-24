// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "abdk-libraries-solidity/ABDKMathQuad.sol";
import "forge-std/console.sol";

import {Initializable} from "oz/proxy/utils/Initializable.sol";
import {Ownable} from "oz/access/Ownable.sol";

import {AminalProposals} from "src/proposals/AminalProposals.sol";
import {AminalsDescriptor} from "src/nft/AminalsDescriptor.sol";
import {ERC721S} from "src/nft/ERC721S.sol";
import {FeedBondingCurve} from "src/utils/FeedBondingCurve.sol";
import {IAminal} from "src/IAminal.sol";
import {IProposals} from "src/proposals/IProposals.sol";
import {ISkill} from "src/skills/ISkills.sol";
import {VisualsAuction} from "src/utils/VisualsAuction.sol";
// import {VoteSkill} from "src/skills/VoteSkill.sol";

contract Aminals is IAminal, ERC721S("Aminals", "AMINALS"), AminalsDescriptor, Initializable, Ownable {
    mapping(uint256 aminalId => Aminal aminal) public aminals;
    uint256 public lastAminalId;
    VisualsAuction public visualsAuction;
    // VoteSkill public voteSkill;

    mapping(address => bool) public skills;

    AminalProposals public proposals;
    // IProposals public loveProposals;

    // uint256 public quorum = 80;
    // uint256 public quorumDecayPerWeek = 10;
    // uint256 public requiredMajority = 70;

    modifier _onlyAuction() {
        require(msg.sender == address(visualsAuction));
        _;
    }

    modifier _onlyProposal() {
        require(msg.sender == address(proposals));
        _;
    }

    constructor(address _visualsAuction, /*address _voteSkill,*/ address _aminalProposals) {
        visualsAuction = VisualsAuction(_visualsAuction);
        // voteSkill = VoteSkill(_voteSkill);
        // skills[address(voteSkill)] = true; // Enable vote skill

        // TODO decide if and how this proposal address could be modified/upgraded
        proposals = AminalProposals(_aminalProposals);

        // initialize the AminalsDescriptor with empty SVG for index 0
        string memory emptySVG = "";
        addBackground(emptySVG);
        addArm(emptySVG);
        addTail(emptySVG);
        addEar(emptySVG);
        addBody(emptySVG);
        addFace(emptySVG);
        addMouth(emptySVG);
        addMisc(emptySVG);
    }

    function spawnInitialAminals(Visuals[] calldata _visuals) external initializer onlyOwner {
        for (uint256 _i = 0; _i < _visuals.length; _i++) {
            _spawnAminalInternal(
                0,
                0,
                _visuals[_i].backId,
                _visuals[_i].armId,
                _visuals[_i].tailId,
                _visuals[_i].earsId,
                _visuals[_i].bodyId,
                _visuals[_i].faceId,
                _visuals[_i].mouthId,
                _visuals[_i].miscId
            );
        }
    }

    // TODO make it so you can only spawn the initial ones
    // Then restrict all future ones to only come from breeding?
    // Possibly:
    //  Initialization period where inititializer can spawn the initial set
    //  Then there is the breeding period where they can only be spawned during gestation
    //
    function spawnAminal(
        uint256 aminalOne,
        uint256 aminalTwo,
        uint256 backId,
        uint256 armId,
        uint256 tailId,
        uint256 earsId,
        uint256 bodyId,
        uint256 faceId,
        uint256 mouthId,
        uint256 miscId
    ) _onlyAuction public returns (uint256) {
        // if (msg.sender != address(visualsAuction)) revert NotSpawnable();

        return
            _spawnAminalInternal(aminalOne, aminalTwo, backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId);
    }

    function _spawnAminalInternal(
        uint256 aminalOne,
        uint256 aminalTwo,
        uint256 backId,
        uint256 armId,
        uint256 tailId,
        uint256 earsId,
        uint256 bodyId,
        uint256 faceId,
        uint256 mouthId,
        uint256 miscId
    ) internal returns (uint256) {
        uint256 aminalId = ++lastAminalId;
        Aminal storage aminal = aminals[aminalId];
        aminal.momId = aminalOne;
        aminal.dadId = aminalTwo;
        aminal.visuals.backId = backId; // Probably something checking that these IDs are in the range of valid traits
        aminal.visuals.armId = armId;
        aminal.visuals.tailId = tailId;
        aminal.visuals.earsId = earsId;
        aminal.visuals.bodyId = bodyId;
        aminal.visuals.faceId = faceId;
        aminal.visuals.mouthId = mouthId;
        aminal.visuals.miscId = miscId;
        _mint(address(this), aminalId);

        return aminalId;
    }

    // TODO do we need all the views?
    function getAminalVisualsByID(uint256 aminalID) public view override returns (Visuals memory) {
        return aminals[aminalID].visuals;
    }

    function tokenURI(uint256 aminalID) public view override returns (string memory) {
        return dataURI(aminalID);
    }

    function getAminalLoveTotal(uint256 aminalID) public view returns (uint256) {
        Aminal storage aminal = aminals[aminalID];
        return aminal.totalLove;
    }

    function getAminalLoveByIdByUser(uint256 aminalID, address user) public view returns (uint256) {
        Aminal storage aminal = aminals[aminalID];
        return aminal.lovePerUser[user];
    }

    function getEnergy(uint256 aminalID) public view returns (uint256) {
        Aminal storage aminal = aminals[aminalID];
        return aminal.energy;
    }

    // // Check for underflows
    // // Needs to be easier to read and easier to test invariants
    // function getQuorum(uint256 proposalTime, uint256 currentTime) public view returns (uint256) {
    //     if (quorum > ((currentTime - proposalTime) * quorumDecayPerWeek) / (1 weeks)) {
    //         return ((quorum - currentTime - proposalTime) * quorumDecayPerWeek) / (1 weeks);
    //     } else {
    //         return 0;
    //     }
    // }

    function feed(uint256 aminalId) public payable returns (uint256) {
        if (msg.value < 0.01 ether) revert NotEnoughEther();
        return _feed(aminalId, msg.sender, msg.value);
    }

    function _feed(uint256 aminalId, address feeder, uint256 amount) internal returns (uint256) {
        Aminal storage aminal = aminals[aminalId];

        //console.log("TESTESTEST: ", feeder);

        // TODO: Amount of love should be on a bonding curve, not a direct
        // addition
        //  uint256 amount = (msg.value / 10**16);

        // TODO: Change _adjustLove bool to a constant
        _adjustLove(aminalId, amount, feeder, true);
        // TODO: Energy should be on a bonding curve that creates an asymptote
        // (possibly a polynomic function), not a direct addition. The bonding
        // curve should be configured so that energy should never reach 100 (the
        // max). Energy can reach 0

        // aminal.energy += uint8(amount);

        // assuming a simple bonding curve, where d(e) = ETH * (1 - e/100)**2
        // aminal.energy = aminal.energy + (amount * ((1 - aminal.energy/100) ** 2));

        // assuming a simple bonding curve, where d(e) = (100 - e)/100
        // bytes16 delta = ABDKMathQuad.div( ABDKMathQuad.sub(ABDKMathQuad.fromInt(100),
        // aminal.energy),
        // ABDKMathQuad.fromInt(100) );
        // aminal.energy = ABDKMathQuad.add(aminal.energy, ABDKMathQuad.mul(delta,
        // ABDKMathQuad.fromUInt(amount)));

        uint256 gap = 10 ** 18 - aminal.energy;

        uint256 delta = (amount * gap) / 10 ** 18;
        aminal.energy += delta;

        // using the bonding curve system
        // FeedBondingCurve feedcurve = new FeedBondingCurve();
        // aminal.energy = feedcurve.feedBondingCurve(amount, aminal.energy);

        // return ABDKMathQuad.toUInt(ABDKMathQuad.mul(ABDKMathQuad.fromUInt(amount), delta));
        //     return ABDKMathQuad.toUInt(delta);

        return delta;
    }

    function setBreeding(uint256 aminalID, bool breeding) public _onlyAuction {
        Aminal storage aminal = aminals[aminalID];
        aminal.breeding = breeding;
    }

    function disableBreedable(uint256 aminalIdOne, uint256 aminalIdTwo) public _onlyAuction {
        Aminal storage aminalOne = aminals[aminalIdOne];
        Aminal storage aminalTwo = aminals[aminalIdTwo];

        aminalOne.breedableWith[aminalIdTwo] = false;
        aminalTwo.breedableWith[aminalIdOne] = false;
    }

    function breedWith(uint256 aminalIdOne, uint256 aminalIdTwo) public payable returns (uint256 ret) {
        require(msg.value >= 0.01 ether, "Not enough ether");

        Aminal storage aminalOne = aminals[aminalIdOne];
        Aminal storage aminalTwo = aminals[aminalIdTwo];
        // Check that Aminal One loves the user enough
        require(aminalOne.lovePerUser[msg.sender] >= 10, "Not enough love");

        // Aminal One loves the user and will follow the user's requessts.
        // Therefore, the breedable status that matters is Aminal Two's, because
        // Aminal Two will not listen to the user. (If Aminal Two has high
        // enough love, the user could set both breed statuses in separate
        // transactions. We're not adjusting Aminal Two's status here even if
        // the user has high enough love on Aminal Two to maintain simplicity --
        // a wrapper contract can always do this atomically in one transaction)
        if (aminalTwo.breedableWith[aminalIdOne]) {
            require(aminalOne.energy >= 10 && aminalTwo.energy >= 10, "Aminal does not have enough energy to breed");

            return visualsAuction.startAuction(aminalIdOne, aminalIdTwo); // remember to undo the
                // breedableWith then auction ends!

            // TODO: Initiate voting for traits on the Visual registry. Voting is
            // denominated in the combined love of both Aminal One and Aminal Two
        } else {
            aminalOne.breedableWith[aminalIdTwo] = true;
            console.log("aminal (", aminalIdOne, ") is now breedable with ", aminalIdTwo);

            return 0;
        }
    }

    // This function consumes energy and can be called by both skill contracts
    // and users
    // TODO: Allow users to specify the number of squeaks
    function squeak(uint256 aminalId, uint256 amount) public payable {
        console.log("here... with msg.value == ", msg.value);
        if (msg.value < 0.01 ether) revert NotEnoughEther();

        Aminal storage aminal = aminals[aminalId];

        console.log("there... with love == ", aminal.lovePerUser[msg.sender]);
        console.log("coming from the address == ", msg.sender, " with skills: ", skills[msg.sender]);
        require(skills[msg.sender] == true || aminal.lovePerUser[msg.sender] >= amount, "Not enough love");

        if (skills[msg.sender] == true) return; // don't adjust love or energy for smart contract calls

        // ensure that aminal.energy never goes below 0
        if (aminal.energy >= amount) aminal.energy = aminal.energy - amount;

        // TODO: Migrate the bool to a constant for convenience
        _adjustLove(aminalId, amount, msg.sender, false);
    }

    function callSkill(uint256 aminalId, address skillAddress, bytes calldata data) public payable {
        require(skills[skillAddress] == true);
        uint256 amount = ISkill(skillAddress).useSkill{value: msg.value}(msg.sender, aminalId, data);
        console.log("Call Skill pubilc function (ABOUT TO SQUEEK) for ", amount);
        squeak(aminalId, amount);
    }

    // TODO to be internal/ harness
    function callSkillInternal(address sender, uint256 aminalId, address skillAddress, bytes calldata data)
        public
        payable
    {
        require(skills[msg.sender] == true);
        require(skills[skillAddress] == true);
        console.log("calling UseSkill externally with msg.value == ", msg.value);
        uint256 amount = ISkill(skillAddress).useSkill{value: msg.value}(sender, aminalId, data);
        console.log("Call Skill Internal (about to squeak) amount === ", amount);
        squeak(aminalId, amount);
    }

    // TODO: Switch to passing the Aminal struct instead of the aminalId
    function _adjustLove(uint256 aminalId, uint256 love, address sender, bool increment) internal {
        Aminal storage aminal = aminals[aminalId];
        if (!increment) {
            aminal.lovePerUser[sender] -= love;
            aminal.totalLove -= love;
        } else {
            aminal.lovePerUser[sender] += love;
            aminal.totalLove += love;
        }
    }

    // TODO: Add delegation to other addresses. This will likely end up wrapping
    // msg.sender functionality in a library that checks for delegation
    function loveDrivenPrice(uint256 aminalId, address sender) public view returns (uint128) {
        Aminal storage aminal = aminals[aminalId];
        // the higher the love, the cheaper the function calls
        //
        // Aminals.Aminal storage aminal = aminals.aminals[aminalId];
        // Aminals.Aminal storage aminal = aminals.getAminalById(aminalId);
        uint128 price;
        uint256 love = aminal.lovePerUser[sender];
        uint256 totlove = aminal.totalLove;
        uint256 ratio = love / totlove;
        if (ratio == 0) price = 100; // max multiplier is 100;

        else price = uint128(100 / ratio);
        // ensure that price is between 1 and 10;
        price = price / 10;
        if (price < 1) price++;

        return price * 10 ** 15;
    }

    function proposeAddSkill(uint256 aminalID, string calldata skillName, address skillAddress)
        public
        returns (uint256 proposalId)
    {
        // TODO: require minimum love amount?
        proposalId = proposals.proposeAddSkill(aminalID, skillName, skillAddress);
        proposals.LoveVote(aminalID, msg.sender, proposalId, true, getAminalLoveTotal(aminalID), proposals.LoveQuorum(), proposals.LoveRequiredMajority());


        // voteYes(aminalID, proposalId); // SHOULD REPLACE WITH A LOVE_VOTE
    }

    function proposeRemoveSkill(uint256 aminalID, string calldata description, address skillAddress)
        public
        returns (uint256 proposalId)
    {
        // TODO: require minimum love amount?
        proposalId = proposals.proposeRemoveSkill(aminalID, description, skillAddress);

        proposals.LoveVote(aminalID, msg.sender, proposalId, true, getAminalLoveTotal(aminalID), proposals.LoveQuorum(), proposals.LoveRequiredMajority());

        // voteYes(aminalID, proposalId); // SHOULD REPLACE WITH A LOVE_VOTE
    }

    function addSkill(address faddress) internal {
        // currently done such as to add the skills globally to all aminals
        // Aminal storage aminal = aminals[aminalId];
        skills[faddress] = true;
        // aminal.skills[aminal.Nskills++] = skill;
    }

    function removeSkill(address faddress) public {
        // currently done such as to add the skills globally to all aminals
        // Aminal storage aminal = aminals[aminalId];
        skills[faddress] = false;
        // aminal.skills[aminal.Nskills++] = skill;
    }

    // function voteNo(uint256 aminalID, uint256 proposalId) public {
    //     _vote(aminalID, proposalId, false);
    // }

    // function voteYes(uint256 aminalID, uint256 proposalId) public {
    //     _vote(aminalID, proposalId, true);
    // }

    function voteSkill(uint256 aminalID, uint256 proposalID, bool yesNo) public {
        proposals.LoveVote(aminalID, msg.sender, proposalID, yesNo, getAminalLoveTotal(aminalID), proposals.LoveQuorum(), proposals.LoveRequiredMajority());
    }

    function _vote(uint256 aminalID, uint256 proposalId, bool yesNo) _onlyProposal public {
        proposals.AminalVote(
            aminalID,
            proposalId,
            yesNo,
            lastAminalId,
            proposals.getQuorum(proposals.getInitiated(proposalId), block.timestamp),
            proposals.requiredMajority()
        );

        IProposals.ProposalType proposalType = proposals.getProposalType(proposalId);
        if (proposals.toExecute(proposalId)) {
            string memory description = proposals.getDescription(proposalId);
            address address1 = proposals.getAddress1(proposalId);
            // address address2 = proposals.getAddress2(proposalId);

            uint256 amount = proposals.getAmount(proposalId);
            if (proposalType == IProposals.ProposalType.AddSkill) addSkill(address1);
            else if (proposalType == IProposals.ProposalType.RemoveSkill) removeSkill(address1);
            proposals.close(proposalId);
        }
    }

    function _log2(uint256 x) private pure returns (uint256 y) {
        assembly {
            let arg := x
            x := sub(x, 1)
            x := or(x, div(x, 0x02))
            x := or(x, div(x, 0x04))
            x := or(x, div(x, 0x10))
            x := or(x, div(x, 0x100))
            x := or(x, div(x, 0x10000))
            x := or(x, div(x, 0x100000000))
            x := or(x, div(x, 0x10000000000000000))
            x := or(x, div(x, 0x100000000000000000000000000000000))
            x := add(x, 1)
            let m := mload(0x40)
            mstore(m, 0xf8f9cbfae6cc78fbefe7cdc3a1793dfcf4f0e8bbd8cec470b6a28a7a5a3e1efd)
            mstore(add(m, 0x20), 0xf5ecf1b3e9debc68e1d9cfabc5997135bfb7a7a3938b7b606b5b4b3f2f1f0ffe)
            mstore(add(m, 0x40), 0xf6e4ed9ff2d6b458eadcdf97bd91692de2d4da8fd2d0ac50c6ae9a8272523616)
            mstore(add(m, 0x60), 0xc8c0b887b0a8a4489c948c7f847c6125746c645c544c444038302820181008ff)
            mstore(add(m, 0x80), 0xf7cae577eec2a03cf3bad76fb589591debb2dd67e0aa9834bea6925f6a4a2e0e)
            mstore(add(m, 0xa0), 0xe39ed557db96902cd38ed14fad815115c786af479b7e83247363534337271707)
            mstore(add(m, 0xc0), 0xc976c13bb96e881cb166a933a55e490d9d56952b8d4e801485467d2362422606)
            mstore(add(m, 0xe0), 0x753a6d1b65325d0c552a4d1345224105391a310b29122104190a110309020100)
            mstore(0x40, add(m, 0x100))
            let magic := 0x818283848586878898a8b8c8d8e8f929395969799a9b9d9e9faaeb6bedeeff
            let shift := 0x100000000000000000000000000000000000000000000000000000000000000
            let a := div(mul(x, magic), shift)
            y := div(mload(add(m, sub(255, a))), shift)
            y := add(y, mul(256, gt(arg, 0x8000000000000000000000000000000000000000000000000000000000000000)))
        }
    }
}
