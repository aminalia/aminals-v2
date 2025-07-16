import { cn } from '@/lib/utils';
import { useAminals } from '@/resources/aminals';
import { X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { isAddress, parseEther } from 'viem';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { aminalFactoryAbi, aminalFactoryAddress } from '../contracts/generated';
import { AminalVisualImage } from './aminal-card';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface BreedingModalProps {
  aminal: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function BreedingModal({
  aminal,
  isOpen,
  onClose,
  onSuccess,
}: BreedingModalProps) {
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [manualAddress, setManualAddress] = useState<string>('');
  const [useManualAddress, setUseManualAddress] = useState(false);
  const [filter, setFilter] = useState<'all' | 'loved'>('all');
  const [action, setAction] = useState<'consent' | 'start-auction'>('consent');

  const { writeContract, isPending, data: hash, error } = useWriteContract();
  const { isConnected, chain, address } = useAccount();
  const enabled = isConnected && chain;

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Fetch available Aminals for selection
  const { data: aminals, isLoading: isLoadingAminals } = useAminals(
    address || '',
    filter,
    'most-loved'
  );

  // Filter out current aminal and process breeding relationships
  const availableAminals = useMemo(() => {
    if (!aminals) return [];

    return aminals
      .filter((a: any) => a.contractAddress !== aminal.contractAddress)
      .map((a: any) => {
        // Check if there's an existing relationship with this aminal
        const existingRelation = aminal.breedableWith?.find(
          (rel: any) => rel.partner.contractAddress === a.contractAddress
        );
        const reverseRelation = a.breedableWith?.find(
          (rel: any) => rel.partner.contractAddress === aminal.contractAddress
        );

        const weLikedThem = !!existingRelation?.consented;
        const theyLikedUs = !!reverseRelation?.consented;
        const canStartBreeding = weLikedThem && theyLikedUs;

        return {
          ...a,
          hasLikedUs: theyLikedUs,
          weLikedThem: weLikedThem,
          canStartBreeding: canStartBreeding,
          relationshipStatus: existingRelation
            ? existingRelation.consented
              ? 'consented'
              : 'pending'
            : 'none',
        };
      })
      .sort((a: any, b: any) => {
        // Prioritize mutual relationships, then those who liked us, then others
        if (a.canStartBreeding && !b.canStartBreeding) return -1;
        if (!a.canStartBreeding && b.canStartBreeding) return 1;
        if (a.hasLikedUs && !b.hasLikedUs) return -1;
        if (!a.hasLikedUs && b.hasLikedUs) return 1;
        return Number(b.totalLove) - Number(a.totalLove);
      });
  }, [aminals, aminal]);

  // Determine current action based on selection
  useEffect(() => {
    if (selectedPartner?.canStartBreeding) {
      setAction('start-auction');
    } else {
      setAction('consent');
    }
  }, [selectedPartner]);

  // Handle transaction success
  useEffect(() => {
    if (isConfirmed) {
      if (action === 'consent') {
        toast.success('💕 Breeding consent given successfully!', {
          id: 'breed-tx',
          duration: 5000,
        });
      } else {
        toast.success(
          '🍼 Gene auction started! Community can now vote on offspring traits.',
          {
            id: 'breed-tx',
            duration: 6000,
          }
        );
      }
      onSuccess?.();
      onClose();
      // Reset form
      setSelectedPartner(null);
      setManualAddress('');
      setUseManualAddress(false);
    }
  }, [isConfirmed, action, onSuccess, onClose]);

  // Handle transaction errors
  useEffect(() => {
    if (error) {
      console.error('Breeding transaction failed:', error);
      let errorMessage = 'Transaction failed. Please try again.';
      if (error.message.includes('insufficient funds')) {
        errorMessage =
          'Insufficient funds. You need at least 0.001 ETH plus gas fees.';
      } else if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction was cancelled by user.';
      }
      toast.error(errorMessage, { id: 'breed-tx' });
    }
  }, [error]);

  // Handle receipt errors
  useEffect(() => {
    if (receiptError) {
      console.error('Breeding transaction receipt error:', receiptError);
      toast.error('Transaction failed. Please try again.', { id: 'breed-tx' });
    }
  }, [receiptError]);

  // Handle pending state
  useEffect(() => {
    if (isPending) {
      toast.loading('Preparing transaction...', { id: 'breed-tx' });
    }
  }, [isPending]);

  // Handle confirmation state
  useEffect(() => {
    if (isConfirming) {
      const message =
        action === 'consent'
          ? 'Giving breeding consent...'
          : 'Starting gene auction...';
      toast.loading(message, { id: 'breed-tx' });
    }
  }, [isConfirming, action]);

  const handleBreeding = () => {
    if (!enabled) return;

    const partnerAddress = useManualAddress
      ? manualAddress
      : selectedPartner?.contractAddress;
    if (!partnerAddress || !isAddress(partnerAddress)) {
      toast.error('Please select a valid partner');
      return;
    }

    writeContract({
      abi: aminalFactoryAbi,
      address: aminalFactoryAddress,
      functionName: 'breedAminals',
      args: [aminal.contractAddress, partnerAddress as `0x${string}`],
      value: parseEther('0.001'),
    });
  };

  const getActionText = () => {
    if (!enabled) return 'Connect Wallet';
    if (isPending || isConfirming) {
      return action === 'consent' ? 'Giving Consent...' : 'Starting Auction...';
    }
    return action === 'consent'
      ? '💕 Give Breeding Consent'
      : '🍼 Start Gene Auction (0.001 ETH)';
  };

  const getRelationshipBadge = (aminal: any) => {
    if (aminal.canStartBreeding) {
      return (
        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
          💕 Ready to Breed
        </span>
      );
    }
    if (aminal.hasLikedUs) {
      return (
        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
          💌 Likes You
        </span>
      );
    }
    if (aminal.weLikedThem) {
      return (
        <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-medium">
          ⏳ Awaiting Response
        </span>
      );
    }
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold truncate">
              Find Breeding Partner
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
              Select an Aminal to breed with or enter a contract address
              manually
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0 ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0">
          {/* Selection Method */}
          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3">
              Selection Method
            </h3>
            <div className="flex gap-2 sm:gap-4 mb-4">
              <button
                onClick={() => setUseManualAddress(false)}
                className={cn(
                  'px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors min-h-[44px] flex-1',
                  !useManualAddress
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                )}
              >
                Browse Aminals
              </button>
              <button
                onClick={() => setUseManualAddress(true)}
                className={cn(
                  'px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors min-h-[44px] flex-1',
                  useManualAddress
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                )}
              >
                Manual Address
              </button>
            </div>

            {useManualAddress ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Partner Contract Address
                </label>
                <Input
                  type="text"
                  placeholder="Enter contract address (0x...)"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  className="max-w-md"
                />
              </div>
            ) : (
              <div>
                {/* Filter Options */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setFilter('all')}
                    className={cn(
                      'px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors min-h-[44px] flex-1',
                      filter === 'all'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    )}
                  >
                    All Aminals
                  </button>
                  <button
                    onClick={() => setFilter('loved')}
                    className={cn(
                      'px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors min-h-[44px] flex-1',
                      filter === 'loved'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    )}
                  >
                    Your Loved
                  </button>
                </div>

                {/* Aminals Grid */}
                {isLoadingAminals ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : !availableAminals || availableAminals.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No available Aminals found
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {availableAminals.map((aminalOption: any) => (
                      <div
                        key={aminalOption.id}
                        className={cn(
                          'border-2 rounded-lg p-2 sm:p-3 cursor-pointer transition-all active:scale-95',
                          selectedPartner?.id === aminalOption.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                        onClick={() => setSelectedPartner(aminalOption)}
                      >
                        <div className="aspect-square mb-2 bg-gray-50 rounded-lg overflow-hidden">
                          <AminalVisualImage aminal={aminalOption} />
                        </div>
                        <div className="text-center space-y-1">
                          <div className="text-xs sm:text-sm font-medium truncate">
                            Aminal #{aminalOption.aminalIndex}
                          </div>
                          <div className="text-xs text-gray-600">
                            {Number(aminalOption.totalLove).toFixed(0)} ❤️
                          </div>
                          {getRelationshipBadge(aminalOption)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Partner Info */}
          {(selectedPartner ||
            (useManualAddress && isAddress(manualAddress))) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-blue-900 mb-2">
                Selected Partner
              </h4>
              {useManualAddress ? (
                <div className="text-sm text-blue-700">
                  Contract Address: {manualAddress}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-lg overflow-hidden border border-blue-200">
                    <AminalVisualImage aminal={selectedPartner} />
                  </div>
                  <div>
                    <div className="font-medium">
                      Aminal #{selectedPartner.aminalIndex}
                    </div>
                    <div className="text-sm text-blue-700">
                      {selectedPartner.contractAddress}
                    </div>
                    {selectedPartner.canStartBreeding && (
                      <div className="text-sm font-medium text-green-700">
                        ✅ Both parties have consented - ready to start auction!
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 sm:p-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between shrink-0">
          <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
            {action === 'consent'
              ? 'Give consent to show interest in breeding'
              : 'Start the gene auction to create offspring (requires mutual consent)'}
          </div>
          <div className="flex gap-3 order-1 sm:order-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 sm:flex-initial"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBreeding}
              disabled={
                !enabled ||
                (!selectedPartner && !manualAddress) ||
                (!useManualAddress && !selectedPartner) ||
                (useManualAddress && !isAddress(manualAddress)) ||
                isPending ||
                isConfirming
              }
              className={cn(
                action === 'consent'
                  ? 'bg-pink-600 hover:bg-pink-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white',
                'disabled:opacity-50 flex-1 sm:flex-initial'
              )}
            >
              {getActionText()}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
