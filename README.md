# Aminals

Aminals is a sophisticated decentralized digital pet platform that combines NFT ownership with complex interaction mechanics, autonomous contract behavior, and community governance. Each Aminal is deployed as its own ERC721 contract, enabling them to hold funds and interact autonomously with other contracts.

## Architecture Overview

The project uses a factory-based architecture where:

- **AminalFactory**: Creates and manages individual Aminal contracts
- **Individual Aminals**: Each Aminal is its own contract with autonomous capabilities
- **Global Skills**: Skills are globally accessible without registration
- **Gene NFTs**: Permissionless trait creation system

## Development

### Building and Testing

```bash
# Build contracts
./forge build

# Run tests
./forge test

# Run specific test
./forge test --match-contract AminalFactoryTest
```

### Scripts

All scripts require environment variables to be set:

```bash
cp .env.example .env
# Edit .env with your private key and RPC URL
```

#### Deployment Scripts

**Deploy Complete System**

```bash
forge script script/DeployAminals.s.sol --rpc-url $RPC_URL --broadcast
```

This deploys the entire Aminals ecosystem:

- AminalFactory with dependencies (GeneAuction, AminalProposals, Genes)
- Initial skills (Move2D, MoveTwice)
- Initial traits and Aminals
- Sets up all contract relationships

**Deploy Individual Skill**

```bash
# Set AMINAL_FACTORY_CONTRACT environment variable first
forge script script/DeploySkill.s.sol --rpc-url $RPC_URL --broadcast
```

Deploys and configures a new Move2D skill. Skills are globally accessible - no registration required.

#### Interaction Scripts

**Spawn New Aminal**

```bash
# Set AMINAL_FACTORY_CONTRACT environment variable
forge script script/SpawnAminal.s.sol --rpc-url $RPC_URL --broadcast
```

Creates a new Aminal through the factory with specified visual traits.

**Feed Aminals**

```bash
# Set AMINAL_FACTORY_CONTRACT and ADDRESS environment variables
forge script script/FeedAminal.s.sol --rpc-url $RPC_URL --broadcast
```

Feeds existing Aminals to increase their love and energy.

**Breed Aminals**

```bash
# Set AMINAL_FACTORY_CONTRACT and ADDRESS environment variables
forge script script/BreedAminal.s.sol --rpc-url $RPC_URL --broadcast
```

Initiates breeding between two Aminals. Requires:

- Both Aminals have sufficient love and energy
- Breeding permissions are set between the Aminals

**Call Skills**

```bash
# Set AMINAL_FACTORY_CONTRACT and MOVE2D_SKILL_CONTRACT environment variables
forge script script/CallSkill.s.sol --rpc-url $RPC_URL --broadcast
```

Calls a skill from an Aminal contract. Skills are globally accessible.

**Add Traits**

```bash
# Set AMINAL_FACTORY_CONTRACT environment variable
forge script script/AddTrait.s.sol --rpc-url $RPC_URL --broadcast
```

Adds new visual traits to the factory's trait library.

#### Information Scripts

**Get System Information**

```bash
# Set AMINAL_FACTORY_CONTRACT environment variable (view only)
forge script script/GetAminalInfo.s.sol --rpc-url $RPC_URL
```

Displays comprehensive information about:

- Factory status and addresses
- All existing Aminals and their properties
- Trait counts and system statistics

**End Auctions**

```bash
# Set AMINAL_FACTORY_CONTRACT and ADDRESS environment variables
forge script script/EndAuction.s.sol --rpc-url $RPC_URL --broadcast
```

Ends gene auctions (implementation depends on GeneAuction system).

### Environment Variables

Required environment variables for scripts:

- `PRIVATE_KEY`: Your wallet private key for transactions
- `RPC_URL`: RPC endpoint for the target network
- `AMINAL_FACTORY_CONTRACT`: Address of the deployed AminalFactory
- `ADDRESS`: Your wallet address (for queries)
- `MOVE2D_SKILL_CONTRACT`: Address of Move2D skill (for skill calls)
- `GENERATOR_SOURCE_CONTRACT`: High-volume contract address for randomness
- `GENERATOR_SOURCE_BALANCE`: Balance check contract for randomness

### Network Configuration

The scripts support multiple networks. Update the RPC URL and ensure you have the correct contract addresses:

```bash
# Holesky Testnet
forge script script/DeployAminals.s.sol --chain-id 17000 --rpc-url "https://ethereum-holesky.publicnode.com" --broadcast

# Sepolia Testnet
forge script script/DeployAminals.s.sol --chain-id 11155111 --rpc-url "https://ethereum-sepolia.publicnode.com" --broadcast
```
