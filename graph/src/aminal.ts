import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
  Aminal as AminalContract,
  FeedAminal as FeedAminalEvent,
  Squeak as SqueakEvent,
  SkillUsed as SkillUsedEvent,
  BreedableSet as BreedableSetEvent,
  EnergyLost as EnergyLostEvent
} from "../generated/templates/Aminal/Aminal";
import {
  Aminal,
  FeedAminalEvent as FeedAminal,
  Squeak,
  SkillUsed,
  BreedingConsent,
  GlobalSkill,
  User,
  Relationship
} from "../generated/schema";

export function handleFeedAminal(event: FeedAminalEvent): void {
  // Load the Aminal entity
  let aminal = Aminal.load(event.address);
  if (!aminal) {
    log.error("Aminal not found for feed event: {}", [event.address.toHexString()]);
    return;
  }
  
  // Create or load user
  let user = User.load(event.params.sender);
  if (!user) {
    user = new User(event.params.sender);
    user.address = event.params.sender;
    user.save();
  }
  
  // Create feed event entity
  let feedEvent = new FeedAminal(
    event.transaction.hash.concat(event.address).concatI32(event.logIndex.toI32())
  );
  feedEvent.aminal = aminal.id;
  feedEvent.sender = user.id;
  feedEvent.amount = BigInt.fromI32(0); // ETH amount (not in event params)
  feedEvent.love = event.params.love;
  feedEvent.totalLove = event.params.totalLove; 
  feedEvent.energy = event.params.energy;
  feedEvent.blockNumber = event.block.number;
  feedEvent.blockTimestamp = event.block.timestamp;
  feedEvent.transactionHash = event.transaction.hash;
  feedEvent.save();
  
  // Update Aminal state
  aminal.energy = event.params.energy;
  aminal.totalLove = event.params.totalLove;
  aminal.save();
  
  // Update or create relationship
  let relationshipId = event.params.sender.concat(event.address);
  let relationship = Relationship.load(relationshipId);
  if (!relationship) {
    relationship = new Relationship(relationshipId);
    relationship.user = user.id;
    relationship.aminal = aminal.id;
  }
  relationship.love = event.params.love;
  relationship.save();
  
  log.info("Feed event for Aminal {} by user {} with love {}", [
    event.address.toHexString(),
    event.params.sender.toHexString(),
    event.params.love.toString()
  ]);
}

export function handleSqueak(event: SqueakEvent): void {
  // Load the Aminal entity
  let aminal = Aminal.load(event.address);
  if (!aminal) {
    log.error("Aminal not found for squeak event: {}", [event.address.toHexString()]);
    return;
  }
  
  // Create or load user
  let user = User.load(event.params.sender);
  if (!user) {
    user = new User(event.params.sender);
    user.address = event.params.sender;
    user.save();
  }
  
  // Create squeak event entity
  let squeak = new Squeak(
    event.transaction.hash.concat(event.address).concatI32(event.logIndex.toI32())
  );
  squeak.aminal = aminal.id;
  squeak.sender = user.id;
  squeak.amount = event.params.amount;
  squeak.love = event.params.love;
  squeak.totalLove = event.params.totalLove;
  squeak.energy = event.params.energy;
  squeak.blockNumber = event.block.number;
  squeak.blockTimestamp = event.block.timestamp;
  squeak.transactionHash = event.transaction.hash;
  squeak.save();
  
  // Update Aminal state
  aminal.energy = event.params.energy;
  aminal.totalLove = event.params.totalLove;
  aminal.save();
  
  // Update relationship
  let relationshipId = event.params.sender.concat(event.address);
  let relationship = Relationship.load(relationshipId);
  if (relationship) {
    relationship.love = event.params.love;
    relationship.save();
  }
  
  log.info("Squeak event for Aminal {} by user {} with amount {}", [
    event.address.toHexString(),
    event.params.sender.toHexString(),
    event.params.amount.toString()
  ]);
}

