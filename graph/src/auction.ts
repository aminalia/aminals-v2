import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { Aminals as AminalsContract } from "../generated/Aminals/Aminals";
import {
  EndAuction as EndAuctionEvent,
  ProposeVisual as ProposeVisualEvent,
  RemoveVisual as RemoveVisualEvent,
  RemoveVisualVote as RemoveVisualVoteEvent,
  StartAuction as StartAuctionEvent,
  VisualsVote as VisualsVoteEvent
} from "../generated/Auction/Auction";
import { store } from "@graphprotocol/graph-ts";

import {
  Auction,
  VisualsVote,
  VisualProposal,
  User
} from "../generated/schema";
import { AMINALS_CONTRACT_ADDRESS } from "./constants";

export function handleEndAuction(event: EndAuctionEvent): void {
  let auction = Auction.load(Bytes.fromI32(event.params.auctionId.toI32()));
  if (auction) {
    auction.auctionId = event.params.childAminalId;
    auction.aminalOne = Bytes.fromI32(event.params.aminalIdOne.toI32());
    auction.aminalTwo = Bytes.fromI32(event.params.aminalIdTwo.toI32());
    auction.childAminalId = event.params.childAminalId;
    auction.finished = true;
    auction.winningIds = event.params.winningIds;

    auction.save();
  }
}

export function handleProposeVisual(event: ProposeVisualEvent): void {
  let user = User.load(Bytes.fromHexString(event.params.sender.toHexString()));
  if (!user) {
    user = new User(Bytes.fromHexString(event.params.sender.toHexString()));
    user.address = event.params.sender;
    user.save();
  }

  let visual = new VisualProposal(
    Bytes.fromI32(event.params.auctionId.toI32())
      .concatI32(event.params.catEnum)
      .concatI32(event.params.visualId.toI32())
  );
  let contract = AminalsContract.bind(
    Address.fromString(AMINALS_CONTRACT_ADDRESS)
  );
  if (visual) {
    visual.auctionId = event.params.auctionId;
    visual.proposer = user.id;
    visual.visualId = event.params.visualId;
    visual.catEnum = event.params.catEnum;
    visual.loveVote = BigInt.zero();
    visual.removeVote = BigInt.zero();
    visual.removed = false;

    visual.blockNumber = event.block.number;
    visual.blockTimestamp = event.block.timestamp;
    visual.transactionHash = event.transaction.hash;

    let callResult = contract.try_getVisuals(
      BigInt.fromI32(event.params.catEnum),
      event.params.visualId
    );
    if (callResult.reverted) {
      visual.svg = "";
      log.info("getVisuals reverted", []);
    } else {
      visual.svg = callResult.value;
    }

    visual.save();
  }
}

export function handleRemoveVisual(event: RemoveVisualEvent): void {
  store.remove(
    "VisualProposal",
    Bytes.fromI32(event.params.auctionId.toI32())
      .concatI32(event.params.catEnum)
      .concatI32(event.params.visualId.toI32())
      .toString()
  );
}

export function handleRemoveVisualVote(event: RemoveVisualVoteEvent): void {
  let vote = new VisualsVote(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  vote.auctionId = event.params.auctionId;
  vote.visualId = event.params.visualId;
  vote.sender = event.params.sender;
  vote.catEnum = event.params.catEnum;
  vote.userLoveVote = event.params.userLoveVote;
  vote.totalLove = event.params.totalLove;
  vote.remove = true;

  vote.blockNumber = event.block.number;
  vote.blockTimestamp = event.block.timestamp;
  vote.transactionHash = event.transaction.hash;

  vote.save();

  // Update visual remove votes
  let visual = VisualProposal.load(
    Bytes.fromI32(event.params.auctionId.toI32())
      .concatI32(event.params.catEnum)
      .concatI32(event.params.visualId.toI32())
  );
  if (visual) {
    visual.removeVote = visual.removeVote + event.params.userLoveVote;

    visual.save();
  }
}

export function handleStartAuction(event: StartAuctionEvent): void {
  let auction = new Auction(Bytes.fromI32(event.params.auctionId.toI32()));
  if (auction) {
    auction.auctionId = event.params.auctionId;
    auction.aminalOne = Bytes.fromI32(event.params.aminalIdOne.toI32());
    auction.aminalTwo = Bytes.fromI32(event.params.aminalIdTwo.toI32());
    auction.childAminalId = event.params.aminalIdOne;
    auction.totalLove = event.params.totalLove;
    auction.finished = false;

    auction.blockNumber = event.block.number;
    auction.blockTimestamp = event.block.timestamp;
    auction.transactionHash = event.transaction.hash;

    auction.save();
  }
}

export function handleVisualsVote(event: VisualsVoteEvent): void {
  let vote = new VisualsVote(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  vote.auctionId = event.params.auctionId;
  vote.visualId = event.params.visualId;
  vote.sender = event.params.sender;
  vote.catEnum = event.params.catEnum;
  vote.userLoveVote = event.params.userLoveVote;
  vote.totalLove = event.params.totalLove;
  vote.remove = false;

  vote.blockNumber = event.block.number;
  vote.blockTimestamp = event.block.timestamp;
  vote.transactionHash = event.transaction.hash;

  vote.save();

  // Update visual loveVote
  let visual = VisualProposal.load(
    Bytes.fromI32(event.params.auctionId.toI32())
      .concatI32(event.params.catEnum)
      .concatI32(event.params.visualId.toI32())
  );
  if (visual) {
    visual.loveVote = visual.loveVote + event.params.userLoveVote;

    visual.save();
  }
}
