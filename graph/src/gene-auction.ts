import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
  GeneAuction as GeneAuctionContract,
  VotingCreated as VotingCreatedEvent,
  VotingSettled as VotingSettledEvent,
  GeneProposed as GeneProposedEvent,
  GeneVoteCast as GeneVoteCastEvent,
  GeneRemovalVote as GeneRemovalVoteEvent,
  GeneRemoved as GeneRemovedEvent,
  BulkVoteCast as BulkVoteCastEvent,
} from "../generated/GeneAuction/GeneAuction";
import { AminalFactory as AminalFactoryContract } from "../generated/AminalFactory/AminalFactory";
import {
  GeneAuction,
  GeneProposal,
  GeneVote,
  GeneNFT,
  Aminal,
  User,
} from "../generated/schema";

// Helper function to create consistent auction ID format
function createAuctionId(auctionId: BigInt): Bytes {
  return Bytes.fromHexString("0x" + (auctionId.toI32() * 0x1000000).toString(16).padStart(8, '0'));
}

// Helper function to create consistent proposal ID format
function createProposalId(auctionId: BigInt, category: i32, geneId: BigInt): Bytes {
  let auctionIdHex = createAuctionId(auctionId);
  return auctionIdHex
    .concatI32(category)
    .concat(Bytes.fromI32(geneId.toI32()));
}

export function handleVotingCreated(event: VotingCreatedEvent): void {
  // Get factory address from event address (the gene auction contract knows the factory)
  // For now, we'll use a known factory address - in production this should be configurable
  let factoryAddress = Address.fromString(
    "0x5dcda867599155a796ff92b39b07fc9f6febe208"
  );

  // Load parent Aminals by index using factory contract
  let aminalOneIndex = event.params.aminalOne;
  let aminalTwoIndex = event.params.aminalTwo;

  // Import and use factory contract to resolve indices to addresses
  let factoryContract = AminalFactoryContract.bind(factoryAddress);

  let aminalOneAddressResult =
    factoryContract.try_aminalsByIndex(aminalOneIndex);
  let aminalTwoAddressResult =
    factoryContract.try_aminalsByIndex(aminalTwoIndex);

  if (aminalOneAddressResult.reverted || aminalTwoAddressResult.reverted) {
    log.error(
      "Failed to resolve Aminal addresses for auction {}: indices {} and {}",
      [
        event.params.auctionId.toString(),
        aminalOneIndex.toString(),
        aminalTwoIndex.toString(),
      ]
    );
    return;
  }

  let aminalOneAddress = aminalOneAddressResult.value;
  let aminalTwoAddress = aminalTwoAddressResult.value;

  // Create auction entity with proper ID format that matches frontend expectations
  let auctionIdHex = createAuctionId(event.params.auctionId);
  let auction = new GeneAuction(auctionIdHex);
  auction.auctionId = event.params.auctionId;
  // Reference Aminal entities by their addresses
  auction.aminalOne = aminalOneAddress;
  auction.aminalTwo = aminalTwoAddress;
  auction.totalLove = event.params.totalLove;
  auction.finished = false;
  auction.blockNumber = event.block.number;
  auction.blockTimestamp = event.block.timestamp;
  auction.transactionHash = event.transaction.hash;
  auction.save();

  log.info(
    "Gene auction created: {} for Aminals {} ({}) and {} ({}) with love {}",
    [
      event.params.auctionId.toString(),
      aminalOneIndex.toString(),
      aminalOneAddress.toHexString(),
      aminalTwoIndex.toString(),
      aminalTwoAddress.toHexString(),
      event.params.totalLove.toString(),
    ]
  );
}

export function handleVotingSettled(event: VotingSettledEvent): void {
  // Load auction entity with proper ID format
  let auctionIdHex = createAuctionId(event.params.auctionId);
  let auction = GeneAuction.load(auctionIdHex);
  if (!auction) {
    log.error("Auction not found for settlement: {}", [
      event.params.auctionId.toString(),
    ]);
    return;
  }

  // Update auction with settlement data
  auction.finished = true;
  auction.winningGeneIds = event.params.winningGeneIds;
  // childAminalId is the index, we need to resolve to address later
  auction.endBlockNumber = event.block.number;
  auction.endBlockTimestamp = event.block.timestamp;
  auction.endTransactionHash = event.transaction.hash;
  auction.save();

  log.info("Gene auction settled: {} with child Aminal index {}", [
    event.params.auctionId.toString(),
    event.params.childAminalId.toString(),
  ]);
}

