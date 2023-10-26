pragma solidity ^0.8.13;

import "forge-std/console.sol";
import {BaseTest} from "./BaseTest.sol";
import {AminalProposals} from "src/proposals/AminalProposals.sol";
import {Aminals} from "src/Aminals.sol";
import {IAminal} from "src/IAminal.sol";
import {IAminalStructs} from "src/IAminalStructs.sol";
import {IAminalStructs} from "src/IAminalStructs.sol";
import {IProposals} from "src/proposals/IProposals.sol";
import {Move2D} from "src/skills/Move2D.sol";
import {MoveTwice} from "src/skills/MoveTwice.sol";
import {VisualsAuction} from "src/utils/VisualsAuction.sol";

contract AminalMiniTest is BaseTest {
    Aminals public aminals;
    VisualsAuction public visualsAuction;

      function setUp() public {
        aminals = Aminals(deployAminals());

        visualsAuction = VisualsAuction(aminals.visualsAuction());
    }

    function test_Run() public {

        registerVisuals();
        spawnAminals();


        feedAminals();


        breedAminals();

        endAuction();

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

        // Get only the Visuals struct from the mapping
        Aminals.Visuals memory visualsOne;
        Aminals.Visuals memory visualsTwo;
        (,,,,, visualsOne) = aminals.aminals(1);
        (,,,,, visualsTwo) = aminals.aminals(2);

        // Aminals.Visuals storage visuals = aminals.getAminalVisualsById(1);
        // uint256 love = aminals.getAminalLoveTotal(1);

        // console.log("aminal 2 visuals EYES-id = ", visualsTwo.eyesId);
    }


    function feedAminals() public {
        address owner = 0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496;
        vm.prank(owner);
        console.log("Feeding the aminal");
        vm.expectRevert(IAminal.NotEnoughEther.selector);
        console.log(uint256(aminals.feed(1)));
        console.log(aminals.feed{value: 0.01 ether}(1));
        console.log(aminals.feed{value: 0.01 ether}(2));
    }

    function breedAminals() public {
       address owner = 0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496;
        vm.prank(owner);
        console.log("Breeding the aminal"); 

        aminals.breedWith{value: 0.01 ether}(1, 2);
        aminals.breedWith{value: 0.01 ether}(2, 1);
    
    }

    function endAuction() public {
       address owner = 0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496;
        vm.prank(owner); 
    
        VisualsAuction visualsAuction = VisualsAuction(aminals.visualsAuction());


         for (uint256 i = 1; i <= 2; i++) {
            console.log("Aminal love by ID by user: ", aminals.getAminalLoveByIdByUser(i, owner));
            console.log("Aminal love total : ",  aminals.getAminalLoveTotal(i));
        }

        visualsAuction.endAuction(3);

        VisualsAuction.Auction memory auction;
        auction = visualsAuction.getAuctionByID(3);

        console.log(auction.aminalIdOne);

        uint[8] memory winnerId = auction.visualIds[1];
        console.log("RET visualIDs[0][0] ==", winnerId[0] );

      //  winnerId = auction.winnerId;

        console.log("We got a winner :::::: ");
        console.log(auction.totalLove);
        for (uint256 i = 0; i < 8; i++) {
            console.log("category ", i);
            console.log(winnerId[i]);
            console.log(aminals.getVisuals(i,winnerId[i]));
        }

    }

}