import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
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

  // Update factory stats
  factory.totalAminals = factory.totalAminals.plus(BigInt.fromI32(1));
  if (event.params.aminalIndex.gt(BigInt.fromI32(0))) {
    factory.initialAminalSpawned = true;
  }
  factory.save();

  // Create new Aminal entity
  let aminal = new Aminal(event.params.aminalAddress);
  aminal.contractAddress = event.params.aminalAddress;
  aminal.aminalIndex = event.params.aminalIndex;
  aminal.factory = factory.id;

  // Set parent addresses and relationships
  if (event.params.mom != BigInt.fromI32(0)) {
    // Load mother by index
    let factoryContract = AminalFactoryContract.bind(event.address);
    let motherAddressResult = factoryContract.try_aminalsByIndex(
      event.params.mom
    );
    if (!motherAddressResult.reverted) {
      aminal.momAddress = motherAddressResult.value;
      aminal.mother = motherAddressResult.value;
    }
  }

  if (event.params.dad != BigInt.fromI32(0)) {
    // Load father by index
    let factoryContract = AminalFactoryContract.bind(event.address);
    let fatherAddressResult = factoryContract.try_aminalsByIndex(
      event.params.dad
    );
    if (!fatherAddressResult.reverted) {
      aminal.dadAddress = fatherAddressResult.value;
      aminal.father = fatherAddressResult.value;
    }
  }

  // Set visual traits (Gene NFT IDs)
  aminal.backId = event.params.backId;
  aminal.armId = event.params.armId;
  aminal.tailId = event.params.tailId;
  aminal.earsId = event.params.earsId;
  aminal.bodyId = event.params.bodyId;
  aminal.faceId = event.params.faceId;
  aminal.mouthId = event.params.mouthId;
  aminal.miscId = event.params.miscId;

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
  // batchUpdateGeneNFTUsage(GenesAddress, allGeneIds, event.params.aminalAddress);

  // Fetch tokenURI for the Aminal
  let tokenURI = fetchTokenURI(event.params.aminalAddress);
  if (tokenURI) {
    aminal.tokenURI = tokenURI;
  }

  // Initialize state
  aminal.energy = BigInt.fromI32(50); // Default starting energy
  aminal.totalLove = BigInt.fromI32(0);
  aminal.breeding = false;

  // Creation info
  aminal.blockNumber = event.block.number;
  aminal.blockTimestamp = event.block.timestamp;
  aminal.transactionHash = event.transaction.hash;

  aminal.save();

  // Create a data source for this individual Aminal contract
  AminalTemplate.create(event.params.aminalAddress);

  log.info("New Aminal spawned: {} at index {}", [
    event.params.aminalAddress.toHexString(),
    event.params.aminalIndex.toString(),
  ]);
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
