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
      address: '0x18fb0d34dd411ac314dcb8c9e0331b76bebf002a',
    },
    {
      abi: ABI.VisualsAuction.abi,
      name: 'VisualsAuction',
      address: '0xe4d8c56167c6508588a84a64d9234bad238cd95b',
    },
  ],
});
