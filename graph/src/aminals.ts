import {
  AddSkillProposal as AddSkillProposalEvent,
  BreedAminal as BreedAminalEvent,
  FeedAminal as FeedAminalEvent,
  Initialized as InitializedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  RemoveSkillProposal as RemoveSkillProposalEvent,
  SkillAdded as SkillAddedEvent,
  SkillRemoved as SkillRemovedEvent,
  SkillVote as SkillVoteEvent,
  SpawnAminal as SpawnAminalEvent,
  Squeak as SqueakEvent,
  Transfer as TransferEvent
} from "../generated/Aminals/Aminals"
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
} from "../generated/schema"

export function handleAddSkillProposal(event: AddSkillProposalEvent): void {
  let entity = new AddSkillProposal(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.aminalId = event.params.aminalId
  entity.proposalId = event.params.proposalId
  entity.skillName = event.params.skillName
  entity.skillAddress = event.params.skillAddress
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBreedAminal(event: BreedAminalEvent): void {
  let entity = new BreedAminal(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.aminalOne = event.params.aminalOne
  entity.aminalTwo = event.params.aminalTwo
  entity.auctionId = event.params.auctionId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFeedAminal(event: FeedAminalEvent): void {
  let entity = new FeedAminal(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.aminalId = event.params.aminalId
  entity.sender = event.params.sender
  entity.amount = event.params.amount
  entity.love = event.params.love
  entity.totalLove = event.params.totalLove
  entity.energy = event.params.energy

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.version = event.params.version

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRemoveSkillProposal(
  event: RemoveSkillProposalEvent
): void {
  let entity = new RemoveSkillProposal(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.aminalId = event.params.aminalId
  entity.proposalId = event.params.proposalId
  entity.skillAddress = event.params.skillAddress
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSkillAdded(event: SkillAddedEvent): void {
  let entity = new SkillAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.aminalId = event.params.aminalId
  entity.skillAddress = event.params.skillAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSkillRemoved(event: SkillRemovedEvent): void {
  let entity = new SkillRemoved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.aminalId = event.params.aminalId
  entity.skillAddress = event.params.skillAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSkillVote(event: SkillVoteEvent): void {
  let entity = new SkillVote(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.aminalId = event.params.aminalId
  entity.sender = event.params.sender
  entity.proposalId = event.params.proposalId
  entity.yesNo = event.params.yesNo

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSpawnAminal(event: SpawnAminalEvent): void {
  let entity = new SpawnAminal(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.aminalId = event.params.aminalId
  entity.mom = event.params.mom
  entity.dad = event.params.dad
  entity.backId = event.params.backId
  entity.armId = event.params.armId
  entity.tailId = event.params.tailId
  entity.earsId = event.params.earsId
  entity.bodyId = event.params.bodyId
  entity.faceId = event.params.faceId
  entity.mouthId = event.params.mouthId
  entity.miscId = event.params.miscId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSqueak(event: SqueakEvent): void {
  let entity = new Squeak(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.aminalId = event.params.aminalId
  entity.amount = event.params.amount
  entity.energy = event.params.energy

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.Aminals_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
