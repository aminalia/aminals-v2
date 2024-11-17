import { defineConfig } from '@wagmi/cli';
import { react } from '@wagmi/cli/plugins';

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
  plugins: [
    // hardhat({
    //   project: '../contracts',
    //   deployments: {
    //     VisualsAuction: {
    //       //   [hardhatChain.id]: HardhatDeployments.VisualsAuction.address,
    //       [sepolia.id]: '0x',
    //       [holesky.id]: '0x645b0f55268ef561176f3247d06d0b7742f79819',
    //     },
    //     Aminals: {
    //       //   [hardhatChain.id]: HardhatDeployments.Aminals.address,
    //       [sepolia.id]: '0x24BEd8962601Caa39e51F02bdC0251Ae51FF0d70',
    //       [holesky.id]: '0x81ed8e0325b17a266b2af225570679cfd635d0bb',
    //     },
    //   },
    // }),
    react({
      // getHookName({ contractName, type }) {
      //   return `use${contractName}__${type}`
      // },
    }),
  ],
});
