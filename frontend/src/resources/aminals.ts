import { useQuery } from '@tanstack/react-query';
import {
  Aminal,
  AminalByIdDocument,
  AminalByIdQuery,
  AminalsListDocument,
  execute,
} from '../../.graphclient';
import { queryKeys, handleGraphQLError } from '../lib/query-client';
import { transformAminals, AminalFilter, AminalSort } from '../lib/data-transformers';

export type { AminalFilter, AminalSort };

export const useAminals = (
  userAddress: string,
  filter: AminalFilter = 'all',
  sort: AminalSort = 'most-loved'
) => {
  return useQuery<Aminal[]>({
    queryKey: queryKeys.aminals.list(filter, sort, userAddress),
    queryFn: async () => {
      try {
        const response = await execute(AminalsListDocument, {
          first: 100,
          skip: 0,
          address: userAddress,
        });
        
        if (response.errors) {
          console.error('GraphQL errors:', response.errors);
          throw handleGraphQLError(response.errors);
        }

        const aminals = response.data?.aminals || [];

        // Use data transformer to apply filter and sort
        return transformAminals(aminals, filter, sort);
      } catch (error) {
        console.error('Failed to fetch aminals:', error);
        throw error;
      }
    },
  });
};

export const useAminal = (aminalId: string) => {
  return useQuery<AminalByIdQuery['aminals'][0] | undefined>({
    queryKey: queryKeys.aminals.detail(aminalId),
    queryFn: async () => {
      try {
        console.log('Fetching aminal with ID:', aminalId);

        const response = await execute(AminalByIdDocument, {
          contractAddress: aminalId, // Use contractAddress as the query parameter
        });

        console.log('GraphQL Response:', response);

        if (response.errors) {
          console.error('GraphQL Errors:', response.errors);
          throw handleGraphQLError(response.errors);
        }

        console.log('Aminals array:', response.data.aminals);
        console.log('First aminal:', response.data.aminals[0]);

        return response.data.aminals[0];
      } catch (error) {
        console.error('Failed to fetch aminal:', error);
        throw error;
      }
    },
    enabled: !!aminalId,
  });
};
