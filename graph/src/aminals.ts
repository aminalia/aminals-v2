import { BigInt, Bytes, log, store } from "@graphprotocol/graph-ts";
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
  Squeak as SqueakEvent,
  TraitAdded as TraitAddedEvent,
} from "../generated/Aminals/Aminals";
import {
  Aminal,
  SkillProposal,
  BreedAminalEvent as BreedAminal,
  FeedAminalEvent as FeedAminal,
  Relationship,
  Skill,
  SkillVote,
  Squeak,
  User,
  Trait,
} from "../generated/schema";

export function handleAddSkillProposal(event: AddSkillProposalEvent): void {
  let entity = new SkillProposal(
    Bytes.fromI32(event.params.aminalId.toI32()).concatI32(
      event.params.proposalId.toI32(),
    ),
  );
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
  // Load aminal entities
  let aminalOne = Aminal.load(Bytes.fromI32(event.params.aminalOne.toI32()));
  let aminalTwo = Aminal.load(Bytes.fromI32(event.params.aminalTwo.toI32()));

  if (aminalOne && aminalTwo) {
    let entity = new BreedAminal(
      event.transaction.hash.concatI32(event.logIndex.toI32()),
    );
    entity.aminalOne = aminalOne.id;
    entity.aminalTwo = aminalTwo.id;
    entity.auctionId = event.params.auctionId;
    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;
    entity.save();

    // If there is a new Auction, we set breeding to true
    if (event.params.auctionId !== BigInt.zero()) {
      aminalOne.breeding = true;
      aminalOne.save();

      aminalTwo.breeding = true;
      aminalTwo.save();
    }
  }
}

export function handleFeedAminal(event: FeedAminalEvent): void {
  let user = User.load(Bytes.fromHexString(event.params.sender.toHexString()));
  if (!user) {
    user = new User(Bytes.fromHexString(event.params.sender.toHexString()));
    user.address = event.params.sender;
    user.save();
  }

  let aminal = Aminal.load(Bytes.fromI32(event.params.aminalId.toI32()));
  let contract = AminalsContract.bind(event.address);

  if (aminal) {
    let entity = new FeedAminal(
      event.transaction.hash.concatI32(event.params.aminalId.toI32()),
    );
    entity.aminal = aminal.id;
    entity.sender = user.id;
    entity.amount = event.params.amount;
    entity.love = event.params.love;
    entity.totalLove = event.params.totalLove;
    entity.energy = event.params.energy;
    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;
    entity.save();

    // Update the aminal's love and energy
    aminal.energy = contract.getEnergy(event.params.aminalId);
    aminal.totalLove = contract.getAminalLoveTotal(event.params.aminalId);

    aminal.save();

    // Update relationship (id is user address + aminal id)
    let relationship = Relationship.load(
      Bytes.fromHexString(event.params.sender.toHexString()).concatI32(
        event.params.aminalId.toI32(),
      ),
    );

    // Create a new relationship if one doesn't exist
    if (!relationship) {
      relationship = new Relationship(
        Bytes.fromHexString(event.params.sender.toHexString()).concatI32(
          event.params.aminalId.toI32(),
        ),
      );
    }

    // Love is the total love for the user
    relationship.aminal = aminal.id;
    relationship.user = user.id;
    relationship.love = event.params.love;
    relationship.save();
  }
}

export function handleRemoveSkillProposal(
  event: RemoveSkillProposalEvent,
): void {
  let entity = new SkillProposal(
    Bytes.fromI32(event.params.aminalId.toI32()).concatI32(
      event.params.proposalId.toI32(),
    ),
  );
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
  let aminal = Aminal.load(Bytes.fromI32(event.params.aminalId.toI32()));
  if (aminal) {
    let skill = new Skill(
      Bytes.fromI32(event.params.aminalId.toI32()).concat(
        Bytes.fromHexString(event.params.skillAddress.toHexString()),
      ),
    );
    skill.aminal = aminal.id;
    skill.skillAddress = event.params.skillAddress;
    skill.removed = false;
    skill.blockNumber = event.block.number;
    skill.blockTimestamp = event.block.timestamp;
    skill.transactionHash = event.transaction.hash;

    skill.save();
  }
}

export function handleSkillRemoved(event: SkillRemovedEvent): void {
  let aminal = Aminal.load(Bytes.fromI32(event.params.aminalId.toI32()));
  let skill = Skill.load(
    Bytes.fromI32(event.params.aminalId.toI32()).concat(
      Bytes.fromHexString(event.params.skillAddress.toHexString()),
    ),
  );
  if (skill && aminal) {
    skill.aminal = aminal.id;
    skill.skillAddress = event.params.skillAddress;
    skill.removed = true;
    skill.blockNumber = event.block.number;
    skill.blockTimestamp = event.block.timestamp;
    skill.transactionHash = event.transaction.hash;

    skill.save();
  }
}

