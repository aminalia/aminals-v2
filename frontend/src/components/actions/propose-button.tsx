import type { Abi, Address } from 'abitype';
import { useAccount, useContractWrite, useNetwork } from 'wagmi';

import { useState } from 'react';

import contract from '../../../deployments/VisualsAuction.json';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const contractConfig = {
  address: '0xb83Aa15dbe5636c656571DDbb74257a81f994B87' as Address,
  abi: contract.abi as Abi,
};

export default function ProposeButton({ auctionId }: { auctionId: any }) {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const enabled = isConnected && !chain?.unsupported;

  // Default breadwith ID is set to one
  const [catId, setCatId] = useState();
  const [vizId, setVizId] = useState();

  const { writeAsync: proposeVisual } = useContractWrite({
    ...contractConfig,
    functionName: 'proposeVisual',
    args: [auctionId, catId, vizId],
    value: BigInt(0.05 * 1e18), // TODO: don't hard-code this, replace it with a call to LoveDrivenPrice()
  });

  const action = async () => {
    if (enabled) {
      await proposeVisual();
    }
  };

  const handleCatIdChange = (event: any) => {
    setCatId(event.target.value);
  };
  const handleVizIdChange = (event: any) => {
    setVizId(event.target.value);
  };

  return (
    <div>
      <Input placeholder="ID of the category" onChange={handleCatIdChange} />
      <Input placeholder="ID of the Visual" onChange={handleVizIdChange} />
      <Button
        type="button"
        onClick={action}
        disabled={!enabled}
        className={enabled ? '' : 'text-neutral-400'}
      >
        Propose New Visual
      </Button>
    </div>
  );
}
