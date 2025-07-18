import { useQuery } from '@tanstack/react-query';
import {
  execute,
  GeneProposalsListDocument,
  GeneProposal,
} from '../../.graphclient';

const BASE_KEY = 'gene-proposals';

// Helper function to convert auction ID to hex format expected by GraphQL
const toHexAuctionId = (auctionId: string): string => {
  if (!/^0x/.test(auctionId)) {
    // Convert auction ID to proper hex format: "1" -> "0x01000000"
    // The auction ID goes in the first byte, followed by zeros
    const auctionNum = parseInt(auctionId);
    const hexId = (auctionNum * 0x1000000).toString(16).padStart(8, '0');
    return `0x${hexId}`;
  }
  return auctionId;
};

export const useGeneProposalsByAuctionId = (auctionId: string) => {
  return useQuery<GeneProposal[]>({
    queryKey: [BASE_KEY, 'auction', auctionId],
    queryFn: async () => {
      const response = await execute(GeneProposalsListDocument, {
        first: 1000,
        skip: 0,
      });
      if (response.errors) throw new Error(response.errors[0].message);
      
      // Filter to only proposals for this auction
      const hexAuctionId = toHexAuctionId(auctionId);
      const filteredProposals = (response.data.geneProposals || []).filter(
        (proposal: GeneProposal) => proposal.auction.id === hexAuctionId
      );
      
      return filteredProposals;
    },
    enabled: !!auctionId,
  });
};