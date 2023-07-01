pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Aminals.sol";
import "../src/IAminal.sol";
import "../src/utils/VisualsAuction.sol";

/*
forge script script/GetTokenUri.s.sol:GetTokenUri   -vvvv

*/

contract GetTokenUri is Script {
    function run() external {

        uint256 deployerPrivateKey = vm.envUint("ETH_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        Aminals aminals = Aminals(0xC5cA00b528daA14036F6edeFA0665D6a4201dDd0);

        // string memory uri1 = aminals.tokenURI(1);
        // console.log(uri1);
        // string memory uri2 = aminals.tokenURI(2);
        // console.log(uri2);

        uint256 a3 = aminals.spawnAminal(1, 2, 1, 1, 1, 2, 2, 2, 2, 1);

        vm.stopBroadcast();
}
}