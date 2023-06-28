// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

contract VisualsAuction {
    // TODO: Maintain an index of pending Aminals based on breeding in progress
    mapping(uint256 auctionId => Auction auction) public auctions;

    struct Auction {
        uint256 aminalIdOne;
        uint256 aminalIdTwo;
        // Max of 10 trait options can be proposed per Aminal. 2 slots are used
        // by the Aminals' current trains, and the other 8 slots are used by
        // proposed traits.
        uint256[8][10] visualIdVotes;
        // If 0, auction has not yet concluded
        // The auctionId will be used as the child Aminal's ID
        uint256 childAminalId;
    }

    function startAuction(uint256 aminalIdOne, uint256 aminalIdTwo) public returns (bytes32) {
        // Set the breeding flag on each Aminal
        // Loop through each current visual per Aminal and write it to the
        // struct. i.e. Index [N][0] is AminalIdOne's traits, Index [N][1] is
        // AminalIdTwo's traits.
        // Then loop through all of Aminal One's proposed traits and write them to the
    }

    function proposeVisual(uint256 auctionId, uint256 visualId) public {}

    function vote(bytes32 auctionId, uint256 visualId, uint256 aminalId) public {}

    function endAuction(bytes32 auctionId) public {}
}
