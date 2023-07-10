// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/console.sol";
import "forge-std/Test.sol";

import "../IAminalStructs.sol";
import "../Aminals.sol";

contract VisualsAuction is IAminalStructs {
    Aminals public aminals;

    enum VisualsCat {
        BACK,
        ARM,
        TAIL,
        EARS,
        BODY,
        FACE,
        MOUTH,
        MISC
    }

    constructor(address _aminals) {
        // TODO: Replace with Aminals contract address
        aminals = Aminals(_aminals);
        console.log(address(this));
    }

    // TODO: Maintain an index of pending Aminals based on breeding in progress
    mapping(uint256 auctionId => Auction auction) public auctions;
    uint256 public auctionCnt = 2; // assuming there are only 2 initially deployed aminals

    // keep track of who has voted already in a particular auction and category
    // mapping(address voter => uint256[99][8]) visualVoted;
    mapping(address => mapping(uint256 => uint256[8])) internal visualVoted;

    struct Auction {
        uint256 aminalIdOne;
        uint256 aminalIdTwo;
        uint256 totalLove;
        // Max of 10 trait options can be proposed per Aminal. 2 slots are used
        // by the Aminals' current traits, and the other 8 slots are used by
        // proposed traits.
        uint256[8][10] visualIds;
        uint256[8][10] visualIdVotes;
        uint256[8][10] visualNoVotes;
        // If 0, auction has not yet concluded
        // The auctionId will be used as the child Aminal's ID
        uint256 childAminalId;
        uint256[8] winnerId;
        bool ended;
    }

    modifier _onlyAminals() {
        require(msg.sender == address(aminals));
        _;
    }

    modifier _auctionRunning(uint256 auctionID) {
        Auction storage auction = auctions[auctionID];
        require(auction.ended == false);
        _;
    }

    function getAuctionByID(uint256 auctionID) public view returns (Auction memory) {
        return auctions[auctionID];
    }

    // TODO: Add return value of auction ID and also emit events
    function startAuction(uint256 aminalIdOne, uint256 aminalIdTwo) public _onlyAminals returns (uint256) {
        // Set the breeding flag on each Aminal
        //aminals.addSkill();

        Visuals memory visualsOne;
        Visuals memory visualsTwo;

        console.log("Auction starting for pregnancy of ", aminalIdOne, " and ", aminalIdTwo);

        // Get only the Visuals struct from the mapping
        (,,,,, visualsOne) = aminals.aminals(aminalIdOne);
        (,,,,, visualsTwo) = aminals.aminals(aminalIdTwo);

        // Reset breedable variable to zero for both aminals
        aminals.disableBreedable(aminalIdOne, aminalIdTwo);

        // Set breeding flag via a setter
        aminals.setBreeding(aminalIdOne, true);
        aminals.setBreeding(aminalIdTwo, true);

        // initialize the new auction
        // Cannot realistically overflow
        unchecked {
            ++auctionCnt;
        }

        Auction storage auction = auctions[auctionCnt];
        //Auction storage auction;
        auction.aminalIdOne = aminalIdOne;
        auction.aminalIdTwo = aminalIdTwo;
        auction.totalLove = aminals.getAminalLoveTotal(aminalIdOne) + aminals.getAminalLoveTotal(aminalIdTwo);

        // console.log("recording auctions at count ", auctionCnt, "with aminalIdOne = ", aminalIdOne);
        // console.log("resulting in ", auctions[auctionCnt].aminalIdOne);

        // register the new auction into the global auction registry
        auction.childAminalId = auctionCnt;
        auctions[auction.childAminalId] = auction;

        // Loop through each current visual per Aminal and write it to the
        // struct. i.e. Index [N][0] is AminalIdOne's traits, Index [N][1] is
        // AminalIdTwo's traits.

        auction.visualIds[0][0] = visualsOne.backId;
        auction.visualIds[1][0] = visualsTwo.backId;
        auction.visualIds[0][1] = visualsOne.armId;
        auction.visualIds[1][1] = visualsTwo.armId;
        auction.visualIds[0][2] = visualsOne.tailId;
        auction.visualIds[1][2] = visualsTwo.tailId;
        auction.visualIds[0][3] = visualsOne.earsId;
        auction.visualIds[1][3] = visualsTwo.earsId;
        auction.visualIds[0][4] = visualsOne.bodyId;
        auction.visualIds[1][4] = visualsTwo.bodyId;
        auction.visualIds[0][5] = visualsOne.faceId;
        auction.visualIds[1][5] = visualsTwo.faceId;
        auction.visualIds[0][6] = visualsOne.mouthId;
        auction.visualIds[1][6] = visualsTwo.mouthId;
        auction.visualIds[0][7] = visualsOne.miscId;
        auction.visualIds[1][7] = visualsTwo.miscId;

        return auctionCnt;
    }

    function proposeVisual(uint256 auctionId, VisualsCat catEnum, uint256 visualId)
        public
        payable
        _auctionRunning(auctionId)
    {
        // Anyone can propose new visuals, but the cost depends on how much they
        // love you in order to avoid ppl from spamming the available slots.abi

        uint256 category = uint256(catEnum);

        Auction storage auction = auctions[auctionId];

        uint256 priceOne = aminals.loveDrivenPrice(auction.aminalIdOne, msg.sender);
        uint256 priceTwo = aminals.loveDrivenPrice(auction.aminalIdTwo, msg.sender);

        uint256 price = priceOne + priceTwo;

        // console.log("required ether to submit new visual === ", price);
        // console.log("received the following amount === ", msg.value);

        require(msg.value >= price, "Not enough ether to propose a new Visual");

        // This starts at 2 because the first two array values are used by the Aminal's traits
        for (uint256 i = 2; i <= 10; i++) {
            // console.log("Iterating thourgh .... ", i, " . -- where auction.visualsIds cat = ", category);

            // Throw error if visual is not registered because slots are taken up
            if (i == 10) revert("Max 8 proposals allowed per category");

            // Assign visualId if empty slot
            if (auction.visualIds[i][category] == 0) {
                auction.visualIds[i][category] = visualId;
                break;
            }
        }
    }

    function voteVisual(uint256 auctionId, VisualsCat catEnum, uint256 i) public payable _auctionRunning(auctionId) {
        uint256 category = uint256(catEnum);

        Auction storage auction = auctions[auctionId];

        uint256 totallove = aminals.getAminalLoveByIdByUser(auction.aminalIdOne, msg.sender)
            + aminals.getAminalLoveByIdByUser(auction.aminalIdTwo, msg.sender);

        require(
            visualVoted[msg.sender][auctionId][category] < totallove, "Already consumed all of your love with votes"
        );

        console.log("********** a vote has been casted on category: ", category, " /  index: ", i);
        // console.log(" == with weight = ", totallove, " .  on auctionId = ", auctionId);

        auction.visualIdVotes[i][category] += (totallove);

        visualVoted[msg.sender][auctionId][category] = totallove;
    }

    function removeVisual(uint256 auctionId, VisualsCat catEnum, uint256 visualId)
        public
        payable
        _auctionRunning(auctionId)
    {
        uint256 category = uint256(catEnum);

        Auction storage auction = auctions[auctionId];

        uint256 totallove = aminals.getAminalLoveByIdByUser(auction.aminalIdOne, msg.sender)
            + aminals.getAminalLoveByIdByUser(auction.aminalIdTwo, msg.sender);

        require(totallove > 0, "You need love to remove a trait from the auction");

        auction.visualNoVotes[visualId][category] += (totallove);

        console.log("totallove per user = ", totallove, " from msg.sender = ", msg.sender);
        console.log(
            "trying to remove the visual with love: ",
            auction.visualNoVotes[visualId][category],
            " and totallove = ",
            auction.totalLove / 3
        );

        if (auction.visualNoVotes[visualId][category] > auction.totalLove / 3) {
            // a third of lovers has voted to remove the visual trait from the auction
            uint256 k = 0;
            // identify the location of the visualId
            for (uint256 i = 2; i < 10; i++) {
                // start with i=2 because we don't want people to remove the 2 parent's traits
                if (auction.visualIds[i][category] == visualId) {
                    console.log("EQUALITY");
                    k = i;
                    break;
                }
            }

            console.log("REMOVAL......... ", k);

            require(k != 0, "The trait to be removed does not exist in the auction list");

            // Remove the visualId from the auction list
            auction.visualIds[k][category] = 0;
            auction.visualIdVotes[k][category] = 0;
            auction.visualNoVotes[k][category] = 0;
        }
    }

    // TODO limits on when this can be called?
    // TODO generate new aminal?
    function endAuction(uint256 auctionId) public _auctionRunning(auctionId) {
        Auction storage auction = auctions[auctionId];

        // TODO better comment
        // loop through all the Visuals and identify the winner;
        uint256[8] memory maxVotes =
            [uint256(0), uint256(0), uint256(0), uint256(0), uint256(0), uint256(0), uint256(0), uint256(0)];

        for (uint256 i = 0; i < 8; i++) {
            // iterate through each category
            uint256 j;
            for (j = 0; j < 10; j++) {
                console.log("i", i);
                console.log("j", j);
                console.log("visualIds", auction.visualIds[j][i]);
                // Break for loop if no visual ids have been proposed
                if (j >= 2 && auction.visualIds[j][i] == 0) break; // break the loop if the visualId is 0, except if index 0 or 1 (inherited traits)
                console.log("maxVotes", maxVotes[i]);
                console.log("visualIdVotes", auction.visualIdVotes[j][i]);
                // Handle tie
                if (auction.visualIdVotes[j][i] != 0 && auction.visualIdVotes[j][i] == maxVotes[i]) {
                    // Randomly select a winner between the tied proposals
                    uint256 randomness = uint256(keccak256(abi.encodePacked(block.prevrandao, msg.sender, i)));
                    console.log("TIE, randomly choose winner", randomness % 2);
                    if (randomness % 2 == 0) auction.winnerId[i] = auction.visualIds[j][i];
                }
                if (auction.visualIdVotes[j][i] != 0 && auction.visualIdVotes[j][i] > maxVotes[i]) {
                    console.log("jjj = ", j, " for category ", i);
                    maxVotes[i] = auction.visualIdVotes[j][i];
                    auction.winnerId[i] = auction.visualIds[j][i];
                }
            }

            if (maxVotes[i] == 0) {
                uint256 randomness = _random(i, j, 1);
                console.log("random = ", randomness);
                console.log("for length = ", j, "category: ", i);
                auction.winnerId[i] = auction.visualIds[i][randomness];
            }

            auction.ended = true;
        }

        // Zero breeding flag via a setter
        aminals.setBreeding(auction.aminalIdOne, false);
        aminals.setBreeding(auction.aminalIdTwo, false);
    }

    function _random(uint256 i, uint256 maxNumber, uint256 minNumber) internal view returns (uint256 amount) {
        amount = uint256(keccak256(abi.encodePacked(block.prevrandao, msg.sender, i)));
        amount = amount % (maxNumber - minNumber);
        amount = amount + minNumber;
        return amount;
    }
}
