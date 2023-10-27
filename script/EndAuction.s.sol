pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {Aminals} from "src/Aminals.sol";
import {IAminal} from "src/IAminal.sol";
import {VisualsAuction} from "src/utils/VisualsAuction.sol";

contract EndAuction is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        Aminals aminals = Aminals(0xC4956868cB2603E8d13BD064Bb1c53C6b5044a38);
        VisualsAuction visualsAuction = VisualsAuction(aminals.visualsAuction());

        for (uint256 i = 1; i <= 2; i++) {
            console.log(
                "Aminal love by ID by user: ",
                aminals.getAminalLoveByIdByUser(i, 0x1f028f240A90414211425bFa38eB4917Cb32c39C)
            );
            console.log("Aminal love total : ", aminals.getAminalLoveTotal(i));
        }

        visualsAuction.endAuction(3);
        VisualsAuction.Auction memory auction;
        auction = visualsAuction.getAuctionByID(3);

        console.log(auction.aminalIdOne);

        uint256[8] memory winnerId = auction.visualIds[0];
        console.log("RET visualIDs[0][0] ==", winnerId[0]);
        console.log("RET2 visualIDs[0][0] ==", winnerId[1]);
        console.log("RET3 visualIDs[0][0] ==", winnerId[2]);

        // winnerId = auction.winnerId;

        console.log("We got a winner :::::: ");
        for (uint256 i = 0; i < 8; i++) {
            console.log("category ", i);
            console.log(winnerId[i]);
            //  console.log(aminals.getVisuals(i, auction.winnerId[i]));
            console.log(aminals.getVisuals(i, winnerId[i]));
        }

        //aminals.spawnAminal(1, 2, winnerId[0], winnerId[1],winnerId[2],winnerId[3],winnerId[4],winnerId[5],winnerId[6],winnerId[7]);

        vm.stopBroadcast();
    }
}
