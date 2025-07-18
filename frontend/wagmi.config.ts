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
      address: '0x487a60b69bd81d3bd6d35c0d632b849b44f4a55d',
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
      address: '0xb10afa4c9f04242feccc8015822dfc5d39b58b07',
    },
    {
      abi: ABI.Genes.abi,
      name: 'Genes',
      address: '0x673bfea6d500ccef982499146f58d610ccfcaad9',
    },
    {
      abi: ABI.GeneRegistry.abi,
      name: 'GeneRegistry',
      address: '0xd5ca2e91099d47e204ce47d3f293b82647756947',
    },
    {
      abi: ABI.Move2D.abi,
      name: 'Move2D',
      address: '0x41063967aa8337ab89a2f69ca8ff54ba13ce1f06',
    },
  ],
});
