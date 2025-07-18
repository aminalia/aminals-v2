pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {AminalFactory} from "src/AminalFactory.sol";
import {IAminal} from "src/interfaces/IAminal.sol";
import {Aminal} from "src/Aminal.sol";
import {InitialGenesMinter} from "script/InitialGenesMinter.sol";
import {Genes} from "src/genes/Genes.sol";

contract AddNewGenes is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // AminalFactory factory = AminalFactory(address(vm.envAddress("AMINAL_FACTORY_CONTRACT")));

        Genes genes = Genes(address(vm.envAddress("GENES_NFT_CONTRACT")));
        console.log("genes nft address ===> ", address(genes));

        InitialGenesMinter minter = new InitialGenesMinter();

        // Set minter as temporary gene factory
        genes.setRegistry(address(minter));
        console.log("Set minter as temporary gene factory");

        minter.mintInitialGenesAnimated(genes, msg.sender);

        vm.stopBroadcast();
    }
}
