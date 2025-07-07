import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { GeneNftByIdQuery, GeneNftsListQuery } from '../../.graphclient';

const BASE_KEY = 'genes';

export type GeneFilter = 'all' | 'yours';
export type GeneSort = 'aminals-count' | 'created-at';
export type CategoryFilter =
  | 'all'
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7';

type GeneNFT = GeneNftsListQuery['geneNFTs'][number];

export const useGenes = (
  filter: GeneFilter = 'all',
  sort: GeneSort = 'aminals-count',
  category: CategoryFilter = 'all'
) => {
  const { address } = useAccount();

  return useQuery<GeneNftsListQuery['geneNFTs']>({
    queryKey: [BASE_KEY, filter, sort, category, address],
    queryFn: async () => {
      try {
        // Direct HTTP fetch as workaround for GraphQL client bug
        const response = await fetch(
          'https://api.studio.thegraph.com/query/57078/aminals-3/version/latest',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: `
              query GeneNFTsList {
                geneNFTs(orderBy: tokenId, orderDirection: asc) {
                  id
                  tokenId
                  traitType
                  name
                  description
                  svg
                  owner {
                    id
                    address
                  }
                  creator {
                    id
                    address
                  }
                  proposalsUsingGene {
                    id
                    auction {
                      id
                      aminalOne {
                        id
                        aminalIndex
                        contractAddress
                        tokenURI
                        energy
                        totalLove
                      }
                      aminalTwo {
                        id
                        aminalIndex
                        contractAddress
                        tokenURI
                        energy
                        totalLove
                      }
                    }
                  }
                  blockTimestamp
                }
              }
            `,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.errors) {
          console.error('GraphQL errors:', data.errors);
          throw new Error(data.errors[0].message);
        }

        if (!data.data) {
          console.error('No data in response:', data);
          throw new Error('No data returned from GraphQL query');
        }

        let geneNFTs = data.data?.geneNFTs || [];

        // Apply owner filter
        if (filter === 'yours' && address) {
          const beforeFilter = geneNFTs.length;
          geneNFTs = geneNFTs.filter(
            (gene: GeneNFT) =>
              gene.creator?.address?.toLowerCase() === address?.toLowerCase()
          );
        }

        // Apply category filter
        if (category !== 'all') {
          const beforeFilter = geneNFTs.length;
          geneNFTs = geneNFTs.filter(
            (gene: GeneNFT) => gene.traitType === Number(category)
          );
        }

        // Apply sort
        if (sort === 'aminals-count') {
          geneNFTs.sort((a: GeneNFT, b: GeneNFT) => {
            // Calculate unique Aminals count from proposals
            const aCount = a.proposalsUsingGene
              ? new Set([
                  ...a.proposalsUsingGene.map(
                    (p: any) => p.auction.aminalOne.id
                  ),
                  ...a.proposalsUsingGene.map(
                    (p: any) => p.auction.aminalTwo.id
                  ),
                ]).size
              : 0;
            const bCount = b.proposalsUsingGene
              ? new Set([
                  ...b.proposalsUsingGene.map(
                    (p: any) => p.auction.aminalOne.id
                  ),
                  ...b.proposalsUsingGene.map(
                    (p: any) => p.auction.aminalTwo.id
                  ),
                ]).size
              : 0;
            return bCount - aCount;
          });
        } else if (sort === 'created-at') {
          // Sort by tokenId as a proxy for creation time
          geneNFTs.sort(
            (a: GeneNFT, b: GeneNFT) => Number(b.tokenId) - Number(a.tokenId)
          );
        }

        return geneNFTs;
      } catch (error) {
        console.error('Error in genes query:', error);
        throw error;
      }
    },
  });
};

export const useGene = (id: string) => {
  return useQuery<GeneNftByIdQuery['geneNFT']>({
    queryKey: [BASE_KEY, id],
    queryFn: async () => {
      // Direct HTTP fetch as workaround for GraphQL client bug
      const response = await fetch(
        'https://api.studio.thegraph.com/query/57078/aminals-3/version/latest',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
            query GeneNFTById($id: ID!) {
              geneNFT(id: $id) {
                id
                tokenId
                traitType
                name
                description
                svg
                owner {
                  id
                  address
                }
                creator {
                  id
                  address
                }
                proposalsUsingGene {
                  id
                  auction {
                    id
                    aminalOne {
                      id
                      aminalIndex
                      contractAddress
                      tokenURI
                      energy
                      totalLove
                    }
                    aminalTwo {
                      id
                      aminalIndex
                      contractAddress
                      tokenURI
                      energy
                      totalLove
                    }
                  }
                }
                blockTimestamp
              }
            }
          `,
            variables: {
              id: id,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.errors) {
        console.error('GraphQL Errors:', data.errors);
        throw new Error(data.errors[0].message);
      }

      return data.data?.geneNFT;
    },
    enabled: !!id,
  });
};

export const useGenesByIds = (ids: string[]) => {
  return useQuery<GeneNftByIdQuery['geneNFT'][]>({
    queryKey: [BASE_KEY, 'multiple', ids.sort()],
    queryFn: async () => {
      if (ids.length === 0) return [];

      // Direct HTTP fetch as workaround for GraphQL client bug
      const response = await fetch(
        'https://api.studio.thegraph.com/query/57078/aminals-3/version/latest',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
            query GeneNFTsById($ids: [String!]!) {
              geneNFTs(where: { tokenId_in: $ids }) {
                id
                tokenId
                traitType
                name
                description
                svg
                owner {
                  id
                  address
                }
                creator {
                  id
                  address
                }
                blockTimestamp
              }
            }
          `,
            variables: {
              ids: ids,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.errors) {
        console.error('GraphQL Errors:', data.errors);
        throw new Error(data.errors[0].message);
      }

      return data.data?.geneNFTs || [];
    },
    enabled: ids.length > 0,
  });
};
