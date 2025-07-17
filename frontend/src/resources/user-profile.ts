import { useQuery } from '@tanstack/react-query';

const BASE_KEY = 'user-profile';

interface UserProfileData {
  id: string;
  address: string;
  lovers: Array<{
    id: string;
    aminal: {
      id: string;
      contractAddress: string;
      tokenURI: string;
      totalLove: string;
      energy: string;
      ethBalance: string;
      blockTimestamp: string;
    };
    love: string;
  }>;
  genesCreated: Array<{
    id: string;
    tokenId: string;
    traitType: number;
    name: string;
    description: string;
    svg: string;
    totalEarnings: string;
    blockTimestamp: string;
    payouts: Array<{
      id: string;
      amount: string;
      auctionId: string;
      blockTimestamp: string;
    }>;
  }>;
  genesOwned: Array<{
    id: string;
    tokenId: string;
    traitType: number;
    name: string;
    description: string;
    svg: string;
    totalEarnings: string;
    blockTimestamp: string;
    creator: {
      id: string;
      address: string;
    };
  }>;
  geneVotes: Array<{
    id: string;
    auction: {
      id: string;
      auctionId: string;
      aminalOne: {
        id: string;
        contractAddress: string;
        tokenURI: string;
      };
      aminalTwo: {
        id: string;
        contractAddress: string;
        tokenURI: string;
      };
    };
    proposal: {
      id: string;
      geneNFT: {
        id: string;
        tokenId: string;
        name: string;
        traitType: number;
      };
    };
    isRemoveVote: boolean;
    loveAmount: string;
    blockTimestamp: string;
  }>;
}

interface UserEarningsData {
  id: string;
  address: string;
  genesCreated: Array<{
    id: string;
    tokenId: string;
    name: string;
    traitType: number;
    totalEarnings: string;
    payouts: Array<{
      id: string;
      amount: string;
      auctionId: string;
      blockTimestamp: string;
      auction: {
        id: string;
        auctionId: string;
        aminalOne: {
          id: string;
          contractAddress: string;
          tokenURI: string;
        };
        aminalTwo: {
          id: string;
          contractAddress: string;
          tokenURI: string;
        };
      };
    }>;
  }>;
}

export const useUserProfile = (address: string) => {
  return useQuery<UserProfileData | null>({
    queryKey: [BASE_KEY, address],
    queryFn: async () => {
      if (!address) return null;

      const response = await fetch(
        'https://api.studio.thegraph.com/query/57078/aminals-3/version/latest',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query UserProfile($address: Bytes!) {
                user(id: $address) {
                  id
                  address
                  lovers {
                    id
                    aminal {
                      id
                      contractAddress
                      tokenURI
                      totalLove
                      energy
                      ethBalance
                      blockTimestamp
                    }
                    love
                  }
                  genesCreated {
                    id
                    tokenId
                    traitType
                    name
                    description
                    svg
                    totalEarnings
                    blockTimestamp
                    payouts {
                      id
                      amount
                      auctionId
                      blockTimestamp
                    }
                  }
                  genesOwned {
                    id
                    tokenId
                    traitType
                    name
                    description
                    svg
                    totalEarnings
                    blockTimestamp
                    creator {
                      id
                      address
                    }
                  }
                  geneVotes {
                    id
                    auction {
                      id
                      auctionId
                      aminalOne {
                        id
                        contractAddress
                        tokenURI
                      }
                      aminalTwo {
                        id
                        contractAddress
                        tokenURI
                      }
                    }
                    proposal {
                      id
                      geneNFT {
                        id
                        tokenId
                        name
                        traitType
                      }
                    }
                    isRemoveVote
                    loveAmount
                    blockTimestamp
                  }
                }
              }
            `,
            variables: {
              address: address,
            },
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

      return data.data?.user || null;
    },
    enabled: !!address,
  });
};

export const useUserEarnings = (address: string) => {
  return useQuery<UserEarningsData | null>({
    queryKey: [BASE_KEY, 'earnings', address],
    queryFn: async () => {
      if (!address) return null;

      const response = await fetch(
        'https://api.studio.thegraph.com/query/57078/aminals-3/version/latest',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query UserEarnings($address: Bytes!) {
                user(id: $address) {
                  id
                  address
                  genesCreated {
                    id
                    tokenId
                    name
                    traitType
                    totalEarnings
                    payouts {
                      id
                      amount
                      auctionId
                      blockTimestamp
                      auction {
                        id
                        auctionId
                        aminalOne {
                          id
                          contractAddress
                          tokenURI
                        }
                        aminalTwo {
                          id
                          contractAddress
                          tokenURI
                        }
                      }
                    }
                  }
                }
              }
            `,
            variables: {
              address: address,
            },
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

      return data.data?.user || null;
    },
    enabled: !!address,
  });
};

export const useUserActivity = (address: string) => {
  return useQuery<UserProfileData | null>({
    queryKey: [BASE_KEY, 'activity', address],
    queryFn: async () => {
      if (!address) return null;

      const response = await fetch(
        'https://api.studio.thegraph.com/query/57078/aminals-3/version/latest',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query UserActivity($address: Bytes!) {
                user(id: $address) {
                  id
                  address
                  lovers(orderBy: love, orderDirection: desc, first: 10) {
                    id
                    aminal {
                      id
                      contractAddress
                      tokenURI
                      totalLove
                    }
                    love
                  }
                  geneVotes(orderBy: blockTimestamp, orderDirection: desc, first: 10) {
                    id
                    auction {
                      id
                      auctionId
                    }
                    proposal {
                      id
                      geneNFT {
                        id
                        tokenId
                        name
                        traitType
                      }
                    }
                    isRemoveVote
                    loveAmount
                    blockTimestamp
                  }
                }
              }
            `,
            variables: {
              address: address,
            },
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

      return data.data?.user || null;
    },
    enabled: !!address,
  });
};