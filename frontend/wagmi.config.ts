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
      address: '0x5dcda867599155a796ff92b39b07fc9f6febe208',
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
      address: '0x3730be2175f4e9cace752305b37891ec8cca5734',
    },
    {
      abi: ABI.Genes.abi,
      name: 'Genes',
      address: '0x463ea6dcbc54c5ed7d704332562187a30276e9b7',
    },
    // GeneRegistry not deployed to Sepolia yet
    // {
    //   abi: ABI.GeneRegistry.abi,
    //   name: 'GeneRegistry',
    //   address: '0x41063967Aa8337Ab89a2F69cA8FF54BA13Ce1f06',
    // },
  ],
});
