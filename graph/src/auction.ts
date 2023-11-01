import { BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { Aminals as AminalsContract } from "../generated/Aminals/Aminals";
import {
  EndAuction as EndAuctionEvent,
  Initialized as InitializedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  ProposeVisual as ProposeVisualEvent,
  RemoveVisual as RemoveVisualEvent,
  StartAuction as StartAuctionEvent,
  VisualsVote as VisualsVoteEvent
} from "../generated/Auction/Auction";
import {
  Auction,
  EndAuction,
  ProposeVisual,
  RemoveVisual,
  StartAuction,
  VisualsVote,
  Visual
} from "../generated/schema";

export function handleEndAuction(event: EndAuctionEvent): void {
  let entity = new EndAuction(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.aminalIdOne = event.params.aminalIdOne;
  entity.aminalIdTwo = event.params.aminalIdTwo;
  entity.childAminalId = event.params.childAminalId;
  entity.winningIds = event.params.winningIds;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  // TODO fix me when new contract is deployed as events have changed
  // See handleStartAuction
  // Update auction
  let auction = new Auction(Bytes.fromI32(event.params.childAminalId.toI32()));
  if (auction) {
    auction.auctionId = event.params.childAminalId;
    auction.aminalIdOne = event.params.aminalIdOne;
    auction.aminalIdTwo = event.params.aminalIdTwo;
    auction.childAminalId = event.params.childAminalId;
    auction.finished = true;

    auction.save();
  }
}

export function handleProposeVisual(event: ProposeVisualEvent): void {
  let entity = new ProposeVisual(Bytes.fromI32(event.params.visualId.toI32()));
  entity.auctionId = event.params.auctionId;
  entity.sender = event.params.sender;
  entity.visualId = event.params.visualId;
  entity.catEnum = event.params.catEnum;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  // Save Visual
  let visual = new Visual(Bytes.fromI32(event.params.visualId.toI32()));
  let contract = AminalsContract.bind(event.address);
  if (visual) {
    visual.auctionId = event.params.auctionId;
    visual.proposer = event.params.sender;
    visual.visualId = event.params.visualId;
    visual.catEnum = event.params.catEnum;
    visual.loveVote = BigInt.fromI32(0);
    visual.removed = false;
    // TODO getVisuals is not working : (
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
  let entity = new RemoveVisual(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.auctionId = event.params.auctionId;
  entity.sender = event.params.sender;
  entity.visualId = event.params.visualId;
  entity.catEnum = event.params.catEnum;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  // TODO handle remove visual? Is this new proposalId?
}

export function handleStartAuction(event: StartAuctionEvent): void {
  let entity = new StartAuction(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.aminalIdOne = event.params.aminalIdOne;
  entity.aminalIdTwo = event.params.aminalIdTwo;
  entity.childAminalId = event.params.childAminalId;
  entity.totalLove = event.params.totalLove;
  // TODO save viusalIds
  // entity.visualIds = event.params.visualIds;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  // TODO fix when a new contract is deployed, there was a bug in the previously deployed
  // contract where aminoIdOne is the auctionId
  // let auction = new Auction(Bytes.fromI32(event.params.auctionId.toI32()));
  let auction = new Auction(Bytes.fromI32(event.params.aminalIdOne.toI32()));
  if (auction) {
    // TODO fix (see above)
    auction.auctionId = event.params.aminalIdOne;
    auction.aminalIdOne = event.params.aminalIdTwo;
    auction.aminalIdTwo = event.params.childAminalId;
    auction.childAminalId = event.params.aminalIdOne;
    auction.finished = false;

    entity.save();
  }
}

export function handleVisualsVote(event: VisualsVoteEvent): void {
  let entity = new VisualsVote(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.auctionId = event.params.auctionId;
  entity.visualId = event.params.visualId;
  entity.sender = event.params.sender;
  entity.catEnum = event.params.catEnum;
  entity.userLoveVote = event.params.userLoveVote;
  entity.totalLove = event.params.totalLove;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  // TODO check whether this ID is unique across auctions
  // Update visual loveVote
  let visual = Visual.load(Bytes.fromI32(event.params.visualId.toI32()));
  if (visual) {
    visual.loveVote = visual.loveVote + event.params.userLoveVote;

    visual.save();
  }
}
