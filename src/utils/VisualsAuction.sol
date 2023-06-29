// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "../IAminal.sol";
import "../Aminals.sol";
import "./VisualsRegistry.sol";

contract VisualsAuction is IAminal {
    Aminals public aminals;
    VisualsRegistry public vRegistry;

    constructor(address _aminals, address _registry) {
        // TODO: Replace with Aminals contract address
        aminals = Aminals(_aminals);
        vRegistry = VisualsRegistry(_registry);
    }

    // TODO: Maintain an index of pending Aminals based on breeding in progress
    mapping(uint256 auctionId => Auction auction) public auctions;
    uint256 auctionCnt = 2; // assuming there are only 2 initially deployed aminals

    struct Auction {
        uint256 aminalIdOne;
        uint256 aminalIdTwo;
        uint256 totalLove;
        // Max of 10 trait options can be proposed per Aminal. 2 slots are used
        // by the Aminals' current trains, and the other 8 slots are used by
        // proposed traits.
        uint256[8][10] visualIds;
        uint256[8][10] visualIdVotes;
        // If 0, auction has not yet concluded
        // The auctionId will be used as the child Aminal's ID
        uint256 childAminalId;
        uint256[8] winnerId;
    }

    function startAuction(uint256 aminalIdOne, uint256 aminalIdTwo) public returns (bytes32) {
        // Set the breeding flag on each Aminal
        aminals.addSkill();

        Aminal storage aminalOne;
        Aminal storage aminalTwo;
        Visuals memory visualsOne;
        Visuals memory visualsTwo;

        (aminalOne.momId, aminalOne.dadId, aminalOne.totalLove, aminalOne.energy, aminalOne.breeding, visualsOne) =
            aminals.aminals(aminalIdOne);
        (aminalTwo.momId, aminalTwo.dadId, aminalTwo.totalLove, aminalTwo.energy, aminalTwo.breeding, visualsTwo) =
            aminals.aminals(aminalIdTwo);

        aminalOne.breeding = aminalTwo.breeding = true;

        // initialize the new auction
        // Cannot realistically overflow
        unchecked {
            ++auctionCnt;
        }
        Auction storage auction = auctions[auctionCnt];
        auction.aminalIdOne = aminalIdOne;
        auction.aminalIdTwo = aminalIdTwo;
        auction.totalLove = aminals.getAminalLoveTotal(aminalIdOne) + aminals.getAminalLoveTotal(aminalIdTwo);

        // register the new auction into the global auction registry
        auction.childAminalId = ++auctionCnt;
        auctions[auction.childAminalId] = auction;

        // Loop through each current visual per Aminal and write it to the
        // struct. i.e. Index [N][0] is AminalIdOne's traits, Index [N][1] is
        // AminalIdTwo's traits.

        auction.visualIds[0][0] = visualsOne.bodyId;
        auction.visualIds[0][1] = visualsTwo.bodyId;
        auction.visualIds[1][0] = visualsOne.hatId;
        auction.visualIds[1][1] = visualsTwo.hatId;
        auction.visualIds[2][0] = visualsTwo.eyesId;
        auction.visualIds[2][1] = visualsTwo.eyesId;
        auction.visualIds[3][0] = visualsTwo.mouthId;
        auction.visualIds[3][1] = visualsTwo.mouthId;
        auction.visualIds[4][0] = visualsTwo.noseId;
        auction.visualIds[4][1] = visualsTwo.noseId;
        auction.visualIds[5][0] = visualsTwo.limbsId;
        auction.visualIds[5][1] = visualsTwo.limbsId;
        auction.visualIds[6][0] = visualsOne.tailId;
        auction.visualIds[6][1] = visualsTwo.tailId;
        auction.visualIds[7][0] = visualsTwo.miscId;
        auction.visualIds[7][1] = visualsTwo.miscId;
    }

    function proposeVisual(uint256 auctionId, uint256 category, uint256 visualId) public payable {
        // anyone can propose new visuals, but the cost depends on how much they love you in order to avoid ppl from spamming the available slots.abi

        Auction storage auction = auctions[auctionId];

        uint256 priceOne = Aminals.loveDrivenPrice(auction.aminalIdOne, msg.sender);
        uint256 priceTwo = Aminals.loveDrivenPrice(auction.aminalIdTwo, msg.sender);

        uint256 price = priceOne + priceTwo;

        require(msg.value >= price, "Not enough ether to propose a new Visual");

        auction.visualIds[category].push(visualId);
    }

    function voteVisual(uint256 auctionId, uint256 category, uint256 i) public payable {
        Auction storage auction = auctions[auctionId];
        uint256 totallove = aminals.getAminalLoveByIdByUser(auction.aminalIdOne, msg.sender)
            + aminals.getAminalLoveByIdByUser(auction.aminalIdTwo, msg.sender);

        auction.visualIdVotes[category][i] += totallove;
    }

    function removeVisual(uint256 auctionId, uint256 visualId) public payable {
        // the loved ones can vote to remove a trait from the auction
    }

    function endAuction(bytes32 auctionId) public {
        Auction storage auction = auctions[auctionId];

        // loop through all the Visuals and identify the winner;
        uint256[] memory maxVotes;

        for (uint256 i = 0; i < 8; i++) {
            uint256[] memory arrVisuals = auction.visualIds[i];

            for (uint256 j = 0; j < arrVisuals.length(); j++) {
                if (arrVisuals[i][j] > maxVotes[i]) {
                    maxVotes[i] = arrVisuals[i][j];
                    auction.winnerId[i] = j;
                }
            }
        }
    }
}
