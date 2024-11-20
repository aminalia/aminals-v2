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
      address: '0x3350b16c29ea6eb7c0a0b40cb11ba630eb511827',
    },
  ],
});
