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
        uint256 i = breed();
        // listAuctionedVisuals(i);
        proposeTraits(i);
        // listAuctionedVisuals(i);
        voteTraits(i);
        listAuctionedVisuals(i);
        removeTraits(i);
        listAuctionedVisuals(i);
        uint256[8] memory arr = endAuction(i);
        spawnNewAminal(1, 2, arr);
    }

    function registerVisuals() public {
        // first aminal
        console.log("aminal bg1 = ", aminals.addBackground("bg1"));
        aminals.addArm("arm");
        aminals.addTail("tail");
        aminals.addEar("ear");
        aminals.addBody("body");
        aminals.addFace("face");
        aminals.addMouth("mouth");
        aminals.addMisc("misc");
        // second aminal
        aminals.addBackground("bg2");
        aminals.addArm("arm2");
        aminals.addTail("tail2");
        aminals.addEar("ear2");
        aminals.addBody("body2");
        aminals.addFace("face2");
        aminals.addMouth("mouth2");
        aminals.addMisc("misc2");

        // aminals.setBreeding(1, true);
    }

    function proposeTraits(uint256 auctionID) public {
        uint256 id1 = aminals.addFace("face3");
        uint256 id2 = aminals.addBody("body3");
        console.log("FACE 3 = ", id1);

        visualsAuction.proposeVisual{value: 0.01 ether}(
            auctionID, VisualsAuction.VisualsCat.FACE, id1
        );
        visualsAuction.proposeVisual{value: 0.01 ether}(
            auctionID, VisualsAuction.VisualsCat.BODY, id2
        );
    }

    function removeTraits(uint256 auctionID) public {
        uint256 id1 = 3;

        address owner2 = 0x2D3C242d2C074D523112093C67d1c01Bb27ca40D;
        vm.prank(owner2);

        visualsAuction.removeVisual(auctionID, VisualsAuction.VisualsCat.FACE, id1);
    }

    function voteTraits(uint256 auctionID) public {
        address owner = 0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496;
        vm.prank(owner);
        visualsAuction.voteVisual(auctionID, VisualsAuction.VisualsCat.EARS, 0);

        VisualsAuction.Auction memory auction;
        auction = visualsAuction.getAuctionByID(auctionID);

        address owner2 = 0x2D3C242d2C074D523112093C67d1c01Bb27ca40D;
        vm.prank(owner2);
        visualsAuction.voteVisual(auctionID, VisualsAuction.VisualsCat.BODY, 2);
        vm.prank(owner2);
        vm.expectRevert("Already consumed all of your love with votes");
        visualsAuction.voteVisual(auctionID, VisualsAuction.VisualsCat.BODY, 1);
    }

    function endAuction(uint256 auctionID) public returns (uint256[8] memory) {
        visualsAuction.endAuction(auctionID);

        VisualsAuction.Auction memory auction;
        auction = visualsAuction.getAuctionByID(auctionID);

        console.log("We got a winner :::::: ");
        for (uint256 i = 0; i < 8; i++) {
            console.log("category ", i);
            console.log(auction.winnerId[i]);
            console.log(aminals.getVisuals(i, auction.winnerId[i]));
        }

        return auction.winnerId;
    }

    function listAuctionedVisuals(uint256 auctionID) public view {
        VisualsAuction.Auction memory auction;
        auction = visualsAuction.getAuctionByID(auctionID);

        // console.log("CONTRACT ADDRESS: ", address(visualsAuction));
        // console.log("Now.--.---.----------", auction.visualIds[2][0]);
        // console.log("Now.--.---.----------", auction.aminalIdOne);
        // console.log("displaying visuals for auction id = ", auctionID);

        for (uint256 i = 0; i < 8; i++) {
            console.log("iterating through category ", i);

            for (uint256 j = 0; j < 2 || auction.visualIds[i][j] > 0; j++) {
                console.log("---> index: ", j, " === value: ", auction.visualIds[i][j]);
                console.log("---> VOTES: === ", auction.visualIdVotes[i][j]);
                console.log(aminals.getVisuals(i, auction.visualIds[i][j]));
            }
        }
    }

    function spawnNewAminal(uint256 mom, uint256 dad, uint256[8] memory winnerIds) public {
        aminals.spawnAminal(
            mom,
            dad,
            winnerIds[0],
            winnerIds[1],
            winnerIds[2],
            winnerIds[3],
            winnerIds[4],
            winnerIds[5],
            winnerIds[6],
            winnerIds[7]
        );
        console.log("spawned a new aminal with the new traits :)");
    }

    function spawnAminals() public {
        console.log("SPawning aminals...........");
        uint256 a1 = aminals.spawnAminal(0, 0, 1, 1, 1, 1, 1, 1, 1, 1);
        uint256 a2 = aminals.spawnAminal(0, 0, 2, 2, 2, 2, 2, 2, 2, 2);
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

        address owner2 = 0x2D3C242d2C074D523112093C67d1c01Bb27ca40D;
        vm.prank(owner2);
        vm.deal(owner2, 1 ether);
        aminals.feed{value: 0.03 ether}(1);

        console.log("Checking amount of love for user");
        console.log(aminals.getAminalLoveByIdByUser(1, owner));
        console.log(aminals.getAminalLoveByIdByUser(1, owner2));
    }

    function breed() public returns (uint256) {
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
