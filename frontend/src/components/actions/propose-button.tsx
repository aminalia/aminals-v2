import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import {
  geneAuctionAbi,
  geneAuctionAddress,
  geneRegistryAbi,
  geneRegistryAddress,
} from '../../contracts/generated';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface ProposeButtonProps {
  auctionId: bigint | string;
  className?: string;
}

interface CategoryOption {
  id: number;
  label: string;
}

const CATEGORIES: CategoryOption[] = [
  { id: 0, label: 'Background' },
  { id: 1, label: 'Arms' },
  { id: 2, label: 'Tail' },
  { id: 3, label: 'Ears' },
  { id: 4, label: 'Body' },
  { id: 5, label: 'Face' },
  { id: 6, label: 'Mouth' },
  { id: 7, label: 'Misc' },
];

export default function ProposeButton({
  auctionId,
  className,
}: ProposeButtonProps) {
  const [catId, setCatId] = useState<number>(0);
  const [vizId, setVizId] = useState<number>(0);
  const { writeContract, isPending, data: hash, error } = useWriteContract();
  const { isConnected, chain, address } = useAccount();
  const enabled = isConnected && chain;

  // Check if the gene is valid
  const { data: isValidGene } = useReadContract({
    address: geneRegistryAddress,
    abi: geneRegistryAbi,
    functionName: 'isValidGene',
    args: [BigInt(vizId)],
    query: {
      enabled: vizId > 0,
    },
  });

  // Get gene info to check category
  const { data: geneInfo } = useReadContract({
    address: geneRegistryAddress,
    abi: geneRegistryAbi,
    functionName: 'getGeneInfo',
    args: [BigInt(vizId)],
    query: {
      enabled: vizId > 0 && isValidGene,
    },
  });

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
      console.log('💡 Propose gene transaction initiated:', {
        hash,
        auctionId: auctionId.toString(),
        categoryId: catId,
        categoryLabel: CATEGORIES[catId]?.label,
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
      console.log('✅ Propose gene transaction confirmed:', {
        hash,
        blockNumber: receipt.blockNumber,
        blockHash: receipt.blockHash,
        gasUsed: receipt.gasUsed?.toString(),
        effectiveGasPrice: receipt.effectiveGasPrice?.toString(),
        status: receipt.status,
        transactionIndex: receipt.transactionIndex,
        auctionId: auctionId.toString(),
        categoryId: catId,
        categoryLabel: CATEGORIES[catId]?.label,
        geneId: vizId,
        timestamp: new Date().toISOString(),
      });

      toast.success(
        `💡 Gene proposed successfully for ${CATEGORIES[catId]?.label}!`,
        {
          id: 'propose-tx',
          duration: 4000,
        }
      );
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
        categoryLabel: CATEGORIES[catId]?.label,
        geneId: vizId,
        userAddress: address,
        chainId: chain?.id,
        contractAddress: geneAuctionAddress,
        timestamp: new Date().toISOString(),
      };

      console.error('❌ Propose gene transaction failed:', errorDetails);

      // More specific error messages based on error type
      let errorMessage = 'Failed to propose gene. Please try again.';
      if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds to complete the transaction.';
      } else if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction was cancelled by user.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message.includes('auction')) {
        errorMessage =
          'Auction error. Please check if the auction is still active.';
      }

      toast.error(errorMessage, {
        id: 'propose-tx',
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
        categoryLabel: CATEGORIES[catId]?.label,
        geneId: vizId,
        timestamp: new Date().toISOString(),
      };

      console.error(
        '❌ Propose gene transaction receipt error:',
        receiptErrorDetails
      );
      toast.error('Proposal failed. Please try again.', {
        id: 'propose-tx',
      });
    }
  }, [receiptError, hash, auctionId, catId, vizId]);

  // Handle pending state
  useEffect(() => {
    if (isPending) {
      console.log('⏳ Propose gene transaction pending...', {
        auctionId: auctionId.toString(),
        categoryId: catId,
        categoryLabel: CATEGORIES[catId]?.label,
        geneId: vizId,
        userAddress: address,
        timestamp: new Date().toISOString(),
      });
      toast.loading('Proposing gene...', { id: 'propose-tx' });
    }
  }, [isPending, auctionId, catId, vizId, address]);

  // Handle confirmation state
  useEffect(() => {
    if (isConfirming) {
      console.log('🔄 Propose gene transaction confirming...', {
        hash,
        auctionId: auctionId.toString(),
        categoryId: catId,
        categoryLabel: CATEGORIES[catId]?.label,
        geneId: vizId,
        timestamp: new Date().toISOString(),
      });
      toast.loading('Confirming proposal...', { id: 'propose-tx' });
    }
  }, [isConfirming, hash, auctionId, catId, vizId]);

  const handlePropose = async () => {
    if (!enabled) {
      console.warn('⚠️ Propose gene attempted but wallet not connected:', {
        isConnected,
        chainId: chain?.id,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (vizId <= 0) {
      toast.error('Please enter a valid gene ID');
      return;
    }

    if (!isValidGene) {
      toast.error(
        `Gene ID ${vizId} doesn't exist or wasn't created through the GeneRegistry`
      );
      return;
    }

    if (geneInfo && geneInfo[1] !== catId) {
      const actualCategory =
        CATEGORIES[Number(geneInfo[1])]?.label || 'Unknown';
      const selectedCategory = CATEGORIES[catId]?.label || 'Unknown';
      toast.error(
        `Gene ID ${vizId} is a ${actualCategory} trait, but you selected ${selectedCategory}`
      );
      return;
    }

    // Log the contract call parameters
    console.log('🚀 Initiating propose gene transaction:', {
      contractAddress: geneAuctionAddress,
      functionName: 'proposeGene',
      auctionId: BigInt(auctionId).toString(),
      categoryId: catId,
      categoryLabel: CATEGORIES[catId]?.label,
      geneId: BigInt(vizId).toString(),
      userAddress: address,
      chainId: chain?.id,
      timestamp: new Date().toISOString(),
    });

    writeContract({
      abi: geneAuctionAbi,
      address: geneAuctionAddress,
      functionName: 'proposeGene',
      args: [BigInt(auctionId), catId, BigInt(vizId)],
    });
  };

  const isTransacting = isPending || isConfirming;
  const canPropose =
    enabled && vizId > 0 && isValidGene && (!geneInfo || geneInfo[1] === catId);

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500">Category</label>
          <select
            value={catId}
            onChange={(e) => setCatId(Number(e.target.value))}
            disabled={isTransacting}
            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500">Gene ID</label>
          <Input
            type="number"
            min="0"
            value={vizId}
            onChange={(e) => setVizId(Number(e.target.value))}
            disabled={isTransacting}
            className="h-9"
          />
        </div>
      </div>

      <Button
        type="button"
        onClick={handlePropose}
        disabled={!canPropose || isTransacting}
        className={`w-full ${
          canPropose && !isTransacting
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'text-gray-400 cursor-not-allowed'
        }`}
      >
        {isTransacting
          ? 'Proposing...'
          : !enabled
          ? 'Connect wallet to propose'
          : vizId <= 0
          ? 'Enter gene ID'
          : !isValidGene
          ? 'Gene not found'
          : geneInfo && geneInfo[1] !== catId
          ? 'Wrong category'
          : 'Propose New Gene'}
      </Button>

      {/* Validation feedback */}
      {vizId > 0 && (
        <div className="mt-2 text-xs">
          {!isValidGene ? (
            <span className="text-red-600">❌ Gene ID {vizId} not found</span>
          ) : geneInfo && geneInfo[1] !== catId ? (
            <span className="text-orange-600">
              ⚠️ Gene is {CATEGORIES[Number(geneInfo[1])]?.label}, not{' '}
              {CATEGORIES[catId]?.label}
            </span>
          ) : (
            <span className="text-green-600">
              ✅ Valid gene for {CATEGORIES[catId]?.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
