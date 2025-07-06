# Testnet Deployment Guide

This guide provides instructions for deploying the Aminals ecosystem to testnet networks.

## Prerequisites

1. **Environment Setup**

   ```bash
   # Install Foundry if not already installed
   curl -L https://foundry.paradigm.xyz | bash
   foundryup

   # Install dependencies
   forge install
   ```

2. **Configure Environment Variables**

   ```bash
   # Copy environment template
   cp .env.example .env

   # Edit .env with your values
   PRIVATE_KEY=your_private_key_here
   ETHERSCAN_API_KEY=your_etherscan_api_key_here
   ```

3. **Fund Deployer Account**
   - Get testnet ETH from faucets:
     - Sepolia: https://sepoliafaucet.com/
     - Goerli: https://goerlifaucet.com/
     - Base Sepolia: https://bridge.base.org/deposit

## Deployment Steps

### Step 1: Deploy Core Contracts

Deploy the core contracts using the existing deployment script:

```bash
# Deploy to Sepolia testnet
forge script script/DeployAminals.s.sol:DeployAminals --chain-id 11155111 --rpc-url "https://ethereum-sepolia.publicnode.com" --broadcast --verify

# Deploy to Base Sepolia
forge script script/DeployAminals.s.sol:DeployAminals --chain-id 84532 --rpc-url "https://sepolia.base.org" --broadcast --verify

# Deploy to Goerli (if needed)
forge script script/DeployAminals.s.sol:DeployAminals --chain-id 5 --rpc-url "https://goerli.blockpi.network/v1/rpc/public" --broadcast --verify

# Deploy to Holesky (alternative testnet)
forge script script/DeployAminals.s.sol:DeployAminals --chain-id 17000 --rpc-url "https://ethereum-holesky.publicnode.com" --broadcast --verify
```

### Step 2: Verify Contract Deployment

After deployment, check the contract addresses from the deployment logs. The DeployAminals automatically:

- Deploys all core contracts (Factory, Genes, GeneAuction, Proposals)
- Initializes all contracts with proper configuration
- Deploys sample skills (Move2D, MoveTwice)
- Mints initial Gene NFTs using InitialGenesMinter
- Spawns initial test Aminals

```bash
# Check deployment addresses from environment variables set by the script
echo "Factory: $AMINAL_FACTORY_CONTRACT"
echo "Genes: $GENES_NFT_CONTRACT"
echo "GeneAuction: $GENE_AUCTION_CONTRACT"
echo "Proposals: $AMINAL_PROPOSALS_CONTRACT"
```

### Step 3: Test Deployment

Verify the deployment by running integration tests:

```bash
# Run tests against deployed contracts
forge test --fork-url sepolia --fork-block-number latest
```

## Contract Addresses

After deployment, update this section with the deployed contract addresses:

### Sepolia Testnet

- **AminalFactory**: `0x...`
- **Genes**: `0x...`
- **GeneAuction**: `0x...`
- **AminalProposals**: `0x...`

### Base Sepolia

- **AminalFactory**: `0x...`
- **Genes**: `0x...`
- **GeneAuction**: `0x...`
- **AminalProposals**: `0x...`

## Testnet Configuration

### Network Settings

Add these networks to your foundry.toml:

```toml
[rpc_endpoints]
sepolia = "https://ethereum-sepolia.publicnode.com"
base-sepolia = "https://sepolia.base.org"
goerli = "https://goerli.blockpi.network/v1/rpc/public"
holesky = "https://ethereum-holesky.publicnode.com"

[etherscan]
sepolia = { key = "${ETHERSCAN_API_KEY}" }
base-sepolia = { key = "${BASESCAN_API_KEY}" }
goerli = { key = "${ETHERSCAN_API_KEY}" }
holesky = { key = "${ETHERSCAN_API_KEY}" }
```

### Available Scripts

The following scripts are available in the `script/` directory:

