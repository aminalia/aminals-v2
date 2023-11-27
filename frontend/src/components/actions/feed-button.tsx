import type { Abi, Address } from 'abitype';
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from 'wagmi';
import contract from '../../../deployments/Aminals.json';

const contractConfig = {
  address: '0xA3183Bd17b3A0BB420CCc36E495668c00A1007B1' as Address,
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
    <button
      type="button"
      onClick={action}
      disabled={!enabled}
      className={enabled ? '' : 'text-neutral-400'}
    >
      Feed 0.01 ETH
    </button>
  );
}
