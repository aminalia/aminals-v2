import type { Abi, Address } from 'abitype';
import { useAccount, useContractWrite, useNetwork } from 'wagmi';

import { useState } from 'react';

import contract from '../../../deployments/VisualsAuction.json';

const contractConfig = {
  address: '0xbdF4BE45f35Fd6a1BABF16c7C38c1403a569E5B0' as Address,
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
  }

  return (
    <div>
      <button
        type="button"
        onClick={action}
        disabled={!enabled}
        className={enabled ? '' : 'text-neutral-400'}
      >
        Propose new Visual:
      </button>
      <input
        placeholder="ID of the category"
        onChange={handleCatIdChange}
      />
      <input
        placeholder="ID of the Visual"
        onChange={handleVizIdChange}
      />
    </div>
  );
}