- `DeployAminals.s.sol`: Main deployment script - deploys all contracts and initializes the system
- `SpawnAminal.s.sol`: Spawns additional Aminals with custom visuals
- `FeedAminal.s.sol`: Feeds existing Aminals to test the love/energy system
- `DeploySkill.s.sol`: Deploys new skill contracts
- `CallSkill.s.sol`: Calls skills from Aminals
- `BreedAminal.s.sol`: Initiates breeding between two Aminals
- `GetAminalInfo.s.sol`: Retrieves information about deployed Aminals
- `AddTrait.s.sol`: References the Gene NFT system for trait creation
- `EndAuction.s.sol`: Ends gene auctions for testing
- `InitialGenesMinter.sol`: Temporary contract for minting initial Gene NFTs

### Initial Gene NFTs

The deployment script creates 16 initial Gene NFTs with these themes:

**Blue/Purple Theme (IDs 0-7):**

- BACK: Purple gradient background
- TAIL: Blue flowing tail design
- ARM: Blue wing-like arms
- EARS: Blue pointed ears
- BODY: Blue circular body
- FACE: Teal face with gray eyes
- MOUTH: Small dark mouth
- MISC: White accessories

**Red/Orange Theme (IDs 8-15):**

- BACK: Teal gradient background
- TAIL: Red flame-like tail
- ARM: Red flowing arms
- EARS: Red pointed ears
- BODY: Red circular body with flame details
- FACE: Orange face with red and yellow eyes
- MOUTH: Large dark mouth with teeth
- MISC: Orange star accessories

## Testing on Testnet

### Basic Flow Test

1. **Spawn Additional Aminals**

   ```bash
   # Use the existing spawn script
   AMINAL_FACTORY_CONTRACT=$FACTORY_ADDRESS forge script script/SpawnAminal.s.sol:SpawnAminal --rpc-url sepolia --broadcast
   ```

2. **Feed an Aminal**

   ```bash
   # Use the existing feed script
   AMINAL_FACTORY_CONTRACT=$FACTORY_ADDRESS forge script script/FeedAminal.s.sol:FeedAminal --rpc-url sepolia --broadcast

   # Or manually feed with cast
   AMINAL_ADDRESS=$(cast call $FACTORY_ADDRESS "getAminalByIndex(uint256)" 0 --rpc-url sepolia)
   cast send $AMINAL_ADDRESS "feed()" --value 0.01ether --rpc-url sepolia --private-key $PRIVATE_KEY
   ```

3. **Check Love and Energy**

   ```bash
   # Check energy
   cast call $AMINAL_ADDRESS "getEnergy()" --rpc-url sepolia

   # Check love
   cast call $AMINAL_ADDRESS "getTotalLove()" --rpc-url sepolia
   ```

### Advanced Testing

4. **Create Gene NFTs**

   ```bash
   # The deployment script automatically creates initial Gene NFTs (IDs 0-15)
   # To create additional Gene NFTs, you need to deploy GeneRegistry first
   # For now, initial genes are created via InitialGenesMinter during deployment

   # Check existing Gene NFTs
   cast call $GENES_NFT_CONTRACT "totalSupply()" --rpc-url sepolia
   cast call $GENES_NFT_CONTRACT "tokenURI(uint256)" 0 --rpc-url sepolia
   ```

5. **Test Breeding**

   ```bash
   # Set breeding consent
   cast send $AMINAL_ADDRESS "setBreedableWith(address,bool)" $PARTNER_ADDRESS true --rpc-url sepolia --private-key $PRIVATE_KEY

   # Initiate breeding
   cast send $FACTORY_ADDRESS "breed(address,address)" $AMINAL_ADDRESS $PARTNER_ADDRESS --rpc-url sepolia --private-key $PRIVATE_KEY
   ```

6. **Use Skills**

   ```bash
   # Deploy a skill contract using the existing script
   AMINAL_FACTORY_CONTRACT=$FACTORY_ADDRESS forge script script/DeploySkill.s.sol:DeploySkill --rpc-url sepolia --broadcast

   # Use the skill with call skill script
   AMINAL_FACTORY_CONTRACT=$FACTORY_ADDRESS forge script script/CallSkill.s.sol:CallSkill --rpc-url sepolia --broadcast

   # Or manually use cast
   cast send $AMINAL_ADDRESS "callSkill(address,bytes)" $SKILL_ADDRESS "0x..." --value 0.001ether --rpc-url sepolia --private-key $PRIVATE_KEY
   ```

## Troubleshooting

