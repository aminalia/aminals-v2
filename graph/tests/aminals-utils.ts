import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  AddSkillProposal,
  BreedAminal,
  FeedAminal,
  Initialized,
  OwnershipTransferred,
  RemoveSkillProposal,
  SkillAdded,
  SkillRemoved,
  SkillVote,
  SpawnAminal,
  Squeak,
  Transfer
} from "../generated/Aminals/Aminals"

export function createAddSkillProposalEvent(
  aminalId: BigInt,
  proposalId: BigInt,
  skillName: string,
  skillAddress: Address,
  sender: Address
): AddSkillProposal {
  let addSkillProposalEvent = changetype<AddSkillProposal>(newMockEvent())

  addSkillProposalEvent.parameters = new Array()

  addSkillProposalEvent.parameters.push(
    new ethereum.EventParam(
      "aminalId",
      ethereum.Value.fromUnsignedBigInt(aminalId)
    )
  )
  addSkillProposalEvent.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  )
  addSkillProposalEvent.parameters.push(
    new ethereum.EventParam("skillName", ethereum.Value.fromString(skillName))
  )
  addSkillProposalEvent.parameters.push(
    new ethereum.EventParam(
      "skillAddress",
      ethereum.Value.fromAddress(skillAddress)
    )
  )
  addSkillProposalEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return addSkillProposalEvent
}

export function createBreedAminalEvent(
  aminalOne: BigInt,
  aminalTwo: BigInt,
  auctionId: BigInt
): BreedAminal {
  let breedAminalEvent = changetype<BreedAminal>(newMockEvent())

  breedAminalEvent.parameters = new Array()

  breedAminalEvent.parameters.push(
    new ethereum.EventParam(
      "aminalOne",
      ethereum.Value.fromUnsignedBigInt(aminalOne)
    )
  )
  breedAminalEvent.parameters.push(
    new ethereum.EventParam(
      "aminalTwo",
      ethereum.Value.fromUnsignedBigInt(aminalTwo)
    )
  )
  breedAminalEvent.parameters.push(
    new ethereum.EventParam(
      "auctionId",
      ethereum.Value.fromUnsignedBigInt(auctionId)
    )
  )

  return breedAminalEvent
}

export function createFeedAminalEvent(
  aminalId: BigInt,
  sender: Address,
  amount: BigInt,
  love: BigInt,
  totalLove: BigInt,
  energy: BigInt
): FeedAminal {
  let feedAminalEvent = changetype<FeedAminal>(newMockEvent())

  feedAminalEvent.parameters = new Array()

  feedAminalEvent.parameters.push(
    new ethereum.EventParam(
      "aminalId",
      ethereum.Value.fromUnsignedBigInt(aminalId)
    )
  )
  feedAminalEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  feedAminalEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  feedAminalEvent.parameters.push(
    new ethereum.EventParam("love", ethereum.Value.fromUnsignedBigInt(love))
  )
  feedAminalEvent.parameters.push(
    new ethereum.EventParam(
      "totalLove",
      ethereum.Value.fromUnsignedBigInt(totalLove)
    )
  )
  feedAminalEvent.parameters.push(
    new ethereum.EventParam("energy", ethereum.Value.fromUnsignedBigInt(energy))
  )

  return feedAminalEvent
}

export function createInitializedEvent(version: i32): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version))
    )
  )

  return initializedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createRemoveSkillProposalEvent(
  aminalId: BigInt,
  proposalId: BigInt,
  skillAddress: Address,
  sender: Address
): RemoveSkillProposal {
  let removeSkillProposalEvent = changetype<RemoveSkillProposal>(newMockEvent())

  removeSkillProposalEvent.parameters = new Array()

  removeSkillProposalEvent.parameters.push(
    new ethereum.EventParam(
      "aminalId",
      ethereum.Value.fromUnsignedBigInt(aminalId)
    )
  )
  removeSkillProposalEvent.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  )
  removeSkillProposalEvent.parameters.push(
    new ethereum.EventParam(
      "skillAddress",
      ethereum.Value.fromAddress(skillAddress)
    )
  )
  removeSkillProposalEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return removeSkillProposalEvent
}

