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
      address: '0x10c6d67f0e1999c306959ffcbee0d2ef00907c1a',
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
      address: '0xa14e5c3724fa283d5b4a1ef94738de6f4f13deb7',
    },
    {
      abi: ABI.Genes.abi,
      name: 'Genes',
      address: '0x9f7a897b309c277c7c47108c7c81f601204607bd',
    },
    {
      abi: ABI.GeneRegistry.abi,
      name: 'GeneRegistry',
      address: '0x038ca6d6da4dee3056bcdcc319f0814e032b5efe',
    },
    {
      abi: ABI.Move2D.abi,
      name: 'Move2D',
      address: '0x7b5be9871564cdd09c4f82ad2397cb4eb0bacb1a',
    },
  ],
});
