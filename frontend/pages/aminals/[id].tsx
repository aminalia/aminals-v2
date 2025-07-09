import CallSkillButton from '@/components/actions/call-skill-button';
import EndAuctionButton from '@/components/actions/endauction-button';
import FeedButton from '@/components/actions/feed-button';
import { AminalVisualImage } from '@/components/aminal-card';
import BreedingModal from '@/components/breeding-modal';
import { useGenesByIds } from '@/resources/genes';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import Layout from '../_layout';

import { Button } from '@/components/ui/button';
import { aminalFactoryAbi, aminalFactoryAddress } from '@/contracts/generated';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { parseEther } from 'viem';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

// Direct fetch for individual Aminal by contract address
const useAminalByAddress = (contractAddress: string, userAddress: string) => {
  return useQuery({
    queryKey: ['aminal-by-address', contractAddress, userAddress],
    queryFn: async () => {
      if (!contractAddress || contractAddress === 'undefined') {
        return null;
      }

      const SUBGRAPH_URL =
        'https://api.studio.thegraph.com/query/57078/aminals-3/version/latest';

      const query = `
        query AminalByAddress($contractAddress: Bytes, $address: Bytes) {
          aminals(where: { contractAddress: $contractAddress }) {
            id
            contractAddress
            aminalIndex
            momAddress
            dadAddress
            energy
            totalLove
            breeding
            blockTimestamp
            tokenURI
            backId
            armId
            tailId
            earsId
            bodyId
            faceId
            mouthId
            miscId
            lovers(where: { user_: { address: $address } }) {
              love
            }
            auctions(where: { finished: false }, first: 1, orderBy: blockTimestamp, orderDirection: desc) {
              id
              auctionId
              finished
              totalLove
              blockTimestamp
              endBlockTimestamp
            }
            children(first: 10) {
              id
              contractAddress
              aminalIndex
              energy
              totalLove
              tokenURI
            }
            breedableWith {
              id
              partner {
                id
                contractAddress
                aminalIndex
                energy
                totalLove
                tokenURI
                breedableWith(where: { partner: $contractAddress }) {
                  id
                  consented
                }
              }
              consented
            }
            feeds(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
              id
              sender {
                address
              }
              amount
              love
              blockTimestamp
            }
            squeaks(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
              id
              sender {
                address
              }
              amount
              love
              blockTimestamp
            }
            skillUsed(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
              id
              caller {
                address
              }
              skillAddress
              blockTimestamp
            }
          }
        }
      `;

      const response = await fetch(SUBGRAPH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { contractAddress, address: userAddress },
        }),
      });

      const data = await response.json();

      console.log(data);

      if (data.errors) {
        console.error('Aminal fetch errors:', data.errors);
        throw new Error(data.errors[0].message);
      }

      const aminals = data.data?.aminals || [];
      return aminals.length > 0 ? aminals[0] : null;
    },
    enabled: !!contractAddress && contractAddress !== 'undefined',
  });
};

const AminalPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query; // This is now a contract address
  const contractAddress = id as string;
  const { address } = useAccount();
  const [isBreedingModalOpen, setIsBreedingModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: aminal,
    isLoading,
    refetch,
  } = useAminalByAddress(contractAddress, address || '');

  // Breeding transaction hooks
  const {
    writeContract: startBreeding,
    isPending: isBreedingPending,
    data: breedingHash,
    error: breedingError,
  } = useWriteContract();

  const {
    isLoading: isBreedingConfirming,
    isSuccess: isBreedingConfirmed,
    error: breedingReceiptError,
  } = useWaitForTransactionReceipt({
    hash: breedingHash,
  });

  // Get all gene IDs for this Aminal to fetch gene data
  const geneIds = useMemo(() => {
    if (!aminal) return [];

    return [
      aminal.backId,
      aminal.armId,
      aminal.tailId,
      aminal.earsId,
      aminal.bodyId,
      aminal.faceId,
      aminal.mouthId,
      aminal.miscId,
    ]
      .filter((id) => id && id.toString() !== '0')
      .map((id) => id.toString());
  }, [aminal]);

  // Fetch gene data for trait images
  const { data: geneData } = useGenesByIds(geneIds);

  // Get children (where this aminal is the mother)
  // Note: The schema only tracks children via mother relationship
  // Children where this aminal is father would need to be queried separately
  const allChildren = useMemo(() => {
    if (!aminal?.children) return [];

    return aminal.children;
  }, [aminal]);

  // Handle breeding transaction success
  useEffect(() => {
    if (isBreedingConfirmed) {
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
      refetch();
    }
  }, [isBreedingConfirmed, queryClient, contractAddress, refetch]);

  // Handle breeding transaction errors
  useEffect(() => {
    if (breedingError) {
      console.error('Breeding transaction failed:', breedingError);
      let errorMessage = 'Transaction failed. Please try again.';
      if (breedingError.message.includes('insufficient funds')) {
        errorMessage =
          'Insufficient funds. You need at least 0.001 ETH plus gas fees.';
      } else if (breedingError.message.includes('user rejected')) {
        errorMessage = 'Transaction was cancelled by user.';
      }
      toast.error(errorMessage, { id: 'breed-tx' });
    }
  }, [breedingError]);

  // Handle breeding receipt errors
  useEffect(() => {
    if (breedingReceiptError) {
      console.error(
        'Breeding transaction receipt error:',
        breedingReceiptError
      );
      toast.error('Transaction failed. Please try again.', { id: 'breed-tx' });
    }
  }, [breedingReceiptError]);

  // Handle breeding pending state
  useEffect(() => {
    if (isBreedingPending) {
      toast.loading('Starting gene auction...', { id: 'breed-tx' });
    }
  }, [isBreedingPending]);

  // Handle breeding confirmation state
  useEffect(() => {
    if (isBreedingConfirming) {
      toast.loading('Confirming transaction...', { id: 'breed-tx' });
    }
  }, [isBreedingConfirming]);

  // Function to start breeding auction with specific partner
  const handleStartAuction = (partnerAddress: string) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    startBreeding({
      abi: aminalFactoryAbi,
      address: aminalFactoryAddress,
      functionName: 'breedAminals',
      args: [contractAddress as `0x${string}`, partnerAddress as `0x${string}`],
      value: parseEther('0.001'),
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!aminal) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-[50vh] text-gray-500">
            Aminal not found
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">
                Aminal #{aminal.aminalIndex}
              </h1>
            </div>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Back to all Aminals
            </Link>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Image */}
            <div className="aspect-square rounded-xl overflow-hidden bg-indigo-50 flex items-center justify-center border border-gray-200">
              <AminalVisualImage aminal={aminal} />
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Stats Section */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
                <h2 className="text-xl font-semibold">Stats</h2>

                {/* Energy and Total Love */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="text-sm text-gray-500">Energy</div>
                    <div className="text-xl font-semibold text-purple-600">
                      {Number(aminal.energy).toFixed(2)} ⚡
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="text-sm text-gray-500">Total Love</div>
                    <div className="text-xl font-semibold text-pink-600">
                      {Number(aminal.totalLove).toFixed(2)} ❤️
                    </div>
                  </div>
                </div>

                {/* Love 4 U section */}
                {aminal.lovers && aminal.lovers.length > 0 && (
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="text-sm text-gray-500">Love 4 U</div>
                    <div className="text-xl font-semibold text-purple-600">
                      💜 {Number(aminal.lovers[0].love).toFixed(2)}
                    </div>
                    <div className="text-xs text-purple-500 mt-1">
                      Your love relationship with this Aminal
                    </div>
                  </div>
                )}

                {/* Contract Address */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="text-sm text-gray-500">Contract Address</div>
                  <div className="text-sm font-mono text-blue-600">
                    {aminal.contractAddress}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <FeedButton
                  contractAddress={aminal.contractAddress as `0x${string}`}
                />

                {/* End Auction Button - show if there's an active auction that has ended */}
                {aminal.auctions &&
                  aminal.auctions.length > 0 &&
                  (() => {
                    const auction = aminal.auctions[0]; // Get the most recent active auction
                    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
                    const auctionEndTime = auction.endBlockTimestamp
                      ? Number(auction.endBlockTimestamp)
                      : 0;
                    const hasEnded =
                      auctionEndTime > 0 && currentTime > auctionEndTime;

                    if (hasEnded && !auction.finished) {
                      return (
                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="text-sm text-yellow-700 mb-2">
                            🔔 Auction #{auction.auctionId.toString()} has ended
                            and can be settled
                          </div>
                          <EndAuctionButton
                            auctionId={auction.auctionId.toString()}
                            className="w-full"
                          />
                        </div>
                      );
                    }
                    return null;
                  })()}
              </div>
            </div>
          </div>

          {/* Info Section - Full width, with two columns, no border */}
          <div className="p-2 space-y-4">
            <h2 className="text-xl font-semibold px-3">Info</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Lineage and Breeding */}
              <div className="space-y-6">
                {/* Lineage */}
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2 px-3">
                    <span className="text-blue-600 text-lg">👪</span>
                    Lineage
                  </h3>

                  {/* Parents */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 px-3">
                      Parents
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="text-sm text-gray-500">Parent A</div>
                        <div className="font-medium text-xs">
                          {!aminal.momAddress ||
                          aminal.momAddress ===
                            '0x0000000000000000000000000000000000000000' ? (
                            <span className="text-gray-400">Genesis</span>
                          ) : (
                            <Link
                              href={`/aminals/${aminal.momAddress}`}
                              className="text-blue-600 hover:text-blue-800 transition-colors underline"
                            >
                              {aminal.momAddress.slice(0, 8)}...
                            </Link>
                          )}
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="text-sm text-gray-500">Parent B</div>
                        <div className="font-medium text-xs">
                          {!aminal.dadAddress ||
                          aminal.dadAddress ===
                            '0x0000000000000000000000000000000000000000' ? (
                            <span className="text-gray-400">Genesis</span>
                          ) : (
                            <Link
                              href={`/aminals/${aminal.dadAddress}`}
                              className="text-blue-600 hover:text-blue-800 transition-colors underline"
                            >
                              {aminal.dadAddress.slice(0, 8)}...
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Children */}
                  {allChildren.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2 px-3">
                        Children ({allChildren.length})
                        <span className="text-xs text-gray-500 ml-1">
                          as Parent A
                        </span>
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {allChildren.slice(0, 4).map((child: any) => (
                          <Link
                            key={child.contractAddress}
                            href={`/aminals/${child.contractAddress}`}
                            className="p-3 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-white rounded border border-green-200 overflow-hidden">
                                <AminalVisualImage aminal={child} />
                              </div>
                              <div>
                                <div className="text-sm font-medium">
                                  #{child.aminalIndex}
                                </div>
                                <div className="text-xs text-green-700">
                                  {Number(child.totalLove).toFixed(0)} ❤️
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                        {allChildren.length > 4 && (
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center">
                            <span className="text-sm text-gray-500">
                              +{allChildren.length - 4} more
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Breeding */}
                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2 px-3">
                    <span className="text-blue-600 text-lg">🧬</span>
                    Breeding
                  </h3>

                  {/* Breeding Status */}
                  <div className="px-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-500">Status:</span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          aminal?.breeding
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {aminal?.breeding ? '✅ Available' : '❌ Not Available'}
                      </span>
                    </div>
                  </div>

                  {/* Quick Actions for Existing Relationships */}
                  {aminal?.breedableWith && aminal.breedableWith.length > 0 && (
                    <div className="px-3">
                      <div className="text-sm text-gray-500 mb-2">
                        Relationships:
                      </div>
                      <div className="space-y-2">
                        {aminal.breedableWith.map((consent: any) => {
                          // Check if this aminal has consented to the partner
                          const weConsented = consent?.consented;
                          const partner = consent?.partner;

                          if (!partner) return null;

                          // Check if partner has also consented back to us
                          const partnerConsent = partner.breedableWith?.[0];
                          const partnerConsented =
                            partnerConsent?.consented || false;
                          const mutualConsent = weConsented && partnerConsented;

                          return (
                            <div
                              key={consent.id}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100"
                            >
                              <Link
                                href={`/aminals/${partner.contractAddress}`}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                <span className="text-sm font-medium">
                                  Aminal #{partner.aminalIndex}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {partner.contractAddress?.slice(0, 8)}...
                                </span>
                              </Link>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    mutualConsent
                                      ? 'bg-green-100 text-green-700'
                                      : weConsented
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {mutualConsent
                                    ? '💕 Ready to Breed'
                                    : weConsented
                                    ? '⏳ Awaiting Response'
                                    : '❌ Not Consented'}
                                </span>
                                <Button
                                  disabled={
                                    !mutualConsent ||
                                    isBreedingPending ||
                                    isBreedingConfirming
                                  }
                                  size="sm"
                                  onClick={() =>
                                    handleStartAuction(partner.contractAddress)
                                  }
                                  className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 h-auto disabled:opacity-50"
                                >
                                  {isBreedingPending || isBreedingConfirming
                                    ? 'Starting...'
                                    : 'Start Auction'}
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="px-3">
                    <p className="text-xs text-gray-500 mb-3">
                      Breeding requires mutual consent and community voting via
                      Gene Auctions.
                    </p>
                    <Button
                      onClick={() => setIsBreedingModalOpen(true)}
                      className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                      disabled={
                        !aminal?.lovers ||
                        aminal.lovers.length === 0 ||
                        Number(aminal.lovers[0]?.love || 0) <= 0
                      }
                    >
                      🔍 Find Breeding Partner
                    </Button>
                    {(!aminal?.lovers ||
                      aminal.lovers.length === 0 ||
                      Number(aminal.lovers[0]?.love || 0) <= 0) && (
                      <p className="text-xs text-yellow-600 mt-1">
                        You must feed this Aminal first to unlock breeding.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Gene IDs */}
              <div>
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2 px-3">
                    <span className="text-blue-600 text-lg">🧬</span>
                    Traits
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        name: 'Background',
                        id: aminal.backId,
                        traitType: 0,
                      },
                      {
                        name: 'Arms',
                        id: aminal.armId,
                        traitType: 1,
                      },
                      {
                        name: 'Tail',
                        id: aminal.tailId,
                        traitType: 2,
                      },
                      {
                        name: 'Ears',
                        id: aminal.earsId,
                        traitType: 3,
                      },
                      {
                        name: 'Body',
                        id: aminal.bodyId,
                        traitType: 4,
                      },
                      {
                        name: 'Face',
                        id: aminal.faceId,
                        traitType: 5,
                      },
                      {
                        name: 'Mouth',
                        id: aminal.mouthId,
                        traitType: 6,
                      },
                      {
                        name: 'Misc',
                        id: aminal.miscId,
                        traitType: 7,
                      },
                    ].map((gene, i) => {
                      // Find gene data for this trait
                      const geneInfo = geneData?.find(
                        (g) => g?.tokenId === gene.id?.toString()
                      );

                      return (
                        <Link
                          key={i}
                          href={`/genes/${gene.id}`}
                          className="p-3 rounded-lg border bg-blue-50 border-blue-100 hover:bg-blue-100 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white rounded border border-blue-200 overflow-hidden flex-shrink-0">
                              {geneInfo?.svg ? (
                                <svg
                                  viewBox="0 0 1000 1000"
                                  className="w-full h-full"
                                  dangerouslySetInnerHTML={{
                                    __html: geneInfo.svg,
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                                  ?
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium truncate">
                                {gene.name}
                              </div>
                              <div className="text-xs text-blue-700 font-medium hover:text-blue-800 truncate">
                                Gene #{gene.id}
                              </div>
                              {geneInfo?.name && (
                                <div className="text-xs text-gray-600 truncate">
                                  {geneInfo.name}
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Global Skills Section */}
          <div className="mt-4 p-6 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <h2 className="text-2xl font-bold">Skills</h2>
              <div className="text-sm text-gray-500">
                Aminals can <em>do</em> things.
              </div>
            </div>

            <div className="space-y-4">
              <CallSkillButton
                aminalContractAddress={aminal.contractAddress as `0x${string}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Breeding Modal */}
      <BreedingModal
        aminal={aminal}
        isOpen={isBreedingModalOpen}
        onClose={() => setIsBreedingModalOpen(false)}
        onSuccess={() => {
          refetch();
          setIsBreedingModalOpen(false);
        }}
      />
    </Layout>
  );
};

export default AminalPage;
