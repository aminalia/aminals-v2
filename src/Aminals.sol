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
import {GenesNFT} from "src/nft/GenesNFT.sol";

contract Aminals is IAminal, ERC721S("Aminals", "AMINALS"), AminalsDescriptor, Initializable, Ownable {
    mapping(uint256 aminalId => Aminal aminal) public aminals;
    uint256 public lastAminalId;
    VisualsAuction public visualsAuction;

    mapping(address => bool) public skills;

    AminalProposals public proposals;

    GenesNFT public genesNFT;

    event SpawnAminal(
        uint256 indexed aminalId,
        uint256 indexed mom,
        uint256 indexed dad,
        uint256 backId,
        uint256 armId,
        uint256 tailId,
        uint256 earsId,
        uint256 bodyId,
        uint256 faceId,
        uint256 mouthId,
        uint256 miscId
    );

    event BreedAminal(uint256 indexed aminalOne, uint256 indexed aminalTwo, uint256 auctionId);

    event FeedAminal(
        uint256 indexed aminalId, address sender, uint256 amount, uint256 love, uint256 totalLove, uint256 energy
    );

    event SkillAdded(uint256 indexed aminalId, address skillAddress);

    event SkillRemoved(uint256 indexed aminalId, address skillAddress);

    event AddSkillProposal(
        uint256 indexed aminalId, uint256 proposalId, string skillName, address skillAddress, address sender
    );

    event RemoveSkillProposal(uint256 indexed aminalId, uint256 proposalId, address skillAddress, address sender);

    event Squeak(uint256 indexed aminalId, uint256 amount, uint256 energy, uint256 love, address sender);

    event SkillVote(uint256 indexed aminalId, address sender, uint256 proposalId, bool yesNo);

    modifier _onlyAuction() {
        require(msg.sender == address(visualsAuction));
        _;
    }

    modifier _onlyProposal() {
        require(msg.sender == address(proposals));
        _;
    }

    constructor(address _visualsAuction, address _aminalProposals, address _genesNFT) {
        visualsAuction = VisualsAuction(_visualsAuction);

        genesNFT = GenesNFT(_genesNFT);

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

    // Creates the initial Aminals.
    // Only callable on by the owner once to initialize.
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

    // Only callable via the auction contract on a successful breeding.
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
    ) public _onlyAuction returns (uint256) {
        return
            _spawnAminalInternal(aminalOne, aminalTwo, backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId);
    }

    // Internal function handling the spawning of new aminals
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
        aminal.exists = true;
        _mint(address(this), aminalId);

        emit SpawnAminal(aminalId, aminalOne, aminalTwo, backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId);

        return aminalId;
    }

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

    function feed(uint256 aminalId) public payable returns (uint256) {
        // Check if enough Ether was sent
        if (msg.value < 0.001 ether) revert NotEnoughEther();

        // Check if the aminal actaually exists so people can't pre-feed aminals
        Aminal storage animal = aminals[aminalId];
        if (!animal.exists) revert AminalDoesNotExist();
        return _feed(aminalId, msg.sender, msg.value);
    }

    function _feed(uint256 aminalId, address feeder, uint256 amount) internal returns (uint256) {
        Aminal storage aminal = aminals[aminalId];

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

        emit FeedAminal(aminalId, feeder, amount, aminal.lovePerUser[feeder], aminal.totalLove, aminal.energy);

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
        require(msg.value >= 0.001 ether, "Not enough ether");

        Aminal storage aminalOne = aminals[aminalIdOne];
        Aminal storage aminalTwo = aminals[aminalIdTwo];

        // Check that Aminal One loves the user enough
        require(aminalOne.lovePerUser[msg.sender] >= 10, "Not enough love");
        require(aminalOne.breedableWith[aminalIdTwo] == false, "Aminal is already breadable with the mate");
        require(aminals[aminalIdTwo].exists == true, "Proposed Aminal to mate does not exist yet");

        // Aminal One loves the user and will follow the user's requessts.
        // Therefore, the breedable status that matters is Aminal Two's, because
        // Aminal Two will not listen to the user. (If Aminal Two has high
        // enough love, the user could set both breed statuses in separate
        // transactions. We're not adjusting Aminal Two's status here even if
        // the user has high enough love on Aminal Two to maintain simplicity --
        // a wrapper contract can always do this atomically in one transaction)
        if (aminalTwo.breedableWith[aminalIdOne]) {
            require(aminalOne.energy >= 10 && aminalTwo.energy >= 10, "Aminal does not have enough energy to breed");

            uint256 auctionId = visualsAuction.startAuction(aminalIdOne, aminalIdTwo); // remember to undo the
                // breedableWith then auction ends!

            emit BreedAminal(aminalIdOne, aminalIdTwo, auctionId);

            return auctionId;

            // TODO: Initiate voting for traits on the Visual registry. Voting is
            // denominated in the combined love of both Aminal One and Aminal Two
        } else {
            aminalOne.breedableWith[aminalIdTwo] = true;
            console.log("aminal (", aminalIdOne, ") is now breedable with ", aminalIdTwo);

            emit BreedAminal(aminalIdOne, aminalIdTwo, 0);

            return 0;
        }
    }

    // This function consumes energy and can be called by both skill contracts
    // and users
    // TODO: Allow users to specify the number of squeaks
    function squeak(uint256 aminalId, uint256 amount) public payable {
        console.log("here... with msg.value == ", msg.value);
        if (msg.value < 0.001 ether) revert NotEnoughEther();

        Aminal storage aminal = aminals[aminalId];

        console.log("there... with love == ", aminal.lovePerUser[msg.sender]);
        console.log("coming from the address == ", msg.sender, " with skills: ", skills[msg.sender]);
        require(skills[msg.sender] == true || aminal.lovePerUser[msg.sender] >= amount, "Not enough love");

        if (skills[msg.sender] == true) return; // don't adjust love or energy for smart contract calls

        // ensure that aminal.energy never goes below 0
        if (aminal.energy >= amount) aminal.energy = aminal.energy - amount;

        // TODO: Migrate the bool to a constant for convenience
        _adjustLove(aminalId, amount, msg.sender, false);

        emit Squeak(aminalId, amount, aminal.energy, aminal.lovePerUser[msg.sender], msg.sender);
    }

    // Calls useSkill on an aminal skill
    function callSkill(uint256 aminalId, address skillAddress, bytes calldata data) public payable {
        require(skills[skillAddress] == true, "Skill does not exist");
        uint256 amount = ISkill(skillAddress).useSkill{value: msg.value}(msg.sender, aminalId, data);
        console.log("Call Skill pubilc function (ABOUT TO SQUEEK) for ", amount);
        squeak(aminalId, amount);
    }

    // Allows skills to call other skills so that they can be composed
    function callSkillInternal(address sender, uint256 aminalId, address skillAddress, bytes calldata data)
        public
        payable
    {
        require(skills[msg.sender] == true, "callSkillInternal can only be called by a registered skill");
        require(skills[skillAddress] == true, "Skill does not exist");
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

        // The higher the love, the cheaper the function calls
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
        payable
        returns (uint256 proposalId)
    {
        // Adding a skill requires a fee that's adjusted based on love
        uint128 price = loveDrivenPrice(aminalID, msg.sender);
        require(msg.value >= price, "Not enough ether to propose a new Visual");

        proposalId = proposals.proposeAddSkill(aminalID, skillName, skillAddress);

        proposals.LoveVote(
            aminalID,
            msg.sender,
            proposalId,
            true,
            getAminalLoveTotal(aminalID),
            proposals.LoveQuorum(),
            proposals.LoveRequiredMajority()
        );
        emit AddSkillProposal(aminalID, proposalId, skillName, skillAddress, msg.sender);
    }

    function proposeRemoveSkill(uint256 aminalID, string calldata description, address skillAddress)
        public
        payable
        returns (uint256 proposalId)
    {
        // Removing a skill requires a fee that's adjusted based on love
        uint128 price = loveDrivenPrice(aminalID, msg.sender);
        require(msg.value >= price, "Not enough ether to propose a new Visual");

        proposalId = proposals.proposeRemoveSkill(aminalID, description, skillAddress);

        console.log(proposalId);

        proposals.LoveVote(
            aminalID,
            msg.sender,
            proposalId,
            true,
            getAminalLoveTotal(aminalID),
            proposals.LoveQuorum(),
            proposals.LoveRequiredMajority()
        );
        emit RemoveSkillProposal(aminalID, proposalId, skillAddress, msg.sender);
    }

    function _addSkill(address faddress, uint256 aminalID) internal {
        // currently done such as to add the skills globally to all aminals
        // Aminal storage aminal = aminals[aminalId];
        skills[faddress] = true;
        // aminal.skills[aminal.Nskills++] = skill;
        emit SkillAdded(aminalID, faddress);
    }

    function removeSkill(address faddress, uint256 aminalID) public {
        // currently done such as to add the skills globally to all aminals
        // Aminal storage aminal = aminals[aminalId];
        skills[faddress] = false;
        // aminal.skills[aminal.Nskills++] = skill;
        emit SkillRemoved(aminalID, faddress);
    }

    function voteSkill(uint256 aminalID, uint256 proposalID, bool yesNo) public {
        proposals.LoveVote(
            aminalID,
            msg.sender,
            proposalID,
            yesNo,
            getAminalLoveTotal(aminalID),
            proposals.LoveQuorum(),
            proposals.LoveRequiredMajority()
        );
    }

    function _vote(uint256 aminalID, uint256 proposalId, bool yesNo) public _onlyProposal {
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
            // TODO rename this method? There is no address2 now...
            address address1 = proposals.getAddress1(proposalId);

            uint256 amount = proposals.getAmount(proposalId);
            if (proposalType == IProposals.ProposalType.AddSkill) _addSkill(address1, aminalID);
            else if (proposalType == IProposals.ProposalType.RemoveSkill) removeSkill(address1, aminalID);
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




    // ------------------------------------------------------------------------
    // SVG Parts - TODO Need to add owner permissions
    // ------------------------------------------------------------------------

    // TODO: need to record the sender and associate it with the svg in the registry

    // eg. 00a79d
    function addBackground(string memory background) public returns (uint256 id) {
        VisualTrait memory trait = VisualTrait(background, msg.sender);
        backgrounds.push(trait);

        emit TraitAdded(backgrounds.length - 1, VisualsCat.BACK, background, msg.sender);

        return backgrounds.length - 1;
    }

    // Aminal #0 - Arms
    // <g id="Arms"><g><g><path class="cls-10" d="m293,378c-31,37-68,71-112,93,22,1,42-2,64-2-10,1-21,4-31,9,14-1,28-3,42-5-11,9-23,19-35,28,11-5,22-11,33-16-8,7-17,14-26,21,5-1,9-4,14-7-8,5-16,12-24,17-6,4-19,12-27,13,20-1,41-5,60-13-12,8-23,19-33,30,10-6,20-13,30-20-10,8-19,19-26,31,8-8,17-16,26-24-14,13-22,35-32,51,15-16,31-32,47-47-16,25-26,53-33,83,8-18,18-35,33-49-15,58-13,114,2,172-1-19,0-39,5-58,6,62,27,119,61,172-22-62-35-125-38-192,6,21,12,42,20,63-1-33-2-66-4-99,4,16,9,28,19,42-9-32-14-64-12-98,4,14,8,28,20,38-13-30-19-60-18-94,4,18,10,36,16,53,0-40,2-79,8-119,4,14,8,28,12,42,1-19,3-38,7-56"/></g><g><path class="cls-10" d="m707,378c31,37,68,71,112,93-22,1-42-2-64-2,10,1,21,4,31,9-14-1-28-3-42-5,11,9,23,19,35,28-11-5-22-11-33-16,8,7,17,14,26,21-5-1-9-4-14-7,8,5,16,12,24,17,6,4,19,12,27,13-20-1-41-5-60-13,12,8,23,19,33,30-10-6-20-13-30-20,10,8,19,19,26,31-8-8-17-16-26-24,14,13,22,35,32,51-15-16-31-32-47-47,16,25,26,53,33,83-8-18-18-35-33-49,15,58,13,114-2,172,1-19,0-39-5-58-6,62-27,119-61,172,22-62,35-125,38-192-6,21-12,42-20,63,1-33,2-66,4-99-4,16-9,28-19,42,9-32,14-64,12-98-4,14-8,28-20,38,13-30,19-60,18-94-4,18-10,36-16,53,0-40-2-79-8-119-4,14-8,28-12,42-1-19-3-38-7-56"/> </g></g> </g>
    function addArm(string memory arm) public returns (uint256 id) {
        VisualTrait memory trait = VisualTrait(arm, msg.sender);

        arms.push(trait);

        emit TraitAdded(arms.length - 1, VisualsCat.ARM, arm, msg.sender);

        return arms.length - 1;
    }

    // Aminal #0 - Tail
    // '<g id="tail"><path class="cls-18" d="m514,544c22,50,22,108,1,159-14,38-38,85-10,121,5,7,13,11,23,13,10,1,21-1,28-8,5-5,8-15,3-22-2-3-7-4-11-3-8,3-4,14,1,19,6,4,13,4,21,2,17-5,28-20,43-30,10-6,24-9,35-2-5-2-11-2-17-1-5,1-11,3-15,7-14,10-25,27-42,35-9,4-21,5-30-1-11-7-16-26-5-37,8-7,21-7,30-1,14,9,15,30,7,44-13,24-47,30-71,18-33-16-46-56-42-91,1-25,10-50,17-74,6-21,9-42,6-63-2-20-8-41-18-59,0,0,47-23,47-23h0Z"/> </g>'
    function addTail(string memory tail) public returns (uint256 id) {
        VisualTrait memory trait = VisualTrait(tail, msg.sender);

        tails.push(trait);

        emit TraitAdded(tails.length - 1, VisualsCat.TAIL, tail, msg.sender);

        return tails.length - 1;
    }

    // Aminal #0 - Ears
    // '<g id="Ears"><g><g><path class="cls-10" d="m335,346c-19-63-24-132-12-198,33,43,71,83,114,117"/><path class="cls-11" d="m340,287c-5-16-8-33-7-50,1,2,3,5,4,8,0-13,0-26,0-39,12,16,28,31,46,41"/></g><g><path class="cls-10" d="m665,342c19-63,24-132,12-198-33,43-71,83-114,117"/><path class="cls-11" d="m660,283c5-16,8-33,7-50-1,2-3,5-4,8,0-13,0-26,0-39-12,16-28,31-46,41"/></g></g> </g>'
    function addEar(string memory ear) public returns (uint256 id) {
        VisualTrait memory trait = VisualTrait(ear, msg.sender);

        ears.push(trait);

        emit TraitAdded(ears.length - 1, VisualsCat.EARS, ear, msg.sender);

        return ears.length - 1;
    }

    // Aminal #0 - Body
    // '<g id="Body"><path class="cls-10" d="m710,398c0,116-94,281-210,281s-210-165-210-281,94-218,210-218,210,102,210,218Z"/> </g> <g id="Body_OL1"><circle class="cls-20" cx="500" cy="375" r="188"/> </g> <g id="Body_OL2"><g><path class="cls-16" d="m312,518c17,61,34,123,52,185,0-14,0-29,0-44,10,24,28,46,50,63-5-12-10-25-15-38,15,16,27,35,37,54-2-15,1-31,8-45,2,10,7,20,14,29,0-7-1-14-2-22,9,6,19,12,29,19-2-6-3-13-1-20,3,7,7,15,11,23,4-8,8-17,12-25,0,18,0,37,0,56,11-21,23-42,35-64,0,11,1,23,2,34,5-14,13-28,24-40,0,12-1,25-1,37,19-27,38-55,57-83-1,11-2,22-3,33,31-57,52-118,63-181-1,1-3,3-5,4"/></g> </g>'
    function addBody(string memory body) public returns (uint256 id) {
        VisualTrait memory trait = VisualTrait(body, msg.sender);

        bodies.push(trait);

        emit TraitAdded(bodies.length - 1, VisualsCat.BODY, body, msg.sender);

        return bodies.length - 1;
    }

    // Aminal #0 - Face
    // '<g id="Face_Mask"><rect class="cls-6" x="338" y="289" width="323" height="126" rx="63" ry="63"/> </g> <g id="Eyes"><g><circle class="cls-17" cx="388" cy="352" r="41"/><g><circle class="cls-12" cx="388" cy="352" r="38"/><circle class="cls-2" cx="367" cy="331" r="3"/><circle class="cls-2" cx="374" cy="325" r="1"/><ellipse class="cls-1" cx="387" cy="336" rx="28" ry="19"/></g><circle class="cls-19" cx="612" cy="352" r="41"/><g><circle class="cls-12" cx="612" cy="352" r="38"/><circle class="cls-2" cx="590" cy="331" r="3"/><circle class="cls-2" cx="597" cy="325" r="1"/><ellipse class="cls-1" cx="611" cy="336" rx="28" ry="19"/> </g></g> </g> <g id="nose"><g><circle class="cls-9" cx="495" cy="307" r="3"/><circle class="cls-9" cx="505" cy="307" r="3"/></g> </g>'

    function addFace(string memory face) public returns (uint256 id) {
        // TODO: Change msg.sender to the ProposerNFT
        // Only send the NFT if the proposal is accepted

        VisualTrait memory trait = VisualTrait(face, msg.sender);

        faces.push(trait);

        // TODO: This is just a skeleton
        this.genesNFT.mint(msg.sender); // @@@ HOW DO WE ATTACH THE SVG TO THE NFT ?

        emit TraitAdded(faces.length - 1, VisualsCat.FACE, face, msg.sender);

        return faces.length - 1;
    }

    // Aminal #0 - Mouth
    // '<g id="Mouth"><g><rect class="cls-12" x="461" y="335" width="77" height="45" rx="22" ry="22"/><path class="cls-7" d="m492,336c0,2-2,5-5,5s-5-2-5-5"/><path class="cls-7" d="m518,336c0,2-2,5-5,5s-5-2-5-5"/><circle class="cls-5" cx="499" cy="364" r="13"/><path class="cls-14" d="m485,380c0-8,7-12,14-12s14,4,14,12"/><path class="cls-13" d="m474,350c-2,2-3,5-4,8,0,3,0,6,1,9"/><path class="cls-13" d="m481,351c-2,2-3,5-4,8,0,3,0,6,2,8"/><path class="cls-13" d="m523,350c2,2,3,5,4,8,0,3,0,6-1,9"/><path class="cls-13" d="m516,351c2,2,3,5,4,8,0,3,0,6-2,8"/></g> </g> <g id="Element_1_OL"><path class="cls-6" d="m530,17l-51,83-8-20c16,1,65,7,81,9-10,11-55,65-67,78,0,0-9-20-9-20l66,5,17,1c-7,6-67,52-77,60,0,0,54-59,54-59l4,11c-20,1-76,6-96,8,13-15,57-67,71-83,0,0,8,20,8,20-18-2-67-7-84-9,12-11,76-72,89-84h0Z"/> </g>'
    function addMouth(string memory mouth) public returns (uint256 id) {
        VisualTrait memory trait = VisualTrait(mouth, msg.sender);

        mouths.push(trait);

        emit TraitAdded(mouths.length - 1, VisualsCat.MOUTH, mouth, msg.sender);

        return mouths.length - 1;
    }

    // Aminal #0 - Mouth
    // '<g id="Mouth"><g><rect class="cls-12" x="461" y="335" width="77" height="45" rx="22" ry="22"/><path class="cls-7" d="m492,336c0,2-2,5-5,5s-5-2-5-5"/><path class="cls-7" d="m518,336c0,2-2,5-5,5s-5-2-5-5"/><circle class="cls-5" cx="499" cy="364" r="13"/><path class="cls-14" d="m485,380c0-8,7-12,14-12s14,4,14,12"/><path class="cls-13" d="m474,350c-2,2-3,5-4,8,0,3,0,6,1,9"/><path class="cls-13" d="m481,351c-2,2-3,5-4,8,0,3,0,6,2,8"/><path class="cls-13" d="m523,350c2,2,3,5,4,8,0,3,0,6-1,9"/><path class="cls-13" d="m516,351c2,2,3,5,4,8,0,3,0,6-2,8"/></g> </g> <g id="Element_1_OL"><path class="cls-6" d="m530,17l-51,83-8-20c16,1,65,7,81,9-10,11-55,65-67,78,0,0-9-20-9-20l66,5,17,1c-7,6-67,52-77,60,0,0,54-59,54-59l4,11c-20,1-76,6-96,8,13-15,57-67,71-83,0,0,8,20,8,20-18-2-67-7-84-9,12-11,76-72,89-84h0Z"/> </g>'

    function addMisc(string memory misc) public returns (uint256 id) {
        VisualTrait memory trait = VisualTrait(misc, msg.sender);

        miscs.push(trait);

        emit TraitAdded(miscs.length - 1, VisualsCat.MISC, misc, msg.sender);

        return miscs.length - 1;
    }



}
