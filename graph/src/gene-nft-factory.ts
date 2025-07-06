import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { GeneCreated as GeneCreatedEvent } from "../generated/GeneRegistry/GeneRegistry";
import { GeneNFT, User } from "../generated/schema";
import { GENES_NFT_ADDRESS } from "./constants";

export function handleGeneCreated(event: GeneCreatedEvent): void {
  // Create or load user (gene creator)
  let user = User.load(event.params.creator);
  if (!user) {
    user = new User(event.params.creator);
    user.address = event.params.creator;
    user.save();
  }

  // Create Gene NFT entity
  // Use Genes contract address + token ID as the entity ID
  let GenesAddress = Address.fromString(GENES_NFT_ADDRESS);
  let geneNFTId = GenesAddress.concat(
    Bytes.fromI32(event.params.geneId.toI32())
  );

  let geneNFT = new GeneNFT(geneNFTId);
  geneNFT.tokenId = event.params.geneId;
  geneNFT.traitType = event.params.category;
  geneNFT.creator = user.id;
  geneNFT.owner = user.id; // Initially owned by creator
  geneNFT.svg = event.params.svg;

  // Set creation info
  geneNFT.blockNumber = event.block.number;
  geneNFT.blockTimestamp = event.block.timestamp;
  geneNFT.transactionHash = event.transaction.hash;

  geneNFT.save();

  log.info("Gene NFT created: {} by {} in category {} with SVG length {}", [
    event.params.geneId.toString(),
    event.params.creator.toHexString(),
    event.params.category.toString(),
    event.params.svg.length.toString(),
  ]);
}
