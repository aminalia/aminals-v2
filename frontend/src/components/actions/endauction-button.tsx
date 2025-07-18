import { useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { geneAuctionAbi, geneAuctionAddress } from '../../contracts/generated';
import { Button } from '../ui/button';

interface EndAuctionButtonProps {
  auctionId: bigint | string;
  className?: string;
}

export default function EndAuctionButton({
  auctionId,
  className,
}: EndAuctionButtonProps) {
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
      console.log('🏁 End auction transaction initiated:', {
        hash,
        auctionId: auctionId.toString(),
        userAddress: address,
        chainId: chain?.id,
        contractAddress: geneAuctionAddress,
        timestamp: new Date().toISOString(),
      });
    }
  }, [hash, auctionId, address, chain?.id]);

  // Handle transaction success
  useEffect(() => {
    if (isConfirmed && receipt) {
      console.log('✅ End auction transaction confirmed:', {
        hash,
        blockNumber: receipt.blockNumber,
        blockHash: receipt.blockHash,
        gasUsed: receipt.gasUsed?.toString(),
        effectiveGasPrice: receipt.effectiveGasPrice?.toString(),
        status: receipt.status,
        transactionIndex: receipt.transactionIndex,
        auctionId: auctionId.toString(),
        timestamp: new Date().toISOString(),
      });

      toast.success('🎉 Aminal birthed successfully! New life created!', {
        id: 'end-auction-tx',
        duration: 5000,
      });
    }
  }, [isConfirmed, receipt, hash, auctionId]);

  // Handle transaction errors
  useEffect(() => {
    if (error) {
      const errorDetails = {
        message: error.message,
        name: error.name,
        cause: error.cause,
        stack: error.stack,
        auctionId: auctionId.toString(),
        userAddress: address,
        chainId: chain?.id,
        contractAddress: geneAuctionAddress,
        timestamp: new Date().toISOString(),
      };

      console.error('❌ End auction transaction failed:', errorDetails);

      // More specific error messages based on error type
      let errorMessage = 'Failed to birth Aminal. Please try again.';
      if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds to complete the transaction.';
      } else if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction was cancelled by user.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message.includes('auction')) {
        errorMessage = 'Auction error. Check if the auction can be settled.';
      }

      toast.error(errorMessage, {
        id: 'end-auction-tx',
      });
    }
  }, [error, auctionId, address, chain?.id]);

  // Handle receipt errors
  useEffect(() => {
    if (receiptError) {
      const receiptErrorDetails = {
        message: receiptError.message,
        name: receiptError.name,
        cause: receiptError.cause,
        hash,
        auctionId: auctionId.toString(),
        timestamp: new Date().toISOString(),
      };

      console.error(
        '❌ End auction transaction receipt error:',
        receiptErrorDetails
      );
      toast.error('Aminal birthing failed. Please try again.', {
        id: 'end-auction-tx',
      });
    }
  }, [receiptError, hash, auctionId]);

  // Handle pending state
  useEffect(() => {
    if (isPending) {
      console.log('⏳ End auction transaction pending...', {
        auctionId: auctionId.toString(),
        userAddress: address,
        timestamp: new Date().toISOString(),
      });
      toast.loading('Birthing Aminal...', { id: 'end-auction-tx' });
    }
  }, [isPending, auctionId, address]);

  // Handle confirmation state
  useEffect(() => {
    if (isConfirming) {
      console.log('🔄 End auction transaction confirming...', {
        hash,
        auctionId: auctionId.toString(),
        timestamp: new Date().toISOString(),
      });
      toast.loading('Confirming Aminal birth...', {
        id: 'end-auction-tx',
      });
    }
  }, [isConfirming, hash, auctionId]);

  const handleEndAuction = () => {
    if (!enabled) {
      console.warn('⚠️ End auction attempted but wallet not connected:', {
        isConnected,
        chainId: chain?.id,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Log the contract call parameters
    console.log('🚀 Initiating end auction transaction:', {
      contractAddress: geneAuctionAddress,
      functionName: 'settleAuction',
      auctionId: BigInt(auctionId).toString(),
      userAddress: address,
      chainId: chain?.id,
      timestamp: new Date().toISOString(),
    });

    writeContract({
      abi: geneAuctionAbi,
      address: geneAuctionAddress,
      functionName: 'settleAuction',
      args: [BigInt(auctionId)],
    });
  };

  return (
    <Button
      onClick={handleEndAuction}
      disabled={!enabled || isPending || isConfirming}
      variant="default"
      size="sm"
      className={`bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 ${className}`}
    >
      {isPending || isConfirming
        ? '🍼 Birthing...'
        : enabled
        ? '👶 Birth Aminal'
        : '🔗 Connect to birth aminal'}
    </Button>
  );
}