export function handleSkillUsed(event: SkillUsedEvent): void {
  // Load the Aminal entity
  let aminal = Aminal.load(event.address);
  if (!aminal) {
    log.error("Aminal not found for skill used event: {}", [event.address.toHexString()]);
    return;
  }
  
  // Create or load user (caller)
  let caller = event.params.user;
  let user = User.load(caller);
  if (!user) {
    user = new User(caller);
    user.address = caller;
    user.save();
  }
  
  // Create skill used event entity
  let skillUsed = new SkillUsed(
    event.transaction.hash.concat(event.address).concatI32(event.logIndex.toI32())
  );
  skillUsed.aminal = aminal.id;
  skillUsed.caller = user.id;
  skillUsed.skillAddress = event.params.target;
  skillUsed.selector = event.params.selector;
  skillUsed.newEnergy = BigInt.fromI32(0); // This event doesn't contain remaining energy
  skillUsed.blockNumber = event.block.number;
  skillUsed.blockTimestamp = event.block.timestamp;
  skillUsed.transactionHash = event.transaction.hash;
  skillUsed.save();
  
  // Update global skill statistics
  let globalSkill = GlobalSkill.load(event.params.target);
  if (!globalSkill) {
    globalSkill = new GlobalSkill(event.params.target);
    globalSkill.skillAddress = event.params.target;
    globalSkill.callCount = BigInt.fromI32(0);
    globalSkill.totalSqueakCost = BigInt.fromI32(0);
    globalSkill.blockNumber = event.block.number;
    globalSkill.blockTimestamp = event.block.timestamp;
    globalSkill.transactionHash = event.transaction.hash;
  }
  globalSkill.callCount = globalSkill.callCount.plus(BigInt.fromI32(1));
  globalSkill.totalSqueakCost = globalSkill.totalSqueakCost.plus(event.params.cost);
  globalSkill.save();
  
  log.info("Skill used for Aminal {} using skill {} with selector {}", [
    event.address.toHexString(),
    event.params.target.toHexString(),
    event.params.selector.toHexString()
  ]);
}

export function handleBreedableSet(event: BreedableSetEvent): void {
  // Load the Aminal entity
  let aminal = Aminal.load(event.address);
  if (!aminal) {
    log.error("Aminal not found for breedable set event: {}", [event.address.toHexString()]);
    return;
  }
  
  // Load partner Aminal
  let partner = Aminal.load(event.params.partner);
  if (!partner) {
    log.error("Partner Aminal not found for breedable set event: {}", [event.params.partner.toHexString()]);
    return;
  }
  
  // Create or update breeding consent
  let consentId = event.address.concat(event.params.partner);
  let consent = BreedingConsent.load(consentId);
  if (!consent) {
    consent = new BreedingConsent(consentId);
    consent.aminal = aminal.id;
    consent.partner = partner.id;
  }
  consent.consented = event.params.status;
  consent.blockNumber = event.block.number;
  consent.blockTimestamp = event.block.timestamp;
  consent.transactionHash = event.transaction.hash;
  consent.save();
  
  log.info("Breeding consent set for Aminal {} with partner {} to {}", [
    event.address.toHexString(),
    event.params.partner.toHexString(),
    event.params.status.toString()
  ]);
}

export function handleEnergyLost(event: EnergyLostEvent): void {
  // Load the Aminal entity
  let aminal = Aminal.load(event.address);
  if (!aminal) {
    log.error("Aminal not found for energy lost event: {}", [event.address.toHexString()]);
    return;
  }
  
  // Update Aminal energy
  aminal.energy = event.params.remainingEnergy;
  aminal.save();
  
  log.info("Energy lost from Aminal {} - amount {} remaining energy {}", [
    event.address.toHexString(),
    event.params.amount.toString(),
    event.params.remainingEnergy.toString()
  ]);
}