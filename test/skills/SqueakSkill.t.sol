// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {SqueakSkill} from "src/skills/SqueakSkill.sol";
import {ISkill} from "src/interfaces/ISkill.sol";
import {SkillTestBase} from "../base/SkillTestBase.t.sol";
import {IAminal} from "src/interfaces/IAminal.sol";
import {Aminal} from "src/Aminal.sol";

contract SqueakSkillTest is SkillTestBase {
    SqueakSkill public squeakSkill;

    event Squeaked(address indexed aminal, uint256 amount);
    event EnergyLost(address indexed user, uint256 amount, uint256 remainingEnergy);
    event LoveConsumed(address indexed user, uint256 amount, uint256 remainingLove);
    // SkillTestBase already declares SkillUsed event

    function setUp() public override {
        super.setUp();
        squeakSkill = new SqueakSkill();
    }

    function test_SqueakSkillSupportsInterface() public {
        assertTrue(squeakSkill.supportsInterface(type(ISkill).interfaceId));
    }

    function test_BasicSqueak() public {
        // SkillTestBase already feeds the aminals in setUp
        uint256 initialEnergy = IAminal(testAminal1).getEnergy();
        uint256 initialLove = IAminal(testAminal1).getLoveByUser(alice);
        uint256 squeakAmount = 100;

        // Prepare squeak call
        bytes memory squeakData = abi.encodeWithSelector(SqueakSkill.squeak.selector, squeakAmount);

        // Expect events
        vm.expectEmit(true, false, false, true);
        emit Squeaked(testAminal1, squeakAmount);

        vm.expectEmit(true, false, false, true);
        emit EnergyLost(alice, squeakAmount, initialEnergy - squeakAmount);

        vm.expectEmit(true, false, false, true);
        emit LoveConsumed(alice, squeakAmount, initialLove - squeakAmount);

        vm.expectEmit(true, true, true, true);
        emit SkillUsed(alice, squeakAmount, address(squeakSkill), SqueakSkill.squeak.selector);

        // Execute squeak
        vm.prank(alice);
        IAminal(testAminal1).useSkill(address(squeakSkill), squeakData);

        // Verify state changes
        assertEq(IAminal(testAminal1).getEnergy(), initialEnergy - squeakAmount);
        assertEq(IAminal(testAminal1).getLoveByUser(alice), initialLove - squeakAmount);
    }

    function test_SqueakWithDifferentAmounts() public {
        // SkillTestBase already feeds the aminals in setUp

        uint256[] memory amounts = new uint256[](5);
        amounts[0] = 1;
        amounts[1] = 10;
        amounts[2] = 100;
        amounts[3] = 500;
        amounts[4] = 1000;

        for (uint256 i = 0; i < amounts.length; i++) {
            uint256 energyBefore = IAminal(testAminal1).getEnergy();
            uint256 loveBefore = IAminal(testAminal1).getLoveByUser(alice);

            bytes memory squeakData = abi.encodeWithSelector(SqueakSkill.squeak.selector, amounts[i]);

            vm.prank(alice);
            IAminal(testAminal1).useSkill(address(squeakSkill), squeakData);

            assertEq(IAminal(testAminal1).getEnergy(), energyBefore - amounts[i]);
            assertEq(IAminal(testAminal1).getLoveByUser(alice), loveBefore - amounts[i]);
        }
    }

    function test_SqueakInsufficientEnergy() public {
        // Get current energy from the already-fed aminal
        uint256 energy = IAminal(testAminal1).getEnergy();
        
        // Exhaust most of the energy first
        if (energy > 5) {
            uint256 exhaustAmount = energy - 5;
            bytes memory exhaustData = abi.encodeWithSelector(SqueakSkill.squeak.selector, exhaustAmount);
            vm.prank(alice);
            IAminal(testAminal1).useSkill(address(squeakSkill), exhaustData);
        }
        
        // Now try to squeak more than remaining energy
        uint256 remainingEnergy = IAminal(testAminal1).getEnergy();
        uint256 squeakAmount = remainingEnergy + 1;

        bytes memory squeakData = abi.encodeWithSelector(SqueakSkill.squeak.selector, squeakAmount);

        vm.prank(alice);
        vm.expectRevert(); // Expect any revert for insufficient energy
        IAminal(testAminal1).useSkill(address(squeakSkill), squeakData);
    }

    function test_SqueakInsufficientLove() public {
        // First, add more energy via bob feeding (alice gets no love from this)
        vm.deal(bob, 10 ether);
        vm.prank(bob);
        IAminal(testAminal1).feed{value: 10 ether}();
        
        // Start fresh - exhaust alice's existing love completely
        uint256 aliceLove = IAminal(testAminal1).getLoveByUser(alice);
        
        if (aliceLove > 0) {
            // Exhaust all love in chunks of 10000 or less
            while (aliceLove > 0) {
                uint256 exhaustAmount = aliceLove > 10_000 ? 10_000 : aliceLove;
                bytes memory exhaustData = abi.encodeWithSelector(SqueakSkill.squeak.selector, exhaustAmount);
                vm.prank(alice);
                IAminal(testAminal1).useSkill(address(squeakSkill), exhaustData);
                aliceLove = IAminal(testAminal1).getLoveByUser(alice);
                
                // Safety check to avoid infinite loop
                if (IAminal(testAminal1).getEnergy() == 0) break;
            }
        }

        // Now alice should have 0 love but aminal has energy. Try to squeak 1 unit.
        bytes memory squeakData = abi.encodeWithSelector(SqueakSkill.squeak.selector, 1);

        vm.prank(alice);
        vm.expectRevert(); // Expect any revert for insufficient love
        IAminal(testAminal1).useSkill(address(squeakSkill), squeakData);
    }

    function test_MultipleUsersSqueak() public {
        // SkillTestBase already feeds alice
        // Feed bob too to give him love
        vm.prank(bob);
        IAminal(testAminal1).feed{value: 1 ether}();

        uint256 squeakAmount = 500;
        bytes memory squeakData = abi.encodeWithSelector(SqueakSkill.squeak.selector, squeakAmount);

        // User1 squeaks
        uint256 energyBefore = IAminal(testAminal1).getEnergy();
        uint256 aliceLoveBefore = IAminal(testAminal1).getLoveByUser(alice);
        uint256 bobLoveBefore = IAminal(testAminal1).getLoveByUser(bob);

        vm.prank(alice);
        IAminal(testAminal1).useSkill(address(squeakSkill), squeakData);

        assertEq(IAminal(testAminal1).getEnergy(), energyBefore - squeakAmount);
        assertEq(IAminal(testAminal1).getLoveByUser(alice), aliceLoveBefore - squeakAmount);
        assertEq(IAminal(testAminal1).getLoveByUser(bob), bobLoveBefore); // User2's love unchanged

        // User2 squeaks
        energyBefore = IAminal(testAminal1).getEnergy();
        bobLoveBefore = IAminal(testAminal1).getLoveByUser(bob);

        vm.prank(bob);
        IAminal(testAminal1).useSkill(address(squeakSkill), squeakData);

        assertEq(IAminal(testAminal1).getEnergy(), energyBefore - squeakAmount);
        assertEq(IAminal(testAminal1).getLoveByUser(bob), bobLoveBefore - squeakAmount);
    }

    function test_SkillCostCalculation() public {
        // Test various amounts
        uint256[] memory amounts = new uint256[](4);
        amounts[0] = 1;
        amounts[1] = 100;
        amounts[2] = 1000;
        amounts[3] = 10_000;

        for (uint256 i = 0; i < amounts.length; i++) {
            bytes memory squeakData = abi.encodeWithSelector(SqueakSkill.squeak.selector, amounts[i]);
            uint256 cost = squeakSkill.skillCost(squeakData);
            assertEq(cost, amounts[i]);
        }
    }

    function test_SkillCostWithInvalidSelector() public {
        // Test with an invalid function selector
        bytes memory invalidData = abi.encodeWithSelector(bytes4(keccak256("invalidFunction()")));
        uint256 cost = squeakSkill.skillCost(invalidData);
        assertEq(cost, 1); // Should return default cost
    }

    function test_SqueakZeroAmount() public {
        // SkillTestBase already feeds the aminals in setUp

        // Try to squeak with 0 amount
        bytes memory squeakData = abi.encodeWithSelector(SqueakSkill.squeak.selector, 0);

        // Even though squeak amount is 0, useSkill enforces minimum cost of 1
        uint256 energyBefore = IAminal(testAminal1).getEnergy();
        uint256 loveBefore = IAminal(testAminal1).getLoveByUser(alice);

        vm.prank(alice);
        IAminal(testAminal1).useSkill(address(squeakSkill), squeakData);

        // Should consume 1 unit (minimum cost)
        assertEq(IAminal(testAminal1).getEnergy(), energyBefore - 1);
        assertEq(IAminal(testAminal1).getLoveByUser(alice), loveBefore - 1);
    }

    function testFuzz_SqueakVariousAmounts(uint256 feedAmount, uint256 squeakAmount) public {
        // Bound inputs to reasonable ranges
        feedAmount = bound(feedAmount, 0.001 ether, 1 ether); // Max 1 ETH to avoid OutOfFunds
        squeakAmount = bound(squeakAmount, 1, 10_000); // Cap at 10_000 due to useSkill logic

        // Give alice some ETH for feeding
        vm.deal(alice, feedAmount);

        // Feed the Aminal with specified amount  
        vm.prank(alice);
        IAminal(testAminal1).feed{value: feedAmount}();

        uint256 energy = IAminal(testAminal1).getEnergy();
        uint256 love = IAminal(testAminal1).getLoveByUser(alice);

        // Only squeak if we have enough resources
        vm.assume(squeakAmount <= energy);
        vm.assume(squeakAmount <= love);

        bytes memory squeakData = abi.encodeWithSelector(SqueakSkill.squeak.selector, squeakAmount);

        vm.prank(alice);
        IAminal(testAminal1).useSkill(address(squeakSkill), squeakData);

        assertEq(IAminal(testAminal1).getEnergy(), energy - squeakAmount);
        assertEq(IAminal(testAminal1).getLoveByUser(alice), love - squeakAmount);
    }

    function test_SqueakExhaustAllResources() public {
        // SkillTestBase already feeds the aminals in setUp

        // Get the minimum of energy and love (but cap at 10000 due to useSkill logic)
        uint256 energy = IAminal(testAminal1).getEnergy();
        uint256 love = IAminal(testAminal1).getLoveByUser(alice);
        uint256 maxSqueak = energy < love ? energy : love;
        
        // Cap at 10000 to match useSkill logic
        if (maxSqueak > 10_000) maxSqueak = 10_000;

        bytes memory squeakData = abi.encodeWithSelector(SqueakSkill.squeak.selector, maxSqueak);

        // Squeak the maximum amount (capped)
        vm.prank(alice);
        IAminal(testAminal1).useSkill(address(squeakSkill), squeakData);

        // Continue exhausting resources until depleted
        while (true) {
            uint256 currentEnergy = IAminal(testAminal1).getEnergy();
            uint256 currentLove = IAminal(testAminal1).getLoveByUser(alice);
            
            if (currentEnergy == 0 || currentLove == 0) break;
            
            uint256 nextSqueak = currentEnergy < currentLove ? currentEnergy : currentLove;
            if (nextSqueak > 10_000) nextSqueak = 10_000;
            
            bytes memory nextSqueakData = abi.encodeWithSelector(SqueakSkill.squeak.selector, nextSqueak);
            vm.prank(alice);
            IAminal(testAminal1).useSkill(address(squeakSkill), nextSqueakData);
        }

        // Verify we've exhausted at least one resource
        assertTrue(IAminal(testAminal1).getEnergy() == 0 || IAminal(testAminal1).getLoveByUser(alice) == 0);

        // Try to squeak again - should fail
        bytes memory squeakOneData = abi.encodeWithSelector(SqueakSkill.squeak.selector, 1);
        vm.prank(alice);
        vm.expectRevert();
        IAminal(testAminal1).useSkill(address(squeakSkill), squeakOneData);
    }
}
