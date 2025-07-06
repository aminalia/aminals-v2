import { parseEther } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';
import { Button } from '../ui/button';
const aminalFactoryAbi = require('../../../deployments/AminalFactory.json').abi;

const AMINAL_FACTORY_ADDRESS =
  '0x5dcda867599155a796ff92b39b07fc9f6febe208' as const;

export default function SpawnAminalButton() {
  const { isConnected, chain } = useAccount();
  const enabled = isConnected && chain;
  const { writeContractAsync, isPending } = useWriteContract();

  async function spawnAminal() {
    if (enabled) {
      // Generate random traits for now - in a real implementation this could be user-selected
      const randomVisuals = {
        backId: BigInt(Math.floor(Math.random() * 10) + 1),
        armId: BigInt(Math.floor(Math.random() * 10) + 1),
        tailId: BigInt(Math.floor(Math.random() * 10) + 1),
        earsId: BigInt(Math.floor(Math.random() * 10) + 1),
        bodyId: BigInt(Math.floor(Math.random() * 10) + 1),
        faceId: BigInt(Math.floor(Math.random() * 10) + 1),
        mouthId: BigInt(Math.floor(Math.random() * 10) + 1),
        miscId: BigInt(Math.floor(Math.random() * 10) + 1),
      };

      await writeContractAsync({
        abi: aminalFactoryAbi,
        address: AMINAL_FACTORY_ADDRESS,
        functionName: 'spawnAminal',
        args: [
          '0x0000000000000000000000000000000000000000', // mom (genesis)
          '0x0000000000000000000000000000000000000000', // dad (genesis)
          randomVisuals,
        ],
        value: parseEther('0.01'), // Cost to spawn
      });
    }
  }

  return (
    <Button
      onClick={spawnAminal}
      disabled={!enabled || isPending}
      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3"
    >
      {isPending ? '⏳ Spawning...' : '🐣 Spawn New Aminal (0.01 ETH)'}
    </Button>
  );
}
