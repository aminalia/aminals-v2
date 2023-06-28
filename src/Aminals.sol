// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/console.sol";
import "forge-std/Test.sol";

import "./utils/FeedBondingCurve.sol";
import "./libs/ABDKMathQuad.sol";





contract Aminals {
    mapping(uint256 aminalId => Aminal aminal) public aminals;

    struct Aminal {
        uint256 totalLove;
        // TODO: Check whether gas usage is the same for a uint128
        uint256 energy;
        mapping(uint256 aminalTwoId => bool readyToBreed) breedableWith;
        mapping(address user => uint256 love) lovePerUser;
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

    function getAminalLoveTotal(uint256 aminalID) public view returns (uint256) {
       Aminal storage aminal = aminals[aminalID];
        return aminal.totalLove;
    }

    function getAminalLoveByIdByUser(uint256 aminalID, address user) public view returns (uint256)  {
        Aminal storage aminal = aminals[aminalID];
        return aminal.lovePerUser[user];
    }

    function getEnergy(uint256 aminalID) public view returns (uint256)  {
        Aminal storage aminal = aminals[aminalID];
        return aminal.energy;
    }


    function feed(uint256 aminalId) public payable returns (uint256) {
        require(msg.value >= 0.01 ether, "Not enough ether");
        Aminal storage aminal = aminals[aminalId];

        //console.log("TESTESTEST: ", msg.sender);


        // TODO: Amount of love should be on a bonding curve, not a direct
        // addition
      //  uint256 amount = (msg.value / 10**16);

        uint256 amount = msg.value;

        // TODO: Change adjustLove bool to a constant
        adjustLove(aminalId, amount, msg.sender, true);
        // TODO: Energy should be on a bonding curve that creates an asymptote
        // (possibly a polynomic function), not a direct addition. The bonding
        // curve should be configured so that energy should never reach 100 (the
        // max). Energy can reach 0

        // aminal.energy += uint8(amount);

        // assuming a simple bonding curve, where d(e) = ETH * (1 - e/100)**2
       // aminal.energy = aminal.energy + (amount * ((1 - aminal.energy/100) ** 2));
        
        // assuming a simple bonding curve, where d(e) = (100 - e)/100
        // bytes16 delta = ABDKMathQuad.div( ABDKMathQuad.sub(ABDKMathQuad.fromInt(100), aminal.energy), ABDKMathQuad.fromInt(100) );
        // aminal.energy = ABDKMathQuad.add(aminal.energy, ABDKMathQuad.mul(delta, ABDKMathQuad.fromUInt(amount)));


        uint256 delta = aminal.energy 
        aminal.energy += delta;

        // using the bonding curve system 
       // FeedBondingCurve feedcurve = new FeedBondingCurve();
       // aminal.energy = feedcurve.feedBondingCurve(amount, aminal.energy);

        // return ABDKMathQuad.toUInt(ABDKMathQuad.mul(ABDKMathQuad.fromUInt(amount), delta));
        //     return ABDKMathQuad.toUInt(delta);

        return delta;

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
            require(aminalOne.energy >=10 && aminalTwo.energy >=10, "Aminal does not have enough energy to breed");
            
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
        if(aminal.energy >= 1) { aminal.energy--; }
        
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
    function adjustLove(uint256 aminalId, uint256 love, address sender, bool increment) internal {
        
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



   function log2(uint x) private returns (uint y){
   assembly {
        let arg := x
        x := sub(x,1)
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
        mstore(m,           0xf8f9cbfae6cc78fbefe7cdc3a1793dfcf4f0e8bbd8cec470b6a28a7a5a3e1efd)
        mstore(add(m,0x20), 0xf5ecf1b3e9debc68e1d9cfabc5997135bfb7a7a3938b7b606b5b4b3f2f1f0ffe)
        mstore(add(m,0x40), 0xf6e4ed9ff2d6b458eadcdf97bd91692de2d4da8fd2d0ac50c6ae9a8272523616)
        mstore(add(m,0x60), 0xc8c0b887b0a8a4489c948c7f847c6125746c645c544c444038302820181008ff)
        mstore(add(m,0x80), 0xf7cae577eec2a03cf3bad76fb589591debb2dd67e0aa9834bea6925f6a4a2e0e)
        mstore(add(m,0xa0), 0xe39ed557db96902cd38ed14fad815115c786af479b7e83247363534337271707)
        mstore(add(m,0xc0), 0xc976c13bb96e881cb166a933a55e490d9d56952b8d4e801485467d2362422606)
        mstore(add(m,0xe0), 0x753a6d1b65325d0c552a4d1345224105391a310b29122104190a110309020100)
        mstore(0x40, add(m, 0x100))
        let magic := 0x818283848586878898a8b8c8d8e8f929395969799a9b9d9e9faaeb6bedeeff
        let shift := 0x100000000000000000000000000000000000000000000000000000000000000
        let a := div(mul(x, magic), shift)
        y := div(mload(add(m,sub(255,a))), shift)
        y := add(y, mul(256, gt(arg, 0x8000000000000000000000000000000000000000000000000000000000000000)))
    }  
}
}