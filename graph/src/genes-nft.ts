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

  // Skip mint events (from address zero) - these are handled by GeneCreated event
  if (event.params.from.equals(Address.zero())) {
    log.info("Skipping mint event for token ID {} - handled by GeneCreated event", [
      event.params.tokenId.toString(),
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
