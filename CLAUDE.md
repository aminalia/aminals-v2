# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Aminals is a sophisticated decentralized digital pet platform that combines NFT ownership with complex interaction mechanics, autonomous contract behavior, and community governance. The project consists of three main components:

1. **Smart Contracts** (Solidity/Foundry): Core blockchain logic for Aminals, skills, and gene NFTs
2. **Frontend** (Next.js/React): Web interface for interacting with Aminals
3. **Graph Protocol** (TypeScript): Indexing and querying blockchain data

## Architecture

### Current Refactored Architecture (Factory-Based)

- **AminalFactory.sol**: Factory contract that creates individual Aminal contracts
- **Aminal.sol**: Each Aminal is its own ERC721 contract (one-of-one NFT) with autonomous capabilities
- **Skills System**: Global call-based architecture where any Aminal can call any registered skill
- **Gene NFTs**: Permissionless trait creation system replacing centralized trait registry

### Core Concepts

- **Aminals**: Autonomous digital pets with their own contract addresses that can hold funds and interact with other contracts
- **Skills**: Small contracts that provide functionality to Aminals (e.g., Move2D, MoveTwice)
- **Energy/Squeaks**: Resource system for Aminal actions
- **Love**: Community appreciation system for Aminals
- **Breeding**: Mechanism for creating new Aminals from existing ones

## Development Commands

### Smart Contracts (Foundry)

```bash
# Build contracts
./forge build

# Run tests
./forge test

# Run specific test
./forge test --match-contract AminalFactoryTest

# Run tests with gas reporting
./forge test --gas-report

# Format code
./forge fmt
```

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run graphclient:build  # Build GraphQL client
npm run wagmi:generate     # Generate contract types
npm run dev                # Start development server
npm run build              # Build for production
npm run lint               # Run linting
npm run typecheck          # Type checking
```

### Graph Protocol

```bash
cd graph
npm install
npm run codegen            # Generate types from schema
npm run build              # Build subgraph
npm run test               # Run tests
npm run deploy             # Deploy to The Graph
```

## Key Files and Directories

### Smart Contracts (`/src`)

- `AminalFactory.sol`: Factory for creating individual Aminal contracts
- `Aminal.sol`: Individual Aminal contract implementation
- `IAminal.sol`: Interface defining Aminal contract methods
- `skills/`: Skill contracts (Move2D, MoveTwice, etc.)
- `nft/`: Gene NFT system for traits
- `proposals/`: Governance contracts for community decisions

### Frontend (`/frontend`)

- `pages/`: Next.js page components
- `src/components/`: React components for UI
- `src/contracts/`: Generated contract types from wagmi
- `src/resources/`: GraphQL queries and data fetching

### Testing (`/test`)

- `AminalFactory.t.sol`: Factory contract tests
- `*.t.sol`: Foundry test files
- `mocks/`: Mock contracts for testing

## Important Notes

### Skills System

- Skills are globally accessible to any Aminal
- Skills must be registered in the factory's skills mapping
- Skills can only be called by factory-created Aminals
- Skills return energy cost which is deducted from the calling Aminal

### Gene NFT System

- Replaces centralized trait registry
- Anyone can create Gene NFTs for traits
- Auction settlement funds go to Gene NFT owners
- Uses registry mapping to verify legitimate Gene NFTs

### Testing Approach

- Use Foundry for smart contract testing
- Tests are in `/test` directory with `.t.sol` extension
- Mock contracts in `/test/mocks/` for isolated testing
- Frontend uses standard Next.js testing patterns

### Deployment

- Smart contracts use Foundry deployment scripts in `/script`
- Frontend deploys to standard Next.js hosting
- Subgraph deploys to The Graph Protocol network

## Development Workflow

1. Smart contract changes: Edit contracts, run tests, format code
2. Frontend changes: Update components, regenerate types if contracts changed
3. Graph changes: Update schema/mappings, run codegen, test locally
4. Integration: Ensure all three components work together after changes

## Architecture Migration Notes

The project recently migrated from a collection-based to factory-based architecture. Key changes:

- Aminals are now individual contracts rather than token IDs in a collection
- Skills are now globally accessible rather than individually taught
- Traits are now Gene NFTs rather than centralized registry entries

This enables Aminals to be truly autonomous entities with their own contract addresses and the ability to hold funds and interact with other contracts.
