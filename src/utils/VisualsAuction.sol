// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;


import "../Aminals.sol";
import "./VisualsRegistry.sol";


contract VisualsAuction {

   Aminals public aminals;
   VisualsRegistry vRegistry;

    constructor(address _aminals, address _registry) {
        // TODO: Replace with Aminals contract address
        aminals = Aminals(_aminals);
        vRegistry = _registry;
    }



    // TODO: Maintain an index of pending Aminals based on breeding in progress
    mapping(uint256 auctionId => Auction auction) public auctions;
    uint256 auctionCnt = 2; // assuming there are only 2 initially deployed aminals

    struct Auction {
        uint256 aminalIdOne;
        uint256 aminalIdTwo;
        // Max of 10 trait options can be proposed per Aminal. 2 slots are used
        // by the Aminals' current trains, and the other 8 slots are used by
        // proposed traits.
        uint256[8][10] visualIds;
        uint256[8][10] visualIdVotes;
        // If 0, auction has not yet concluded
        // The auctionId will be used as the child Aminal's ID
        uint256 childAminalId;
    }

    function startAuction(uint256 aminalIdOne, uint256 aminalIdTwo) public returns (bytes32) {
        // Set the breeding flag on each Aminal

        Aminal storage aminalOne = aminals[aminalIdOne];
        Aminal storage aminalTwo = aminals[aminalIdTwo];
        aminalOne.breeding = aminalTwo.breeding = true;

        // initialize the new auction

        VisualsAuction auction = new VisualsAuction();
        auction.aminalIdOne = aminalIdOne;
        auction.aminalIdTwo = aminalIdTwo;

        // register the new auction into the global auction registry
        auction.childAminalId = ++auctionCnt;
        auctions[auction.childAminalId] = auction;


        // Loop through each current visual per Aminal and write it to the
        // struct. i.e. Index [N][0] is AminalIdOne's traits, Index [N][1] is
        // AminalIdTwo's traits.

            auction.visualIds[0][0] = aminalOne.body;
            auction.visualIds[0][1] = aminalTwo.body;
            auction.visualIds[1][0] = aminalOne.hat;
            auction.visualIds[1][1] = aminalTwo.hat;            
            auction.visualIds[2][0] = aminalTwo.eyes;           
            auction.visualIds[2][1] = aminalTwo.eyes;           
            auction.visualIds[3][0] = aminalTwo.mouth;          
            auction.visualIds[3][1] = aminalTwo.mouth;          
            auction.visualIds[4][0] = aminalTwo.nose;           
            auction.visualIds[4][1] = aminalTwo.nose;           
            auction.visualIds[5][0] = aminalTwo.limbs;          
            auction.visualIds[5][1] = aminalTwo.limbs;
            auction.visualIds[6][0] = aminalOne.tail;
            auction.visualIds[6][1] = aminalTwo.tail;           
            auction.visualIds[7][0] = aminalTwo.accessories;    
            auction.visualIds[7][1] = aminalTwo.accessories;            


    function proposeVisual(uint256 auctionId, uint category, uint256 visualId) public payable {

        // anyone can propose new visuals, but the cost depends on how much they love you in order to avoid ppl from spamming the available slots.abi

        Auction auction = auctions[auctionId];

        uint256 priceOne = Aminals.loveDrivenPrice(auction.aminalIdOne, msg.sender);
        uint256 priceTwo = Aminals.loveDrivenPrice(auction.aminalIdTwo, msg.sender);

        uint256 price = priceOne + priceTwo;

        require(msg.value >= price, "Not enough ether to propose a new Visual");

        auction.visualIds[category].push(visualId);

    }

    function removeVisual(uint256 auctionId, uint256 visualId) public payable {
        // the loved ones can vote to remove a trait from the auction

    }

    function vote(bytes32 auctionId, uint256 visualId, uint256 aminalId) public {}

    function endAuction(bytes32 auctionId) public {}
}
