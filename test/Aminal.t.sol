// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Aminals.sol";
import "../src/utils/VisualsRegistry.sol";

contract CounterTest is Test {
    Aminals public aminals;
    VisualsRegistry public registry;

    function setUp() public {
        aminals = new Aminals();
        registry = new VisualsRegistry();
    }

    function testRegisterVisuals() public {
        registry = new VisualsRegistry();
        registry.registerVisual(VisualsRegistry.BODY, "body1");
        registry.registerVisual(VisualsRegistry.BODY, "body2");
        registry.registerVisual(VisualsRegistry.HAT, "hat1");
        registry.registerVisual(VisualsRegistry.HAT, "hat2");
        registry.registerVisual(VisualsRegistry.EYES, "eyes1");
        registry.registerVisual(VisualsRegistry.EYES, "eyes2");
    }

    function testSpawnAminals() public {
        aminals.spawnAminal(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        aminals.spawnAminal(0, 0, 1, 1, 1, 0, 0, 0, 0, 0);
    }

    function testSqueak() public {
        vm.expectRevert("Not enough ether");
        console.log("Squeak without 0.01 ether");
        aminals.squeak(1);
        console.log("Squeak with 0.01 ether");
        vm.expectRevert("Not enough love");
        aminals.squeak{value: 0.01 ether}(1);
        console.log("Squeak completed");
    }

    function testFeed() public {
        address owner = 0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496;
        vm.prank(owner);
        console.log("Feeding the aminal");
        vm.expectRevert("Not enough ether");
        console.log(uint256(aminals.feed(1)));
        console.log(aminals.feed{value: 0.01 ether}(1));
        console.log(aminals.feed{value: 0.01 ether}(1));
        console.log(aminals.feed{value: 0.03 ether}(1));
        console.log(aminals.feed{value: 0.02 ether}(1));
        console.log(aminals.feed{value: 0.08 ether}(1));
        console.log(aminals.feed{value: 0.08 ether}(1));
        console.log(aminals.feed{value: 0.08 ether}(1));
        console.log(aminals.feed{value: 0.08 ether}(1));
        console.log(aminals.feed{value: 0.08 ether}(1));

        console.log("Checking amount of love for user");
        console.log(aminals.getAminalLoveByIdByUser(1, owner));
    }

    function testBreed() public {
        address owner = 0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496;
        vm.prank(owner);
        console.log("Breeding the aminals");
        aminals.breedWith{value: 0.05 ether}(1, 2);
        vm.expectRevert("Not enough love");
        aminals.breedWith{value: 0.05 ether}(2, 1);
        console.log(aminals.feed{value: 0.08 ether}(2));
        aminals.breedWith{value: 0.05 ether}(1, 2);
    }
}
