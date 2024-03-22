import type { Abi, Address } from 'abitype';
import { useAccount, useContractWrite, useNetwork } from 'wagmi';

import { useState } from 'react';

import contract from '../../../deployments/Aminals.json';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const contractConfig = {
  address: '0x9fe1e3Fd1e936d5348094e861B76C9E9d527E541' as Address,
  abi: contract.abi as Abi,
};

export default function BreedButton({ id1 }: { id1: string }) {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const enabled = isConnected && !chain?.unsupported;

  // Default breadwith ID is set to one
  const [breedWithId, setBreedWithId] = useState(1);

  const { writeAsync: breedWith } = useContractWrite({
    ...contractConfig,
    functionName: 'breedWith',
    args: [id1, breedWithId],
    value: BigInt(0.01 * 1e18),
  });

  const action = async () => {
    if (enabled) {
      await breedWith();
    }
  };

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
