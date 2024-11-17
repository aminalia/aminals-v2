import { defineConfig } from '@wagmi/cli';

const ABI = {
  Aminals: require('./deployments/Aminals.json'),
  VisualsAuction: require('./deployments/VisualsAuction.json'),
};

export default defineConfig({
  out: 'src/contracts/generated.ts',
  contracts: [
    {
      abi: ABI.Aminals.abi,
      name: 'Aminals',
      address: '0xb60971942e4528a811d24826768bc91ad1383d21',
    },
    {
      abi: ABI.VisualsAuction.abi,
      name: 'VisualsAuction',
      address: '0xfccab12127c6b007ab56733be57cd364182ccecc',
    },
  ],
});
