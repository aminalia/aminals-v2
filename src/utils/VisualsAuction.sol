// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/console.sol";
import {Initializable} from "oz/proxy/utils/Initializable.sol";
import {Ownable} from "oz/access/Ownable.sol";
import {IERC20} from "oz/token/ERC20/IERC20.sol";

import {Aminals} from "src/Aminals.sol";
import {IAminalStructs} from "src/IAminalStructs.sol";
import {ProposerNFT} from "src/nft/ProposerNFT.sol";

contract VisualsAuction is IAminalStructs, Initializable, Ownable {
    Aminals public aminals;
    ProposerNFT public proposerNFT;

    address public immutable GENERATOR_SOURCE_CONTRACT;
    address public immutable GENERATOR_SOURCE_BALANCE;

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

    event StartAuction(
        uint256 indexed auctionId,
        uint256 indexed aminalIdOne,
        uint256 indexed aminalIdTwo,
        uint256 totalLove,
        uint256[8][10] visualIds
    );

    event EndAuction(
        uint256 indexed auctionId,
        uint256 aminalIdOne,
        uint256 aminalIdTwo,
        uint256 childAminalId,
        uint256[8] winningIds
    );

    event ProposeVisual(uint256 indexed auctionId, address sender, uint256 visualId, VisualsCat catEnum);

    event RemoveVisual(uint256 indexed auctionId, address sender, uint256 visualId, VisualsCat catEnum);

    event VisualsVote(
        uint256 indexed auctionId,
        uint256 visualId,
        address sender,
        VisualsCat catEnum,
        uint256 userLoveVote,
        uint256 totalLove
    );

    event RemoveVisualVote(
        uint256 indexed auctionId,
        uint256 visualId,
        address sender,
        VisualsCat catEnum,
        uint256 userLoveVote,
        uint256 totalLove
    );

    constructor(address _generatornessSourceContract, address _generatornessSourceBalance) {
        require(_generatornessSourceContract != address(0), "Invalid generator source contract");
        require(_generatornessSourceBalance != address(0), "Invalid generator source balance");
        // Ideally a token that has significant activity in every block.
        GENERATOR_SOURCE_CONTRACT = _generatornessSourceContract;
        GENERATOR_SOURCE_BALANCE = _generatornessSourceBalance;
    }

    function setup(address _aminals) external initializer onlyOwner {
        aminals = Aminals(_aminals);
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

    // Starts a new auction for the pregnancy of two Aminals, returns the auction id
    function startAuction(uint256 aminalIdOne, uint256 aminalIdTwo) public _onlyAminals returns (uint256) {
        Visuals memory visualsOne;
        Visuals memory visualsTwo;

        console.log("Auction starting for pregnancy of ", aminalIdOne, " and ", aminalIdTwo);

        // Get only the Visuals struct from the mapping
        (,,,,,, visualsOne) = aminals.aminals(aminalIdOne);
        (,,,,,, visualsTwo) = aminals.aminals(aminalIdTwo);

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

        console.log("Auction cnt ==", auctionCnt);
        console.log("VisualIds[0[0]] == ", auction.visualIds[0][0]);

        emit StartAuction(auctionCnt, aminalIdOne, aminalIdTwo, auction.totalLove, auction.visualIds);

        return auctionCnt;
    }

    // Proposes a new visual trait, only callable if the auction is running.
    //
    // Anyone can propose new visuals, but the cost depends on how much they
    // love you in order to avoid ppl from spamming the available slots.abi
    function proposeVisual(uint256 auctionId, VisualsCat catEnum, uint256 visualId)
        public
        payable
        _auctionRunning(auctionId)
    {
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

        emit ProposeVisual(auctionId, msg.sender, visualId, catEnum);
    }

    function voteVisual(uint256 auctionId, VisualsCat catEnum, uint256 visualId)
        public
        payable
        _auctionRunning(auctionId)
    {
        uint256 category = uint256(catEnum);

        Auction storage auction = auctions[auctionId];

        uint256 userlove = aminals.getAminalLoveByIdByUser(auction.aminalIdOne, msg.sender);
        uint256 totallove = userlove + aminals.getAminalLoveByIdByUser(auction.aminalIdTwo, msg.sender);

        require(
            visualVoted[msg.sender][auctionId][category] < totallove, "Already consumed all of your love with votes"
        );

        console.log("********** a vote has been casted on category: ", category, " /  iD: ", visualId);
        // console.log(" == with weight = ", totallove, " .  on auctionId = ", auctionId);

        // find the index for the submitted Visual ID
        uint256 k = 10;
        for (uint256 i = 0; i < 10; i++) {
            if (auction.visualIds[i][category] == visualId) {
                k = i;
                break;
            }
        }

        console.log("*************************************************** K = ", k);

        require(k < 10, "Cannot vote on a trait that is not part of the auction");

        auction.visualIdVotes[k][category] += (totallove);
        visualVoted[msg.sender][auctionId][category] = totallove;

        emit VisualsVote(auctionId, visualId, msg.sender, catEnum, userlove, totallove);
    }

    function removeVisual(uint256 auctionId, VisualsCat catEnum, uint256 visualId)
        public
        payable
        _auctionRunning(auctionId)
    {
        uint256 category = uint256(catEnum);

        Auction storage auction = auctions[auctionId];

        uint256 userlove = aminals.getAminalLoveByIdByUser(auction.aminalIdOne, msg.sender);
        uint256 totallove = userlove + aminals.getAminalLoveByIdByUser(auction.aminalIdTwo, msg.sender);

        require(totallove > 0, "You need love to remove a trait from the auction");

        auction.visualNoVotes[visualId][category] += (totallove);

        console.log("totallove per user = ", totallove, " from msg.sender = ", msg.sender);
        console.log(
            "trying to remove the visual with love: ",
            auction.visualNoVotes[visualId][category],
            " and totallove = ",
            auction.totalLove / 3
        );

        emit RemoveVisualVote(auctionId, visualId, msg.sender, catEnum, userlove, totallove);

        if (auction.visualNoVotes[visualId][category] > auction.totalLove / 3) {
            // a third of lovers has voted to remove the visual trait from the auction
            uint256 k = 0;

            // identify the location of the visualId
            for (uint256 i = 2; i < 10; i++) {
                // start with i=2 because we don't want people to remove the 2 parent's traits
                if (auction.visualIds[i][category] == visualId) {
                    k = i;
                    break;
                }
            }

            console.log("REMOVAL......... ", k);

            require(k != 0, "The trait to be removed does not exist in the auction list");

            uint256 j;
            // reset all values, so that new visuals can be submitted
            for (j = k; j < 9 && auction.visualIds[j][category] != 0; j++) {
                // stop at 9 because of the j+1 below
                auction.visualIds[j][category] = auction.visualIds[j + 1][category];
                auction.visualIdVotes[j][category] = auction.visualIdVotes[j + 1][category];
                auction.visualNoVotes[j][category] = auction.visualNoVotes[j + 1][category];
                console.log("current j == ", j);
            }

            console.log("stop removal at ... ", j);

            auction.visualIds[j][category] = 0;
            auction.visualIdVotes[j][category] = 0;
            auction.visualNoVotes[j][category] = 0;

            emit RemoveVisual(auctionId, msg.sender, visualId, catEnum);
        }
    }

    // TODO limits on when this can be called
    function endAuction(uint256 auctionId) public _auctionRunning(auctionId) {
        Auction storage auction = auctions[auctionId];

        console.log("ENDING AUCTION");

        // Initialize maxVotes array with zeros
        uint256[8] memory maxVotes =
            [uint256(0), uint256(0), uint256(0), uint256(0), uint256(0), uint256(0), uint256(0), uint256(0)];

        console.log("ENDING AUCTION");
        console.log("Testing visual id[0[0]] = ", auction.visualIds[0][0]);

        // Loop through all the Visuals and identify the winner;
        for (uint256 i = 0; i < 8; i++) {
            // iterate through each category
            uint256 j;
            for (j = 0; j < 10; j++) {
                // Break the loop if the visualId is 0 (indicates an empty slot).
                // We skip indexes 0 and 1 as they are inherited
                if (j >= 2 && auction.visualIds[j][i] == 0) break;
                // console.log("maxVotes", maxVotes[i]);
                // console.log("visualIdVotes", auction.visualIdVotes[j][i]);

                // Handle tie
                if (auction.visualIdVotes[j][i] != 0 && auction.visualIdVotes[j][i] == maxVotes[i]) {
                    // Randomly select a winner between the tied proposals
                    uint256 randomness = uint256(keccak256(abi.encodePacked(block.prevrandao, msg.sender, i)));
                    console.log("TIE, randomly choose winner", randomness % 2);
                    if (randomness % 2 == 0) auction.winnerId[i] = auction.visualIds[j][i];
                }
                if (auction.visualIdVotes[j][i] != 0 && auction.visualIdVotes[j][i] > maxVotes[i]) {
                    // console.log("jjj = ", j, " for category ", i);
                    maxVotes[i] = auction.visualIdVotes[j][i];
                    auction.winnerId[i] = auction.visualIds[j][i];
                }
            }

            if (maxVotes[i] == 0) {
                uint256 randomness = _generator2(i, j, 1);
                console.log("random = ", randomness);
                console.log("for category: ", i);
                console.log("trait == ", auction.visualIds[randomness][i]);
                auction.winnerId[i] = auction.visualIds[randomness][i];
            }

            auction.ended = true;
        }

        // Zero breeding flag via a setter
        aminals.setBreeding(auction.aminalIdOne, false);
        aminals.setBreeding(auction.aminalIdTwo, false);

        aminals.spawnAminal(
            auction.aminalIdOne,
            auction.aminalIdTwo,
            auction.winnerId[0],
            auction.winnerId[1],
            auction.winnerId[2],
            auction.winnerId[3],
            auction.winnerId[4],
            auction.winnerId[5],
            auction.winnerId[6],
            auction.winnerId[7]
        );

        emit EndAuction(auctionId, auction.aminalIdOne, auction.aminalIdTwo, auction.childAminalId, auction.winnerId);
    }

    // Called generator and not random to make it clear that this is not a
    // secure source of randomness. It's simply better than nothing.
    function _generator(uint256 i, uint256 maxNumber, uint256 minNumber) internal view returns (uint256 amount) {
        amount = uint256(keccak256(abi.encodePacked(block.prevrandao, msg.sender, i)));
        amount = amount % (maxNumber - minNumber);
        amount = amount + minNumber;
        // console.log("random for ", i, " == ", amount);
        return amount;
    }

    // Called generator and not random to make it clear that this is not a
    // secure source of randomness. It's simply better than nothing.
    function _generator2(uint256 i, uint256 maxNumber, uint256 minNumber) private view returns (uint256 amount) {
        bytes32 r = keccak256(
            abi.encodePacked(
                msg.sender,
                tx.gasprice,
                i,
                block.number,
                block.timestamp,
                blockhash(block.number - 1),
                IERC20(GENERATOR_SOURCE_CONTRACT).balanceOf(GENERATOR_SOURCE_BALANCE)
            )
        );
        amount = uint256(r);
        amount = amount % (maxNumber);
        amount = amount + minNumber;
        return amount - 1;
    }
}
