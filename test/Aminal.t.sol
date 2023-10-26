// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/console.sol";
import {BaseTest} from "./BaseTest.sol";
import {AminalProposals} from "src/proposals/AminalProposals.sol";
import {Aminals} from "src/Aminals.sol";
import {IAminal} from "src/IAminal.sol";
import {IAminalStructs} from "src/IAminalStructs.sol";
import {IProposals} from "src/proposals/IProposals.sol";
import {Move2D} from "src/skills/Move2D.sol";
import {MoveTwice} from "src/skills/MoveTwice.sol";
import {VisualsAuction} from "src/utils/VisualsAuction.sol";

contract AminalTest is BaseTest {
    Aminals public aminals;
    VisualsAuction public visualsAuction;
    IProposals public proposals;

    function setUp() public {
        aminals = Aminals(deployAminals());
        proposals = aminals.proposals();

        visualsAuction = VisualsAuction(aminals.visualsAuction());
    }

    function test_Run() public {
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
        addAndUseSkills();
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

    function spawnAminals() public {
        console.log("SPawning aminals...........");

        spawnInitialAminals(aminals);
        console.log("spawned.... ");

        // Can't initialize twice
        vm.expectRevert("Initializable: contract is already initialized");
        spawnInitialAminals(aminals);

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
        vm.expectRevert(IAminal.NotEnoughEther.selector);
        aminals.squeak(1, 1);
        vm.expectRevert("Not enough love");
        aminals.squeak{value: 0.01 ether}(1, 1);
    }

    function feed() public {
        address owner = 0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496;
        vm.prank(owner);
        console.log("Feeding the aminal");
        vm.expectRevert(IAminal.NotEnoughEther.selector);
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

        address owner3 = 0x45CbC00e0618880bfB2dBDdEAed1ef1411dd5eeE;
        vm.prank(owner3);
        vm.deal(owner3, 1 ether);
        aminals.feed{value: 0.03 ether}(1);

        console.log("Checking amount of love for user");
        console.log(aminals.getAminalLoveByIdByUser(1, owner));
        console.log(aminals.getAminalLoveByIdByUser(1, owner2));
        console.log(aminals.getAminalLoveByIdByUser(1, owner3));
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

    function proposeTraits(uint256 auctionID) public {
        uint256 id1 = aminals.addFace("face3");
        uint256 id2 = aminals.addBody("body3");
        uint256 id3 = aminals.addBody("body4");
        uint256 id4 = aminals.addBody("body5");
        uint256 id5 = aminals.addBody("body6");
        uint256 id6 = aminals.addBody("body7");
        uint256 id7 = aminals.addBody("body8");
        uint256 id8 = aminals.addBody("body9");
        uint256 id9 = aminals.addBody("body10");
        uint256 id10 = aminals.addBody("body11");

        vm.expectRevert("Not enough ether to propose a new Visual");
        visualsAuction.proposeVisual{value: 0.01 ether}(auctionID, VisualsAuction.VisualsCat.FACE, id1);
        visualsAuction.proposeVisual{value: 0.02 ether}(auctionID, VisualsAuction.VisualsCat.BODY, id2);
        // Test making a bunch of proposals
        visualsAuction.proposeVisual{value: 0.02 ether}(auctionID, VisualsAuction.VisualsCat.BODY, id3);
        visualsAuction.proposeVisual{value: 0.02 ether}(auctionID, VisualsAuction.VisualsCat.BODY, id4);
        visualsAuction.proposeVisual{value: 0.02 ether}(auctionID, VisualsAuction.VisualsCat.BODY, id5);
        visualsAuction.proposeVisual{value: 0.02 ether}(auctionID, VisualsAuction.VisualsCat.BODY, id6);
        visualsAuction.proposeVisual{value: 0.02 ether}(auctionID, VisualsAuction.VisualsCat.BODY, id7);
        visualsAuction.proposeVisual{value: 0.02 ether}(auctionID, VisualsAuction.VisualsCat.BODY, id8);
        visualsAuction.proposeVisual{value: 0.02 ether}(auctionID, VisualsAuction.VisualsCat.BODY, id9);
        // 9th proposal fails as there is only 8 slots per category
        vm.expectRevert("Max 8 proposals allowed per category");
        visualsAuction.proposeVisual{value: 0.02 ether}(auctionID, VisualsAuction.VisualsCat.BODY, id10);
    }

    function voteTraits(uint256 auctionID) public {
        address owner = 0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496;
        vm.prank(owner);
        visualsAuction.voteVisual(auctionID, VisualsAuction.VisualsCat.EARS, 1);

        // VisualsAuction.Auction memory auction;
        // auction = visualsAuction.getAuctionByID(auctionID);

        address owner2 = 0x2D3C242d2C074D523112093C67d1c01Bb27ca40D;
        vm.prank(owner2);
        visualsAuction.voteVisual(auctionID, VisualsAuction.VisualsCat.BODY, 2);
        vm.prank(owner2);
        vm.expectRevert("Already consumed all of your love with votes");
        visualsAuction.voteVisual(auctionID, VisualsAuction.VisualsCat.BODY, 1);

        // Owner 3 causes a tie
        address owner3 = 0x45CbC00e0618880bfB2dBDdEAed1ef1411dd5eeE;
        vm.prank(owner3);
        visualsAuction.voteVisual(auctionID, VisualsAuction.VisualsCat.BODY, 1);
        vm.prank(owner3);
    }

    function listAuctionedVisuals(uint256 auctionID) public view {
        VisualsAuction.Auction memory auction;
        auction = visualsAuction.getAuctionByID(auctionID);

        console.log("displaying visuals for auction id = ", auctionID);

        for (uint256 i = 0; i < 8; i++) {
            console.log("iterating through category ", i);

            for (uint256 j = 0; j < 10; j++) {
                if (auction.visualIds[j][i] != 0) {
                    console.log("---> category: ", i, " - index: ", j);
                    console.log("=== value: ", auction.visualIds[j][i], "---> VOTES: === ", auction.visualIdVotes[j][i]);
                    console.log(aminals.getVisuals(i, auction.visualIds[j][i]));
                }
            }
        }
    }

    function removeTraits(uint256 auctionID) public {
        uint256 id1 = 3;

        address owner3 = 0x45CbC00e0618880bfB2dBDdEAed1ef1411dd5eeE;
        vm.prank(owner3);
        visualsAuction.removeVisual(auctionID, VisualsAuction.VisualsCat.FACE, id1);

        address owner = 0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496;
        vm.prank(owner);
        vm.expectRevert("The trait to be removed does not exist in the auction list");
        visualsAuction.removeVisual(auctionID, VisualsAuction.VisualsCat.FACE, id1);

        visualsAuction.removeVisual(auctionID, VisualsAuction.VisualsCat.BODY, 5);

        // New visual is added to the auction as there is now a free slot
        uint256 id10 = aminals.addBody("body11");
        visualsAuction.proposeVisual{value: 0.02 ether}(auctionID, VisualsAuction.VisualsCat.BODY, id10);
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

    function spawnNewAminal(uint256 mom, uint256 dad, uint256[8] memory winnerIds) public {
        vm.prank(address(visualsAuction));
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

    function addAndUseSkills() public {
        console.log("\n now playing with the skillests...");

        // introduce skillsets
        Move2D mover = new Move2D(address(aminals));
        (uint256 x, uint256 y) = mover.getCoords(3);
        console.log("x = ", x, " y = ", y);

        address owner = 0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496;
        address owner2 = 0x2D3C242d2C074D523112093C67d1c01Bb27ca40D;

        vm.prank(owner2);
        uint256 proposalId = aminals.proposeAddSkill(1, "Move Skill", address(mover));

        // with proxy function call
        bytes memory data = mover.getSkillData(888, 999);

        // @@@@ THESE 2 LINES BELOW CREATE A STRANGE ERROR -- need to figure out why
        //    Failing tests:
        //     Encountered 1 failing test in test/Aminal.t.sol:AminalTest
        //     [FAIL. Reason: Call reverted as expected, but without data] test_Run() (gas: 5448636)

        //  vm.expectRevert("Calling the skill fails because addSkill did not pass with enough love");
        //  aminals.callSkill{value: 0.01 ether}(1, address(mover), data);

        vm.prank(owner);
        aminals.voteSkill(1, proposalId, true); // now the Skill should be approved

        aminals.callSkill{value: 0.01 ether}(1, address(mover), data);

        (x, y) = mover.getCoords(1);
        console.log("x = ", x, " y = ", y);

        // with proxy function call
        MoveTwice mover2 = new MoveTwice(address(aminals), address(mover));
        uint256 proposalId2 = aminals.proposeAddSkill(1, "Move Skill 2", address(mover2));

        data = mover2.getSkillData(222, 333, 777, 666);
        console.log("calling mover 2");
        aminals.callSkill{value: 0.5 ether}(1, address(mover2), data);
        (x, y) = mover.getCoords(1);
        console.log("x = ", x, " y = ", y);
    }
}
