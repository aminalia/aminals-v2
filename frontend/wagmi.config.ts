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
      address: '0x797564393e357bae3dd4edbf4d38af242e3fd7fe',
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
      address: '0xaf3e8e413df045f495c98ad4ca0a8969fcb14592',
    },
    {
      abi: ABI.Genes.abi,
      name: 'Genes',
      address: '0x41004e0babd0161378c746e7c2d870f951ae555d',
    },
    // GeneRegistry not deployed to Sepolia yet
    {
      abi: ABI.GeneRegistry.abi,
      name: 'GeneRegistry',
      address: '0xa9dd7702e425f61c72ae143a4301c58947b6c0ec',
    },
  ],
});
