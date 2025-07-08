# Graph Schema Migration Guide

This document outlines the changes made to the frontend GraphQL queries to support the new Graph Protocol schema.

## Key Changes

### 1. Skill System Updates
- **Entity**: `skillCalls` → `skillUsed`
- **Fields**:
  - `data` → `selector` (bytes4 function selector instead of full data)
  - `squeakCost` → `newEnergy` (energy after skill use)
  - Removed `aminalIndex` field from aminal references

### 2. Gene NFT Enhancements
- **New Fields**:
  - `totalEarnings`: BigInt tracking cumulative earnings from auctions
  - `payouts`: Array of `GeneCreatorPayout` entities

### 3. New Entity: GeneCreatorPayout
- **Purpose**: Track individual payouts to gene creators from auction settlements
- **Fields**:
  - `id`: Unique identifier
  - `auction`: Reference to GeneAuction
  - `geneNFT`: Reference to Gene NFT
  - `creator`: Reference to creator User
  - `amount`: Payout amount in wei
  - `auctionId`: Auction ID for dashboard display
  - `geneId`: Gene ID for dashboard display

### 4. Aminal Structure Updates
- Removed `aminalIndex` references in auction/gene queries
- Updated skill tracking to use `skillUsed`

## Files Updated

### GraphQL Queries
- `/src/resources/aminals.graphql` - Updated skillUsed fields
- `/src/resources/skills.graphql` - Renamed queries and updated fields  
- `/src/resources/genes.graphql` - Added earnings tracking fields

### TypeScript Integration
- `/src/resources/genes.ts` - Updated inline queries with new fields

## Deployment Steps

1. Deploy updated subgraph to The Graph Protocol
2. Update `.graphclientrc.yml` endpoint if needed
3. Run `npm run graphclient:build` to regenerate types
4. Remove temporary types from `/src/types/new-schema.ts`
5. Test queries against new schema

## Current Status

The frontend GraphQL queries have been updated to work with the new schema, but the `.graphclient` types cannot be generated until the new subgraph is deployed. Temporary types are available in `/src/types/new-schema.ts` for development reference.

## New Features Enabled

### Gene Creator Dashboard
The new schema supports building a trait creator dashboard with:
- Total earnings per gene
- Individual payout history
- Auction performance metrics

### Enhanced Skill Tracking
- Better performance with simplified data structure
- Function selector tracking for analytics
- Energy state tracking after skill use

## Backwards Compatibility

**Note**: This update is NOT backwards compatible with the old schema. The frontend will only work after the new subgraph is deployed.