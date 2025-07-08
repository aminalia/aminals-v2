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
      address: '0x1c709d848e1abf0eb5e738229646e1b90287c840',
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
      address: '0x7cbbc91326fdf023428c942d1027ff33b4239bf8',
    },
    {
      abi: ABI.Genes.abi,
      name: 'Genes',
      address: '0x7d4672be8dfba2ee7c65e4494f00bbd2d997b157',
    },
    // GeneRegistry not deployed to Sepolia yet
    {
      abi: ABI.GeneRegistry.abi,
      name: 'GeneRegistry',
      address: '0x4c13d55407d60646bb46a7a144fa72219abf492c',
    },
  ],
});
