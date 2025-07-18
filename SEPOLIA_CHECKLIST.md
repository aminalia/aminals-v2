# ✅ Sepolia Deployment Checklist

## Status: Ready for Deployment

The subgraph has been configured for Sepolia and builds successfully!

## ⚠️ Required Updates Before Deployment

### 1. Contract Addresses

Update these addresses in `/workspace/graph/subgraph.yaml` with your actual Sepolia deployments:

```yaml
# Current (Holesky addresses - NEED TO UPDATE):
AminalFactory: "0x12ab74042d20e7f28b324d00055c239c740d4c3d"
GeneAuction: "0x0b7d125d966f58115433574cf037611321d64a7f"
Genes: "0x4c7fba8cc9555abb6f51b7da33c82c0eee8c6485"
GeneRegistry: "0x41063967aa8337ab89a2f69ca8ff54ba13ce1f06"
```

### 2. Start Blocks

Update to actual deployment blocks in `subgraph.yaml`:

```yaml
# Current: startBlock: 5000000
# Update to: startBlock: [ACTUAL_DEPLOYMENT_BLOCK]
```

## 🚀 Deployment Options

### Option A: Deploy Existing Contracts to Sepolia

If you have contracts deployed on Sepolia, just update the addresses and start blocks above.

### Option B: Deploy New Contracts to Sepolia

```bash
# Set environment variables
export SEPOLIA_RPC_URL="https://ethereum-sepolia.publicnode.com"
export PRIVATE_KEY="your_private_key"
export ETHERSCAN_API_KEY="your_etherscan_key"

# Run deployment script
./deploy-sepolia.sh
```

## 📋 Deployment Commands

```bash
# 1. Update addresses and start blocks in subgraph.yaml

# 2. Build and deploy subgraph
cd graph
npm run codegen
npm run build
npm run deploy:sepolia

# 3. Update frontend GraphQL endpoint (after subgraph deployment)
```

## ✅ What's Already Done

- ✅ Network configuration updated to Sepolia
- ✅ Subgraph builds successfully
- ✅ Performance optimizations applied
- ✅ Schema cleaned up (removed aminalsUsingGene field)
- ✅ Deployment scripts prepared
- ✅ Frontend compatibility fixes applied

## 📝 Post-Deployment Tasks

1. **Update Frontend GraphQL URL**:

   - In `frontend/src/resources/traits.ts`
   - Replace with new Sepolia subgraph endpoint

2. **Test the Application**:
   - Verify traits load correctly
   - Check Aminal images display
   - Test all GraphQL queries

## 🔧 Configuration Files Created

- ✅ `/workspace/SEPOLIA_DEPLOYMENT.md` - Detailed deployment guide
- ✅ `/workspace/deploy-sepolia.sh` - Contract deployment script
- ✅ Updated `graph/package.json` with `deploy:sepolia` command
- ✅ Updated `graph/subgraph.yaml` for Sepolia network

## 🚨 Important Notes

- Start blocks should be set to actual deployment blocks for optimal performance
- All contract addresses must exist on Sepolia before deploying subgraph
- The subgraph will need time to sync after deployment
- Make sure to authenticate with The Graph CLI: `graph auth --studio <YOUR_DEPLOY_KEY>`
