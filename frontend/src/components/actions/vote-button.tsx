import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { geneAuctionAbi, geneAuctionAddress } from '../../contracts/generated';
import { Button } from '../ui/button';

export default function VoteButton({
  auctionId,
  catId,
  vizId,
}: {
  auctionId: any;
  catId: any;
  vizId: any;
}) {
  const { isConnected, chain, address } = useAccount();
  const enabled = isConnected && chain;
  const { writeContract, isPending, data: hash, error } = useWriteContract();

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
      console.log('🗳️ Vote transaction initiated:', {
        hash,
        auctionId: auctionId.toString(),
        categoryId: catId,
        geneId: vizId,
        userAddress: address,
        chainId: chain?.id,
        contractAddress: geneAuctionAddress,
        timestamp: new Date().toISOString(),
      });
    }
  }, [hash, auctionId, catId, vizId, address, chain?.id]);

  // Handle transaction success
  useEffect(() => {
    if (isConfirmed && receipt) {
      console.log('✅ Vote transaction confirmed:', {
        hash,
        blockNumber: receipt.blockNumber,
        blockHash: receipt.blockHash,
        gasUsed: receipt.gasUsed?.toString(),
        effectiveGasPrice: receipt.effectiveGasPrice?.toString(),
        status: receipt.status,
        transactionIndex: receipt.transactionIndex,
        auctionId: auctionId.toString(),
        categoryId: catId,
        geneId: vizId,
        timestamp: new Date().toISOString(),
      });

      toast.success('🗳️ Vote cast successfully!', {
        id: `vote-${catId}-${vizId}`,
        duration: 3000,
      });
    }
  }, [isConfirmed, receipt, hash, auctionId, catId, vizId]);

  // Handle transaction errors
  useEffect(() => {
    if (error) {
      const errorDetails = {
        message: error.message,
        name: error.name,
        cause: error.cause,
        stack: error.stack,
        auctionId: auctionId.toString(),
        categoryId: catId,
        geneId: vizId,
        userAddress: address,
        chainId: chain?.id,
        contractAddress: geneAuctionAddress,
        timestamp: new Date().toISOString(),
      };

      console.error('❌ Vote transaction failed:', errorDetails);

      // More specific error messages based on error type
      let errorMessage = 'Failed to cast vote. Please try again.';
      if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds to complete the transaction.';
      } else if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction was cancelled by user.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message.includes('auction')) {
        errorMessage = 'Auction error. Please check if voting is still active.';
      }

      toast.error(errorMessage, {
        id: `vote-${catId}-${vizId}`,
      });
    }
  }, [error, auctionId, catId, vizId, address, chain?.id]);

  // Handle receipt errors
  useEffect(() => {
    if (receiptError) {
      const receiptErrorDetails = {
        message: receiptError.message,
        name: receiptError.name,
        cause: receiptError.cause,
        hash,
        auctionId: auctionId.toString(),
        categoryId: catId,
        geneId: vizId,
        timestamp: new Date().toISOString(),
      };

      console.error('❌ Vote transaction receipt error:', receiptErrorDetails);
      toast.error('Vote failed. Please try again.', {
        id: `vote-${catId}-${vizId}`,
      });
    }
  }, [receiptError, hash, auctionId, catId, vizId]);

  // Handle pending state
  useEffect(() => {
    if (isPending) {
      console.log('⏳ Vote transaction pending...', {
        auctionId: auctionId.toString(),
        categoryId: catId,
        geneId: vizId,
        userAddress: address,
        timestamp: new Date().toISOString(),
      });
      toast.loading('Casting vote...', { id: `vote-${catId}-${vizId}` });
    }
  }, [isPending, auctionId, catId, vizId, address]);

  // Handle confirmation state
  useEffect(() => {
    if (isConfirming) {
      console.log('🔄 Vote transaction confirming...', {
        hash,
        auctionId: auctionId.toString(),
        categoryId: catId,
        geneId: vizId,
        timestamp: new Date().toISOString(),
      });
      toast.loading('Confirming vote...', { id: `vote-${catId}-${vizId}` });
    }
  }, [isConfirming, hash, auctionId, catId, vizId]);

  const action = () => {
    if (enabled) {
      // Log the contract call parameters
      console.log('🚀 Initiating vote transaction:', {
        contractAddress: geneAuctionAddress,
        functionName: 'voteOnGene',
        auctionId: BigInt(auctionId).toString(),
        categoryId: catId,
        geneId: BigInt(vizId).toString(),
        userAddress: address,
        chainId: chain?.id,
        timestamp: new Date().toISOString(),
      });

      writeContract({
        abi: geneAuctionAbi,
        address: geneAuctionAddress,
        functionName: 'voteOnGene',
        args: [BigInt(auctionId), catId, BigInt(vizId)],
      });
    } else {
      console.warn('⚠️ Vote attempted but wallet not connected:', {
        isConnected,
        chainId: chain?.id,
        timestamp: new Date().toISOString(),
      });
    }
  };

  return (
    <Button
      type="button"
      onClick={action}
      disabled={!enabled || isPending || isConfirming}
      className={cn(
        enabled ? '' : 'text-neutral-400',
        (isPending || isConfirming) && 'opacity-50 cursor-not-allowed'
      )}
    >
      {isPending || isConfirming ? 'Voting...' : `Vote on Gene ${vizId}`}
    </Button>
  );
}
