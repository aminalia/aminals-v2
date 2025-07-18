pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import {AminalFactory} from "src/AminalFactory.sol";
import {Aminal} from "src/Aminal.sol";
import {Move2D} from "src/skills/Move2D.sol";
import {FightSkill} from "src/skills/FightSkill.sol";

/*
Call a skill from an Aminal contract

Usage:
forge script script/CallSkill.s.sol:CallSkill --rpc-url $RPC_URL --broadcast
*/

contract CallSkill is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        AminalFactory factory = AminalFactory(address(vm.envAddress("AMINAL_FACTORY_CONTRACT")));

        // Get the first Aminal
        require(factory.totalAminals() > 0, "No Aminals exist");
        address aminalAddress = factory.aminalsByIndex(0);
        Aminal aminal = Aminal(payable(aminalAddress));

        console.log("Using Aminal at address:", aminalAddress);
        console.log("Aminal energy before:", aminal.getEnergy());

        // Get skill address (assuming Move2D skill exists)
        address skillAddress = address(vm.envAddress("MOVE2D_SKILL_CONTRACT"));
        console.log("Using skill at address:", skillAddress);

        // Prepare skill data using the new Move2D format
        Move2D move2DSkill = Move2D(skillAddress);
        bytes memory skillData = abi.encodeWithSelector(move2DSkill.move.selector, 5, 10);

        // Call the skill using the new method
        aminal.useSkill(skillAddress, skillData);

        console.log("Skill called successfully");
        console.log("Aminal energy after:", aminal.getEnergy());

        // Check if position was updated (this would require reading skill properties)
        console.log("Check Aminal's position properties for movement changes");

        vm.stopBroadcast();
    }
}

contract CallFight is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        AminalFactory factory = AminalFactory(address(vm.envAddress("AMINAL_FACTORY_CONTRACT")));

        require(factory.totalAminals() > 0, "No Aminals exist");

        address aminalAddress = factory.aminalsByIndex(0);
        address victimAddress = factory.aminalsByIndex(1);

        Aminal aminal = Aminal(payable(aminalAddress));
        Aminal victim = Aminal(payable(victimAddress));

        uint256 energy1 = aminal.getEnergy();
        uint256 energy2 = victim.getEnergy();
        console.log("Aminal energy before: ", vm.toString(energy1));
        console.log("Victim energy before: ", vm.toString(energy2));

        // Get skill address (assuming FightSkill skill exists)
        FightSkill skillContract = FightSkill(address(vm.envAddress("FIGHT_SKILL_CONTRACT")));
        console.log("Using FIGHT skill at address:", address(skillContract));

        (uint256 health1,) = skillContract.getStats(victimAddress);
        (uint256 health2,) = skillContract.getStats(victimAddress);
        console.log("Aminal health before: ", vm.toString(health1));
        console.log("Victim health before: ", vm.toString(health2));

        // Prepare skill data for FightSkill attack function
        bytes memory skillData = abi.encodeWithSelector(skillContract.attack.selector, victimAddress, 1);

        // Call the skill
        aminal.useSkill(address(skillContract), skillData);

        console.log("Skill called successfully");

        energy1 = aminal.getEnergy();
        energy2 = victim.getEnergy();
        console.log("Aminal energy after: ", vm.toString(energy1));
        console.log("Victim energy after: ", vm.toString(energy2));

        (health1,) = skillContract.getStats(victimAddress);
        (health2,) = skillContract.getStats(victimAddress);
        console.log("Aminal health after: ", vm.toString(health1));
        console.log("Victim health after: ", vm.toString(health2));

        vm.stopBroadcast();
    }
}
