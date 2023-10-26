pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {Aminals} from "src/Aminals.sol";
import {IAminal} from "src/IAminal.sol";
import {VisualsAuction} from "src/utils/VisualsAuction.sol";

/*
forge script script/GetTokenUri.s.sol:GetTokenUri   -vvvv
forge script script/SpawnAminal.s.sol:SpawnAminal -vvvv --rpc-url https://rpc.ankr.com/eth_goerli --broadc
ast
*/

contract SpawnAminal is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        Aminals aminals = Aminals(address(vm.envAddress("CONTRACT")));

        // string memory uri1 = aminals.tokenURI(1);
        // console.log(uri1);
        // string memory uri2 = aminals.tokenURI(2);
        // console.log(uri2);

        uint256 a3 = aminals.spawnAminal(1, 2, 1, 2, 1, 2, 2, 2, 1, 1);

        vm.stopBroadcast();
    }
}
