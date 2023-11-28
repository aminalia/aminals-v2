import type { Abi, Address } from 'abitype';
import { useAccount, useContractWrite, useNetwork } from 'wagmi';

import contract from '../../../deployments/VisualsAuction.json';

const contractConfig = {
  address: '0xb83Aa15dbe5636c656571DDbb74257a81f994B87' as Address,
  abi: contract.abi as Abi,
};

export default function VoteButton({
  auctionId,
  catId,
  vizId,
}: {
  auctionId: any;
  catId: any;
  vizId: any;
}) {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const enabled = isConnected && !chain?.unsupported;

  const { writeAsync: voteVisual } = useContractWrite({
    ...contractConfig,
    functionName: 'voteVisual',
    args: [auctionId, catId, vizId],
  });

  const action = async () => {
    if (enabled) {
      await voteVisual();
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
        [Vote on Visual {catId} - {vizId}]
      </button>
    </div>
  );
}
