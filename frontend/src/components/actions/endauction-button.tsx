import type { Abi, Address } from 'abitype';
import { useAccount, useContractWrite, useNetwork } from 'wagmi';

import contract from '../../../deployments/VisualsAuction.json';

const contractConfig = {
  address: '0xb83Aa15dbe5636c656571DDbb74257a81f994B87' as Address,
  abi: contract.abi as Abi,
};

export default function EndAuctionButton({ auctionId }: { auctionId: any }) {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const enabled = isConnected && !chain?.unsupported;

  const { writeAsync: EndAuction } = useContractWrite({
    ...contractConfig,
    functionName: 'endAuction',
    args: [auctionId],
  });

  const action = async () => {
    if (enabled) {
      await EndAuction();
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
