import { TRAIT_CATEGORIES } from '@/constants/trait-categories';
import { cn } from '@/lib/utils';
import { useAuction, useAuctionVotes, useAuctions } from '@/resources/auctions';
import { useMemo, useState } from 'react';

interface VoteStatsProps {
  auctionId: string;
}

const VoteStats = ({ auctionId }: VoteStatsProps) => {
  const { data: votes, isLoading } = useAuctionVotes(auctionId);
  const { data: allAuctions } = useAuctions();
  const { data: currentAuction } = useAuction(auctionId);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const voteStats = useMemo(() => {
    if (!votes || votes.length === 0) return {};

    const stats: {
      [traitType: number]: {
        [geneId: string]: {
          votes: number;
          totalLove: number;
          geneName: string;
          svg: string;
        };
      };
    } = {};

    // Group votes by transaction to detect bulk votes
    const votesByTx = votes.reduce((acc, vote) => {
      const txKey = `${vote.voter.address}-${vote.blockNumber}-${vote.transactionHash}`;
      if (!acc[txKey]) {
        acc[txKey] = [];
      }
      acc[txKey].push(vote);
      return acc;
    }, {} as Record<string, typeof votes>);

    // Process each transaction
    Object.values(votesByTx).forEach((txVotes) => {
      const nonRemoveVotes = txVotes.filter((v) => !v.isRemoveVote);
      const bulkVoteSize = nonRemoveVotes.length;

      txVotes.forEach((vote) => {
        const traitType = vote.proposal.traitType;
        const geneId = vote.proposal.geneNFT.tokenId;
        const geneName = vote.proposal.geneNFT.name || `Gene #${geneId}`;
        const svg = vote.proposal.geneNFT.svg || '';
        const loveAmount = Number(vote.loveAmount);

        if (!stats[traitType]) {
          stats[traitType] = {};
        }

        if (!stats[traitType][geneId]) {
          stats[traitType][geneId] = {
            votes: 0,
            totalLove: 0,
            geneName,
            svg,
          };
        }

        if (!vote.isRemoveVote) {
          stats[traitType][geneId].votes += 1;
          // Divide love amount by bulk vote size to get actual love per gene
          stats[traitType][geneId].totalLove += loveAmount / bulkVoteSize;
        }
      });
    });

    return stats;
  }, [votes]);

  // Filter vote stats by selected category
  const filteredVoteStats = useMemo(() => {
    if (selectedCategory === 'all') return voteStats;

    const categoryIndex = Object.keys(TRAIT_CATEGORIES).find(
      (key) => key === selectedCategory
    );

    if (!categoryIndex) return voteStats;

    const traitType = Number(categoryIndex);
    return voteStats[traitType] ? { [traitType]: voteStats[traitType] } : {};
  }, [voteStats, selectedCategory]);

  // Calculate winning genes for preview
  const winningGenes = useMemo(() => {
    const winners: { [traitType: number]: string } = {};

    Object.entries(voteStats).forEach(([traitType, genes]) => {
      let maxLove = 0;
      let winningGene = '';

      Object.entries(genes).forEach(([geneId, stats]) => {
        if (stats.totalLove > maxLove) {
          maxLove = stats.totalLove;
          winningGene = stats.svg;
        }
      });

      if (winningGene) {
        winners[Number(traitType)] = winningGene;
      }
    });

    return winners;
  }, [voteStats]);

  const previewSvg = useMemo(() => {
    // Correct rendering order: background=0, arm=1, tail=2, ears=3, body=4, face=5, mouth=6, misc=7
    const orderedTraits = [0, 1, 2, 3, 4, 5, 6, 7];
    return orderedTraits
      .map((traitType) => winningGenes[traitType] || '')
      .join('');
  }, [winningGenes]);

  // Calculate high-level statistics
  const highLevelStats = useMemo(() => {
    if (!votes || !allAuctions || !currentAuction) return null;

    // Group votes by voter and transaction to avoid double counting bulk votes
    const votesByVoterAndTx = votes.reduce((acc, vote) => {
      if (vote.isRemoveVote) return acc;

      const key = `${vote.voter.address}-${vote.blockNumber}-${vote.transactionHash}`;
      if (!acc[key]) {
        acc[key] = {
          voter: vote.voter.address,
          loveAmount: Number(vote.loveAmount),
          traitTypes: new Set([vote.proposal.traitType]),
        };
      } else {
        acc[key].traitTypes.add(vote.proposal.traitType);
      }
      return acc;
    }, {} as Record<string, { voter: string; loveAmount: number; traitTypes: Set<number> }>);

    // Calculate correct totals accounting for bulk vote distribution
    const uniqueTransactions = Object.values(votesByVoterAndTx);
    const totalLoveSpent = uniqueTransactions.reduce((sum, tx) => {
      // Each transaction represents the full love amount spent by that voter
      return sum + tx.loveAmount;
    }, 0);

    const uniqueVoters = new Set(uniqueTransactions.map((tx) => tx.voter)).size;
    const activeAuctions = allAuctions.filter((a) => !a.finished).length;
    const completedAuctions = allAuctions.filter((a) => a.finished).length;

    // Calculate turnout: percentage of parent Aminals' love participating in voting
    // This represents how much of the voting power (based on parent love) is being utilized
    const parentLoveTotal = Number(currentAuction.totalLove) || 0;
    const turnoutPercentage =
      parentLoveTotal > 0
        ? Math.round((totalLoveSpent / parentLoveTotal) * 100)
        : 0;

    return {
      totalLoveSpent: Math.round(totalLoveSpent),
      uniqueVoters,
      activeAuctions,
      completedAuctions,
      turnoutPercentage,
      parentLoveTotal,
    };
  }, [votes, allAuctions, currentAuction]);

  if (isLoading) {
    return <div className="text-center py-4">Loading vote statistics...</div>;
  }

  if (Object.keys(voteStats).length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Vote Statistics</h3>

        {/* High-level Stats */}
        {highLevelStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-blue-600">
                {highLevelStats.activeAuctions}
              </div>
              <div className="text-xs text-blue-700">Active Auctions</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-600">
                {highLevelStats.completedAuctions}
              </div>
              <div className="text-xs text-green-700">Completed</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-purple-600">
                {highLevelStats.turnoutPercentage}%
              </div>
              <div className="text-xs text-purple-700">Turnout</div>
            </div>
            <div className="bg-pink-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-pink-600">
                {highLevelStats.uniqueVoters}
              </div>
              <div className="text-xs text-pink-700">Unique Voters</div>
            </div>
          </div>
        )}

        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <div className="text-gray-600">
            <div className="text-lg mb-2">📊</div>
            <div className="font-medium">No votes cast yet</div>
            <div className="text-sm mt-1">
              Vote on proposed genes to see statistics here
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Vote Statistics</h3>
        {highLevelStats && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{highLevelStats.uniqueVoters} voters</span>
            <span>•</span>
            <span>{highLevelStats.totalLoveSpent} ❤️ votes</span>
            <span>•</span>
            <span className="font-medium text-blue-600">
              {highLevelStats.turnoutPercentage}% turnout
            </span>
          </div>
        )}
      </div>

      {/* Preview of current winning combination */}
      {Object.keys(winningGenes).length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🏆</span>
                <h4 className="font-semibold text-purple-700">
                  Current Winning Combination
                </h4>
              </div>
              <div className="text-sm text-purple-600">
                What the offspring would look like if the auction closed now
              </div>
            </div>
            <div className="w-64 h-64 bg-white rounded-lg overflow-hidden border border-purple-200 flex-shrink-0">
              <svg
                viewBox="0 0 1000 1000"
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: previewSvg }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Category Filters */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-2 min-w-max">
          <button
            className={cn(
              'px-3 py-1.5 text-sm rounded-full font-medium transition-colors flex items-center gap-1',
              selectedCategory === 'all'
                ? 'bg-gray-900 text-white hover:bg-gray-800'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
            )}
            onClick={() => setSelectedCategory('all')}
          >
            <span>🔍</span>
            <span>All Categories</span>
          </button>

          {Object.entries(TRAIT_CATEGORIES).map(([key, { name, emoji }]) => (
            <button
              key={key}
              className={cn(
                'px-3 py-1.5 text-sm rounded-full font-medium transition-colors flex items-center gap-1',
                selectedCategory === key
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
              )}
              onClick={() => setSelectedCategory(key)}
            >
              <span>{emoji}</span>
              <span>{name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Vote statistics by trait category */}
      <div className="space-y-3">
        {Object.keys(filteredVoteStats).length === 0 &&
        selectedCategory !== 'all' ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <div className="text-gray-600">
              <span className="text-lg block mb-2">
                {
                  TRAIT_CATEGORIES[
                    Number(selectedCategory) as keyof typeof TRAIT_CATEGORIES
                  ]?.emoji
                }
              </span>
              <div className="font-medium">
                No votes for{' '}
                {
                  TRAIT_CATEGORIES[
                    Number(selectedCategory) as keyof typeof TRAIT_CATEGORIES
                  ]?.name
                }{' '}
                yet
              </div>
              <div className="text-sm mt-1">
                Try selecting a different category or vote on genes to see
                statistics
              </div>
            </div>
          </div>
        ) : (
          Object.entries(filteredVoteStats).map(([traitType, genes]) => {
            const categoryIndex = Number(traitType);
            const category =
              TRAIT_CATEGORIES[categoryIndex as keyof typeof TRAIT_CATEGORIES];

            return (
              <div
                key={traitType}
                className="border border-gray-200 rounded-lg p-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span>{category?.emoji}</span>
                  <h4 className="font-medium text-sm">{category?.name}</h4>
                </div>

                <div className="space-y-1">
                  {Object.entries(genes)
                    .sort(([, a], [, b]) => b.totalLove - a.totalLove)
                    .slice(0, 3) // Show only top 3
                    .map(([geneId, stats], index) => (
                      <div
                        key={geneId}
                        className={`flex items-center justify-between p-2 rounded transition-all ${
                          index === 0
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-white rounded overflow-hidden border border-gray-200">
                            {stats.svg ? (
                              <svg
                                viewBox="0 0 1000 1000"
                                className="w-full h-full"
                                dangerouslySetInnerHTML={{ __html: stats.svg }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                                ?
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium flex items-center gap-1">
                              {stats.geneName}
                              {index === 0 && (
                                <span className="text-xs bg-green-600 text-white px-1 rounded">
                                  🏆
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-600">
                              #{geneId}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-bold">
                            {Math.round(stats.totalLove)} ❤️
                          </div>
                          <div className="text-xs text-gray-600">
                            {stats.votes}v
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default VoteStats;
