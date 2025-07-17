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
  GeneNFT,
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

// Gene NFT usage tracking removed for performance optimization

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

  // Set parent addresses directly from event params
  if (event.params.parentOne != Address.zero()) {
    aminal.momAddress = event.params.parentOne;
    aminal.mother = event.params.parentOne;
  }

  if (event.params.parentTwo != Address.zero()) {
    aminal.dadAddress = event.params.parentTwo;
    aminal.father = event.params.parentTwo;
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

  // Gene NFT usage tracking removed for performance optimization
  // This relationship can be queried on-demand if needed
  // let GenesAddress = Address.fromBytes(factory.Genes);
  // let allGeneIds: BigInt[] = [
  //   event.params.backId,
  //   event.params.armId,
  //   event.params.tailId,
  //   event.params.earsId,
  //   event.params.bodyId,
  //   event.params.faceId,
  //   event.params.mouthId,
  //   event.params.miscId
  // ];
  // batchUpdateGeneNFTUsage(GenesAddress, allGeneIds, event.params.child);

  // Fetch tokenURI for the Aminal
  let tokenURI = fetchTokenURI(event.params.child);
  if (tokenURI) {
    aminal.tokenURI = tokenURI;
  }

  // Initialize state
  aminal.energy = BigInt.fromI32(50); // Default starting energy
  aminal.totalLove = BigInt.fromI32(0);
  aminal.breeding = false;

  // If this Aminal has parents, update the auction and parent states
  if (
    event.params.parentOne != Address.zero() &&
    event.params.parentTwo != Address.zero()
  ) {
    // Set breeding to false for parent Aminals since breeding is complete
    let parent1 = Aminal.load(event.params.parentOne);
    let parent2 = Aminal.load(event.params.parentTwo);

    if (parent1) {
      parent1.breeding = false;
      parent1.save();
    }
    if (parent2) {
      parent2.breeding = false;
      parent2.save();
    }

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

    // Set breeding status
    aminalOne.breeding = true;
    aminalTwo.breeding = true;

    aminalOne.save();
    aminalTwo.save();
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
