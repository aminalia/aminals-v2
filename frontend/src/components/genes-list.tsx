import { useAccount } from 'wagmi';
import { useGeneProposalsByAuctionId } from '../resources/gene-proposals';
import GeneCard from './gene-card';

interface GenesListProps {
  auctionId: string;
}

const GenesList = ({ auctionId }: GenesListProps) => {
  const { address } = useAccount();
  const {
    data: genes,
    isLoading,
    error,
  } = useGeneProposalsByAuctionId(auctionId);

  if (isLoading) {
    return <div className="text-center py-8">Loading genes...</div>;
  }

  if (error) {
    console.error('Genes loading error:', error);
    return (
      <div className="text-center py-8 text-red-500">
        <div>Error loading genes</div>
        <div className="text-sm mt-2">{error.message}</div>
      </div>
    );
  }

  if (!genes || genes.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-gray-600">
          <div className="text-lg mb-2">🎨</div>
          <div className="font-medium">No community proposals yet</div>
          <div className="text-sm mt-1">Be the first to propose a gene for this breeding!</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {genes.map((gene) => (
        <GeneCard
          key={`${gene.auction.auctionId}-${gene.geneNFT.tokenId}`}
          gene={gene}
        />
      ))}
    </div>
  );
};

export default GenesList;
