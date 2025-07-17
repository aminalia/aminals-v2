import { Address, BigInt, Bytes, log, store } from "@graphprotocol/graph-ts";
import {
  AminalFactory as AminalFactoryContract,
  AminalSpawned as AminalSpawnedEvent,
  BreedAminal as BreedAminalEvent,
} from "../generated/AminalFactory/AminalFactory";
import { Aminal as AminalContract } from "../generated/templates/Aminal/Aminal";
import { Aminal as AminalTemplate } from "../generated/templates";
import {
  AminalFactory,
  Aminal,
  BreedAminalEvent as BreedAminal,
  GeneAuction,
  User,
} from "../generated/schema";
import { createAuctionId } from "./gene-auction";

// Helper function to fetch tokenURI for an Aminal
function fetchTokenURI(aminalAddress: Address): string | null {
  let aminalContract = AminalContract.bind(aminalAddress);
  let tokenURIResult = aminalContract.try_tokenURI(BigInt.fromI32(1)); // Aminals use token ID 1

  if (!tokenURIResult.reverted) {
    return tokenURIResult.value;
  } else {
    log.warning("Failed to fetch tokenURI for Aminal {}", [
      aminalAddress.toHexString(),
    ]);
    return null;
  }
}

// Helper function to initialize ETH balance for new Aminals
// Note: New Aminals start with 0 ETH balance
function initializeEthBalance(): BigInt {
  return BigInt.fromI32(0);
}

export function handleAminalSpawned(event: AminalSpawnedEvent): void {
  // Create or load factory entity
  let factory = AminalFactory.load(event.address);
  if (!factory) {
    factory = new AminalFactory(event.address);
    factory.totalAminals = BigInt.fromI32(0);
    factory.initialAminalSpawned = false;

    // Get factory contract to read state
    let factoryContract = AminalFactoryContract.bind(event.address);
    let geneAuctionResult = factoryContract.try_geneAuction();
    let GenesResult = factoryContract.try_genes();
    let loveVRGDAResult = factoryContract.try_loveVRGDA();

    if (!geneAuctionResult.reverted) {
      factory.geneAuction = geneAuctionResult.value;
    } else {
      factory.geneAuction = Bytes.fromHexString(
        "0x0000000000000000000000000000000000000000"
      );
    }

    if (!GenesResult.reverted) {
      factory.genes = GenesResult.value;
    } else {
      factory.genes = Bytes.fromHexString(
        "0x0000000000000000000000000000000000000000"
      );
    }

    if (!loveVRGDAResult.reverted) {
      factory.loveVRGDA = loveVRGDAResult.value;
    } else {
      factory.loveVRGDA = Bytes.fromHexString(
        "0x0000000000000000000000000000000000000000"
      );
    }

    factory.blockNumber = event.block.number;
    factory.blockTimestamp = event.block.timestamp;
    factory.transactionHash = event.transaction.hash;
  }

  // Create new Aminal entity
  let aminal = new Aminal(event.params.child);
  aminal.contractAddress = event.params.child;
  aminal.aminalIndex = factory.totalAminals; // Use current count as index before incrementing
  aminal.factory = factory.id;

  // Update factory stats
  factory.totalAminals = factory.totalAminals.plus(BigInt.fromI32(1));
  factory.save();

  // Set parent relationships from event params
  if (event.params.parentOne != Address.zero()) {
    aminal.parentOne = event.params.parentOne;
  }

  if (event.params.parentTwo != Address.zero()) {
    aminal.parentTwo = event.params.parentTwo;
  }

  // Set auction information
  aminal.auctionId = event.params.auctionId;

  // Set visual traits (Gene NFT IDs) from array
  // Array order: [BACK, ARM, TAIL, EARS, BODY, FACE, MOUTH, MISC]
  aminal.backId = event.params.geneIds[0];
  aminal.armId = event.params.geneIds[1];
  aminal.tailId = event.params.geneIds[2];
  aminal.earsId = event.params.geneIds[3];
  aminal.bodyId = event.params.geneIds[4];
  aminal.faceId = event.params.geneIds[5];
  aminal.mouthId = event.params.geneIds[6];
  aminal.miscId = event.params.geneIds[7];

  // Fetch tokenURI for the Aminal
  let tokenURI = fetchTokenURI(event.params.child);
  if (tokenURI) {
    aminal.tokenURI = tokenURI;
  }

  // Initialize state
  aminal.energy = BigInt.fromI32(50); // Default starting energy
  aminal.totalLove = BigInt.fromI32(0);
  aminal.ethBalance = initializeEthBalance();

  // If this Aminal has parents, update the auction and parent states
  if (
    event.params.parentOne != Address.zero() &&
    event.params.parentTwo != Address.zero()
  ) {
    // Load parent Aminals for any needed updates
    let parent1 = Aminal.load(event.params.parentOne);
    let parent2 = Aminal.load(event.params.parentTwo);

    // Parents are loaded but no longer need breeding status updates
    // since breeding consent system was removed

    // Directly link the auction to the child using the auctionId from the event
    if (event.params.auctionId.gt(BigInt.fromI32(0))) {
      let auctionId = createAuctionId(event.params.auctionId);
      let auction = GeneAuction.load(auctionId);
      if (auction) {
        auction.childAminal = aminal.id;
        auction.save();

        log.info("Updated auction {} with child Aminal {}", [
          auction.auctionId.toString(),
          aminal.id.toHexString(),
        ]);
      } else {
        log.warning("Auction not found for ID: {}", [
          event.params.auctionId.toString(),
        ]);
      }
    }
  }

  // Creation info
  aminal.blockNumber = event.block.number;
  aminal.blockTimestamp = event.block.timestamp;
  aminal.transactionHash = event.transaction.hash;

  aminal.save();

  // Create a data source for this individual Aminal contract
  AminalTemplate.create(event.params.child);

  log.info("New Aminal spawned: {}", [event.params.child.toHexString()]);
}

export function handleBreedAminal(event: BreedAminalEvent): void {
  // Load the Aminal entities
  let aminalOne = Aminal.load(event.params.aminalOne);
  let aminalTwo = Aminal.load(event.params.aminalTwo);

  if (!aminalOne || !aminalTwo) {
    log.error("One or both Aminals not found for breeding event: {} and {}", [
      event.params.aminalOne.toHexString(),
      event.params.aminalTwo.toHexString(),
    ]);
    return;
  }

  // Create breed event entity
  let breedEvent = new BreedAminal(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  breedEvent.aminalOne = aminalOne.id;
  breedEvent.aminalTwo = aminalTwo.id;
  breedEvent.auctionId = event.params.auctionId;

  // Link to auction if one was created
  if (event.params.auctionId.gt(BigInt.fromI32(0))) {
    breedEvent.auction = Bytes.fromI32(event.params.auctionId.toI32());

    // Breeding consent system removed - no status updates needed
  }

  breedEvent.blockNumber = event.block.number;
  breedEvent.blockTimestamp = event.block.timestamp;
  breedEvent.transactionHash = event.transaction.hash;

  breedEvent.save();

  log.info("Breed event created between {} and {} with auction ID {}", [
    event.params.aminalOne.toHexString(),
    event.params.aminalTwo.toHexString(),
    event.params.auctionId.toString(),
  ]);
}
