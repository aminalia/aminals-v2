// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {AminalFactory} from "src/AminalFactory.sol";
import {Aminal as AminalContract} from "src/Aminal.sol";
import {AminalVRGDA} from "src/utils/AminalVRGDA.sol";
import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";
import {GeneAuction} from "src/genes/GeneAuction.sol";
import {AminalProposals} from "src/proposals/AminalProposals.sol";
import {Genes} from "src/genes/Genes.sol";
import {GeneRegistry} from "src/genes/GeneRegistry.sol";

contract AminalVRGDATest is Test, IAminalStructs {
    AminalFactory public factory;
    AminalContract public aminal;
    AminalVRGDA public vrgda;
    GeneAuction public geneAuction;
    AminalProposals public proposals;
    Genes public genes;
    GeneRegistry public geneFactory;

    address public user1 = makeAddr("user1");
    address public user2 = makeAddr("user2");

    function setUp() public {
        // Deploy real dependencies
        genes = new Genes();
        geneFactory = new GeneRegistry(address(genes));
        geneAuction = new GeneAuction(address(genes), address(geneFactory));
        proposals = new AminalProposals();

        // Deploy factory
        factory = new AminalFactory();
        factory.initialize(address(geneAuction), address(proposals), address(genes));

        // Setup contracts properly
        genes.setup(address(factory));
        genes.setFactory(address(geneFactory));
        geneAuction.setup(address(factory), address(factory));
        proposals.setup(address(factory));
        factory.setup(); // This deploys the VRGDA

        // Get the VRGDA instance from factory
        vrgda = factory.loveVRGDA();

        // Spawn a test Aminal
        Visuals[] memory initialVisuals = new Visuals[](1);
        initialVisuals[0] =
            Visuals({backId: 1, armId: 1, tailId: 1, earsId: 1, bodyId: 1, faceId: 1, mouthId: 1, miscId: 1});

        factory.spawnInitialAminals(initialVisuals);
        address aminalAddress = factory.getAminalByIndex(0);
        aminal = AminalContract(payable(aminalAddress));

        // Fund test users
        deal(user1, 20 ether);
        deal(user2, 2000 ether);
    }

    function test_InitialEnergyIs50() public {
        // Initial energy is 50 units (0.005 ETH worth)
        assertEq(aminal.getEnergy(), 50);
    }

    function test_FixedEnergyGainPerETH() public {
        uint256 feedAmount = 0.5 ether;
        uint256 expectedEnergyGain = (feedAmount * vrgda.ENERGY_PER_ETH()) / 1 ether; // Should be 5000
        uint256 initialEnergy = aminal.getEnergy(); // 50

        vm.prank(user1);
        aminal.feed{value: feedAmount}();

        assertEq(aminal.getEnergy(), initialEnergy + expectedEnergyGain);
        assertEq(aminal.getEnergy(), 5050); // 50 + (0.5 ETH * 10000) = 5050 energy
    }

    function test_LoveVariesBasedOnEnergy() public {
        // At low energy (50), should get good love multiplier
        uint256 feedAmount1 = 0.1 ether;
        uint256 initialEnergy = aminal.getEnergy(); // 50

        // Calculate expected love using VRGDA directly
        uint256 expectedLove1 = vrgda.getLoveForETH(initialEnergy, feedAmount1);

        vm.prank(user1);
        aminal.feed{value: feedAmount1}();

        assertEq(aminal.getLoveByUser(user1), expectedLove1);
        assertEq(aminal.getTotalLove(), expectedLove1);

        // Feed more to increase energy significantly
        vm.prank(user1);
        aminal.feed{value: 5 ether}();

        uint256 totalLoveBefore = aminal.getTotalLove();
        uint256 energyBefore = aminal.getEnergy();

        // Now with higher energy, love per ETH should be less
        uint256 feedAmount2 = 0.1 ether;
        uint256 expectedLove2 = vrgda.getLoveForETH(energyBefore, feedAmount2);

        vm.prank(user2);
        aminal.feed{value: feedAmount2}();

        uint256 loveGained = aminal.getTotalLove() - totalLoveBefore;

        // Love gained should match VRGDA calculation
        assertEq(loveGained, expectedLove2);
        assertEq(aminal.getLoveByUser(user2), expectedLove2);

        // Love per ETH should be less at higher energy
        uint256 lovePerETH1 = (expectedLove1 * 1e18) / feedAmount1;
        uint256 lovePerETH2 = (expectedLove2 * 1e18) / feedAmount2;
        assertLt(lovePerETH2, lovePerETH1);

        // But energy gain should be the same
        uint256 energyGained = aminal.getEnergy() - energyBefore;
        assertEq(energyGained, 1000); // 0.1 ETH * 10000 = 1000 energy
    }

    function test_LoveMultiplierDecreasesWithEnergy() public {
        // Check initial love multiplier at starting energy (50)
        uint256 initialEnergy = aminal.getEnergy(); // 50
        uint256 initialMultiplier = vrgda.getLoveMultiplier(initialEnergy);

        // At low energy (50), love multiplier should be high
        assertGt(initialMultiplier, 50_000); // Should be > 5x multiplier

        // Feed small amount to increase energy
        vm.prank(user1);
        aminal.feed{value: 0.1 ether}();

        uint256 newEnergy = aminal.getEnergy();
        uint256 newMultiplier = vrgda.getLoveMultiplier(newEnergy);

        // Love multiplier should decrease as energy increases
        assertLt(newMultiplier, initialMultiplier);

        // Feed much more to reach high energy threshold
        vm.prank(user2);
        aminal.feed{value: 100 ether}();

        // At very high energy, multiplier should be much lower
        uint256 highEnergy = aminal.getEnergy();
        uint256 highEnergyMultiplier = vrgda.getLoveMultiplier(highEnergy);

        // Should be significantly less than initial
        assertLt(highEnergyMultiplier, initialMultiplier / 2);
        assertLt(highEnergyMultiplier, newMultiplier);
    }

    function test_VRGDAThresholds() public {
        // Test the specific thresholds in the VRGDA
        // getLoveMultiplier returns love gained for 1 ETH, not the raw multiplier

        // Very low energy should give maximum love (10x base units)
        uint256 lowEnergyLove = vrgda.getLoveMultiplier(5);
        uint256 expectedMaxLove = (1 ether * vrgda.ENERGY_PER_ETH() * vrgda.MAX_LOVE_MULTIPLIER()) / (1 ether * 1 ether);
        assertEq(lowEnergyLove, expectedMaxLove); // Should be 100,000

        // Very high energy should give minimum love (0.1x base units)
        uint256 highEnergyLove = vrgda.getLoveMultiplier(2_000_000);
        uint256 expectedMinLove = (1 ether * vrgda.ENERGY_PER_ETH() * vrgda.MIN_LOVE_MULTIPLIER()) / (1 ether * 1 ether);
        assertEq(highEnergyLove, expectedMinLove); // Should be 1,000

        // Normal energy should be in between
        uint256 normalEnergyLove = vrgda.getLoveMultiplier(1000);
        assertGt(normalEnergyLove, expectedMinLove);
        assertLt(normalEnergyLove, expectedMaxLove);
    }

    function testFuzz_FixedEnergyGain(uint96 ethAmount) public {
        vm.assume(ethAmount > 0.001 ether && ethAmount < 10 ether);

        uint256 initialEnergy = aminal.getEnergy();
        uint256 expectedEnergyGain = (ethAmount * vrgda.ENERGY_PER_ETH()) / 1 ether;

        vm.prank(user1);
        aminal.feed{value: ethAmount}();

        assertEq(aminal.getEnergy(), initialEnergy + expectedEnergyGain);
    }

    function testFuzz_LoveDiminishingReturns(uint96 firstAmount, uint96 secondAmount) public {
        vm.assume(firstAmount > 0.01 ether && firstAmount < 10 ether);
        vm.assume(secondAmount > 0.01 ether && secondAmount < 10 ether);

        // First feeding at initial energy
        vm.prank(user1);
        aminal.feed{value: firstAmount}();
        uint256 lovePerEthFirst = (aminal.getTotalLove() * 1e18) / firstAmount;

        // Second feeding at higher energy
        vm.prank(user2);
        uint256 loveBefore = aminal.getTotalLove();
        aminal.feed{value: secondAmount}();
        uint256 loveGained = aminal.getTotalLove() - loveBefore;
        uint256 lovePerEthSecond = (loveGained * 1e18) / secondAmount;

        // Love per ETH should decrease with higher energy
        // Allow 5% tolerance for VRGDA curve variations and rounding
        uint256 allowedIncrease = lovePerEthFirst / 20;
        assertLe(lovePerEthSecond, lovePerEthFirst + allowedIncrease);
    }

    function test_LoveTrackingPerUser() public {
        uint256 feedAmount1 = 0.1 ether;
        uint256 feedAmount2 = 0.2 ether;

        uint256 initialEnergy = aminal.getEnergy();

        // Calculate expected love for each feeding
        uint256 expectedLove1 = vrgda.getLoveForETH(initialEnergy, feedAmount1);

        // First user feeds
        vm.prank(user1);
        aminal.feed{value: feedAmount1}();

        uint256 energyAfterFirst = aminal.getEnergy();
        uint256 expectedLove2 = vrgda.getLoveForETH(energyAfterFirst, feedAmount2);

        // Second user feeds
        vm.prank(user2);
        aminal.feed{value: feedAmount2}();

        // Check individual love tracking
        assertEq(aminal.getLoveByUser(user1), expectedLove1);
        assertEq(aminal.getLoveByUser(user2), expectedLove2);
        assertEq(aminal.getTotalLove(), expectedLove1 + expectedLove2);

        // Energy should be fixed based on ETH sent
        uint256 expectedTotalEnergy = initialEnergy + ((feedAmount1 + feedAmount2) * vrgda.ENERGY_PER_ETH()) / 1 ether;
        assertEq(aminal.getEnergy(), expectedTotalEnergy);
    }

    function test_MinimumLoveGain() public {
        // Feed a large amount to get high energy (user1 has 20 ETH)
        vm.prank(user1);
        aminal.feed{value: 15 ether}();

        uint256 loveBefore = aminal.getTotalLove();
        uint256 energyBefore = aminal.getEnergy();

        // Even with high energy, sending ETH should give some love (minimum multiplier)
        vm.prank(user2);
        aminal.feed{value: 0.1 ether}();

        // Should gain some love (at least minimum multiplier)
        assertGt(aminal.getTotalLove(), loveBefore);

        // Check that we get at least the minimum love multiplier
        uint256 loveGained = aminal.getTotalLove() - loveBefore;
        uint256 expectedMinLove =
            (0.1 ether * vrgda.ENERGY_PER_ETH() * vrgda.MIN_LOVE_MULTIPLIER()) / (1 ether * 1 ether);
        assertGe(loveGained, expectedMinLove);

        // Energy gain should be fixed
        uint256 energyGained = aminal.getEnergy() - energyBefore;
        assertEq(energyGained, 1000); // 0.1 ETH * 10000 = 1000 energy
    }

    function test_MaximumLoveAtLowEnergy() public {
        // At very low energy (< 10), love should be at maximum
        uint256 maxLove = vrgda.getLoveMultiplier(5); // Very low energy
        uint256 expectedMaxLove = (1 ether * vrgda.ENERGY_PER_ETH() * vrgda.MAX_LOVE_MULTIPLIER()) / (1 ether * 1 ether);
        assertEq(maxLove, expectedMaxLove); // Should be 100,000

        // Test that initial energy (50) gets a high love amount
        uint256 initialLove = vrgda.getLoveMultiplier(aminal.getEnergy());
        uint256 expectedMinLove = (1 ether * vrgda.ENERGY_PER_ETH() * vrgda.MIN_LOVE_MULTIPLIER()) / (1 ether * 1 ether);
        assertGt(initialLove, expectedMinLove * 5); // Should be much higher than minimum

        // Feed a small amount and check love amount decreases
        vm.prank(user1);
        aminal.feed{value: 0.1 ether}();

        uint256 loveAfterFeeding = vrgda.getLoveMultiplier(aminal.getEnergy());
        assertLt(loveAfterFeeding, initialLove);
    }

    function test_EnergyCapBehavior() public {
        // Test that we can approach the energy cap
        uint256 maxEnergy = 1_000_000; // 100 ETH worth

        // Feed a large amount to test energy capping (use user2 who has more ETH)
        vm.prank(user2);
        aminal.feed{value: 150 ether}(); // More than the cap

        // Energy should be capped
        assertLe(aminal.getEnergy(), maxEnergy);

        // Should still gain love even when energy is capped
        assertGt(aminal.getTotalLove(), 0);
    }
}
