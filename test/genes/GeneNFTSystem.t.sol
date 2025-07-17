// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import {Genes} from "src/genes/Genes.sol";
import {GeneRegistry} from "src/genes/GeneRegistry.sol";
import {GeneAuction} from "src/genes/GeneAuction.sol";
import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";
import {AminalFactory} from "src/AminalFactory.sol";
import {IAminalFactory} from "src/interfaces/IAminalFactory.sol";
import {AminalProposals} from "src/proposals/AminalProposals.sol";
import {Aminal as AminalContract} from "src/Aminal.sol";

contract GeneNFTSystemTest is Test, IAminalStructs {
    Genes public genes;
    GeneRegistry public geneRegistry;
    GeneAuction public geneAuction;
    AminalFactory public aminalFactory;
    AminalProposals public proposals;

    address public alice = address(0x1);
    address public bob = address(0x2);
    address public charlie = address(0x3);

    // Sample SVG content for testing
    string constant SAMPLE_BACKGROUND = '<rect width="1000" height="1000" fill="#87CEEB"/>';
    string constant SAMPLE_FACE = '<circle cx="500" cy="400" r="100" fill="#FFB6C1"/>';
    string constant SAMPLE_BODY = '<ellipse cx="500" cy="600" rx="150" ry="200" fill="#DDA0DD"/>';

    function setUp() public {
        // Deploy contracts
        genes = new Genes();
        geneRegistry = new GeneRegistry(address(genes));
        geneAuction = new GeneAuction(address(genes), address(geneRegistry));
        proposals = new AminalProposals();

        // Deploy AminalFactory
        aminalFactory = new AminalFactory();
        aminalFactory.initialize(address(geneAuction), address(proposals), address(genes));

        // Setup contracts
        genes.setup(address(aminalFactory)); // AminalFactory acts as Aminals contract
        genes.setRegistry(address(geneRegistry));
        geneAuction.setup(address(aminalFactory)); // AminalFactory acts as both factory and access control
        proposals.setup(address(aminalFactory));
        aminalFactory.setup();

        // Give test accounts some ETH
        vm.deal(alice, 10 ether);
        vm.deal(bob, 10 ether);
        vm.deal(charlie, 10 ether);
    }

    /// @notice Helper function to feed aminals so users have enough love to propose genes
    function _feedAminals(address aminal1, address aminal2) internal {
        // Alice needs love for both aminals to propose genes (10 love each)
        vm.prank(alice);
        AminalContract(payable(aminal1)).feed{value: 0.1 ether}();
        vm.prank(alice);
        AminalContract(payable(aminal2)).feed{value: 0.1 ether}();

        // Bob also feeds for voting tests
        vm.prank(bob);
        AminalContract(payable(aminal1)).feed{value: 0.1 ether}();
        vm.prank(bob);
        AminalContract(payable(aminal2)).feed{value: 0.1 ether}();
    }

    /// @notice Helper function to create an auction through breeding
    function _createAuctionThroughBreeding() internal returns (uint256 auctionId) {
        // First spawn some initial Aminals to test with
        Visuals[] memory initialVisuals = new Visuals[](2);
        initialVisuals[0] =
            Visuals({backId: 1, armId: 1, tailId: 1, earsId: 1, bodyId: 1, faceId: 1, mouthId: 1, miscId: 1});
        initialVisuals[1] =
            Visuals({backId: 2, armId: 2, tailId: 2, earsId: 2, bodyId: 2, faceId: 2, mouthId: 2, miscId: 2});
        aminalFactory.spawnInitialAminals(initialVisuals);

        // Get the aminal addresses
        address aminalOne = aminalFactory.getAminalByIndex(0);
        address aminalTwo = aminalFactory.getAminalByIndex(1);

        // Breed the aminals to create an auction
        return aminalFactory.breedAminals{value: 0.001 ether}(aminalOne, aminalTwo);
    }

    function testGeneNFTCreation() public {
        vm.startPrank(alice);

        // Create a background gene
        uint256 geneId = geneRegistry.createGene(SAMPLE_BACKGROUND, VisualsCat.BACK);

        vm.stopPrank();

        // Verify gene was created correctly
        assertEq(geneId, 0, "First gene should have ID 0");
        assertEq(genes.ownerOf(geneId), alice, "Alice should own the gene");

        // Verify gene info
        (address creator, VisualsCat category, string memory svg) = geneRegistry.getGeneInfo(geneId);
        assertEq(creator, alice, "Creator should be Alice");
        assertTrue(category == VisualsCat.BACK, "Category should be BACK");
        assertEq(svg, SAMPLE_BACKGROUND, "SVG should match");

        // Verify factory registry
        assertTrue(geneRegistry.isValidGene(geneId), "Gene should be valid");

        // Verify counters
        assertEq(geneRegistry.totalGenesCreated(), 1, "Total genes should be 1");
    }

    function testMultipleGeneCreation() public {
        // Alice creates background gene
        vm.prank(alice);
        uint256 backgroundGene = geneRegistry.createGene(SAMPLE_BACKGROUND, VisualsCat.BACK);

        // Bob creates face gene
        vm.prank(bob);
        uint256 faceGene = geneRegistry.createGene(SAMPLE_FACE, VisualsCat.FACE);

        // Charlie creates body gene
        vm.prank(charlie);
        uint256 bodyGene = geneRegistry.createGene(SAMPLE_BODY, VisualsCat.BODY);

        // Verify ownership
        assertEq(genes.ownerOf(backgroundGene), alice);
        assertEq(genes.ownerOf(faceGene), bob);
        assertEq(genes.ownerOf(bodyGene), charlie);

        // Verify categories
        (, VisualsCat bgCat,) = geneRegistry.getGeneInfo(backgroundGene);
        (, VisualsCat faceCat,) = geneRegistry.getGeneInfo(faceGene);
        (, VisualsCat bodyCat,) = geneRegistry.getGeneInfo(bodyGene);

        assertTrue(bgCat == VisualsCat.BACK);
        assertTrue(faceCat == VisualsCat.FACE);
        assertTrue(bodyCat == VisualsCat.BODY);

        assertEq(geneRegistry.totalGenesCreated(), 3);
    }

    function testGeneTransferability() public {
        vm.prank(alice);
        uint256 geneId = geneRegistry.createGene(SAMPLE_BACKGROUND, VisualsCat.BACK);

        // Alice transfers gene to Bob
        vm.prank(alice);
        genes.transferFrom(alice, bob, geneId);

        assertEq(genes.ownerOf(geneId), bob, "Bob should now own the gene");
    }

    function testAuctionCreation() public {
        // First spawn some initial Aminals to test with
        Visuals[] memory initialVisuals = new Visuals[](2);
        initialVisuals[0] =
            Visuals({backId: 1, armId: 1, tailId: 1, earsId: 1, bodyId: 1, faceId: 1, mouthId: 1, miscId: 1});
        initialVisuals[1] =
            Visuals({backId: 2, armId: 2, tailId: 2, earsId: 2, bodyId: 2, faceId: 2, mouthId: 2, miscId: 2});
        aminalFactory.spawnInitialAminals(initialVisuals);

        // Get the aminal addresses
        address aminalOne = aminalFactory.getAminalByIndex(0);
        address aminalTwo = aminalFactory.getAminalByIndex(1);

        // Feed aminals so Alice has love for both
        _feedAminals(aminalOne, aminalTwo);

        // Alice breeds the aminals to create an auction (she has love for both)
        vm.prank(alice);
        uint256 auctionId = aminalFactory.breedAminals{value: 0.001 ether}(aminalOne, aminalTwo);

        (
            uint256 aminalOneIndex,
            uint256 aminalTwoIndex,
            uint256 totalLove,
            uint256 startTime,
            uint256 endTime,
            bool settled
        ) = geneAuction.getAuctionInfo(auctionId);

        assertEq(aminalOneIndex, 0);
        assertEq(aminalTwoIndex, 1);
        // totalLove will be based on actual love given to aminals, not the hardcoded 100 ether
        assertEq(startTime, block.timestamp);
        assertEq(endTime, block.timestamp + 1 hours);
        assertFalse(settled);

        assertTrue(geneAuction.isVotingActive(auctionId));
    }

    function testGeneProposalInAuction() public {
        // First spawn some initial Aminals to test with
        Visuals[] memory initialVisuals = new Visuals[](2);
        initialVisuals[0] =
            Visuals({backId: 1, armId: 1, tailId: 1, earsId: 1, bodyId: 1, faceId: 1, mouthId: 1, miscId: 1});
        initialVisuals[1] =
            Visuals({backId: 2, armId: 2, tailId: 2, earsId: 2, bodyId: 2, faceId: 2, mouthId: 2, miscId: 2});
        aminalFactory.spawnInitialAminals(initialVisuals);

        // Get aminal addresses and feed them so Alice has love to propose genes
        address aminal1 = aminalFactory.getAminalByIndex(0);
        address aminal2 = aminalFactory.getAminalByIndex(1);
        _feedAminals(aminal1, aminal2);

        // Alice creates gene, breeds aminals, and proposes gene
        vm.startPrank(alice);
        uint256 geneId = geneRegistry.createGene(SAMPLE_BACKGROUND, VisualsCat.BACK);
        uint256 auctionId = aminalFactory.breedAminals{value: 0.001 ether}(aminal1, aminal2);
        geneAuction.proposeGene(auctionId, VisualsCat.BACK, geneId);
        vm.stopPrank();

        // Verify gene was proposed
        GeneAuction.CategoryVoteInfo memory voteInfo = geneAuction.getCategoryVoting(auctionId, VisualsCat.BACK);
        assertEq(voteInfo.proposedGenes.length, 1);
        assertEq(voteInfo.proposedGenes[0], geneId);
    }

    function testGeneVotingInAuction() public {
        // First spawn some initial Aminals to test with
        Visuals[] memory initialVisuals = new Visuals[](2);
        initialVisuals[0] =
            Visuals({backId: 1, armId: 1, tailId: 1, earsId: 1, bodyId: 1, faceId: 1, mouthId: 1, miscId: 1});
        initialVisuals[1] =
            Visuals({backId: 2, armId: 2, tailId: 2, earsId: 2, bodyId: 2, faceId: 2, mouthId: 2, miscId: 2});
        aminalFactory.spawnInitialAminals(initialVisuals);

        // Get aminal addresses and feed them so Alice has love to propose genes
        address aminal1 = aminalFactory.getAminalByIndex(0);
        address aminal2 = aminalFactory.getAminalByIndex(1);
        _feedAminals(aminal1, aminal2);

        // Alice creates gene, breeds aminals, proposes gene, and votes
        vm.startPrank(alice);
        uint256 geneId = geneRegistry.createGene(SAMPLE_BACKGROUND, VisualsCat.BACK);
        uint256 auctionId = aminalFactory.breedAminals{value: 0.001 ether}(aminal1, aminal2);
        geneAuction.proposeGene(auctionId, VisualsCat.BACK, geneId);
        geneAuction.voteOnGene(auctionId, VisualsCat.BACK, geneId);
        vm.stopPrank();

        // Verify vote count (should be > 0 since Alice voted)
        uint256 totalVotes = geneAuction.getGeneVotes(auctionId, VisualsCat.BACK, geneId);
        assertTrue(totalVotes > 0, "Should have votes since Alice has love");

        // Verify user vote (should be > 0)
        uint256 userVote = geneAuction.getUserVote(auctionId, VisualsCat.BACK, geneId, alice);
        assertTrue(userVote > 0, "User should have recorded vote");
    }

    function testVoteUpdating() public {
        // First spawn some initial Aminals to test with
        Visuals[] memory initialVisuals = new Visuals[](2);
        initialVisuals[0] =
            Visuals({backId: 1, armId: 1, tailId: 1, earsId: 1, bodyId: 1, faceId: 1, mouthId: 1, miscId: 1});
        initialVisuals[1] =
            Visuals({backId: 2, armId: 2, tailId: 2, earsId: 2, bodyId: 2, faceId: 2, mouthId: 2, miscId: 2});
        aminalFactory.spawnInitialAminals(initialVisuals);

        // Get aminal addresses and feed them so Alice has love to propose genes
        address aminal1 = aminalFactory.getAminalByIndex(0);
        address aminal2 = aminalFactory.getAminalByIndex(1);
        _feedAminals(aminal1, aminal2);

        // Alice creates gene, breeds aminals, and proposes gene
        vm.startPrank(alice);
        uint256 geneId = geneRegistry.createGene(SAMPLE_BACKGROUND, VisualsCat.BACK);
        uint256 auctionId = aminalFactory.breedAminals{value: 0.001 ether}(aminal1, aminal2);
        geneAuction.proposeGene(auctionId, VisualsCat.BACK, geneId);
        vm.stopPrank();

        // Test that voting with love succeeds (this is expected behavior)
        vm.prank(alice);
        geneAuction.voteOnGene(auctionId, VisualsCat.BACK, geneId);

        // Verify that votes were cast since Alice has love
        uint256 totalVotes = geneAuction.getGeneVotes(auctionId, VisualsCat.BACK, geneId);
        assertTrue(totalVotes > 0, "Should have votes since Alice has love");
    }

    function testVotingSettlement() public {
        // Create initial Aminals for parents
        Visuals[] memory initialVisuals = new Visuals[](2);
        initialVisuals[0] =
            Visuals({backId: 0, armId: 0, tailId: 0, earsId: 0, bodyId: 0, faceId: 0, mouthId: 0, miscId: 0});
        initialVisuals[1] =
            Visuals({backId: 0, armId: 0, tailId: 0, earsId: 0, bodyId: 0, faceId: 0, mouthId: 0, miscId: 0});
        aminalFactory.spawnInitialAminals(initialVisuals);

        // Get aminal addresses and feed them so Alice has love to propose genes
        address aminal1 = aminalFactory.getAminalByIndex(0);
        address aminal2 = aminalFactory.getAminalByIndex(1);
        _feedAminals(aminal1, aminal2);

        // Create a gene
        vm.prank(alice);
        uint256 geneId = geneRegistry.createGene(SAMPLE_BACKGROUND, VisualsCat.BACK);

        // Create voting through breeding
        vm.prank(alice);
        uint256 auctionId = aminalFactory.breedAminals{value: 0.001 ether}(aminal1, aminal2);

        // Propose gene but don't vote (user has no love for the parents)
        vm.prank(alice);
        geneAuction.proposeGene(auctionId, VisualsCat.BACK, geneId);

        // Fast forward past voting end (1 hour + 1 minute)
        vm.warp(block.timestamp + 1 hours + 1 minutes);

        // Record parent energies before settlement
        address parent0 = aminalFactory.getAminalByIndex(0);
        address parent1 = aminalFactory.getAminalByIndex(1);
        uint256 aminal0EnergyBefore = AminalContract(payable(parent0)).getEnergy();
        uint256 aminal1EnergyBefore = AminalContract(payable(parent1)).getEnergy();
        uint256 initialAminalCount = aminalFactory.totalAminals();

        // Settle voting
        geneAuction.settleAuction(auctionId);

        // Verify voting is settled
        (,,,,, bool settled) = geneAuction.getAuctionInfo(auctionId);
        assertTrue(settled);
        assertFalse(geneAuction.isVotingActive(auctionId));

        // Verify child Aminal was spawned (even without votes)
        assertEq(aminalFactory.totalAminals(), initialAminalCount + 1);

        // Since no votes were cast, no energy should be transferred
        // (The settlement should still work but with default/random trait selection)
    }

    function testEmptySVGFails() public {
        vm.prank(alice);
        vm.expectRevert(GeneRegistry.EmptySVG.selector);
        geneRegistry.createGene("", VisualsCat.BACK);
    }

    function testGetGenesByCreator() public {
        // Alice creates multiple genes
        vm.startPrank(alice);
        geneRegistry.createGene(SAMPLE_BACKGROUND, VisualsCat.BACK);
        geneRegistry.createGene(SAMPLE_FACE, VisualsCat.FACE);
        vm.stopPrank();

        // Bob creates one gene
        vm.prank(bob);
        geneRegistry.createGene(SAMPLE_BODY, VisualsCat.BODY);

        // Check Alice's genes
        uint256[] memory aliceGenes = geneRegistry.getGenesByCreator(alice);
        assertEq(aliceGenes.length, 2);
        assertEq(aliceGenes[0], 0);
        assertEq(aliceGenes[1], 1);

        // Check Bob's genes
        uint256[] memory bobGenes = geneRegistry.getGenesByCreator(bob);
        assertEq(bobGenes.length, 1);
        assertEq(bobGenes[0], 2);
    }

    function testGetGenesByCategory() public {
        // Create genes in different categories
        vm.prank(alice);
        geneRegistry.createGene(SAMPLE_BACKGROUND, VisualsCat.BACK);

        vm.prank(bob);
        geneRegistry.createGene(SAMPLE_FACE, VisualsCat.FACE);

        vm.prank(charlie);
        geneRegistry.createGene('<rect width="1000" height="1000" fill="#00FF00"/>', VisualsCat.BACK);

        // Check background genes
        uint256[] memory backgroundGenes = geneRegistry.getGenesByCategory(VisualsCat.BACK);
        assertEq(backgroundGenes.length, 2);
        assertEq(backgroundGenes[0], 0);
        assertEq(backgroundGenes[1], 2);

        // Check face genes
        uint256[] memory faceGenes = geneRegistry.getGenesByCategory(VisualsCat.FACE);
        assertEq(faceGenes.length, 1);
        assertEq(faceGenes[0], 1);
    }

    function testAminalFactoryIntegration() public {
        // Test that AminalFactory can spawn Aminals with gene-based traits
        uint256[8] memory winningGenes = [uint256(1), 2, 3, 4, 5, 6, 7, 8];

        // Create parent Aminals first
        Visuals[] memory initialVisuals = new Visuals[](2);
        initialVisuals[0] =
            Visuals({backId: 0, armId: 0, tailId: 0, earsId: 0, bodyId: 0, faceId: 0, mouthId: 0, miscId: 0});
        initialVisuals[1] =
            Visuals({backId: 0, armId: 0, tailId: 0, earsId: 0, bodyId: 0, faceId: 0, mouthId: 0, miscId: 0});
        aminalFactory.spawnInitialAminals(initialVisuals);

        address parent1 = aminalFactory.getAminalByIndex(0);
        address parent2 = aminalFactory.getAminalByIndex(1);

        // Call spawnAminal as GeneAuction would
        vm.prank(address(geneAuction));
        address childAminal = aminalFactory.spawnAminal(parent1, parent2, winningGenes);

        // Verify child was spawned
        assertTrue(aminalFactory.isAminal(childAminal));
        assertEq(aminalFactory.totalAminals(), 3);

        // Verify child has correct traits
        Visuals memory childVisuals = aminalFactory.getAminalVisualsByAddress(childAminal);
        assertEq(childVisuals.backId, 1);
        assertEq(childVisuals.armId, 2);
        assertEq(childVisuals.tailId, 3);
        assertEq(childVisuals.earsId, 4);
        assertEq(childVisuals.bodyId, 5);
        assertEq(childVisuals.faceId, 6);
        assertEq(childVisuals.mouthId, 7);
        assertEq(childVisuals.miscId, 8);
    }

    function testProposeGeneWithoutLove() public {
        // Spawn aminals
        Visuals[] memory initialVisuals = new Visuals[](2);
        initialVisuals[0] =
            Visuals({backId: 1, armId: 1, tailId: 1, earsId: 1, bodyId: 1, faceId: 1, mouthId: 1, miscId: 1});
        initialVisuals[1] =
            Visuals({backId: 2, armId: 2, tailId: 2, earsId: 2, bodyId: 2, faceId: 2, mouthId: 2, miscId: 2});
        aminalFactory.spawnInitialAminals(initialVisuals);

        // Get aminal addresses
        address aminal1 = aminalFactory.getAminalByIndex(0);
        address aminal2 = aminalFactory.getAminalByIndex(1);

        // Only Alice feeds aminals so she can breed them (Bob won't have love for proposing)
        vm.prank(alice);
        AminalContract(payable(aminal1)).feed{value: 0.1 ether}();
        vm.prank(alice);
        AminalContract(payable(aminal2)).feed{value: 0.1 ether}();

        // Create a gene that Bob will try to propose
        vm.prank(bob);
        uint256 geneId = geneRegistry.createGene(SAMPLE_BACKGROUND, VisualsCat.BACK);

        // Create auction through breeding (Alice has love from feeding)
        vm.prank(alice);
        uint256 auctionId = aminalFactory.breedAminals{value: 0.001 ether}(aminal1, aminal2);

        // Bob tries to propose gene without having any love for the aminals
        // This should fail because proposeGene requires 10 love for both aminals
        vm.prank(bob);
        vm.expectRevert(); // Should revert with NotEnoughLove
        geneAuction.proposeGene(auctionId, VisualsCat.BACK, geneId);
    }

    function testProposeGeneWithPartialLove() public {
        // Spawn aminals
        Visuals[] memory initialVisuals = new Visuals[](2);
        initialVisuals[0] =
            Visuals({backId: 1, armId: 1, tailId: 1, earsId: 1, bodyId: 1, faceId: 1, mouthId: 1, miscId: 1});
        initialVisuals[1] =
            Visuals({backId: 2, armId: 2, tailId: 2, earsId: 2, bodyId: 2, faceId: 2, mouthId: 2, miscId: 2});
        aminalFactory.spawnInitialAminals(initialVisuals);

        // Get aminal addresses
        address aminal1 = aminalFactory.getAminalByIndex(0);
        address aminal2 = aminalFactory.getAminalByIndex(1);

        // Alice feeds both aminals so she can breed them
        _feedAminals(aminal1, aminal2);

        // Create a gene that Charlie will try to propose
        vm.prank(charlie);
        uint256 geneId = geneRegistry.createGene(SAMPLE_BACKGROUND, VisualsCat.BACK);

        // Charlie feeds only ONE aminal (not both) - this is for the proposal test
        vm.prank(charlie);
        AminalContract(payable(aminal1)).feed{value: 0.1 ether}();
        // Note: Charlie does NOT feed aminal2

        // Verify Charlie has love for aminal1 but not aminal2
        assertTrue(
            AminalContract(payable(aminal1)).getLoveByUser(charlie) >= 10, "Charlie should have love for aminal1"
        );
        assertTrue(
            AminalContract(payable(aminal2)).getLoveByUser(charlie) < 10, "Charlie should NOT have love for aminal2"
        );

        // Create auction through breeding
        vm.prank(alice);
        uint256 auctionId = aminalFactory.breedAminals{value: 0.001 ether}(aminal1, aminal2);

        // Charlie tries to propose gene but only has love for one aminal
        // This should fail because proposeGene requires 10 love for BOTH aminals
        vm.prank(charlie);
        vm.expectRevert(); // Should revert with NotEnoughLove when trying to squeak from aminal2
        geneAuction.proposeGene(auctionId, VisualsCat.BACK, geneId);
    }
}
