// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Aminals.sol";



contract CounterTest is Test {
    Aminals public aminals;

    function setUp() public {
        aminals = new Aminals();
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
        console.log(aminals.feed{value:0.01 ether}(1));
        console.log(aminals.feed{value:0.01 ether}(1));
        console.log(aminals.feed{value:0.03 ether}(1));
        console.log(aminals.feed{value:0.02 ether}(1));
        console.log(aminals.feed{value:0.08 ether}(1));
        console.log(aminals.feed{value:0.08 ether}(1));
        console.log(aminals.feed{value:0.08 ether}(1));
        console.log(aminals.feed{value:0.08 ether}(1));
        console.log(aminals.feed{value:0.08 ether}(1));

        console.log("Checking amount of love for user");
        console.log(aminals.getAminalLoveByIdByUser(1, owner));

    }
}
