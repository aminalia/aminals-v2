import { useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { geneAuctionAbi, geneAuctionAddress } from '../../contracts/generated';
import { Button } from '../ui/button';

export default function BulkVoteButton({
  auctionId,
  backId,
  armId,
  tailId,
  earsId,
  bodyId,
  faceId,
  mouthId,
  miscId,
}: {
  auctionId: any;
  backId: any;
  armId: any;
  tailId: any;
  earsId: any;
  bodyId: any;
  faceId: any;
  mouthId: any;
  miscId: any;
}) {
  const traitIds = [
    backId,
    armId,
    tailId,
    earsId,
    bodyId,
    faceId,
    mouthId,
    miscId,
  ];

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
      console.log('🗳️ Bulk vote transaction initiated:', {
        hash,
        auctionId,
        traitIds,
        userAddress: address,
        chainId: chain?.id,
        contractAddress: geneAuctionAddress,
        timestamp: new Date().toISOString(),
      });
    }
  }, [hash, auctionId, traitIds, address, chain?.id]);

  // Handle transaction success
  useEffect(() => {
    if (isConfirmed && receipt) {
      console.log('✅ Bulk vote transaction confirmed:', {
        hash,
        blockNumber: receipt.blockNumber,
        blockHash: receipt.blockHash,
        gasUsed: receipt.gasUsed?.toString(),
        effectiveGasPrice: receipt.effectiveGasPrice?.toString(),
        status: receipt.status,
        transactionIndex: receipt.transactionIndex,
        auctionId,
        traitIds,
        timestamp: new Date().toISOString(),
      });

      toast.success('🗳️ All votes cast successfully!', {
        id: 'bulk-vote-tx',
        duration: 4000,
      });
    }
  }, [isConfirmed, receipt, hash, auctionId, traitIds]);

  // Handle transaction errors
  useEffect(() => {
    if (error) {
      const errorDetails = {
        message: error.message,
        name: error.name,
        cause: error.cause,
        stack: error.stack,
        auctionId,
        traitIds,
        userAddress: address,
        chainId: chain?.id,
        contractAddress: geneAuctionAddress,
        timestamp: new Date().toISOString(),
      };

      console.error('❌ Bulk vote transaction failed:', errorDetails);

      // More specific error messages based on error type
      let errorMessage = 'Failed to cast votes. Please try again.';
      if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds to complete the transaction.';
      } else if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction was cancelled by user.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      }

      toast.error(errorMessage, {
        id: 'bulk-vote-tx',
      });
    }
  }, [error, auctionId, traitIds, address, chain?.id]);

  // Handle receipt errors
  useEffect(() => {
    if (receiptError) {
      const receiptErrorDetails = {
        message: receiptError.message,
        name: receiptError.name,
        cause: receiptError.cause,
        hash,
        auctionId,
        traitIds,
        timestamp: new Date().toISOString(),
      };

      console.error(
        '❌ Bulk vote transaction receipt error:',
        receiptErrorDetails
      );
      toast.error('Votes failed. Please try again.', {
        id: 'bulk-vote-tx',
      });
    }
  }, [receiptError, hash, auctionId, traitIds]);

  // Handle pending state
  useEffect(() => {
    if (isPending) {
      console.log('⏳ Bulk vote transaction pending...', {
        auctionId,
        traitIds,
        userAddress: address,
        timestamp: new Date().toISOString(),
      });
      toast.loading('Casting votes...', { id: 'bulk-vote-tx' });
    }
  }, [isPending, auctionId, traitIds, address]);

  // Handle confirmation state
  useEffect(() => {
    if (isConfirming) {
      console.log('🔄 Bulk vote transaction confirming...', {
        hash,
        auctionId,
        traitIds,
        timestamp: new Date().toISOString(),
      });
      toast.loading('Confirming votes...', { id: 'bulk-vote-tx' });
    }
  }, [isConfirming, hash, auctionId, traitIds]);

  const action = () => {
    if (enabled) {
      // Convert trait IDs to BigInt array (8 elements for all categories)
      const geneIds = traitIds.map((id) => BigInt(id)) as [
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint
      ];

      // Log the contract call parameters
      console.log('🚀 Initiating bulk vote transaction:', {
        contractAddress: geneAuctionAddress,
        functionName: 'bulkVoteOnGenes',
        auctionId: BigInt(auctionId).toString(),
        geneIds: geneIds.map((id) => id.toString()),
        userAddress: address,
        chainId: chain?.id,
        timestamp: new Date().toISOString(),
      });

      writeContract({
        abi: geneAuctionAbi,
        address: geneAuctionAddress,
        functionName: 'bulkVoteOnGenes',
        args: [
          BigInt(auctionId),
          geneIds, // 8-element tuple as required by contract
        ],
      });
    } else {
      console.warn('⚠️ Bulk vote attempted but wallet not connected:', {
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
      className={enabled ? 'w-full' : 'w-full text-neutral-400'}
    >
      {isPending || isConfirming ? 'Voting...' : 'Vote on Selected Traits'}
    </Button>
  );
}
