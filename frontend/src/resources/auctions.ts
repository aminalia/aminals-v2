import { useQuery } from '@tanstack/react-query';
import {
  GeneAuction,
  GeneAuctionDocument,
  GeneAuctionQuery,
  GeneAuctionsListDocument,
  GeneProposal,
  GeneVotesByAuctionDocument,
  GeneVote,
  execute,
} from '../../.graphclient';

const BASE_KEY = 'auctions';

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

export const useAuctions = () => {
  return useQuery<GeneAuction[]>({
    queryKey: [BASE_KEY, 'list'],
    queryFn: async () => {
      const response = await execute(GeneAuctionsListDocument, {
        first: 10,
        skip: 0,
      });
      if (response.errors) throw new Error(response.errors[0].message);
      return response.data.geneAuctions;
    },
  });
};

export const useAuction = (auctionId: string) => {
  return useQuery<GeneAuction | null>({
    queryKey: [BASE_KEY, auctionId ?? ''],
    queryFn: async () => {
      const response = await execute(GeneAuctionDocument, {
        id: toHexAuctionId(auctionId),
      });
      if (response.errors) throw new Error(response.errors[0].message);
      return response.data.geneAuction;
    },
  });
};

export const useAuctionProposeGenes = (auctionId: string) => {
  return useQuery<GeneProposal[]>({
    queryKey: [BASE_KEY, auctionId ?? '', 'proposals'],
    queryFn: async () => {
      const response = await execute(GeneAuctionDocument, {
        id: toHexAuctionId(auctionId),
      });
      if (response.errors) throw new Error(response.errors[0].message);
      return response.data.geneAuction?.proposals || [];
    },
  });
};

export const useProposeGenes = () => {
  return useQuery<GeneProposal[]>({
    queryKey: [BASE_KEY, 'all', 'proposals'],
    queryFn: async () => {
      const response = await execute(GeneAuctionsListDocument, {
        first: 1000,
        skip: 0,
      });
      if (response.errors) throw new Error(response.errors[0].message);
      return response.data.geneAuctions.flatMap((auction: any) => auction.proposals);
    },
  });
};

export const useAuctionVotes = (auctionId: string) => {
  return useQuery<GeneVote[]>({
    queryKey: [BASE_KEY, auctionId ?? '', 'votes'],
    queryFn: async () => {
      const response = await execute(GeneVotesByAuctionDocument, {
        auctionId: toHexAuctionId(auctionId),
      });
      if (response.errors) throw new Error(response.errors[0].message);
      return response.data.geneVotes;
    },
    enabled: !!auctionId,
  });
};
