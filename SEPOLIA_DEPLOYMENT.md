# Sepolia Deployment Guide

## Overview

This guide will help you deploy the optimized Aminals subgraph to Sepolia testnet.

## Prerequisites

1. **Graph CLI and Authentication**

   ```bash
   npm install -g @graphprotocol/graph-cli
   graph auth --studio <YOUR_DEPLOY_KEY>
   ```

2. **Contracts Deployed on Sepolia**
   - You need to deploy the Aminals contracts to Sepolia first
   - Or have existing Sepolia contract addresses

## Step 1: Deploy Contracts to Sepolia (if needed)

If contracts aren't deployed to Sepolia yet:

```bash
# From root directory
# Update .env or anvil script to use Sepolia
export RPC_URL="https://ethereum-sepolia.publicnode.com"
export PRIVATE_KEY="your_private_key"

# Deploy using forge
forge script script/DeployAminals.s.sol --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast --verify
```

## Step 2: Update Subgraph Configuration

### Current Configuration Status:

- ✅ Network updated to `sepolia`
- ✅ **COMPLETED**: Contract addresses updated to Sepolia addresses
- ✅ **COMPLETED**: Start blocks updated to actual deployment block (8700538)

### Contract Addresses (UPDATED):

1. **Contract Addresses** (updated in `subgraph.yaml`):

   ```yaml
   # AminalFactory address
   address: "0x42fa457b1a742c5d7330f24916c60985448b8e8f"  # ✅ SEPOLIA ADDRESS

   # GeneAuction address
   address: "0x9c0ad5e98b4a3dcdaef1a2162172c9ac4391ac1f"  # ✅ SEPOLIA ADDRESS

   # Genes address
   address: "0xbddca7fae18cba8fc457a8b69338d404d443cb0d"  # ✅ SEPOLIA ADDRESS

   # GeneRegistry address - COMMENTED OUT (not deployed yet)
   # address: "0x41063967aa8337ab89a2f69ca8ff54ba13ce1f06"  # PLACEHOLDER
   ```

2. **Start Blocks** (updated to actual deployment blocks):
   ```yaml
   startBlock: 8700538 # ✅ ACTUAL DEPLOYMENT BLOCK
   ```

## Step 3: Build and Deploy Subgraph

```bash
cd graph

# 1. Generate code from schema
npm run codegen  # ✅ COMPLETED

# 2. Build the subgraph
npm run build    # ✅ COMPLETED

# 3. Deploy to The Graph Studio
npm run deploy   # ⚠️  REQUIRES AUTHENTICATION
```

### Build Status:

- ✅ **COMPLETED**: Code generation successful
- ✅ **COMPLETED**: Build successful (Build ID: `QmZiYq3SDeU8oJi9ovGpYGsGgiCdKBfhq1z8xEpEDdSmeo`)
- ✅ **COMPLETED**: IPFS upload successful
- ⚠️ **PENDING**: Deployment requires The Graph Studio authentication

### To Complete Deployment:

1. **Authenticate with The Graph Studio**:
   ```bash
   npx graph auth --studio <YOUR_DEPLOY_KEY>
   ```
2. **Deploy with version label**:
   ```bash
   npx graph deploy --node https://api.studio.thegraph.com/deploy/ aminals-sepolia --version-label "v1.0.0"
   ```

## Step 4: Update Frontend Configuration

Update the frontend to use the new Sepolia subgraph:

1. **Update GraphQL endpoint** in `frontend/src/resources/traits.ts`:

   ```typescript
   // Replace the URL with your new Sepolia subgraph endpoint
   const response = await fetch('https://api.studio.thegraph.com/query/[YOUR_USER_ID]/[SEPOLIA_SUBGRAPH_NAME]/version/latest'
   ```

2. **Update wagmi configuration** for Sepolia network

## Commands Summary

```bash
# From /workspace/graph directory:

# 1. Update contract addresses in subgraph.yaml
# 2. Update start blocks in subgraph.yaml

# 3. Generate and build
npm run codegen
npm run build

# 4. Deploy
npm run deploy
```

## Notes

- The subgraph has been optimized for performance with the latest schema changes
- Start blocks should be set to the actual deployment blocks for better sync performance
- Make sure all contract addresses are correct for Sepolia
- The subgraph will take some time to sync initially

## Troubleshooting

- If deployment fails, check that all contract addresses exist on Sepolia
- Ensure start blocks are not set too early (before contracts were deployed)
- Verify ABI files match the deployed contracts
