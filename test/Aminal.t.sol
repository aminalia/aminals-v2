// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Aminals.sol";
import "../src/IAminal.sol";
import "../src/utils/VisualsAuction.sol";

contract CounterTest is Test {
    Aminals public aminals;
    VisualsAuction public visualsAuction;

    function setUp() public {
        aminals = new Aminals();
        visualsAuction = VisualsAuction(aminals.visualsAuction());
        }

    function testRun() public {
        registerVisuals();
        spawnAminals();
        squeak();
        feed();
        uint i = breed();
        listAuctionedVisuals(i);
        proposeTraits(i);
        listAuctionedVisuals(i);
        voteTraits(i);

    }

    function registerVisuals() public {
        // first aminal
        aminals.addBackground("bg1");
        aminals.addArm("arm");
        aminals.addTail("tail");
        aminals.addEar("ear");
        aminals.addBody("body");
        aminals.addFace("face");
        aminals.addMouth("mouth");
        // second aminal
        aminals.addBackground("bg1");
        aminals.addArm("arm2");
        aminals.addTail("tail2");
        aminals.addEar("ear2");
        aminals.addBody("body2");
        aminals.addFace("face2");
        aminals.addMouth("mouth2");
    }

    function proposeTraits(uint auctionID) public {
        uint id1 = aminals.addFace("face3");
        uint id2 = aminals.addBody("body3");

        visualsAuction.proposeVisual{value: 0.01 ether}(auctionID, VisualsAuction.VisualsCat.FACE, id1);
        visualsAuction.proposeVisual{value: 0.01 ether}(auctionID, VisualsAuction.VisualsCat.BODY, id2);

    }

    function voteTraits(uint auctionID) public {
        
        address owner = 0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496;
        vm.prank(owner);
        visualsAuction.voteVisual(auctionID, VisualsAuction.VisualsCat.FACE, 3);
    }

    function listAuctionedVisuals(uint auctionID) public view {
        
        VisualsAuction.Auction memory auction;
         auction = visualsAuction.getAuctionByID(auctionID);

         console.log("CONTRACT ADDRESS: ", address(visualsAuction));
        

        // console.log("Now.--.---.----------", auction.visualIds[2][0]);
         console.log("Now.--.---.----------", auction.aminalIdOne);

        // console.log("displaying visuals for auction id = ", auctionID);

        for(uint i=0; i<8; i++) {
             console.log("iterating through category ", i);

            for(uint j=0; j < 2 || auction.visualIds[i][j] > 0; j++) {
                 console.log("---> ", j, " = " , auction.visualIds[i][j]);
                //   console.log( registry.visuals(VisualsRegistry.VisualsCat(i),j) );
                console.log(aminals.getVisuals(i, j));
             }
        }
    }

    function spawnAminals() public {
        console.log("SPawning aminals...........");
        uint a1 = aminals.spawnAminal(0, 0,    1, 1, 1, 1, 1, 1, 1, 1);
        uint a2 = aminals.spawnAminal(0, 0,    1, 2, 2, 2, 2, 2, 2, 2);
        console.log("spawned.... ", a1, " & ", a2);

        // Get only the Visuals struct from the mapping
        Aminals.Visuals memory visualsOne;
        Aminals.Visuals memory visualsTwo;
        (,,,,, visualsOne) = aminals.aminals(1);
        (,,,,, visualsTwo) = aminals.aminals(2);

        // Aminals.Visuals storage visuals = aminals.getAminalVisualsById(1);
        // uint256 love = aminals.getAminalLoveTotal(1);

        // console.log("aminal 2 visuals EYES-id = ", visualsTwo.eyesId);

    }

    function squeak() public {
        vm.expectRevert("Not enough ether");
        console.log("Squeak without 0.01 ether");
        aminals.squeak(1);
        console.log("Squeak with 0.01 ether");
        vm.expectRevert("Not enough love");
        aminals.squeak{value: 0.01 ether}(1);
        console.log("Squeak completed");
    }

    function feed() public {
        address owner = 0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496;
        vm.prank(owner);
        console.log("Feeding the aminal");
        vm.expectRevert("Not enough ether");
        console.log(uint256(aminals.feed(1)));
        console.log(aminals.feed{value: 0.01 ether}(1));
        console.log(aminals.feed{value: 0.01 ether}(1));
        console.log(aminals.feed{value: 0.03 ether}(1));
        console.log(aminals.feed{value: 0.02 ether}(1));
        console.log(aminals.feed{value: 0.08 ether}(1));
        console.log(aminals.feed{value: 0.08 ether}(1));
        console.log(aminals.feed{value: 0.08 ether}(1));
        console.log(aminals.feed{value: 0.08 ether}(1));
        console.log(aminals.feed{value: 0.08 ether}(1));

        console.log("Checking amount of love for user");
        console.log(aminals.getAminalLoveByIdByUser(1, owner));
    }

    function breed() public returns (uint) {
        address owner = 0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496;
        vm.prank(owner);
        console.log("Breeding the aminals");
        aminals.breedWith{value: 0.05 ether}(1, 2);
        vm.expectRevert("Not enough love");
        aminals.breedWith{value: 0.05 ether}(2, 1);
        console.log(aminals.feed{value: 0.08 ether}(2));
        return aminals.breedWith{value: 0.05 ether}(2, 1);
    }
}
