import { useQuery } from '@tanstack/react-query';
import { Auction, AuctionsListDocument, execute } from '../../.graphclient';

const BASE_KEY = 'aminals';

export const useAuctions = () => {
  return useQuery<Auction[]>({
    queryKey: [BASE_KEY],
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