export function handleSkillVote(event: SkillVoteEvent): void {
  let entity = new SkillVote(
    event.transaction.hash.concatI32(event.params.aminalId.toI32()),
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
  let aminal = new Aminal(Bytes.fromI32(event.params.aminalId.toI32()));
  let contract = AminalsContract.bind(event.address);

  aminal.aminalId = event.params.aminalId;
  aminal.mom = event.params.mom;
  aminal.dad = event.params.dad;

  // Use try_tokenURI instead of direct tokenURI call
  let tokenURIResult = contract.try_tokenURI(event.params.aminalId);
  if (!tokenURIResult.reverted) {
    aminal.tokenUri = tokenURIResult.value;
  } else {
    aminal.tokenUri = "";
  }

  // Use try_getEnergy instead of direct getEnergy call
  let energyResult = contract.try_getEnergy(event.params.aminalId);
  if (!energyResult.reverted) {
    aminal.energy = energyResult.value;
  } else {
    aminal.energy = BigInt.fromI32(0);
  }

  // Use try_getAminalLoveTotal instead of direct call
  let loveTotalResult = contract.try_getAminalLoveTotal(event.params.aminalId);
  if (!loveTotalResult.reverted) {
    aminal.totalLove = loveTotalResult.value;
  } else {
    aminal.totalLove = BigInt.fromI32(0);
  }

  aminal.breeding = false;

  // Creation info
  aminal.blockNumber = event.block.number;
  aminal.blockTimestamp = event.block.timestamp;
  aminal.transactionHash = event.transaction.hash;

  // Save the aminal first so it exists for the relationships
  aminal.save();

  function loadTrait(traitId: BigInt, catEnum: i32): Trait | null {
    return Trait.load(
      Bytes.fromI32(traitId.toI32()).concat(Bytes.fromI32(catEnum)),
    );
  }

  // Handle traits
  let traits = [
    loadTrait(event.params.backId, 0),
    loadTrait(event.params.armId, 1),
    loadTrait(event.params.tailId, 2),
    loadTrait(event.params.earsId, 3),
    loadTrait(event.params.bodyId, 4),
    loadTrait(event.params.faceId, 5),
    loadTrait(event.params.mouthId, 6),
    loadTrait(event.params.miscId, 7),
  ];

  for (let i = 0; i < traits.length; i++) {
    let trait = traits[i];
    if (trait != null) {
      trait.aminals = trait.aminals.concat([aminal.id]);
      trait.save();
    }
  }
}

export function handleSqueak(event: SqueakEvent): void {
  let entity = new Squeak(Bytes.fromI32(event.params.aminalId.toI32()));
  entity.aminalId = event.params.aminalId;
  entity.amount = event.params.amount;
  entity.energy = event.params.energy;
  entity.sender = event.params.sender;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let aminal = Aminal.load(Bytes.fromI32(event.params.aminalId.toI32()));
  let contract = AminalsContract.bind(event.address);
  if (aminal) {
    aminal.energy = contract.getEnergy(event.params.aminalId);
    aminal.totalLove = contract.getAminalLoveTotal(event.params.aminalId);

    aminal.save();

    // Load user
    let user = User.load(
      Bytes.fromHexString(event.params.sender.toHexString()),
    );
    if (user) {
      // Update relationship (id is user address + aminal id)
      let relationship = Relationship.load(
        Bytes.fromHexString(event.params.sender.toHexString()).concatI32(
          event.params.aminalId.toI32(),
        ),
      );

      if (relationship) {
        // Love is the total love for the user
        relationship.aminal = aminal.id;
        relationship.user = user.id;
        relationship.love = event.params.love;
        relationship.save();
      }
    }
  }

  entity.save();
}

export function handleTraitAdded(event: TraitAddedEvent): void {
  let trait = new Trait(
    Bytes.fromI32(event.params.visualId.toI32()).concat(
      Bytes.fromI32(event.params.catEnum),
    ),
  );

  trait.visualId = event.params.visualId;
  trait.catEnum = event.params.catEnum;
  trait.svg = event.params.svg;
  let user = User.load(Bytes.fromHexString(event.params.creator.toHexString()));
  if (!user) {
    user = new User(Bytes.fromHexString(event.params.creator.toHexString()));
    user.address = event.params.creator;
    user.save();
  }
  trait.creator = user.id;
  trait.aminals = []; // Initialize with empty array

  trait.save();
}
