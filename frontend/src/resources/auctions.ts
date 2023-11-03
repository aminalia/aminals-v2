import { useQuery } from '@tanstack/react-query';
import {
  Auction,
  AuctionDocument,
  AuctionProposeVisualListDocument,
  AuctionsListDocument,
  ProposeVisual,
  ProposeVisualListDocument,
  execute,
} from '../../.graphclient';

const BASE_KEY = 'aminals';

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

export const useAuction = (auctionId: string | string[]) => {
  return useQuery<Auction>({
    queryKey: [BASE_KEY, auctionId ?? ''],
    queryFn: async () => {
      const response = await execute(AuctionDocument, {
        id: auctionId,
      });
      if (response.errors) throw new Error(response.errors[0].message);
      return response.data.auctions;
    },
  });
};

export const useAuctionProposeVisuals = (auctionId: string | string[]) => {
  return useQuery<ProposeVisual[]>({
    queryKey: [BASE_KEY, auctionId ?? '', 'proposals'],
    queryFn: async () => {
      const response = await execute(AuctionProposeVisualListDocument, {
        auctionId,
      });
      if (response.errors) throw new Error(response.errors[0].message);
      return response.data.proposeVisuals;
    },
  });
};

export const useProposeVisuals = () => {
  return useQuery<ProposeVisual[]>({
    queryKey: [BASE_KEY, 'all', 'proposals'],
    queryFn: async () => {
      const response = await execute(ProposeVisualListDocument, {
        first: 1000,
        skip: 0,
      });
      if (response.errors) throw new Error(response.errors[0].message);
      return response.data.proposeVisuals;
    },
  });
};
