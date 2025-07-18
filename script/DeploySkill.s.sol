pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {AminalFactory} from "src/AminalFactory.sol";
import {Move2D} from "src/skills/Move2D.sol";
import {FightSkill} from "src/skills/FightSkill.sol";

/*
Deploy and register a new skill with the AminalFactory

Usage:
forge script script/DeploySkill.s.sol:DeploySkill --rpc-url $RPC_URL --broadcast
*/

contract DeploySkill is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        AminalFactory factory = AminalFactory(address(vm.envAddress("AMINAL_FACTORY_CONTRACT")));

        // Deploy a Move2D skill
        Move2D move2DSkill = new Move2D(address(factory));

        console.log("Move2D skill deployed to:", address(move2DSkill));
        console.log("Factory address:", address(factory));
        console.log("Skills are globally accessible - no registration required");

        vm.stopBroadcast();
    }
}

contract StartFight is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        AminalFactory factory = AminalFactory(address(vm.envAddress("AMINAL_FACTORY_CONTRACT")));

        FightSkill fight = new FightSkill(address(factory));

        console.log("Fighting !");
    }
}
