import { useWriteAminalsBreedWith } from '@/contracts/generated';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function BreedButton({ id1 }: { id1: string }) {
  const { isConnected, chain } = useAccount();
  const enabled = isConnected && !chain;

  // Default breadwith ID is set to one
  const [breedWithId, setBreedWithId] = useState(1);

  const breedWidth = useWriteAminalsBreedWith();

  async function action() {
    if (enabled) {
      await breedWidth.writeContractAsync({
        args: [BigInt(id1), BigInt(breedWithId)],
      });
    }
  }

  const handleBreedWithIdChange = (event: any) => {
    setBreedWithId(event.target.value);
  };

  return (
    <div>
      <Input placeholder="ID of the mate" onChange={handleBreedWithIdChange} />
      <Button
        type="button"
        onClick={action}
        disabled={!enabled}
        className={enabled ? '' : 'text-neutral-400'}
      >
        Breed
      </Button>
    </div>
  );
}