export function createSkillAddedEvent(
  aminalId: BigInt,
  skillAddress: Address
): SkillAdded {
  let skillAddedEvent = changetype<SkillAdded>(newMockEvent())

  skillAddedEvent.parameters = new Array()

  skillAddedEvent.parameters.push(
    new ethereum.EventParam(
      "aminalId",
      ethereum.Value.fromUnsignedBigInt(aminalId)
    )
  )
  skillAddedEvent.parameters.push(
    new ethereum.EventParam(
      "skillAddress",
      ethereum.Value.fromAddress(skillAddress)
    )
  )

  return skillAddedEvent
}

export function createSkillRemovedEvent(
  aminalId: BigInt,
  skillAddress: Address
): SkillRemoved {
  let skillRemovedEvent = changetype<SkillRemoved>(newMockEvent())

  skillRemovedEvent.parameters = new Array()

  skillRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "aminalId",
      ethereum.Value.fromUnsignedBigInt(aminalId)
    )
  )
  skillRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "skillAddress",
      ethereum.Value.fromAddress(skillAddress)
    )
  )

  return skillRemovedEvent
}

export function createSkillVoteEvent(
  aminalId: BigInt,
  sender: Address,
  proposalId: BigInt,
  yesNo: boolean
): SkillVote {
  let skillVoteEvent = changetype<SkillVote>(newMockEvent())

  skillVoteEvent.parameters = new Array()

  skillVoteEvent.parameters.push(
    new ethereum.EventParam(
      "aminalId",
      ethereum.Value.fromUnsignedBigInt(aminalId)
    )
  )
  skillVoteEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  skillVoteEvent.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  )
  skillVoteEvent.parameters.push(
    new ethereum.EventParam("yesNo", ethereum.Value.fromBoolean(yesNo))
  )

  return skillVoteEvent
}

export function createSpawnAminalEvent(
  aminalId: BigInt,
  mom: BigInt,
  dad: BigInt,
  backId: BigInt,
  armId: BigInt,
  tailId: BigInt,
  earsId: BigInt,
  bodyId: BigInt,
  faceId: BigInt,
  mouthId: BigInt,
  miscId: BigInt
): SpawnAminal {
  let spawnAminalEvent = changetype<SpawnAminal>(newMockEvent())

  spawnAminalEvent.parameters = new Array()

  spawnAminalEvent.parameters.push(
    new ethereum.EventParam(
      "aminalId",
      ethereum.Value.fromUnsignedBigInt(aminalId)
    )
  )
  spawnAminalEvent.parameters.push(
    new ethereum.EventParam("mom", ethereum.Value.fromUnsignedBigInt(mom))
  )
  spawnAminalEvent.parameters.push(
    new ethereum.EventParam("dad", ethereum.Value.fromUnsignedBigInt(dad))
  )
  spawnAminalEvent.parameters.push(
    new ethereum.EventParam("backId", ethereum.Value.fromUnsignedBigInt(backId))
  )
  spawnAminalEvent.parameters.push(
    new ethereum.EventParam("armId", ethereum.Value.fromUnsignedBigInt(armId))
  )
  spawnAminalEvent.parameters.push(
    new ethereum.EventParam("tailId", ethereum.Value.fromUnsignedBigInt(tailId))
  )
  spawnAminalEvent.parameters.push(
    new ethereum.EventParam("earsId", ethereum.Value.fromUnsignedBigInt(earsId))
  )
  spawnAminalEvent.parameters.push(
    new ethereum.EventParam("bodyId", ethereum.Value.fromUnsignedBigInt(bodyId))
  )
  spawnAminalEvent.parameters.push(
    new ethereum.EventParam("faceId", ethereum.Value.fromUnsignedBigInt(faceId))
  )
  spawnAminalEvent.parameters.push(
    new ethereum.EventParam(
      "mouthId",
      ethereum.Value.fromUnsignedBigInt(mouthId)
    )
  )
  spawnAminalEvent.parameters.push(
    new ethereum.EventParam("miscId", ethereum.Value.fromUnsignedBigInt(miscId))
  )

  return spawnAminalEvent
}

export function createSqueakEvent(
  aminalId: BigInt,
  amount: BigInt,
  energy: BigInt
): Squeak {
  let squeakEvent = changetype<Squeak>(newMockEvent())

  squeakEvent.parameters = new Array()

  squeakEvent.parameters.push(
    new ethereum.EventParam(
      "aminalId",
      ethereum.Value.fromUnsignedBigInt(aminalId)
    )
  )
  squeakEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  squeakEvent.parameters.push(
    new ethereum.EventParam("energy", ethereum.Value.fromUnsignedBigInt(energy))
  )

  return squeakEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  id: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )

  return transferEvent
}
