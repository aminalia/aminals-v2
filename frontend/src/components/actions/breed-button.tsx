import type { Abi, Address } from 'abitype';
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from 'wagmi';

import { useState } from 'react';

import contract from '../../../deployments/Aminals.json';

const contractConfig = {
  address: '0xA3183Bd17b3A0BB420CCc36E495668c00A1007B1' as Address,
  abi: contract.abi as Abi,
};

export default function BreedButton({ id1 }: { id1: string }) {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const enabled = isConnected && !chain?.unsupported;

  const [breedWithId, setBreedWithId] = useState(1);

  const { config: contractWriteConfig, isLoading: mintPrepLoading } =
    usePrepareContractWrite({
      ...contractConfig,
      functionName: 'breedWith',
      args: [id1, breedWithId],
      enabled,
      value: BigInt(0.01 * 1e18),
    });

  const { data: breedData, write: breedWith } =
    useContractWrite(contractWriteConfig);

  async function action() {
    if (enabled) {
      await breedWith?.();
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
