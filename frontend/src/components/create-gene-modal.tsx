'use client';

import { TRAIT_CATEGORIES } from '@/constants/trait-categories';
import { useEffect, useState } from 'react';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { SimpleSVGBuilder } from './simple-svg-builder';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
// import { GeneRegistryAbi, GeneRegistryAddress } from '@/contracts/generated'; // Commented out - GeneRegistry not deployed to Sepolia
import toast from 'react-hot-toast';

interface CreateGeneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

function CreateGeneModal({ isOpen, onClose, onSuccess }: CreateGeneModalProps) {
  const { address } = useAccount();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<number>(0);
  const [svg, setSvg] = useState(
    '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">\n  <circle cx="100" cy="100" r="50" fill="#ff6b6b"/>\n</svg>'
  );
  const [isCreating, setIsCreating] = useState(false);

  const {
    writeContract,
    data: hash,
    isPending,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle transaction success
  useEffect(() => {
    if (isConfirmed && isCreating) {
      toast.success('🧬 Gene NFT created successfully!', {
        id: 'create-gene-tx',
        duration: 5000,
      });

      setIsCreating(false);
      // Reset form
      setName('');
      setDescription('');
      setCategory(0);
      setSvg(
        '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">\n  <circle cx="100" cy="100" r="50" fill="#ff6b6b"/>\n</svg>'
      );
      onSuccess?.();
      onClose();
    }
  }, [isConfirmed, isCreating, onSuccess, onClose]);

  // Handle transaction errors
  useEffect(() => {
    if (writeError) {
      console.error('Write contract error:', writeError);
      toast.error('Failed to create gene. Please try again.', {
        id: 'create-gene-tx',
      });
      setIsCreating(false);
    }
  }, [writeError]);

  // Handle receipt errors
  useEffect(() => {
    if (receiptError) {
      console.error('Transaction receipt error:', receiptError);
      toast.error('Transaction failed. Please try again.', {
        id: 'create-gene-tx',
      });
      setIsCreating(false);
    }
  }, [receiptError]);

  // Handle pending transaction
  useEffect(() => {
    if (isPending) {
      toast.loading('Preparing transaction...', { id: 'create-gene-tx' });
    } else if (isConfirming && hash) {
      toast.loading('Transaction submitted, waiting for confirmation...', {
        id: 'create-gene-tx',
      });
    }
  }, [isPending, isConfirming, hash]);

  const handleCreate = () => {
    // GeneRegistry not deployed to Sepolia yet
    toast.error(
      'Gene creation is not available yet on Sepolia. GeneRegistry contract needs to be deployed.'
    );
    setIsCreating(false);

    // TODO: Uncomment when GeneRegistry is deployed to Sepolia
    // if (!address) {
    //   toast.error('Please connect your wallet first');
    //   return;
    // }
    //
    // if (!name.trim()) {
    //   toast.error('Please enter a name for your gene');
    //   return;
    // }
    //
    // if (!svg.trim() || svg.includes('<!-- Your SVG content here -->')) {
    //   toast.error('Please create or paste an SVG design');
    //   return;
    // }
    //
    // setIsCreating(true);
    //
    // writeContract({
    //   address: GeneRegistryAddress,
    //   abi: GeneRegistryAbi,
    //   functionName: 'createGene',
    //   args: [
    //     svg, // svg
    //     category, // category (0-7)
    //   ],
    //   value: BigInt('1000000000000000'), // 0.001 ETH in wei
    // });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Create New Gene NFT</h2>
              <p className="text-gray-600">Design a unique trait for Aminals</p>
            </div>
            <Button variant="outline" onClick={onClose}>
              ✕ Close
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left side - Form */}
            <Card className="p-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="gene-name" className="text-sm font-medium">
                    Gene Name *
                  </Label>
                  <Input
                    id="gene-name"
                    type="text"
                    placeholder="e.g., Rainbow Wings, Golden Fur, etc."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="gene-description"
                    className="text-sm font-medium"
                  >
                    Description (Optional)
                  </Label>
                  <textarea
                    id="gene-description"
                    placeholder="Describe this gene trait..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md text-sm resize-none h-20"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="gene-category"
                    className="text-sm font-medium"
                  >
                    Trait Category *
                  </Label>
                  <select
                    id="gene-category"
                    value={category}
                    onChange={(e) => setCategory(Number(e.target.value))}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
                  >
                    {Object.entries(TRAIT_CATEGORIES).map(
                      ([key, { name, emoji }]) => (
                        <option key={key} value={key}>
                          {emoji} {name}
                        </option>
                      )
                    )}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Choose which part of the Aminal this gene affects
                  </p>
                </div>

                {/* Preview */}
                <div>
                  <Label className="text-sm font-medium">Preview</Label>
                  <div className="mt-2 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-center">
                      <div
                        className="w-24 h-24 border border-gray-300 rounded bg-white flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: svg }}
                      />
                    </div>
                    <div className="text-center mt-2 text-sm text-gray-600">
                      {name || 'Unnamed Gene'} •{' '}
                      {
                        TRAIT_CATEGORIES[
                          category as keyof typeof TRAIT_CATEGORIES
                        ]?.name
                      }
                    </div>
                  </div>
                </div>

                {/* Fee Info */}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-600">⚠️</span>
                    <div className="text-sm text-amber-800">
                      <p className="font-medium">Creation Fee: 0.001 ETH</p>
                      <p className="text-xs">
                        This fee helps maintain the Gene NFT system and prevents
                        spam.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t">
                  <div className="flex gap-3">
                    <Button
                      onClick={handleCreate}
                      disabled={
                        !address ||
                        !svg.trim() ||
                        !name.trim() ||
                        isPending ||
                        isConfirming
                      }
                      className="flex-1"
                    >
                      {isPending || isConfirming ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {isPending ? 'Creating...' : 'Confirming...'}
                        </>
                      ) : (
                        'Create Gene NFT'
                      )}
                    </Button>
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                  </div>

                  {!address && (
                    <p className="text-sm text-red-600 mt-2">
                      Please connect your wallet to create a gene
                    </p>
                  )}

                  {hash && (
                    <p className="text-sm text-gray-600 mt-2">
                      Transaction: {hash.slice(0, 10)}...{hash.slice(-8)}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Right side - SVG Builder */}
            <div>
              <SimpleSVGBuilder onSVGChange={setSvg} initialSVG={svg} />
            </div>
          </div>

          {/* Tips */}
          <Card className="mt-6 p-4 bg-blue-50 border-blue-200">
            <div className="text-sm">
              <h3 className="font-medium text-blue-900 mb-2">
                💡 Tips for Creating Great Genes
              </h3>
              <ul className="space-y-1 text-blue-800">
                <li>• Use the SVG builder to create simple, clean designs</li>
                <li>
                  • Choose colors that work well with different Aminal
                  combinations
                </li>
                <li>
                  • Keep designs simple - they&apos;ll be small when used on
                  Aminals
                </li>
                <li>
                  • Consider how your trait will look alongside other traits
                </li>
                <li>
                  • You can edit the SVG code directly for advanced
                  customization
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CreateGeneModal;
