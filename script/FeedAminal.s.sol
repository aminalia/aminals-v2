pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {AminalFactory} from "src/AminalFactory.sol";
import {IAminal} from "src/interfaces/IAminal.sol";
import {Aminal} from "src/Aminal.sol";
import {GeneAuction} from "src/genes/GeneAuction.sol";

contract FeedAminal is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        AminalFactory factory = AminalFactory(address(vm.envAddress("AMINAL_FACTORY_CONTRACT")));

        // Get the first two Aminal contract addresses
        for (uint256 i = 0; i < 2 && i < factory.totalAminals(); i++) {
            address aminalAddress = factory.aminalsByIndex(i);
            Aminal aminal = Aminal(payable(aminalAddress));

            // Feed the individual Aminal
            aminal.feed{value: 0.001 ether}();

            console.log("Fed Aminal at address:", aminalAddress);
            console.log("Aminal love by user:", aminal.getLoveByUser(address(vm.envAddress("ADDRESS"))));
            console.log("Aminal total love:", aminal.getTotalLove());
            console.log("Aminal energy:", aminal.getEnergy());
        }

        vm.stopBroadcast();
    }
}
