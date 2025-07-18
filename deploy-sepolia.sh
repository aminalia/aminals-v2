#!/bin/bash

# Aminals Sepolia Deployment Script
echo "🚀 Deploying Aminals to Sepolia..."

# Check if required environment variables are set
if [ -z "$SEPOLIA_RPC_URL" ]; then
    echo "❌ SEPOLIA_RPC_URL not set. Please set it to your Sepolia RPC endpoint"
    echo "   Example: export SEPOLIA_RPC_URL=https://ethereum-sepolia.publicnode.com"
    exit 1
fi

if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ PRIVATE_KEY not set. Please set your private key"
    echo "   Example: export PRIVATE_KEY=0x..."
    exit 1
fi

echo "📋 Configuration:"
echo "   Network: Sepolia"
echo "   RPC URL: $SEPOLIA_RPC_URL"

# Deploy contracts
echo "📦 Deploying contracts..."
forge script script/DeployAminals.s.sol \
    --rpc-url $SEPOLIA_RPC_URL \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --verify \
    --etherscan-api-key $ETHERSCAN_API_KEY

if [ $? -eq 0 ]; then
    echo "✅ Contract deployment successful!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Update contract addresses in graph/subgraph.yaml"
    echo "2. Update start blocks to deployment blocks"
    echo "3. Deploy subgraph with: cd graph && npm run deploy:sepolia"
else
    echo "❌ Contract deployment failed"
    exit 1
fi