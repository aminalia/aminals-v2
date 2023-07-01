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

        Aminals aminals = Aminals(address(0xA3698549308Def0a1255Ac7Abf609505B0627C2f));

        string memory uri1 = aminals.tokenURI(1);
        console.log(uri1);
        string memory uri2 = aminals.tokenURI(2);
        console.log(uri2);
    }

}