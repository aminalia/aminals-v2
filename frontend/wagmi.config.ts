import { defineConfig } from '@wagmi/cli';

const ABI = {
  Aminals: require('./deployments/sepolia/Aminals.json'),
  VisualsAuction: require('./deployments/sepolia/VisualsAuction.json'),
};

export default defineConfig({
  out: 'src/contracts/generated.ts',
  contracts: [
    {
      abi: ABI.Aminals.abi,
      name: 'Aminals',
      address: '0x81ed8e0325b17a266b2af225570679cfd635d0bb',
    },
    {
      abi: ABI.VisualsAuction.abi,
      name: 'VisualsAuction',
      address: '0x645b0f55268ef561176f3247d06d0b7742f79819',
    },
  ],
});
