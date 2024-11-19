import { useWriteVisualsAuctionVoteVisual } from '@/contracts/generated';
import { useAccount } from 'wagmi';
import { Button } from '../ui/button';

export default function VoteButton({
  auctionId,
  catId,
  vizId,
}: {
  auctionId: any;
  catId: any;
  vizId: any;
}) {
  const { isConnected, chain } = useAccount();
  const enabled = isConnected && chain;
  const voteVisual = useWriteVisualsAuctionVoteVisual();

  const action = async () => {
    if (enabled) {
      await voteVisual.writeContractAsync({
        args: [auctionId, catId, BigInt(vizId)],
      });
    }
  };

  return (
    <Button
      type="button"
      onClick={action}
      disabled={!enabled}
      className={enabled ? '' : 'text-neutral-400'}
    >
      [Vote on Visual {catId} - {vizId}]
    </Button>
  );
}
