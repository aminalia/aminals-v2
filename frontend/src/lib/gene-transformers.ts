import { GeneNftsListQuery } from '../../.graphclient';

export type GeneFilter = 'all' | 'yours';
export type GeneSort = 'aminals-count' | 'created-at';
export type CategoryFilter = 'all' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7';

type GeneNFT = GeneNftsListQuery['geneNFTs'][number];

/**
 * Transform and filter genes based on user preferences
 */
export const transformGenes = (
  genes: GeneNFT[],
  filter: GeneFilter = 'all',
  sort: GeneSort = 'aminals-count',
  category: CategoryFilter = 'all',
  userAddress?: string
): GeneNFT[] => {
  let processedGenes = [...genes];

  // Apply owner filter
  if (filter === 'yours' && userAddress) {
    processedGenes = processedGenes.filter(
      (gene: GeneNFT) =>
        gene.creator?.address?.toLowerCase() === userAddress.toLowerCase()
    );
  }

  // Apply category filter
  if (category !== 'all') {
    processedGenes = processedGenes.filter(
      (gene: GeneNFT) => gene.traitType === Number(category)
    );
  }

  // Apply sort
  processedGenes.sort((a: GeneNFT, b: GeneNFT) => {
    switch (sort) {
      case 'aminals-count':
        // Calculate unique Aminals count from proposals
        const aCount = a.proposalsUsingGene
          ? new Set([
              ...a.proposalsUsingGene.map((p: any) => p.auction.aminalOne.id),
              ...a.proposalsUsingGene.map((p: any) => p.auction.aminalTwo.id),
            ]).size
          : 0;
        const bCount = b.proposalsUsingGene
          ? new Set([
              ...b.proposalsUsingGene.map((p: any) => p.auction.aminalOne.id),
              ...b.proposalsUsingGene.map((p: any) => p.auction.aminalTwo.id),
            ]).size
          : 0;
        return bCount - aCount;
      case 'created-at':
        // Sort by tokenId as a proxy for creation time
        return Number(b.tokenId) - Number(a.tokenId);
      default:
        return 0;
    }
  });

  return processedGenes;
};

/**
 * Calculate gene statistics
 */
export const calculateGeneStats = (gene: GeneNFT) => {
  const totalEarnings = Number(gene.totalEarnings || 0);
  const proposalCount = gene.proposalsUsingGene?.length || 0;
  const payoutCount = gene.payouts?.length || 0;
  
  // Calculate unique Aminals count from proposals
  const uniqueAminalsCount = gene.proposalsUsingGene
    ? new Set([
        ...gene.proposalsUsingGene.map((p: any) => p.auction.aminalOne.id),
        ...gene.proposalsUsingGene.map((p: any) => p.auction.aminalTwo.id),
      ]).size
    : 0;

  return {
    totalEarnings,
    proposalCount,
    payoutCount,
    uniqueAminalsCount,
    averageEarningsPerProposal: proposalCount > 0 ? totalEarnings / proposalCount : 0,
  };
};

/**
 * Format gene display data
 */
export const formatGeneForDisplay = (gene: GeneNFT) => {
  const stats = calculateGeneStats(gene);
  
  return {
    id: gene.id,
    tokenId: gene.tokenId,
    displayName: gene.name || `Gene #${gene.tokenId}`,
    description: gene.description || '',
    traitType: gene.traitType,
    traitTypeName: getTraitTypeName(gene.traitType),
    svg: gene.svg,
    owner: gene.owner,
    creator: gene.creator,
    stats,
    metadata: {
      blockTimestamp: Number(gene.blockTimestamp || 0),
      createdAt: new Date(Number(gene.blockTimestamp || 0) * 1000),
    },
  };
};

/**
 * Get trait type name from number
 */
export const getTraitTypeName = (traitType: number): string => {
  const traitNames = {
    0: 'Background',
    1: 'Arm',
    2: 'Tail',
    3: 'Ears',
    4: 'Body',
    5: 'Face',
    6: 'Mouth',
    7: 'Misc',
  };
  return traitNames[traitType as keyof typeof traitNames] || 'Unknown';
};

/**
 * Filter genes by search term
 */
export const filterGenesBySearch = (
  genes: GeneNFT[],
  searchTerm: string
): GeneNFT[] => {
  if (!searchTerm.trim()) {
    return genes;
  }

  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return genes.filter((gene) => {
    const name = gene.name?.toLowerCase() || '';
    const description = gene.description?.toLowerCase() || '';
    const tokenId = gene.tokenId?.toString() || '';
    const traitTypeName = getTraitTypeName(gene.traitType).toLowerCase();
    
    return (
      name.includes(lowerSearchTerm) ||
      description.includes(lowerSearchTerm) ||
      tokenId.includes(lowerSearchTerm) ||
      traitTypeName.includes(lowerSearchTerm)
    );
  });
};

/**
 * Group genes by trait type
 */
export const groupGenesByTraitType = (genes: GeneNFT[]) => {
  const groups = {
    0: [] as GeneNFT[], // Background
    1: [] as GeneNFT[], // Arm
    2: [] as GeneNFT[], // Tail
    3: [] as GeneNFT[], // Ears
    4: [] as GeneNFT[], // Body
    5: [] as GeneNFT[], // Face
    6: [] as GeneNFT[], // Mouth
    7: [] as GeneNFT[], // Misc
  };

  genes.forEach((gene) => {
    const traitType = gene.traitType;
    if (traitType >= 0 && traitType <= 7) {
      groups[traitType as keyof typeof groups].push(gene);
    }
  });

  return groups;
};

/**
 * Validate gene data structure
 */
export const validateGene = (gene: any): gene is GeneNFT => {
  return (
    gene &&
    typeof gene === 'object' &&
    'id' in gene &&
    'tokenId' in gene &&
    'traitType' in gene
  );
};