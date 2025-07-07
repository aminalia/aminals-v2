import BulkVoteButton from '@/components/actions/bulk-vote-button';
import EndAuctionButton from '@/components/actions/endauction-button';
import CountdownTimer from '@/components/countdown-timer';
import GenesList from '@/components/genes-list';
import ProposeGeneModal from '@/components/propose-gene-modal';
import TraitSelector, {
  SelectedParts,
  TraitParts,
} from '@/components/trait-selector';
import { Button } from '@/components/ui/button';
import VoteStats from '@/components/vote-stats';
import { useAuction, useAuctionProposeGenes } from '@/resources/auctions';
import { useGenesByIds } from '@/resources/genes';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import Layout from '../_layout';

// VOTING_DURATION from the contract (1 hour = 3600 seconds)
const VOTING_DURATION = 3600;

const AuctionPage: NextPage = () => {
  const router = useRouter();
  const auctionId = router.query.auctionId as string;

  const {
    data: auction,
    isLoading: isLoadingAuction,
    error,
  } = useAuction(auctionId);
  const {
    data: proposeGenes,
    isLoading: isLoadingProposeGenes,
    error: proposeGenesError,
  } = useAuctionProposeGenes(auctionId);

  console.log('auction data:', auction, error);
  console.log('propose genes:', proposeGenes, proposeGenesError);

  // Calculate auction end time
  const auctionEndTime = useMemo(() => {
    if (!auction?.blockTimestamp) return 0;
    // Convert BigInt to number and add voting duration
    return Number(auction.blockTimestamp) + VOTING_DURATION;
  }, [auction?.blockTimestamp]);

  // Check if auction has ended
  const isAuctionEnded = useMemo(() => {
    if (!auction) return false;
    const now = Math.floor(Date.now() / 1000);
    return auction.finished || now >= auctionEndTime;
  }, [auction, auctionEndTime]);

  // Get all gene IDs from parent Aminals
  const geneIds = useMemo(() => {
    if (!auction) return [];

    const ids = [
      auction.aminalOne.backId,
      auction.aminalOne.armId,
      auction.aminalOne.tailId,
      auction.aminalOne.earsId,
      auction.aminalOne.bodyId,
      auction.aminalOne.faceId,
      auction.aminalOne.mouthId,
      auction.aminalOne.miscId,
      auction.aminalTwo.backId,
      auction.aminalTwo.armId,
      auction.aminalTwo.tailId,
      auction.aminalTwo.earsId,
      auction.aminalTwo.bodyId,
      auction.aminalTwo.faceId,
      auction.aminalTwo.mouthId,
      auction.aminalTwo.miscId,
    ]
      .filter((id) => {
        const idStr = id ? id.toString() : '';
        return idStr !== '' && idStr !== '0';
      })
      .map((id) => id.toString());
    return Array.from(new Set(ids)); // Remove duplicates
  }, [auction]);

  // Fetch gene NFT data for the gene IDs
  const { data: geneData, isLoading: isLoadingGenes } = useGenesByIds(geneIds);

  // State for selected gene parts
  const [selectedParts, setSelectedParts] = useState<SelectedParts>({
    background: 0,
    tail: 0,
    arm: 0,
    ears: 0,
    body: 0,
    face: 0,
    mouth: 0,
    misc: 0,
  });

  // State for propose gene modal
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);

  // Create a lookup map for gene data
  const geneMap = useMemo(() => {
    if (!geneData) return {};

    const map: { [key: string]: any } = {};
    geneData.forEach((gene) => {
      if (gene && gene.tokenId) {
        map[gene.tokenId] = gene;
      }
    });
    return map;
  }, [geneData]);

  // Define the gene parts from the auction data
  const parts: TraitParts = useMemo(() => {
    if (!auction) {
      return {
        background: [],
        body: [],
        face: [],
        mouth: [],
        ears: [],
        arm: [],
        tail: [],
        misc: [],
      };
    }

    const getGeneForId = (id: any) => {
      if (!id || id.toString() === '0') {
        return null;
      }
      const gene = geneMap[id.toString()];
      return gene ? { ...gene, visualId: gene.tokenId } : null;
    };

    const result = {
      background: [
        getGeneForId(auction.aminalOne.backId),
        getGeneForId(auction.aminalTwo.backId),
      ].filter(Boolean),
      body: [
        getGeneForId(auction.aminalOne.bodyId),
        getGeneForId(auction.aminalTwo.bodyId),
      ].filter(Boolean),
      face: [
        getGeneForId(auction.aminalOne.faceId),
        getGeneForId(auction.aminalTwo.faceId),
      ].filter(Boolean),
      mouth: [
        getGeneForId(auction.aminalOne.mouthId),
        getGeneForId(auction.aminalTwo.mouthId),
      ].filter(Boolean),
      ears: [
        getGeneForId(auction.aminalOne.earsId),
        getGeneForId(auction.aminalTwo.earsId),
      ].filter(Boolean),
      arm: [
        getGeneForId(auction.aminalOne.armId),
        getGeneForId(auction.aminalTwo.armId),
      ].filter(Boolean),
      tail: [
        getGeneForId(auction.aminalOne.tailId),
        getGeneForId(auction.aminalTwo.tailId),
      ].filter(Boolean),
      misc: [
        getGeneForId(auction.aminalOne.miscId),
        getGeneForId(auction.aminalTwo.miscId),
      ].filter(Boolean),
    };

    return result;
  }, [auction, geneMap]);

  // Handler for gene selection
  const handlePartSelection = (part: string, index: number) => {
    setSelectedParts((prev) => ({
      ...prev,
      [part]: index,
    }));
  };

  // Function to get parent Aminal contract addresses
  const getParentAddresses = () => {
    if (!auction) return { parentOne: '?', parentTwo: '?' };
    return {
      parentOne:
        auction.aminalOne.contractAddress || auction.aminalOne.aminalIndex,
      parentTwo:
        auction.aminalTwo.contractAddress || auction.aminalTwo.aminalIndex,
    };
  };

  const { parentOne, parentTwo } = getParentAddresses();

  return (
    <Layout>
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">Breeding</h1>
              <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full font-medium">
                #{auctionId}
              </span>
            </div>
            <Link
              href="/auctions"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Back to all Auctions
            </Link>
          </div>

          {isLoadingAuction || isLoadingGenes ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Parents Info with Countdown Timer */}
              <div className="bg-gray-50 rounded-xl px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-5">
                <div className="flex items-center gap-4">
                  <div className="text-xl">👪</div>
                  <div>
                    <div className="text-sm text-gray-500">Parents</div>
                    <div className="font-medium">
                      Aminal #{auction?.aminalOne?.aminalIndex || '?'} + Aminal
                      #{auction?.aminalTwo?.aminalIndex || '?'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  {/* Countdown Timer or End Auction Button */}
                  {auction?.finished ? (
                    <div className="flex items-center gap-2">
                      <div className="text-xl">✅</div>
                      <div className="flex flex-col">
                        <div className="text-sm text-gray-500">Status</div>
                        <div className="font-medium text-green-600">
                          Auction Completed
                        </div>
                      </div>
                    </div>
                  ) : isAuctionEnded ? (
                    <EndAuctionButton auctionId={auctionId} />
                  ) : (
                    <CountdownTimer endTime={auctionEndTime} />
                  )}
                </div>
              </div>

              {/* Main Content */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold">Design Your Offspring</h2>
                  <p className="text-gray-600 mt-1">
                    Choose which genes to inherit from each parent, or insert a
                    new gene.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                  {/* Left Column - Preview */}
                  <div className="lg:col-span-2">
                    <div className="aspect-square rounded-xl overflow-hidden bg-indigo-50 border border-gray-200 p-4">
                      <svg
                        viewBox="0 0 1000 1000"
                        className="w-full h-full"
                        dangerouslySetInnerHTML={{
                          __html: Object.entries(selectedParts)
                            .map(([part, index]) => {
                              // Handle empty gene selection (index -1)
                              if (index === -1) return '';
                              return parts[part][index]?.svg || '';
                            })
                            .join(''),
                        }}
                      />
                    </div>
                    <div className="mt-6 space-y-4">
                      {!auction?.finished && !isAuctionEnded && (
                        <>
                          <BulkVoteButton
                            auctionId={auctionId}
                            backId={
                              selectedParts.background === -1
                                ? '0'
                                : parts.background[selectedParts.background]
                                    ?.visualId || '0'
                            }
                            armId={
                              selectedParts.arm === -1
                                ? '0'
                                : parts.arm[selectedParts.arm]?.visualId || '0'
                            }
                            tailId={
                              selectedParts.tail === -1
                                ? '0'
                                : parts.tail[selectedParts.tail]?.visualId ||
                                  '0'
                            }
                            earsId={
                              selectedParts.ears === -1
                                ? '0'
                                : parts.ears[selectedParts.ears]?.visualId ||
                                  '0'
                            }
                            bodyId={
                              selectedParts.body === -1
                                ? '0'
                                : parts.body[selectedParts.body]?.visualId ||
                                  '0'
                            }
                            faceId={
                              selectedParts.face === -1
                                ? '0'
                                : parts.face[selectedParts.face]?.visualId ||
                                  '0'
                            }
                            mouthId={
                              selectedParts.mouth === -1
                                ? '0'
                                : parts.mouth[selectedParts.mouth]?.visualId ||
                                  '0'
                            }
                            miscId={
                              selectedParts.misc === -1
                                ? '0'
                                : parts.misc[selectedParts.misc]?.visualId ||
                                  '0'
                            }
                          />
                          <Button
                            onClick={() => setIsProposalModalOpen(true)}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                          >
                            ✨ Propose New Gene
                          </Button>
                        </>
                      )}
                      {auction?.finished && (
                        <div className="text-center py-4">
                          <div className="text-green-600 font-medium">
                            🎉 Auction Complete! New Aminal has been created.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Gene Selector */}
                  <div>
                    <TraitSelector
                      parts={parts}
                      selectedParts={selectedParts}
                      onPartSelection={handlePartSelection}
                      disabled={auction?.finished || isAuctionEnded}
                    />
                  </div>
                </div>
              </div>

              {/* Genes List Section */}
              <div className="mt-4 space-y-6">
                <h2 className="text-2xl font-bold">Community Proposals</h2>
                <GenesList auctionId={auctionId} />
              </div>

              {/* Vote Statistics Section */}
              <div className="mt-4 space-y-6">
                <VoteStats auctionId={auctionId} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Propose Gene Modal */}
      {!auction?.finished && !isAuctionEnded && (
        <ProposeGeneModal
          auctionId={auctionId}
          isOpen={isProposalModalOpen}
          onClose={() => setIsProposalModalOpen(false)}
        />
      )}
    </Layout>
  );
};

export default AuctionPage;