### Common Issues

1. **Gas Estimation Failures**

   - Increase gas limit: `--gas-limit 3000000`
   - Check contract state and prerequisites

2. **Verification Failures**

   - Ensure constructor args match exactly
   - Wait for block confirmations before verifying

3. **Initialization Errors**
   - Check deployment order dependencies
   - Verify all contracts are deployed before initialization

### Debug Commands

```bash
# Check contract bytecode
cast code $CONTRACT_ADDRESS --rpc-url sepolia

# Check transaction status
cast tx $TX_HASH --rpc-url sepolia

# Check logs
cast logs --address $CONTRACT_ADDRESS --rpc-url sepolia
```

## Frontend Integration

After testnet deployment, update the frontend configuration:

1. **Update Contract Addresses**

   ```typescript
   // frontend/src/contracts/addresses.ts
   export const TESTNET_ADDRESSES = {
     sepolia: {
       factory: "0x...",
       Genes: "0x...",
       // ... other addresses
     },
   };
   ```

2. **Configure Network**

   ```typescript
   // frontend/src/config/networks.ts
   export const SEPOLIA_CONFIG = {
     chainId: 11155111,
     name: "Sepolia",
     rpcUrl: "https://rpc.sepolia.org",
     blockExplorer: "https://sepolia.etherscan.io",
   };
   ```

3. **Test Frontend Integration**
   ```bash
   cd frontend
   npm run dev
   # Navigate to testnet environment and test functionality
   ```

## Monitoring and Maintenance

### Event Monitoring

Monitor key events for proper operation:

```bash
# Monitor Aminal creation
cast logs --address $FACTORY_ADDRESS --topics "AminalCreated(address,uint256)" --rpc-url sepolia

# Monitor feeding events
cast logs --address $AMINAL_ADDRESS --topics "FeedAminal(address,uint256,uint256,uint256,uint256)" --rpc-url sepolia
```

### Health Checks

Regular health checks to ensure system stability:

```bash
# Check factory state
cast call $FACTORY_ADDRESS "aminalCount()" --rpc-url sepolia

# Check Gene NFT supply
cast call $GENES_NFT_CONTRACT "totalSupply()" --rpc-url sepolia

# Check specific Gene NFT
cast call $GENES_NFT_CONTRACT "tokenURI(uint256)" 0 --rpc-url sepolia
```

## Security Considerations

1. **Use Separate Testnet Keys**: Never use mainnet private keys for testnet
2. **Limit Testnet Funds**: Only fund accounts with necessary testnet ETH
3. **Monitor Contracts**: Set up monitoring for unusual activity
4. **Regular Updates**: Keep deployment scripts updated with latest contract versions

## Advanced Gene NFT System

The current deployment uses `InitialGenesMinter` for initial Gene NFTs. For a full permissionless trait system, you can deploy the `GeneRegistry`:

```bash
# Deploy GeneRegistry (optional - for permissionless trait creation)
forge script script/DeployGeneFactory.s.sol:DeployGeneFactory --rpc-url sepolia --broadcast
```

Once deployed, users can create their own Gene NFTs:

```bash
# Create a custom gene NFT (requires 0.001 ETH fee)
cast send $GENE_FACTORY_ADDRESS "createGene(string,uint8)" "<svg>...</svg>" 5 --value 0.001ether --rpc-url sepolia --private-key $PRIVATE_KEY
```

The GeneRegistry provides:

- **Permissionless Trait Creation**: Anyone can create Gene NFTs for traits
- **Registry System**: Tracks which Gene NFTs came from the factory
- **Fee Protection**: Prevents spam with minimum creation fee
- **SVG Validation**: Basic validation of trait SVG content

## Next Steps

After successful testnet deployment:

1. **Conduct User Testing**: Invite community to test on testnet
2. **Performance Testing**: Monitor gas usage and optimization opportunities
3. **Security Audit**: Prepare for security audit of deployed contracts
4. **Deploy GeneRegistry**: Enable permissionless trait creation
5. **Mainnet Preparation**: Create mainnet deployment scripts and checklist

---

**Note**: This is a testnet deployment. All contracts and transactions are for testing purposes only. Do not use real funds or sensitive data.
