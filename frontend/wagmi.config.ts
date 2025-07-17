import { defineConfig } from '@wagmi/cli';

// TODO use ABIs in out/ dir
const ABI = {
  AminalFactory: require('../out/AminalFactory.sol/AminalFactory.json'),
  Aminal: require('../out/Aminal.sol/Aminal.json'),
  GeneAuction: require('../out/GeneAuction.sol/GeneAuction.json'),
  Genes: require('../out/Genes.sol/Genes.json'),
  GeneRegistry: require('../out/GeneRegistry.sol/GeneRegistry.json'),
  Move2D: require('../out/Move2D.sol/Move2D.json'),
};

export default defineConfig({
  out: 'src/contracts/generated.ts',
  contracts: [
    {
      abi: ABI.AminalFactory.abi,
      name: 'AminalFactory',
      address: '0x37bd5f9dec75deaa689f7a3d517b62424caba8ba',
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
      address: '0xb1c434fb9fb47cd5e0fd274d0f3bfec5f66b3d7c',
    },
    {
      abi: ABI.Genes.abi,
      name: 'Genes',
      address: '0x5938ad3cd862dd08bd78ba1b92eb2d54e7842ee9',
    },
    {
      abi: ABI.GeneRegistry.abi,
      name: 'GeneRegistry',
      address: '0x1fa4c76903dce4ad3a3aa95ae1c44d70dfad471d',
    },
    {
      abi: ABI.Move2D.abi,
      name: 'Move2D',
      address: '0x71f0a8e4ee88b5e77d61077ec97f75260e095b89',
    },
  ],
});
