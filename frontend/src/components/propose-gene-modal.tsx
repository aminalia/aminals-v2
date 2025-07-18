import { TRAIT_CATEGORIES } from '@/constants/trait-categories';
import { cn } from '@/lib/utils';
import { CategoryFilter, useGenes } from '@/resources/genes';
import { X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { geneAuctionAbi, geneAuctionAddress } from '../contracts/generated';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface ProposeGeneModalProps {
  auctionId: bigint | string;
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  { id: 0, label: 'Background' },
  { id: 1, label: 'Arms' },
  { id: 2, label: 'Tail' },
  { id: 3, label: 'Ears' },
  { id: 4, label: 'Body' },
  { id: 5, label: 'Face' },
  { id: 6, label: 'Mouth' },
  { id: 7, label: 'Misc' },
];

export default function ProposeGeneModal({
  auctionId,
  isOpen,
  onClose,
}: ProposeGeneModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [selectedGeneId, setSelectedGeneId] = useState<string>('');
  const [manualGeneId, setManualGeneId] = useState<string>('');
  const [useManualId, setUseManualId] = useState(false);
  const { writeContract, isPending, data: hash, error } = useWriteContract();
  const { isConnected, chain } = useAccount();
  const enabled = isConnected && chain;

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Get category key for the API
  const categoryKey = useMemo(() => {
    return selectedCategory.toString() as CategoryFilter;
  }, [selectedCategory]);

  // Fetch genes for the selected category
  const { data: genes, isLoading: isLoadingGenes } = useGenes(
    'all',
    'aminals-count',
    categoryKey
  );

  // Handle transaction success
  useEffect(() => {
    if (isConfirmed) {
      toast.success(
        '🧬 Gene proposed successfully! The community can now vote on it.',
        {
          id: 'propose-gene-tx',
          duration: 5000,
        }
      );
      onClose();
      // Reset form
      setSelectedGeneId('');
      setManualGeneId('');
      setUseManualId(false);
      setSelectedCategory(0);
    }
  }, [isConfirmed, onClose]);

  // Handle transaction errors
  useEffect(() => {
    if (error) {
      console.error('Propose gene transaction failed:', error);
      toast.error('Failed to propose gene. Please try again.', {
        id: 'propose-gene-tx',
      });
    }
  }, [error]);

  // Handle receipt errors
  useEffect(() => {
    if (receiptError) {
      console.error('Transaction receipt error:', receiptError);
      toast.error('Transaction failed. Please try again.', {
        id: 'propose-gene-tx',
      });
    }
  }, [receiptError]);

  // Handle transaction pending state
  useEffect(() => {
    if (isPending) {
      toast.loading('Proposing gene...', { id: 'propose-gene-tx' });
    }
  }, [isPending]);

  // Handle confirmation state
  useEffect(() => {
    if (isConfirming) {
      toast.loading('Confirming transaction...', { id: 'propose-gene-tx' });
    }
  }, [isConfirming]);

  const handlePropose = () => {
    if (!enabled) return;

    const geneId = useManualId ? manualGeneId : selectedGeneId;
    if (!geneId) return;

    writeContract({
      abi: geneAuctionAbi,
      address: geneAuctionAddress,
      functionName: 'proposeGene',
      args: [BigInt(auctionId), selectedCategory, BigInt(geneId)],
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold">Propose New Gene</h2>
            <p className="text-sm text-gray-600">
              Select a gene from the registry or enter a specific ID
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Category Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Select Category</h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => {
                const emoji =
                  TRAIT_CATEGORIES[category.id as keyof typeof TRAIT_CATEGORIES]
                    ?.emoji || '🎨';
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2',
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    )}
                  >
                    <span>{emoji}</span>
                    <span>{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gene Selection Method */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Select Gene</h3>
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setUseManualId(false)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  !useManualId
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                )}
              >
                Browse Registry
              </button>
              <button
                onClick={() => setUseManualId(true)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  useManualId
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                )}
              >
                Enter ID Manually
              </button>
            </div>

            {useManualId ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Gene ID
                </label>
                <Input
                  type="text"
                  placeholder="Enter gene ID (e.g., 123)"
                  value={manualGeneId}
                  onChange={(e) => setManualGeneId(e.target.value)}
                  className="max-w-xs"
                />
              </div>
            ) : (
              <div>
                {isLoadingGenes ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : !genes || genes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No genes found for this category
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {genes.map((gene: any) => (
                      <div
                        key={gene.id}
                        className={cn(
                          'border-2 rounded-lg p-3 cursor-pointer transition-all',
                          selectedGeneId === gene.tokenId
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                        onClick={() => setSelectedGeneId(gene.tokenId)}
                      >
                        <div className="aspect-square mb-2 bg-gray-50 rounded-lg overflow-hidden">
                          <svg
                            viewBox="0 0 1000 1000"
                            className="w-full h-full"
                            dangerouslySetInnerHTML={{
                              __html: gene.svg || '',
                            }}
                          />
                        </div>
                        <div className="text-sm font-medium text-center">
                          Gene #{gene.tokenId}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {useManualId
              ? `Manual ID: ${manualGeneId || 'Not entered'}`
              : `Selected: ${
                  selectedGeneId ? `Gene #${selectedGeneId}` : 'None'
                }`}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handlePropose}
              disabled={
                !enabled ||
                (!selectedGeneId && !manualGeneId) ||
                isPending ||
                isConfirming
              }
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {!enabled
                ? 'Connect Wallet'
                : isPending || isConfirming
                ? 'Proposing...'
                : 'Propose Gene'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
