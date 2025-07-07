import CallSkillButton from '@/components/actions/call-skill-button';
import EndAuctionButton from '@/components/actions/endauction-button';
import FeedButton from '@/components/actions/feed-button';
import { AminalVisualImage } from '@/components/aminal-card';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import Layout from '../_layout';

import BreedButton from '@/components/actions/breed-button';
import { useQuery } from '@tanstack/react-query';

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
            breedableWith {
              id
              partner {
                id
                contractAddress
                aminalIndex
                energy
                totalLove
                tokenURI
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
            skillCalls(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
              id
              caller {
                address
              }
              skillAddress
              squeakCost
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
  const { data: aminal, isLoading } = useAminalByAddress(
    contractAddress,
    address || ''
  );

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
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2 px-3">
                    <span className="text-blue-600 text-lg">👪</span>
                    Lineage
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="text-sm text-gray-500">Mom</div>
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
                      <div className="text-sm text-gray-500">Dad</div>
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
                          aminal.breeding
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {aminal.breeding ? '✅ Available' : '❌ Not Available'}
                      </span>
                    </div>
                  </div>

                  {/* Breeding Partners */}
                  {aminal.breedableWith && aminal.breedableWith.length > 0 && (
                    <div className="px-3">
                      <div className="text-sm text-gray-500 mb-2">
                        Can breed with:
                      </div>
                      <div className="space-y-2">
                        {aminal.breedableWith.map((consent: any) => (
                          <div
                            key={consent.id}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100"
                          >
                            <Link
                              href={`/aminals/${consent.partner.contractAddress}`}
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <span className="text-sm font-medium">
                                Aminal #{consent.partner.aminalIndex}
                              </span>
                              <span className="text-xs text-gray-500">
                                {consent.partner.contractAddress.slice(0, 8)}...
                              </span>
                            </Link>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                consent.consented
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {consent.consented
                                ? '✅ Consented'
                                : '⏳ Pending'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="px-3">
                    <p className="text-xs text-gray-500 mb-3">
                      Breeding requires mutual consent and community voting via
                      Gene Auctions.
                    </p>
                    <BreedButton
                      contractAddress={aminal.contractAddress as `0x${string}`}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Gene IDs */}
              <div>
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2 px-3">
                    <span className="text-blue-600 text-lg">🧬</span>
                    Gene IDs
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        name: 'Back',
                        emoji: '🎒',
                        id: aminal.backId,
                        traitType: 0,
                      },
                      {
                        name: 'Arms',
                        emoji: '💪',
                        id: aminal.armId,
                        traitType: 1,
                      },
                      {
                        name: 'Tail',
                        emoji: '🐾',
                        id: aminal.tailId,
                        traitType: 2,
                      },
                      {
                        name: 'Ears',
                        emoji: '👂',
                        id: aminal.earsId,
                        traitType: 3,
                      },
                      {
                        name: 'Body',
                        emoji: '👤',
                        id: aminal.bodyId,
                        traitType: 4,
                      },
                      {
                        name: 'Face',
                        emoji: '😊',
                        id: aminal.faceId,
                        traitType: 5,
                      },
                      {
                        name: 'Mouth',
                        emoji: '👄',
                        id: aminal.mouthId,
                        traitType: 6,
                      },
                      {
                        name: 'Misc',
                        emoji: '✨',
                        id: aminal.miscId,
                        traitType: 7,
                      },
                    ].map((gene, i) => (
                      <Link
                        key={i}
                        href={`/genes/${gene.id}`}
                        className="p-3 rounded-lg border bg-blue-50 border-blue-100 hover:bg-blue-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{gene.emoji}</span>
                          <div>
                            <div className="text-sm font-medium">
                              {gene.name}
                            </div>
                            <div className="text-xs text-blue-700 font-medium hover:text-blue-800">
                              Gene #{gene.id} →
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Global Skills Section */}
          <div className="mt-4 p-6 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <h2 className="text-2xl font-bold">Global Skills</h2>
              <div className="text-sm text-gray-500">
                Any Aminal can call any registered skill
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="text-lg font-medium text-blue-800 mb-2">
                  🔮 Call a Global Skill
                </h3>
                <p className="text-sm text-blue-600 mb-4">
                  In the new architecture, skills are globally available to any
                  Aminal. No need to learn them individually!
                </p>
                <CallSkillButton
                  aminalContractAddress={
                    aminal.contractAddress as `0x${string}`
                  }
                />
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <h4 className="font-medium mb-2">Available Global Skills:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">🏃</span>
                    <span className="font-medium">Move2D</span>
                    <span className="text-gray-500">
                      - Move your Aminal in 2D space
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">🏃‍♀️</span>
                    <span className="font-medium">MoveTwice</span>
                    <span className="text-gray-500">
                      - Move your Aminal twice in one action
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AminalPage;
