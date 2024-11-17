import { useAccount } from 'wagmi';

import { useWriteAminalsFeed } from '@/contracts/generated';

export default function FeedButton({ id }: { id: string }) {
  const { isConnected, chain } = useAccount();
  const enabled = isConnected && chain;

  const feed = useWriteAminalsFeed();

  async function action() {
    if (enabled) {
      await feed.writeContractAsync({
        args: [BigInt(id)],
      });
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