export function handleGeneProposed(event: GeneProposedEvent): void {
  // Load auction entity with proper ID format
  let auctionIdHex = createAuctionId(event.params.auctionId);
  let auction = GeneAuction.load(auctionIdHex);
  if (!auction) {
    log.error("Auction not found for gene proposal: {}", [
      event.params.auctionId.toString(),
    ]);
    return;
  }

  // Create or load user
  let user = User.load(event.params.proposer);
  if (!user) {
    user = new User(event.params.proposer);
    user.address = event.params.proposer;
    user.save();
  }

  // Create gene proposal entity with proper ID format
  let proposalId = createProposalId(event.params.auctionId, event.params.category, event.params.geneId);
  let proposal = new GeneProposal(proposalId);
  proposal.auction = auction.id;
  // Store gene NFT reference properly - using the Genes contract address from the auction
  let genesContract = Address.fromString("0x463ea6dcbc54c5ed7d704332562187a30276e9b7");
  proposal.geneNFT = genesContract.concat(
    Bytes.fromI32(event.params.geneId.toI32())
  );
  proposal.traitType = event.params.category;
  proposal.proposer = user.id;
  proposal.loveVotes = BigInt.fromI32(0);
  proposal.removeVotes = BigInt.fromI32(0);
  proposal.removed = false;
  proposal.blockNumber = event.block.number;
  proposal.blockTimestamp = event.block.timestamp;
  proposal.transactionHash = event.transaction.hash;
  proposal.save();

  log.info("Gene proposed for auction {}: gene ID {} trait type {} by {}", [
    event.params.auctionId.toString(),
    event.params.geneId.toString(),
    event.params.category.toString(),
    event.params.proposer.toHexString(),
  ]);
}

export function handleGeneVoteCast(event: GeneVoteCastEvent): void {
  // Load auction entity with proper ID format
  let auctionIdHex = createAuctionId(event.params.auctionId);
  let auction = GeneAuction.load(auctionIdHex);
  if (!auction) {
    log.error("Auction not found for gene vote: {}", [
      event.params.auctionId.toString(),
    ]);
    return;
  }

  // Load gene proposal with proper ID format
  let proposalId = createProposalId(event.params.auctionId, event.params.category, event.params.geneId);
  let proposal = GeneProposal.load(proposalId);
  if (!proposal) {
    log.error("Gene proposal not found for vote: auction {} gene {} trait {}", [
      event.params.auctionId.toString(),
      event.params.geneId.toString(),
      event.params.category.toString(),
    ]);
    return;
  }

  // Create or load user
  let user = User.load(event.params.voter);
  if (!user) {
    user = new User(event.params.voter);
    user.address = event.params.voter;
    user.save();
  }

  // Create gene vote entity
  let voteId = event.transaction.hash.concatI32(event.logIndex.toI32());
  let vote = new GeneVote(voteId);
  vote.auction = auction.id;
  vote.proposal = proposal.id;
  vote.voter = user.id;
  vote.isRemoveVote = false; // Regular vote
  // Get user's voting power from contract since the event doesn't include it
  let geneAuctionContract = GeneAuctionContract.bind(event.address);
  let votingPowerResult = geneAuctionContract.try_getUserVotingPower(
    event.params.auctionId,
    event.params.voter
  );
  let votingPower = votingPowerResult.reverted
    ? BigInt.fromI32(0)
    : votingPowerResult.value;
  vote.loveAmount = votingPower;
  vote.blockNumber = event.block.number;
  vote.blockTimestamp = event.block.timestamp;
  vote.transactionHash = event.transaction.hash;
  vote.save();

  // Update proposal vote counts
  proposal.loveVotes = proposal.loveVotes.plus(votingPower);
  proposal.save();

  log.info(
    "Gene vote cast for auction {}: gene {} trait {} by {} with love {}",
    [
      event.params.auctionId.toString(),
      event.params.geneId.toString(),
      event.params.category.toString(),
      event.params.voter.toHexString(),
      votingPower.toString(),
    ]
  );
}

