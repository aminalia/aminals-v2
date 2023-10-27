pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {Aminals} from "src/Aminals.sol";
import {IAminal} from "src/IAminal.sol";
import {VisualsAuction} from "src/utils/VisualsAuction.sol";
import {IAminalStructs} from "src/IAminalStructs.sol";

/*
forge script script/GetTokenUri.s.sol:GetTokenUri   -vvvv
forge script script/SpawnAminal.s.sol:SpawnAminal -vvvv --rpc-url https://rpc.ankr.com/eth_goerli --broadc
ast
*/

contract SpawnAminal is Script {

    IAminalStructs.Visuals[] newVisuals;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        Aminals aminals = Aminals(0x1C147bc1BD3811c1E4B2a1526457151A624b5A98);

        // string memory uri1 = aminals.tokenURI(1);
        // console.log(uri1);
        // string memory uri2 = aminals.tokenURI(2);
        // console.log(uri2);

        // Aminals.Visuals[] memory visuals; 
        // // [1, 2, 1, 2, 1, 2, 1 ,2];
        // for (uint i = 1; i <= 8; i++) {
        //     visuals[i] = i % 2;
        // }


       // IAminalStructs.Visuals[] memory newVisuals = new IAminalStructs.Visuals[];


        newVisuals.push(IAminalStructs.Visuals(1,2,1,2,1,2,1,2));

        aminals.spawnInitialAminals(newVisuals);

        vm.stopBroadcast();
    }
}
