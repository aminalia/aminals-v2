import { useAccount } from 'wagmi';

import { useWriteAminalsBreedWith } from '@/contracts/generated';
import { useState } from 'react';

export default function BreedButton({ id1 }: { id1: string }) {
  const { isConnected, chain } = useAccount();
  const enabled = isConnected && !chain;

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
      <br />

      <input
        placeholder="ID of the mate"
        onChange={handleBreedWithIdChange}
      ></input>

      <button
        type="button"
        onClick={action}
        disabled={!enabled}
        className={enabled ? '' : 'text-neutral-400'}
      >
        Breed
      </button>
    </div>
  );
}
