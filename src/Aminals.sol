// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;


import "./utils/FeedBondingCurve.sol";
import "./libs/ABDKMathQuad.sol";

contract Aminals {
    mapping(uint256 aminalId => Aminal aminal) public aminals;

    struct Aminal {
        uint128 totalLove;
        // TODO: Check whether gas usage is the same for a uint128
        bytes16 energy;
        mapping(uint256 aminalTwoId => bool readyToBreed) breedableWith;
        mapping(address user => uint8 love) lovePerUser;
        Visuals visuals;
        mapping(uint8 => Skills) skills;
    }

    // TODO: Migrate to VisualsRegistry
    struct Visuals {
        string body;
        string hat;
        string eyes;
        string mouth;
        string nose;
        string limbs;
        string tail;
        string accessories;
    }

    // TODO: Migrate to SkillsRegistry
    struct Skills {
        string name;
        address contractAddress;
        // Human-readable ABI format
        string functionSignature;
    }

    function getEnergy(uint256 aminalID) public view returns (bytes16)  {
        Aminal storage aminal = aminals[aminalID];
        return aminal.energy;
    }


    function feed(uint256 aminalId) public payable returns (uint256) {
        require(msg.value >= 0.01 ether, "Not enough ether");
        Aminal storage aminal = aminals[aminalId];


        // TODO: Amount of love should be on a bonding curve, not a direct
        // addition
        uint256 amount = (msg.value / 10**16);
        // TODO: Change adjustLove bool to a constant
        adjustLove(aminalId, uint8(amount), msg.sender, true);
        // TODO: Energy should be on a bonding curve that creates an asymptote
        // (possibly a polynomic function), not a direct addition. The bonding
        // curve should be configured so that energy should never reach 100 (the
        // max). Energy can reach 0

        // aminal.energy += uint8(amount);

        // assuming a simple bonding curve, where d(e) = ETH * (1 - e/100)**2
       // aminal.energy = aminal.energy + (amount * ((1 - aminal.energy/100) ** 2));
        
        // assuming a simple bonding curve, where d(e) = (100 - e)/100
        bytes16 delta = ABDKMathQuad.div( ABDKMathQuad.sub(ABDKMathQuad.fromInt(100), aminal.energy), ABDKMathQuad.fromInt(100) );
        aminal.energy = ABDKMathQuad.add(aminal.energy, ABDKMathQuad.mul(delta, ABDKMathQuad.fromUInt(amount)));


        // using the bonding curve system 
       // FeedBondingCurve feedcurve = new FeedBondingCurve();
       // aminal.energy = feedcurve.feedBondingCurve(amount, aminal.energy);

        return ABDKMathQuad.toUInt(ABDKMathQuad.mul(ABDKMathQuad.fromUInt(amount), delta));
            return ABDKMathQuad.toUInt(delta);

    }

    function breedWith(uint256 aminalIdOne, uint256 aminalIdTwo) public payable {
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
            require(ABDKMathQuad.toInt(aminalOne.energy) >= 10 && ABDKMathQuad.toInt(aminalTwo.energy) >= 10, "Aminal does not have enough energy");

            // TODO: Initiate voting for traits on the Visual registry. Voting is
            // denominated in the combined love of both Aminal One and Aminal Two
        } else {
            aminalOne.breedableWith[aminalIdTwo] = true;
        }
    }

    // This function consumes energy and can be called by both skill contracts
    // and users
    // TODO: Allow users to specify the number of squeaks
    function squeak(uint256 aminalId) public payable {
        require(msg.value >= 0.01 ether, "Not enough ether");

        Aminal storage aminal = aminals[aminalId];

        require(aminal.lovePerUser[msg.sender] >= 1, "Not enough love");
        
        // ensure that aminal.energy never goes below 0
        if(ABDKMathQuad.toInt(aminal.energy) >= 1) {     aminal.energy = ABDKMathQuad.sub(aminal.energy, ABDKMathQuad.fromInt(1)); }
        
        // TODO: Migrate the bool to a constant for convenience
        adjustLove(aminalId, 1, msg.sender, false);
    }

    function addSkill() public {}

    function addVisuals() public {}

    function callSkill(uint256 aminalId, bytes32 skillId, bytes32 data) public payable {
        squeak((aminalId));
        // TODO: Call skill based on data in the SkillsRegistry
        // We'll likely want to use DELEGATECALL here
    }

    // TODO: Switch to passing the Aminal struct instead of the aminalId
    function adjustLove(uint256 aminalId, uint8 love, address sender, bool increment) internal {
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
}
