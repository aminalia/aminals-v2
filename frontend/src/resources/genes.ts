import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { 
  GeneNftByIdQuery, 
  GeneNftsListQuery, 
  GeneNftsListDocument,
  GeneNftByIdDocument,
  execute 
} from '../../.graphclient';
import { queryKeys, handleGraphQLError } from '../lib/query-client';
import { 
  transformGenes, 
  GeneFilter, 
  GeneSort, 
  CategoryFilter 
} from '../lib/gene-transformers';

export type { GeneFilter, GeneSort, CategoryFilter };

type GeneNFT = GeneNftsListQuery['geneNFTs'][number];

export const useGenes = (
  filter: GeneFilter = 'all',
  sort: GeneSort = 'aminals-count',
  category: CategoryFilter = 'all'
) => {
  const { address } = useAccount();

  return useQuery<GeneNftsListQuery['geneNFTs']>({
    queryKey: queryKeys.genes.list({ filter, sort, category, address }),
    queryFn: async () => {
      try {
        const response = await execute(GeneNftsListDocument, {});
        
        if (response.errors) {
          console.error('GraphQL errors:', response.errors);
          throw handleGraphQLError(response.errors);
        }

        if (!response.data) {
          console.error('No data in response:', response);
          throw new Error('No data returned from GraphQL query');
        }

        const geneNFTs = response.data?.geneNFTs || [];

        // Use data transformer to apply filter, sort, and category
        return transformGenes(geneNFTs, filter, sort, category, address);
      } catch (error) {
        console.error('Error in genes query:', error);
        throw error;
      }
    },
  });
};

export const useGene = (id: string) => {
  return useQuery<GeneNftByIdQuery['geneNFT']>({
    queryKey: queryKeys.genes.detail(id),
    queryFn: async () => {
      try {
        const response = await execute(GeneNftByIdDocument, {
          id: id,
        });

        if (response.errors) {
          console.error('GraphQL Errors:', response.errors);
          throw handleGraphQLError(response.errors);
        }

        return response.data?.geneNFT;
      } catch (error) {
        console.error('Error fetching gene:', error);
        throw error;
      }
    },
    enabled: !!id,
  });
};

export const useGenesByIds = (ids: string[]) => {
  return useQuery<GeneNftsListQuery['geneNFTs']>({
    queryKey: queryKeys.genes.list({ ids: ids.sort() }),
    queryFn: async () => {
      if (ids.length === 0) return [];

      try {
        // Use the main genes query and filter by IDs
        const response = await execute(GeneNftsListDocument, {});
        
        if (response.errors) {
          console.error('GraphQL Errors:', response.errors);
          throw handleGraphQLError(response.errors);
        }

        const allGenes = response.data?.geneNFTs || [];
        
        // Filter genes by the requested IDs
        return allGenes.filter((gene: GeneNFT) => ids.includes(gene.tokenId));
      } catch (error) {
        console.error('Error fetching genes by IDs:', error);
        throw error;
      }
    },
    enabled: ids.length > 0,
  });
};
