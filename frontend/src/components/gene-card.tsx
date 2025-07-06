import { TRAIT_CATEGORIES } from '@/constants/trait-categories';
import { GeneProposal } from '../../.graphclient';
import VoteButton from './actions/vote-button';

interface GeneCardProps {
  gene: GeneProposal;
  userLove?: bigint;
}

const GeneCard = ({ gene, userLove }: GeneCardProps) => {
  const geneTypeNames = ['Background', 'Arms', 'Tail', 'Ears', 'Body', 'Face', 'Mouth', 'Misc'];
  const categoryName = geneTypeNames[gene.traitType] || 'Unknown';
  const categoryEmoji = '🧬'; // Gene emoji

  return (
    <div className="rounded-lg border border-gray-200 shadow-sm bg-white p-6 transition-all hover:shadow-lg">
      <div className="flex flex-col gap-4">
        <svg
          viewBox="0 0 1000 1000"
          className="w-full h-full"
          dangerouslySetInnerHTML={{
            __html: gene.geneNFT.svg || '',
          }}
        />

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold flex items-center gap-2">
              <span className="text-xl">{categoryEmoji}</span>
              Gene #{gene.geneNFT.tokenId}
            </span>
            <span className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded-md">
              {categoryName}
            </span>
          </div>

          <div className="text-sm text-gray-600">
            <span>Proposed by: </span>
            <span className="font-mono">
              {gene.proposer.address.slice(0, 6)}...
              {gene.proposer.address.slice(-4)}
            </span>
          </div>

          <div className="text-sm text-gray-600">
            <span>Votes: </span>
            <span className="font-semibold">{gene.loveVotes}</span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <VoteButton
            auctionId={gene.auction.auctionId}
            catId={gene.traitType}
            vizId={gene.geneNFT.tokenId}
          />
        </div>
      </div>
    </div>
  );
};

export default GeneCard;
