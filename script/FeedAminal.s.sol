pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {Aminals} from "src/Aminals.sol";
import {IAminal} from "src/IAminal.sol";
import {VisualsAuction} from "src/utils/VisualsAuction.sol";

contract FeedAminal is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        Aminals aminals = Aminals(0xC4956868cB2603E8d13BD064Bb1c53C6b5044a38);

        for (uint256 i = 1; i <= 2; i++) {
            aminals.feed{value: 0.01 ether}(i);

            console.log(
                "Aminal love by ID by user: ",
                aminals.getAminalLoveByIdByUser(i, 0x1f028f240A90414211425bFa38eB4917Cb32c39C)
            );
            console.log("Aminal love total : ", aminals.getAminalLoveTotal(i));
        }

        vm.stopBroadcast();
    }
}
