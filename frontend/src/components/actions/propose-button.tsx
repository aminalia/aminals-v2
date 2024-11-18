import { useWriteVisualsAuctionProposeVisual } from '@/contracts/generated';
import { useState } from 'react';
import { parseEther } from 'viem';
import { useAccount } from 'wagmi';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function ProposeButton({ auctionId }: { auctionId: any }) {
  const { isConnected, chain } = useAccount();
  const enabled = isConnected && chain;

  // Default breadwith ID is set to one
  const [catId, setCatId] = useState(0);
  const [vizId, setVizId] = useState(0);

  const proposeVisual = useWriteVisualsAuctionProposeVisual();

  const action = async () => {
    if (enabled) {
      await proposeVisual.writeContractAsync({
        args: [auctionId, catId, BigInt(vizId)],
        value: BigInt(parseEther('0.05')),
      });
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
