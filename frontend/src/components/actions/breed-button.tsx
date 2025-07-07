import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { isAddress, parseEther } from 'viem';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import {
  aminalFactoryAbi,
  aminalFactoryAddress,
} from '../../contracts/generated';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function BreedButton({
  contractAddress,
}: {
  contractAddress: `0x${string}`;
}) {
  const { isConnected, chain, address } = useAccount();
  const enabled = isConnected && chain;
  const [partnerAddress, setPartnerAddress] = useState<string>('');
  const [step, setStep] = useState<'consent' | 'auction'>('consent');
  const { writeContract, isPending, data: hash, error } = useWriteContract();
  const queryClient = useQueryClient();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Log transaction initiation
  useEffect(() => {
    if (hash) {
      console.log('💕 Breed transaction initiated:', {
        hash,
        step,
        aminalAddress: contractAddress,
        partnerAddress,
        userAddress: address,
        chainId: chain?.id,
        contractAddress: aminalFactoryAddress,
        timestamp: new Date().toISOString(),
      });
    }
  }, [hash, step, contractAddress, partnerAddress, address, chain?.id]);

  // Handle transaction success
  useEffect(() => {
    if (isConfirmed && receipt) {
      console.log('✅ Breed transaction confirmed:', {
        hash,
        blockNumber: receipt.blockNumber,
        blockHash: receipt.blockHash,
        gasUsed: receipt.gasUsed?.toString(),
        effectiveGasPrice: receipt.effectiveGasPrice?.toString(),
        status: receipt.status,
        transactionIndex: receipt.transactionIndex,
        step,
        aminalAddress: contractAddress,
        partnerAddress,
        timestamp: new Date().toISOString(),
      });

      if (step === 'consent') {
        toast.success('💕 Breeding consent given successfully!', {
          id: 'breed-tx',
          duration: 5000,
        });
        setStep('auction');
      } else if (step === 'auction') {
        toast.success(
          '🍼 Gene auction started! Community can now vote on offspring traits.',
          {
            id: 'breed-tx',
            duration: 6000,
          }
        );
      }

      queryClient.invalidateQueries({
        queryKey: ['aminal-by-address', contractAddress],
      });
      queryClient.invalidateQueries({ queryKey: ['aminals-direct'] });
      queryClient.invalidateQueries({ queryKey: ['aminals'] });
    }
  }, [
    isConfirmed,
    receipt,
    hash,
    step,
    contractAddress,
    partnerAddress,
    queryClient,
  ]);

  // Handle transaction errors
  useEffect(() => {
    if (error) {
      const errorDetails = {
        message: error.message,
        name: error.name,
        cause: error.cause,
        stack: error.stack,
        step,
        aminalAddress: contractAddress,
        partnerAddress,
        userAddress: address,
        chainId: chain?.id,
        contractAddress: aminalFactoryAddress,
        timestamp: new Date().toISOString(),
      };

      console.error('❌ Breed transaction failed:', errorDetails);

      // More specific error messages based on error type
      let errorMessage = 'Transaction failed. Please try again.';
      if (error.message.includes('insufficient funds')) {
        errorMessage =
          'Insufficient funds. You need at least 0.001 ETH plus gas fees.';
      } else if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction was cancelled by user.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message.includes('breeding')) {
        errorMessage =
          'Breeding error. Check if both Aminals are eligible to breed.';
      }

      toast.error(errorMessage, { id: 'breed-tx' });
    }
  }, [error, step, contractAddress, partnerAddress, address, chain?.id]);

  // Handle receipt errors
  useEffect(() => {
    if (receiptError) {
      const receiptErrorDetails = {
        message: receiptError.message,
        name: receiptError.name,
        cause: receiptError.cause,
        hash,
        step,
        aminalAddress: contractAddress,
        partnerAddress,
        timestamp: new Date().toISOString(),
      };

      console.error('❌ Breed transaction receipt error:', receiptErrorDetails);
      toast.error('Transaction failed. Please try again.', { id: 'breed-tx' });
    }
  }, [receiptError, hash, step, contractAddress, partnerAddress]);

  // Handle pending state
  useEffect(() => {
    if (isPending) {
      console.log('⏳ Breed transaction pending...', {
        step,
        aminalAddress: contractAddress,
        partnerAddress,
        userAddress: address,
        timestamp: new Date().toISOString(),
      });
      toast.loading('Preparing transaction...', { id: 'breed-tx' });
    }
  }, [isPending, step, contractAddress, partnerAddress, address]);

  // Handle confirmation state
  useEffect(() => {
    if (isConfirming) {
      console.log('🔄 Breed transaction confirming...', {
        hash,
        step,
        aminalAddress: contractAddress,
        partnerAddress,
        timestamp: new Date().toISOString(),
      });

      const message =
        step === 'consent'
          ? 'Giving breeding consent...'
          : 'Starting gene auction...';
      toast.loading(message, { id: 'breed-tx' });
    }
  }, [isConfirming, hash, step, contractAddress, partnerAddress]);

  function giveConsent() {
    if (!enabled || !isAddress(partnerAddress)) {
      toast.error('Please enter a valid partner contract address');
      return;
    }

    // Log the contract call parameters
    console.log('🚀 Initiating breed consent transaction:', {
      contractAddress: aminalFactoryAddress,
      functionName: 'breedAminals',
      aminalAddress: contractAddress,
      partnerAddress,
      value: parseEther('0.001').toString(),
      userAddress: address,
      chainId: chain?.id,
      timestamp: new Date().toISOString(),
    });

    writeContract({
      abi: aminalFactoryAbi,
      address: aminalFactoryAddress,
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

    // Log the contract call parameters
    console.log('🚀 Initiating breed auction transaction:', {
      contractAddress: aminalFactoryAddress,
      functionName: 'breedAminals',
      aminalAddress: contractAddress,
      partnerAddress,
      value: parseEther('0.001').toString(),
      userAddress: address,
      chainId: chain?.id,
      timestamp: new Date().toISOString(),
    });

    writeContract({
      abi: aminalFactoryAbi,
      address: aminalFactoryAddress,
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
        disabled={isPending || isConfirming}
        className="w-full"
      />

      {step === 'consent' ? (
        <Button
          onClick={giveConsent}
          disabled={
            !enabled || !isAddress(partnerAddress) || isPending || isConfirming
          }
          variant="outline"
          className="w-full"
        >
          {isPending || isConfirming
            ? '⏳ Giving Consent...'
            : '💕 Give Breeding Consent'}
        </Button>
      ) : (
        <Button
          onClick={startAuction}
          disabled={
            !enabled || !isAddress(partnerAddress) || isPending || isConfirming
          }
          className="w-full bg-pink-600 hover:bg-pink-700 text-white"
        >
          {isPending || isConfirming
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
