import { useQuery } from '@tanstack/react-query';
import {
  Auction,
  AuctionDocument,
  AuctionProposeVisualListDocument,
  AuctionsListDocument,
  ProposeVisualListDocument,
  VisualProposal,
  execute,
} from '../../.graphclient';

const BASE_KEY = 'auctions';

export const useAuctions = () => {
  return useQuery<Auction[]>({
    queryKey: [BASE_KEY, 'list'],
    queryFn: async () => {
      const response = await execute(AuctionsListDocument, {
        first: 10,
        skip: 0,
      });
      if (response.errors) throw new Error(response.errors[0].message);
      return response.data.auctions;
    },
  });
};

export const useAuction = (auctionId: string) => {
  return useQuery<Auction[]>({
    queryKey: [BASE_KEY, auctionId ?? ''],
    queryFn: async () => {
      const response = await execute(AuctionDocument, {
        auctionId,
      });
      if (response.errors) throw new Error(response.errors[0].message);
      return response.data.auctions;
    },
  });
};

export const useAuctionProposeVisuals = (auctionId: string) => {
  return useQuery<VisualProposal[]>({
    queryKey: [BASE_KEY, auctionId ?? '', 'proposals'],
    queryFn: async () => {
      const response = await execute(AuctionProposeVisualListDocument, {
        auctionId,
      });
      if (response.errors) throw new Error(response.errors[0].message);
      return response.data.visualProposals;
    },
  });
};

export const useProposeVisuals = () => {
  return useQuery<VisualProposal[]>({
    queryKey: [BASE_KEY, 'all', 'proposals'],
    queryFn: async () => {
      const response = await execute(ProposeVisualListDocument, {
        first: 1000,
        skip: 0,
      });
      if (response.errors) throw new Error(response.errors[0].message);
      return response.data.visualProposals;
    },
  });
};
