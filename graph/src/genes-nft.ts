import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
  Genes as GenesContract,
  Transfer as TransferEvent,
} from "../generated/Genes/Genes";
import { GeneNFT, User } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  log.info(
    "Gene NFT Transfer event - from: {}, to: {}, tokenId: {}, contract: {}",
    [
      event.params.from.toHexString(),
      event.params.to.toHexString(),
      event.params.tokenId.toString(),
      event.address.toHexString(),
    ]
  );

  // Handle mint events (from address zero) for genesis genes or direct mints
  if (event.params.from.equals(Address.zero())) {
    log.info("Processing mint event for token ID {} from Genes contract", [
      event.params.tokenId.toString(),
    ]);

    // Check if this gene already exists (created by GeneCreated event)
    let geneNFTId = event.address.concat(
      Bytes.fromI32(event.params.tokenId.toI32())
    );
    
    let existingGene = GeneNFT.load(geneNFTId);
    if (existingGene) {
      log.info("Gene NFT already exists for token ID {} - skipping mint event", [
        event.params.tokenId.toString(),
      ]);
      return;
    }

    // Create new GeneNFT entity for genesis genes or direct mints
    let geneNFT = new GeneNFT(geneNFTId);
    geneNFT.tokenId = event.params.tokenId;

    // Get contract to read metadata
    let contract = GenesContract.bind(event.address);

    // Try to get gene info (svg and category)
    let geneInfoResult = contract.try_getGeneInfo(event.params.tokenId);
    if (!geneInfoResult.reverted) {
      geneNFT.traitType = geneInfoResult.value.value1; // category
      geneNFT.svg = geneInfoResult.value.value0; // svg
      log.info("Gene NFT metadata loaded - traitType: {}, svg length: {}", [
        geneInfoResult.value.value1.toString(),
        geneInfoResult.value.value0.length.toString(),
      ]);
    } else {
      geneNFT.traitType = 0; // Default to BACK trait
      geneNFT.svg = "";
      log.warning("Failed to load gene info for token ID {}", [
        event.params.tokenId.toString(),
      ]);
    }

    // Set metadata fields
    geneNFT.name = "Aminal Gene #" + event.params.tokenId.toString();
    geneNFT.description = "A gene NFT representing a trait for Aminals";

    // Set creator and owner (minter)
    let creator = User.load(event.params.to);
    if (!creator) {
      creator = new User(event.params.to);
      creator.address = event.params.to;
      creator.save();
    }
    geneNFT.creator = creator.id;
    geneNFT.owner = creator.id;
    
    // Initialize earnings tracking
    geneNFT.totalEarnings = BigInt.fromI32(0);

    // Creation info
    geneNFT.blockNumber = event.block.number;
    geneNFT.blockTimestamp = event.block.timestamp;
    geneNFT.transactionHash = event.transaction.hash;

    geneNFT.save();

    log.info("Genesis Gene NFT created: token ID {} with composite ID {} to {}", [
      event.params.tokenId.toString(),
      geneNFTId.toHexString(),
      event.params.to.toHexString(),
    ]);
    
    return;
  }

  // This is a transfer event - update owner
  let geneNFT = GeneNFT.load(
    event.address.concat(Bytes.fromI32(event.params.tokenId.toI32()))
  );

  if (geneNFT) {
    // Create or load new owner
    let newOwner = User.load(event.params.to);
    if (!newOwner) {
      newOwner = new User(event.params.to);
      newOwner.address = event.params.to;
      newOwner.save();
    }

    geneNFT.owner = newOwner.id;
    geneNFT.save();

    log.info("Gene NFT transferred: token ID {} from {} to {}", [
      event.params.tokenId.toString(),
      event.params.from.toHexString(),
      event.params.to.toHexString(),
    ]);
  } else {
    log.error("Gene NFT not found for transfer: token ID {}", [
      event.params.tokenId.toString(),
    ]);
  }
}
