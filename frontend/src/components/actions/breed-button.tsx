import { useWriteAminalsBreedWith } from '@/contracts/generated';
import type { Abi, Address } from 'abitype';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const contractConfig = {
  address: '0x9fe1e3Fd1e936d5348094e861B76C9E9d527E541' as Address,
  abi: contract.abi as Abi,
};

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
