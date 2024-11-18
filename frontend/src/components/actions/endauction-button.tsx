import { useWriteVisualsAuctionEndAuction } from '@/contracts/generated';
import { useAccount } from 'wagmi';

export default function EndAuctionButton({ auctionId }: { auctionId: any }) {
  const { isConnected, chain } = useAccount();
  const enabled = isConnected && chain;
  const endAuction = useWriteVisualsAuctionEndAuction();

  const action = async () => {
    if (enabled) {
      await endAuction.writeContractAsync({ args: [auctionId] });
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={action}
        disabled={!enabled}
        className={enabled ? '' : 'text-neutral-400'}
      >
        [End Auction]
      </button>
    </div>
  );
}
