# Aminals Subgraph Deployment Update

## Updated Contract Addresses (Holesky Testnet)

The subgraph has been updated with the latest deployed contract addresses from the Holesky testnet:

### Main Contracts

- **AminalFactory**: `0x421a9568b51aa4ca588e993fc2b482a24fd5354e`
- **GeneAuction**: `0x58b2a2f0e2fb2b280325c8b58e3164c28768bb9c`
- **Genes**: `0xd5bb61310193a528e794c7302533df65283223b2`
- **AminalProposals**: `0xce3eae1324a9970c776cd1c6dc501e6fa1e161a0`

### Skill Contracts (for reference)

- **Move2D**: `0x96f1597fc84c69aef97a8af274b7709a0f38d84a`
- **MoveTwice**: `0x7580880b51894f0f8c04143b551723793ea2a8c8`

### Network Configuration

- **Chain ID**: 17000 (0x4268)
- **Network**: Holesky Testnet
- **Start Block**: 4111558 (0x3ebcc6)

## Files Updated

### 1. `subgraph.yaml`

- Updated all contract addresses from placeholder values
- Set correct start block (4111558) for all data sources
- Configured for Holesky network

### 2. `src/constants.ts`

- Added all deployed contract addresses
- Included skill contract addresses for reference
- Added network information in comments

### 3. `networks.json`

- Updated configuration for Holesky network
- Replaced old Aminals contract with new factory-based addresses
- Set consistent start blocks for all contracts

## Deployment Status

✅ **Build Status**: Successfully compiled  
✅ **Contract Addresses**: Updated with latest deployment  
✅ **ABIs**: Generated from latest contracts  
✅ **Event Handlers**: Configured for new architecture

## Next Steps

The subgraph is now ready for deployment to The Graph Protocol. To deploy:

1. **Local Testing**: The subgraph can be tested locally using Graph Node
2. **Hosted Service**: Deploy to The Graph's hosted service (if available)
3. **Decentralized Network**: Deploy to The Graph's decentralized network

### Deployment Command Examples

```bash
# For hosted service (replace with your subgraph name)
npm run deploy:hosted

# For decentralized network
npm run deploy:mainnet  # or appropriate network
```

## Architecture Summary

The updated subgraph now supports the complete factory-based Aminals architecture:

- **Factory Pattern**: AminalFactory creates individual Aminal contracts
- **Dynamic Indexing**: Template contracts for newly spawned Aminals
- **Gene NFT System**: Decentralized trait management
- **Love-Based Auctions**: Community-driven breeding mechanics
- **Global Skills**: Skills accessible to any Aminal

The subgraph will automatically begin indexing from block 4111558 and track all Aminal creation, feeding, breeding, and skill usage events across the ecosystem.
