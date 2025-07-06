// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import {AminalFactory} from "src/AminalFactory.sol";
import {Aminal as AminalContract} from "src/Aminal.sol";
import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";
import {Move2D} from "src/skills/Move2D.sol";
import {GeneAuction} from "src/genes/GeneAuction.sol";
import {AminalProposals} from "src/proposals/AminalProposals.sol";
import {Genes} from "src/genes/Genes.sol";
import {GeneRegistry} from "src/genes/GeneRegistry.sol";

contract SkillComposabilityTest is Test, IAminalStructs {
    AminalFactory public factory;
    GeneAuction public geneAuction;
    AminalProposals public proposals;
    Genes public genes;
    GeneRegistry public geneFactory;
    Move2D public move2DSkill;

    AminalContract public aminal;

    address public alice = address(0x1);

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
        factory.setup();

        // Deploy skills
        move2DSkill = new Move2D(address(factory));

        // Skills are globally accessible - no registration needed

        // Spawn a test Aminal
        Visuals[] memory initialVisuals = new Visuals[](1);
        initialVisuals[0] =
            Visuals({backId: 1, armId: 1, tailId: 1, earsId: 1, bodyId: 1, faceId: 1, mouthId: 1, miscId: 1});

        factory.spawnInitialAminals(initialVisuals);
        address aminalAddress = factory.getAminalByIndex(0);
        aminal = AminalContract(payable(aminalAddress));
    }

    function testBasicSkillUsage() public {
        vm.deal(alice, 1 ether);

        // Feed the Aminal to give it energy and love
        vm.prank(alice);
        aminal.feed{value: 0.1 ether}();

        uint256 initialEnergy = aminal.getEnergy();
        uint256 initialLove = aminal.getLoveByUser(alice);

        // Use the Move2D skill
        bytes memory skillData = move2DSkill.getSkillData(10, 20);
        vm.prank(alice);
        aminal.useSkill(address(move2DSkill), skillData);

        // Check coordinates were updated
        (uint256 x, uint256 y) = move2DSkill.getCoords(address(aminal));
        assertEq(x, 10, "X coordinate should be 10");
        assertEq(y, 20, "Y coordinate should be 20");

        // Energy and love should be consumed by the skill calls
        assertTrue(aminal.getEnergy() < initialEnergy, "Energy should be consumed");
        assertTrue(aminal.getLoveByUser(alice) < initialLove, "Love should be consumed");
    }

    function testMultipleSkillCalls() public {
        vm.deal(alice, 1 ether);

        // Feed the Aminal to give it energy and love
        vm.prank(alice);
        aminal.feed{value: 0.1 ether}();

        // Use Move2D skill multiple times
        bytes memory skillData1 = move2DSkill.getSkillData(10, 20);
        vm.prank(alice);
        aminal.useSkill(address(move2DSkill), skillData1);

        // Move to a different position
        bytes memory skillData2 = move2DSkill.getSkillData(30, 40);
        vm.prank(alice);
        aminal.useSkill(address(move2DSkill), skillData2);

        // Check final coordinates
        (uint256 x, uint256 y) = move2DSkill.getCoords(address(aminal));
        assertEq(x, 30, "X coordinate should be 30 after second move");
        assertEq(y, 40, "Y coordinate should be 40 after second move");
    }

    function testGlobalSkillAccessibility() public {
        // Create a second Aminal by temporarily enabling initial spawn
        // Reset the initial spawn flag to allow spawning another Aminal
        vm.store(address(factory), bytes32(uint256(2)), bytes32(uint256(0))); // Reset initialAminalSpawned flag

        Visuals[] memory additionalVisuals = new Visuals[](1);
        additionalVisuals[0] = Visuals(2, 2, 2, 2, 2, 2, 2, 2);
        factory.spawnInitialAminals(additionalVisuals);
        address aminal2Address = factory.getAminalByIndex(1);
        AminalContract aminal2 = AminalContract(payable(aminal2Address));

        vm.deal(alice, 1 ether);

        // Feed both Aminals
        vm.startPrank(alice);
        aminal.feed{value: 0.1 ether}();
        aminal2.feed{value: 0.1 ether}();
        vm.stopPrank();

        // Both Aminals should be able to use the same skill
        bytes memory skillData = move2DSkill.getSkillData(100, 200);

        vm.prank(alice);
        aminal.useSkill(address(move2DSkill), skillData);

        vm.prank(alice);
        aminal2.useSkill(address(move2DSkill), skillData);

        // Both should have moved to the same coordinates
        (uint256 x1, uint256 y1) = move2DSkill.getCoords(address(aminal));
        (uint256 x2, uint256 y2) = move2DSkill.getCoords(address(aminal2));

        assertEq(x1, 100, "First Aminal should be at x=100");
        assertEq(y1, 200, "First Aminal should be at y=200");
        assertEq(x2, 100, "Second Aminal should be at x=100");
        assertEq(y2, 200, "Second Aminal should be at y=200");
    }

    function testSkillSecurityModel() public {
        // Test that skills can only be called by Aminal contracts
        vm.deal(alice, 1 ether);

        // Direct call to skill should fail
        vm.prank(alice);
        vm.expectRevert("Only Aminal contracts can call this");
        move2DSkill.move(50, 60);

        // Call through Aminal should work
        vm.prank(alice);
        aminal.feed{value: 0.1 ether}();

        bytes memory skillData = move2DSkill.getSkillData(50, 60);
        vm.prank(alice);
        aminal.useSkill(address(move2DSkill), skillData);

        (uint256 x, uint256 y) = move2DSkill.getCoords(address(aminal));
        assertEq(x, 50, "X should be 50");
        assertEq(y, 60, "Y should be 60");
    }
}
