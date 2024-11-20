import { useWriteAminalsBreedWith } from '@/contracts/generated';
import { isBigInt } from '@/lib/utils';
import { ChangeEvent, useState } from 'react';
import { parseEther } from 'viem';
import { useAccount } from 'wagmi';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function BreedButton({ id }: { id: string }) {
  const { isConnected, chain } = useAccount();
  const enabled = isConnected && chain;

  const [breedWithId, setBreedWithId] = useState<string>('');
  const breedWith = useWriteAminalsBreedWith();

  async function action() {
    console.log('breedWithId', breedWithId);
    if (enabled && isBigInt(breedWithId)) {
      await breedWith.writeContractAsync({
        args: [BigInt(id), BigInt(breedWithId)],
        value: parseEther('0.001'),
      });
    }
  }

  const handleBreedWithIdChange = (event: ChangeEvent<HTMLInputElement>) => {
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
