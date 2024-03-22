import type { Abi, Address } from 'abitype';
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from 'wagmi';
import contract from '../../../deployments/Aminals.json';
import { Button } from '../ui/button';

const contractConfig = {
  address: '0x9fe1e3Fd1e936d5348094e861B76C9E9d527E541' as Address,
  abi: contract.abi as Abi,
};

export default function FeedButton({ id }: { id: string }) {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const enabled = isConnected && !chain?.unsupported;

  const { config: contractWriteConfig, isLoading: mintPrepLoading } =
    usePrepareContractWrite({
      ...contractConfig,
      functionName: 'feed',
      args: [id],
      enabled,
      value: BigInt(0.01 * 1e18),
    });

  const { data: feedData, write: feed } = useContractWrite(contractWriteConfig);

  async function action() {
    if (enabled) {
      await feed?.();
    }
  }

  return (
    <Button
      type="button"
      onClick={action}
      disabled={!enabled}
      className={enabled ? '' : 'text-neutral-400'}
    >
      Feed 0.01 ETH
    </Button>
  );
}
