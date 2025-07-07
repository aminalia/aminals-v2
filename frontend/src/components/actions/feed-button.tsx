import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { parseEther } from 'viem';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { aminalAbi } from '../../contracts/generated';
import { Button } from '../ui/button';

export default function FeedButton({
  contractAddress,
}: {
  contractAddress: `0x${string}`;
}) {
  const { isConnected, chain, address } = useAccount();
  const enabled = isConnected && chain;
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
      console.log('🍖 Feed aminal transaction initiated:', {
        hash,
        aminalAddress: contractAddress,
        userAddress: address,
        chainId: chain?.id,
        timestamp: new Date().toISOString(),
      });
    }
  }, [hash, contractAddress, address, chain?.id]);

  // Handle transaction success
  useEffect(() => {
    if (isConfirmed && receipt) {
      console.log('✅ Feed aminal transaction confirmed:', {
        hash,
        blockNumber: receipt.blockNumber,
        blockHash: receipt.blockHash,
        gasUsed: receipt.gasUsed?.toString(),
        effectiveGasPrice: receipt.effectiveGasPrice?.toString(),
        status: receipt.status,
        transactionIndex: receipt.transactionIndex,
        aminalAddress: contractAddress,
        timestamp: new Date().toISOString(),
      });

      toast.success('🍖 Aminal fed successfully! Energy increased!', {
        id: 'feed-tx',
        duration: 5000,
      });

      // Refresh the data - invalidate all related queries
      queryClient.invalidateQueries({
        queryKey: ['aminal-by-address', contractAddress],
      });
      queryClient.invalidateQueries({ queryKey: ['aminals-direct'] });
      queryClient.invalidateQueries({ queryKey: ['aminals'] });
    }
  }, [isConfirmed, receipt, hash, contractAddress, queryClient]);

  // Handle transaction errors
  useEffect(() => {
    if (error) {
      const errorDetails = {
        message: error.message,
        name: error.name,
        cause: error.cause,
        stack: error.stack,
        aminalAddress: contractAddress,
        userAddress: address,
        chainId: chain?.id,
        timestamp: new Date().toISOString(),
      };

      console.error('❌ Feed aminal transaction failed:', errorDetails);

      // More specific error messages based on error type
      let errorMessage = 'Failed to feed Aminal. Please try again.';
      if (error.message.includes('insufficient funds')) {
        errorMessage =
          'Insufficient funds. You need at least 0.01 ETH plus gas fees.';
      } else if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction was cancelled by user.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      }

      toast.error(errorMessage, { id: 'feed-tx' });
    }
  }, [error, contractAddress, address, chain?.id]);

  // Handle receipt errors
  useEffect(() => {
    if (receiptError) {
      const receiptErrorDetails = {
        message: receiptError.message,
        name: receiptError.name,
        cause: receiptError.cause,
        hash,
        aminalAddress: contractAddress,
        timestamp: new Date().toISOString(),
      };

      console.error(
        '❌ Feed aminal transaction receipt error:',
        receiptErrorDetails
      );
      toast.error('Transaction failed. Please try again.', { id: 'feed-tx' });
    }
  }, [receiptError, hash, contractAddress]);

  // Handle pending state
  useEffect(() => {
    if (isPending) {
      console.log('⏳ Feed aminal transaction pending...', {
        aminalAddress: contractAddress,
        userAddress: address,
        timestamp: new Date().toISOString(),
      });
      toast.loading('Preparing transaction...', { id: 'feed-tx' });
    }
  }, [isPending, contractAddress, address]);

  // Handle confirmation state
  useEffect(() => {
    if (isConfirming) {
      console.log('🔄 Feed aminal transaction confirming...', {
        hash,
        aminalAddress: contractAddress,
        timestamp: new Date().toISOString(),
      });
      toast.loading('Transaction submitted, waiting for confirmation...', {
        id: 'feed-tx',
      });
    }
  }, [isConfirming, hash, contractAddress]);

  function action() {
    if (!enabled || !contractAddress) {
      console.warn(
        '⚠️ Feed aminal attempted but wallet not connected or no contract address:',
        {
          isConnected,
          contractAddress,
          chainId: chain?.id,
          timestamp: new Date().toISOString(),
        }
      );
      return;
    }

    // Log the contract call parameters
    console.log('🚀 Initiating feed aminal transaction:', {
      contractAddress,
      functionName: 'feed',
      value: parseEther('0.01').toString(),
      userAddress: address,
      chainId: chain?.id,
      timestamp: new Date().toISOString(),
    });

    writeContract({
      abi: aminalAbi,
      address: contractAddress,
      functionName: 'feed',
      args: [],
      value: parseEther('0.01'),
    });
  }

  return (
    <Button
      onClick={action}
      disabled={!enabled || isPending || isConfirming}
      className="w-full rounded-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5"
    >
      {isPending
        ? '⏳ Feeding...'
        : isConfirming
        ? '⏳ Confirming...'
        : '🍖 Feed (0.01 ETH)'}
    </Button>
  );
}
