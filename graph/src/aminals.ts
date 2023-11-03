import { Bytes } from "@graphprotocol/graph-ts";
import {
  Aminals as AminalsContract,
  AddSkillProposal as AddSkillProposalEvent,
  BreedAminal as BreedAminalEvent,
  FeedAminal as FeedAminalEvent,
  RemoveSkillProposal as RemoveSkillProposalEvent,
  SkillAdded as SkillAddedEvent,
  SkillRemoved as SkillRemovedEvent,
  SkillVote as SkillVoteEvent,
  SpawnAminal as SpawnAminalEvent,
  Squeak as SqueakEvent
} from "../generated/Aminals/Aminals";
import {
  Aminal,
  SkillProposal,
  BreedAminal,
  FeedAminal,
  Skills,
  SkillVote,
  SpawnAminal,
  Squeak
} from "../generated/schema";

export function handleAddSkillProposal(event: AddSkillProposalEvent): void {
  let entity = new SkillProposal(Bytes.fromI32(event.params.aminalId.toI32()));
  entity.aminalId = event.params.aminalId;
  entity.proposalId = event.params.proposalId;
  entity.skillName = event.params.skillName;
  entity.skillAddress = event.params.skillAddress;
  entity.sender = event.params.sender;
  entity.removed = false;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleBreedAminal(event: BreedAminalEvent): void {
  let entity = new BreedAminal(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.aminalOne = event.params.aminalOne;
  entity.aminalTwo = event.params.aminalTwo;
  entity.auctionId = event.params.auctionId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleFeedAminal(event: FeedAminalEvent): void {
  let entity = new FeedAminal(Bytes.fromI32(event.params.aminalId.toI32()));
  entity.aminalId = event.params.aminalId;
  entity.sender = event.params.sender;
  entity.amount = event.params.amount;
  entity.love = event.params.love;
  entity.totalLove = event.params.totalLove;
  entity.energy = event.params.energy;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let aminal = Aminal.load(Bytes.fromI32(event.params.aminalId.toI32()));
  let contract = AminalsContract.bind(event.address);
  if (aminal) {
    aminal.energy = contract.getEnergy(event.params.aminalId);
    aminal.totalLove = contract.getAminalLoveTotal(event.params.aminalId);

    aminal.save();
  }
}

export function handleRemoveSkillProposal(
  event: RemoveSkillProposalEvent
): void {
  let entity = new SkillProposal(Bytes.fromI32(event.params.aminalId.toI32()));
  entity.aminalId = event.params.aminalId;
  entity.proposalId = event.params.proposalId;
  entity.skillAddress = event.params.skillAddress;
  entity.sender = event.params.sender;
  entity.removed = true;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleSkillAdded(event: SkillAddedEvent): void {
  let entity = new Skills(Bytes.fromI32(event.params.aminalId.toI32()));
  entity.aminalId = event.params.aminalId;
  entity.skillAddress = event.params.skillAddress;
  entity.removed = false;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleSkillRemoved(event: SkillRemovedEvent): void {
  let entity = new Skills(Bytes.fromI32(event.params.aminalId.toI32()));
  entity.aminalId = event.params.aminalId;
  entity.skillAddress = event.params.skillAddress;
  entity.removed = true;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleSkillVote(event: SkillVoteEvent): void {
  let entity = new SkillVote(
    event.transaction.hash.concatI32(event.params.aminalId.toI32())
  );
  entity.aminalId = event.params.aminalId;
  entity.sender = event.params.sender;
  entity.proposalId = event.params.proposalId;
  entity.yesNo = event.params.yesNo;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleSpawnAminal(event: SpawnAminalEvent): void {
  let entity = new SpawnAminal(Bytes.fromI32(event.params.aminalId.toI32()));
  entity.aminalId = event.params.aminalId;
  entity.mom = event.params.mom;
  entity.dad = event.params.dad;
  entity.backId = event.params.backId;
  entity.armId = event.params.armId;
  entity.tailId = event.params.tailId;
  entity.earsId = event.params.earsId;
  entity.bodyId = event.params.bodyId;
  entity.faceId = event.params.faceId;
  entity.mouthId = event.params.mouthId;
  entity.miscId = event.params.miscId;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let aminal = new Aminal(Bytes.fromI32(event.params.aminalId.toI32()));
  let contract = AminalsContract.bind(event.address);
  aminal.aminalId = event.params.aminalId;
  aminal.mom = event.params.mom;
  aminal.dad = event.params.dad;
  aminal.tokenUri = contract.tokenURI(event.params.aminalId);
  aminal.energy = contract.getEnergy(event.params.aminalId);
  aminal.totalLove = contract.getAminalLoveTotal(event.params.aminalId);

  aminal.save();
}

export function handleSqueak(event: SqueakEvent): void {
  let entity = new Squeak(Bytes.fromI32(event.params.aminalId.toI32()));
  entity.aminalId = event.params.aminalId;
  entity.amount = event.params.amount;
  entity.energy = event.params.energy;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let aminal = Aminal.load(Bytes.fromI32(event.params.aminalId.toI32()));
  let contract = AminalsContract.bind(event.address);
  if (aminal) {
    aminal.energy = contract.getEnergy(event.params.aminalId);
    aminal.totalLove = contract.getAminalLoveTotal(event.params.aminalId);

    aminal.save();
  }

  entity.save();
}
