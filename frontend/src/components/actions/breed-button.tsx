import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { isAddress, parseEther } from 'viem';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
const aminalAbi = require('../../../deployments/Aminal.json').abi;
const aminalFactoryAbi = require('../../../deployments/AminalFactory.json').abi;

const AMINAL_FACTORY_ADDRESS =
  '0x5dcda867599155a796ff92b39b07fc9f6febe208' as const;

export default function BreedButton({
  contractAddress,
}: {
  contractAddress: `0x${string}`;
}) {
  const { isConnected, chain } = useAccount();
  const enabled = isConnected && chain;
  const [partnerAddress, setPartnerAddress] = useState<string>('');
  const [step, setStep] = useState<'consent' | 'auction'>('consent');
  const { writeContract, isPending, data: hash, error } = useWriteContract();
  const queryClient = useQueryClient();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle transaction success
  useEffect(() => {
    if (isConfirmed && step === 'consent') {
      toast.success('💕 Breeding consent given successfully!', {
        id: 'breed-tx',
        duration: 5000,
      });
      setStep('auction');
      queryClient.invalidateQueries({
        queryKey: ['aminal-by-address', contractAddress],
      });
      queryClient.invalidateQueries({ queryKey: ['aminals-direct'] });
      queryClient.invalidateQueries({ queryKey: ['aminals'] });
    } else if (isConfirmed && step === 'auction') {
      toast.success(
        '🍼 Gene auction started! Community can now vote on offspring traits.',
        {
          id: 'breed-tx',
          duration: 6000,
        }
      );
      queryClient.invalidateQueries({
        queryKey: ['aminal-by-address', contractAddress],
      });
      queryClient.invalidateQueries({ queryKey: ['aminals-direct'] });
      queryClient.invalidateQueries({ queryKey: ['aminals'] });
    }
  }, [isConfirmed, step, queryClient, contractAddress]);

  // Handle transaction errors
  useEffect(() => {
    if (error) {
      console.error('Breed transaction failed:', error);
      toast.error('Transaction failed. Please try again.', { id: 'breed-tx' });
    }
  }, [error]);

  // Handle receipt errors
  useEffect(() => {
    if (receiptError) {
      console.error('Transaction receipt error:', receiptError);
      toast.error('Transaction failed. Please try again.', { id: 'breed-tx' });
    }
  }, [receiptError]);

  // Handle pending transaction
  useEffect(() => {
    if (isPending) {
      toast.loading('Preparing transaction...', { id: 'breed-tx' });
    } else if (isConfirming && hash) {
      const message =
        step === 'consent'
          ? 'Giving breeding consent...'
          : 'Starting gene auction...';
      toast.loading(message, { id: 'breed-tx' });
    }
  }, [isPending, isConfirming, hash, step]);

  function giveConsent() {
    if (!enabled || !isAddress(partnerAddress)) {
      toast.error('Please enter a valid partner contract address');
      return;
    }

    writeContract({
      abi: aminalFactoryAbi,
      address: AMINAL_FACTORY_ADDRESS,
      functionName: 'breedAminals',
      args: [contractAddress, partnerAddress as `0x${string}`],
      value: parseEther('0.001'),
    });
  }

  function startAuction() {
    if (!enabled || !isAddress(partnerAddress)) {
      toast.error('Please enter a valid partner contract address');
      return;
    }

    writeContract({
      abi: aminalFactoryAbi,
      address: AMINAL_FACTORY_ADDRESS,
      functionName: 'breedAminals',
      args: [contractAddress, partnerAddress as `0x${string}`],
      value: parseEther('0.001'),
    });
  }

  return (
    <div className="space-y-2">
      <Input
        placeholder="Enter partner contract address (0x...)"
        value={partnerAddress}
        onChange={(e) => setPartnerAddress(e.target.value)}
        className="w-full"
      />

      {step === 'consent' ? (
        <Button
          onClick={giveConsent}
          disabled={!enabled || !isAddress(partnerAddress) || isPending}
          variant="outline"
          className="w-full"
        >
          {isPending ? '⏳ Giving Consent...' : '💕 Give Breeding Consent'}
        </Button>
      ) : (
        <Button
          onClick={startAuction}
          disabled={!enabled || !isAddress(partnerAddress) || isPending}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white"
        >
          {isPending
            ? '⏳ Starting Auction...'
            : '🍼 Start Gene Auction (0.001 ETH)'}
        </Button>
      )}

      {step === 'auction' && (
        <p className="text-sm text-gray-600">
          Consent given! Now start the gene auction to create offspring.
        </p>
      )}
    </div>
  );
}
