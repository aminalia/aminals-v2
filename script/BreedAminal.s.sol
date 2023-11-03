pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {Aminals} from "src/Aminals.sol";
import {IAminal} from "src/IAminal.sol";
import {VisualsAuction} from "src/utils/VisualsAuction.sol";

contract BreedAminal is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        Aminals aminals = Aminals(address(vm.envAddress("AMINALS_CONTRACT")));

        for (uint256 i = 1; i <= 2; i++) {
            console.log("~~~~~~~~~~~~~~~");
            console.log("Aminal ID", i);
            console.log(
                "Aminal love by ID by user: ", aminals.getAminalLoveByIdByUser(i, address(vm.envAddress("ADDRESS")))
            );
            console.log("Aminal love total : ", aminals.getAminalLoveTotal(i));
            console.log("Aminal energy total : ", aminals.getEnergy(i));
            console.log("~~~~~~~~~~~~~~~");
        }

        aminals.breedWith{value: 0.001 ether}(1, 2);
        aminals.breedWith{value: 0.001 ether}(2, 1);

        vm.stopBroadcast();
    }
}
