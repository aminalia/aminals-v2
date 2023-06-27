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
}
