import { TRAIT_CATEGORIES } from '@/constants/trait-categories';
import { useAuctionVotes } from '@/resources/auctions';
import { useMemo } from 'react';

interface VoteStatsProps {
  auctionId: string;
}

const VoteStats = ({ auctionId }: VoteStatsProps) => {
  const { data: votes, isLoading } = useAuctionVotes(auctionId);

  const voteStats = useMemo(() => {
    if (!votes || votes.length === 0) return {};

    const stats: { [traitType: number]: { [geneId: string]: { votes: number; totalLove: number; geneName: string; svg: string } } } = {};

    votes.forEach(vote => {
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
        stats[traitType][geneId].totalLove += loveAmount;
      }
    });

    return stats;
  }, [votes]);

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
      .map(traitType => winningGenes[traitType] || '')
      .join('');
  }, [winningGenes]);

  if (isLoading) {
    return <div className="text-center py-4">Loading vote statistics...</div>;
  }

  if (Object.keys(voteStats).length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold mb-4">Vote Statistics</h3>
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <div className="text-gray-600">
            <div className="text-lg mb-2">📊</div>
            <div className="font-medium">No votes cast yet</div>
            <div className="text-sm mt-1">Vote on proposed genes to see statistics here</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Vote Statistics</h3>
      
      {/* Preview of current winning combination */}
      {Object.keys(winningGenes).length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🏆</span>
            <h4 className="font-bold text-lg text-purple-700">Current Winning Combination</h4>
          </div>
          <div className="bg-white rounded-xl p-4 border border-purple-200">
            <div className="aspect-square max-w-sm mx-auto rounded-lg overflow-hidden bg-indigo-50 border border-gray-200">
              <svg
                viewBox="0 0 1000 1000"
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: previewSvg }}
              />
            </div>
          </div>
          <div className="text-center mt-4 text-sm text-purple-600">
            This is what the offspring would look like if the auction closed now
          </div>
        </div>
      )}
      
      {/* Vote statistics by trait category */}
      <div className="grid gap-4">
        {Object.entries(voteStats).map(([traitType, genes]) => {
          const categoryIndex = Number(traitType);
          const category = TRAIT_CATEGORIES[categoryIndex as keyof typeof TRAIT_CATEGORIES];
          
          return (
            <div key={traitType} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{category?.emoji}</span>
                <h4 className="font-semibold">{category?.name}</h4>
              </div>
              
              <div className="space-y-2">
                {Object.entries(genes)
                  .sort(([,a], [,b]) => b.totalLove - a.totalLove)
                  .map(([geneId, stats], index) => (
                    <div key={geneId} className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                      index === 0 ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                          {stats.svg ? (
                            <svg
                              viewBox="0 0 1000 1000"
                              className="w-full h-full"
                              dangerouslySetInnerHTML={{ __html: stats.svg }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                              No SVG
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {stats.geneName}
                            {index === 0 && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">🏆 Leading</span>}
                          </div>
                          <div className="text-sm text-gray-600">Gene #{geneId}</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-lg">{stats.totalLove} ❤️</div>
                        <div className="text-sm text-gray-600">{stats.votes} votes</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VoteStats;