export function handleGeneRemovalVote(event: GeneRemovalVoteEvent): void {
  // Load auction entity with proper ID format
  let auctionIdHex = createAuctionId(event.params.auctionId);
  let auction = GeneAuction.load(auctionIdHex);
  if (!auction) {
    log.error("Auction not found for gene removal vote: {}", [
      event.params.auctionId.toString(),
    ]);
    return;
  }

  // Load gene proposal with proper ID format
  let proposalId = createProposalId(event.params.auctionId, event.params.category, event.params.geneId);
  let proposal = GeneProposal.load(proposalId);
  if (!proposal) {
    log.error(
      "Gene proposal not found for removal vote: auction {} gene {} trait {}",
      [
        event.params.auctionId.toString(),
        event.params.geneId.toString(),
        event.params.category.toString(),
      ]
    );
    return;
  }

  // Create or load user
  let user = User.load(event.params.voter);
  if (!user) {
    user = new User(event.params.voter);
    user.address = event.params.voter;
    user.save();
  }

  // Create gene vote entity for removal
  let voteId = event.transaction.hash.concatI32(event.logIndex.toI32());
  let vote = new GeneVote(voteId);
  vote.auction = auction.id;
  vote.proposal = proposal.id;
  vote.voter = user.id;
  vote.isRemoveVote = true; // Removal vote
  vote.loveAmount = event.params.voteWeight;
  vote.blockNumber = event.block.number;
  vote.blockTimestamp = event.block.timestamp;
  vote.transactionHash = event.transaction.hash;
  vote.save();

  // Update proposal removal vote counts
  proposal.removeVotes = proposal.removeVotes.plus(event.params.voteWeight);
  proposal.save();

  log.info(
    "Gene removal vote cast for auction {}: gene {} trait {} by {} with love {}",
    [
      event.params.auctionId.toString(),
      event.params.geneId.toString(),
      event.params.category.toString(),
      event.params.voter.toHexString(),
      event.params.voteWeight.toString(),
    ]
  );
}

export function handleGeneRemoved(event: GeneRemovedEvent): void {
  // Load gene proposal with proper ID format
  let proposalId = createProposalId(event.params.auctionId, event.params.category, event.params.geneId);
  let proposal = GeneProposal.load(proposalId);
  if (!proposal) {
    log.error(
      "Gene proposal not found for removal: auction {} gene {} trait {}",
      [
        event.params.auctionId.toString(),
        event.params.geneId.toString(),
        event.params.category.toString(),
      ]
    );
    return;
  }

  // Mark proposal as removed
  proposal.removed = true;
  proposal.save();

  log.info("Gene removed from auction {}: gene {} trait {}", [
    event.params.auctionId.toString(),
    event.params.geneId.toString(),
    event.params.category.toString(),
  ]);
}

export function handleBulkVoteCast(event: BulkVoteCastEvent): void {
  // Load auction entity with proper ID format
  let auctionIdHex = createAuctionId(event.params.auctionId);
  let auction = GeneAuction.load(auctionIdHex);
  if (!auction) {
    log.error("Auction not found for bulk vote: {}", [
      event.params.auctionId.toString(),
    ]);
    return;
  }

  // Create or load user
  let user = User.load(event.params.voter);
  if (!user) {
    user = new User(event.params.voter);
    user.address = event.params.voter;
    user.save();
  }

  // Get user's voting power from contract since the event doesn't include it
  let geneAuctionContract = GeneAuctionContract.bind(event.address);
  let votingPowerResult = geneAuctionContract.try_getUserVotingPower(
    event.params.auctionId,
    event.params.voter
  );
  let votingPower = votingPowerResult.reverted
    ? BigInt.fromI32(0)
    : votingPowerResult.value;

  log.info("Bulk vote cast for auction {} by {} with total vote weight {}", [
    event.params.auctionId.toString(),
    event.params.voter.toHexString(),
    votingPower.toString(),
  ]);

  // Create individual vote entities for each non-zero gene ID in the bulk vote
  // Since bulkVoteOnGenes doesn't emit individual GeneVoteCast events, we need to create them here
  let geneIds = event.params.geneIds;
  for (let i = 0; i < geneIds.length; i++) {
    let geneId = geneIds[i];
    if (!geneId.isZero()) {
      // Create proposal ID for this gene/category combination
      let proposalId = createProposalId(event.params.auctionId, i, geneId);
      let proposal = GeneProposal.load(proposalId);
      
      if (!proposal) {
        log.warning("Gene proposal not found for bulk vote: auction {} gene {} trait {} - skipping", [
          event.params.auctionId.toString(),
          geneId.toString(),
          i.toString(),
        ]);
        continue;
      }

      // Create gene vote entity for this individual vote
      // Use a unique ID that includes the trait category to avoid collisions
      let voteId = event.transaction.hash
        .concatI32(event.logIndex.toI32())
        .concatI32(i); // Add category index to make it unique
      let vote = new GeneVote(voteId);
      vote.auction = auction.id;
      vote.proposal = proposal.id;
      vote.voter = user.id;
      vote.isRemoveVote = false; // Regular vote
      vote.loveAmount = votingPower;
      vote.blockNumber = event.block.number;
      vote.blockTimestamp = event.block.timestamp;
      vote.transactionHash = event.transaction.hash;
      vote.save();

      // Update proposal vote counts
      proposal.loveVotes = proposal.loveVotes.plus(votingPower);
      proposal.save();

      log.info(
        "Individual vote created from bulk vote for auction {}: gene {} trait {} by {} with love {}",
        [
          event.params.auctionId.toString(),
          geneId.toString(),
          i.toString(),
          event.params.voter.toHexString(),
          votingPower.toString(),
        ]
      );
    }
  }
}
