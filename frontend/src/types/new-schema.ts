// Temporary types for new schema - will be replaced by generated types after deployment

export interface SkillUsed {
  id: string;
  aminal: {
    id: string;
    contractAddress: string;
  };
  caller: {
    id: string;
    address: string;
  };
  skillAddress: string;
  selector: string;
  newEnergy: string;
  blockTimestamp: string;
}

export interface GeneCreatorPayout {
  id: string;
  auction: {
    id: string;
    auctionId: string;
  };
  geneNFT: {
    id: string;
    tokenId: string;
  };
  creator: {
    id: string;
    address: string;
  };
  amount: string;
  auctionId: string;
  geneId: string;
  blockTimestamp: string;
}

export interface GeneNFTWithEarnings {
  id: string;
  tokenId: string;
  traitType: number;
  name?: string;
  description?: string;
  svg?: string;
  owner: {
    id: string;
    address: string;
  };
  creator: {
    id: string;
    address: string;
  };
  totalEarnings: string;
  proposalsUsingGene: Array<{
    id: string;
    auction: {
      id: string;
      aminalOne: {
        id: string;
        contractAddress: string;
        tokenURI?: string;
        energy: string;
        totalLove: string;
      };
      aminalTwo: {
        id: string;
        contractAddress: string;
        tokenURI?: string;
        energy: string;
        totalLove: string;
      };
    };
  }>;
  payouts: GeneCreatorPayout[];
  blockTimestamp: string;
}

export interface AminalWithSkillUsed {
  id: string;
  contractAddress: string;
  aminalIndex?: string; // Will be removed in new schema
  momAddress?: string;
  dadAddress?: string;
  energy: string;
  totalLove: string;
  breeding?: boolean;
  blockTimestamp: string;
  tokenURI?: string;
  backId: string;
  armId: string;
  tailId: string;
  earsId: string;
  bodyId: string;
  faceId: string;
  mouthId: string;
  miscId: string;
  breedableWith?: Array<{
    id: string;
    partner: {
      id: string;
      contractAddress: string;
      aminalIndex?: string;
    };
  }>;
  lovers?: Array<{
    love: string;
  }>;
  feeds?: Array<{
    id: string;
    sender: {
      id: string;
      address: string;
    };
    amount: string;
    love: string;
    totalLove: string;
    energy: string;
    blockTimestamp: string;
  }>;
  squeaks?: Array<{
    id: string;
    sender: {
      id: string;
      address: string;
    };
    amount: string;
    love: string;
    totalLove: string;
    energy: string;
    blockTimestamp: string;
  }>;
  skillUsed?: SkillUsed[];
}