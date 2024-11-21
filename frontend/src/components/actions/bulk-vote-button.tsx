import { useWriteVisualsAuctionBulkVoteVisual } from '@/contracts/generated';
import { useAccount } from 'wagmi';
import { Button } from '../ui/button';

export default function BulkVoteButton({
  auctionId,
  backId,
  armId,
  tailId,
  earsId,
  bodyId,
  faceId,
  mouthId,
  miscId,
}: {
  auctionId: any;
  backId: any;
  armId: any;
  tailId: any;
  earsId: any;
  bodyId: any;
  faceId: any;
  mouthId: any;
  miscId: any;
}) {
  console.log([backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId]);

  const { isConnected, chain } = useAccount();
  const enabled = isConnected && chain;
  const voteVisual = useWriteVisualsAuctionBulkVoteVisual();

  const action = async () => {
    if (enabled) {
      await voteVisual.writeContractAsync({
        args: [
          auctionId,
          [backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId],
        ],
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
      Vote
    </Button>
  );
}
