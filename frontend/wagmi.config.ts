import { defineConfig } from '@wagmi/cli';

const ABI = {
  AminalFactory: require('./deployments/AminalFactory.json'),
  Aminal: require('./deployments/Aminal.json'),
  GeneAuction: require('./deployments/GeneAuction.json'),
  Genes: require('./deployments/Genes.json'),
  GeneRegistry: require('./deployments/GeneRegistry.json'),
};

export default defineConfig({
  out: 'src/contracts/generated.ts',
  contracts: [
    {
      abi: ABI.AminalFactory.abi,
      name: 'AminalFactory',
      address: '0x82583ad09b5f685f927e490f13a65e6627dd59b0',
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
      address: '0xb32868a1ccd5b4541a1751251c3663127908e460',
    },
    {
      abi: ABI.Genes.abi,
      name: 'Genes',
      address: '0x4a1c11060bde95b957b852c81b4453a35470912b',
    },
    // GeneRegistry not deployed to Sepolia yet
    // {
    //   abi: ABI.GeneRegistry.abi,
    //   name: 'GeneRegistry',
    //   address: '0x41063967Aa8337Ab89a2F69cA8FF54BA13Ce1f06',
    // },
  ],
});
