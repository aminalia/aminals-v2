import {
  Auction,
  EndAuction as EndAuctionEvent,
  Initialized as InitializedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  ProposeVisual as ProposeVisualEvent,
  RemoveVisual as RemoveVisualEvent,
  StartAuction as StartAuctionEvent,
  VisualsVote as VisualsVoteEvent
} from "../generated/Auction/Auction";
import {
  EndAuction,
  ProposeVisual,
  RemoveVisual,
  StartAuction,
  VisualsVote
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
}

export function handleProposeVisual(event: ProposeVisualEvent): void {
  let entity = new ProposeVisual(
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
}

export function handleStartAuction(event: StartAuctionEvent): void {
  let entity = new StartAuction(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.aminalIdOne = event.params.aminalIdOne;
  entity.aminalIdTwo = event.params.aminalIdTwo;
  entity.childAminalId = event.params.childAminalId;
  entity.totalLove = event.params.totalLove;
  entity.visualIds = event.params.visualIds;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
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
}
