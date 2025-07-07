import { defineConfig } from '@wagmi/cli';

// TODO use ABIs in out/ dir
const ABI = {
  AminalFactory: require('../out/AminalFactory.sol/AminalFactory.json'),
  Aminal: require('../out/Aminal.sol/Aminal.json'),
  GeneAuction: require('../out/GeneAuction.sol/GeneAuction.json'),
  Genes: require('../out/Genes.sol/Genes.json'),
  GeneRegistry: require('../out/GeneRegistry.sol/GeneRegistry.json'),
};

export default defineConfig({
  out: 'src/contracts/generated.ts',
  contracts: [
    {
      abi: ABI.AminalFactory.abi,
      name: 'AminalFactory',
      address: '0x93ac7da955fe0180a87fa7a1197e572a3b0e7c82',
    },
    {
      abi: ABI.Aminal.abi,
      name: 'Aminal',
      // Note: This will be used as a template for individual Aminal contracts
      // Actual addresses will be dynamic based on factory spawns
    },
    {
      abi: ABI.GeneAuction.abi,
      name: 'GeneAuction',
      address: '0xf391678a18693ad00bd6d0151563b160c28f8657',
    },
    {
      abi: ABI.Genes.abi,
      name: 'Genes',
      address: '0x82d725b4809a9f7495318ef1395e0f8d27fce7a2',
    },
    // GeneRegistry not deployed to Sepolia yet
    {
      abi: ABI.GeneRegistry.abi,
      name: 'GeneRegistry',
      address: '0xab4f70c7d3dd3f34906592fe8096dbcd673fe65d',
    },
  ],
});
