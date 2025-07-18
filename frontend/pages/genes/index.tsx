import { Button } from '@/components/ui/button';
import { TRAIT_CATEGORIES } from '@/constants/trait-categories';
import { useHasMounted } from '@/hooks/useHasMounted';
import { cn } from '@/lib/utils';
import {
  CategoryFilter,
  GeneFilter,
  GeneSort,
  useGenes,
} from '@/resources/genes';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import Layout from '../_layout';

// Import dynamically to avoid module resolution issues
const TraitCard = dynamic(() => import('../../src/components/trait-card'), {
  ssr: false,
});

const CreateGeneModal = dynamic(
  () =>
    import('../../src/components/create-gene-modal').then((mod) => ({
      default: mod.default,
    })),
  {
    ssr: false,
  }
);

const TraitsPage: NextPage = () => {
  const hasMounted = useHasMounted();
  const { address } = useAccount();
  const [filter, setFilter] = useState<GeneFilter>('all');
  const [sort, setSort] = useState<GeneSort>('aminals-count');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    data: genes,
    isLoading: isLoadingGenes,
    error: genesError,
    isError: isGenesError,
  } = useGenes(filter, sort, category);

  console.log('Genes data:', genes);
  console.log('Genes loading:', isLoadingGenes);
  console.log('Genes error:', genesError);
  console.log('Is genes error:', isGenesError);

  return (
    <Layout>
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Genes Gallery</h1>
              <p className="text-gray-600">
                Browse and discover unique genes for Aminals
              </p>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="self-start sm:self-auto"
            >
              ✨ Create New Gene
            </Button>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 flex-wrap">
            {/* Count */}
            <div className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {genes?.length || 0} Genes found
            </div>

            <div className="flex flex-wrap gap-3">
              {/* Filter Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Filter:</span>
                <div className="flex gap-2">
                  <button
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-full font-medium transition-colors',
                      filter === 'all'
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                    )}
                    onClick={() => setFilter('all')}
                  >
                    All
                  </button>
                  <button
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-full font-medium transition-colors',
                      filter === 'yours'
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100',
                      // Only apply disabled styles after mount to prevent hydration mismatch
                      hasMounted && !address && 'opacity-50 cursor-not-allowed'
                    )}
                    onClick={() => setFilter('yours')}
                    disabled={hasMounted && !address}
                  >
                    Your Genes
                  </button>
                </div>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  className="px-3 py-1.5 text-sm rounded-full border border-gray-200 bg-white text-gray-700 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-200"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as GeneSort)}
                >
                  <option value="aminals-count">Most Used</option>
                  <option value="created-at">Most Recent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-max">
              <button
                className={cn(
                  'px-3 py-1.5 text-sm rounded-full font-medium transition-colors flex items-center gap-1',
                  category === 'all'
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                )}
                onClick={() => setCategory('all')}
              >
                <span>🔍</span>
                <span>All Categories</span>
              </button>

              {/* Generate a button for each trait category */}
              {Object.entries(TRAIT_CATEGORIES).map(
                ([key, { name, emoji }]) => (
                  <button
                    key={key}
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-full font-medium transition-colors flex items-center gap-1',
                      category === key
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                    )}
                    onClick={() => setCategory(key as CategoryFilter)}
                  >
                    <span>{emoji}</span>
                    <span>{name}</span>
                  </button>
                )
              )}
            </div>
          </div>

          {isLoadingGenes ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : isGenesError ? (
            <div className="text-center py-12 bg-red-50 rounded-lg">
              <p className="text-red-600">
                Error loading genes: {genesError?.message || 'Unknown error'}
              </p>
              <p className="text-sm text-red-500 mt-2">
                Check the console for more details.
              </p>
            </div>
          ) : !genes || genes.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                No genes found matching your filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {genes.map((gene: any) => (
                <TraitCard
                  key={gene.id}
                  trait={gene}
                  aminalCount={
                    gene.proposalsUsingGene
                      ? // Extract unique Aminals from proposals (each proposal has 2 Aminals)
                        new Set([
                          ...gene.proposalsUsingGene.map(
                            (p: any) => p.auction.aminalOne.id
                          ),
                          ...gene.proposalsUsingGene.map(
                            (p: any) => p.auction.aminalTwo.id
                          ),
                        ]).size
                      : 0
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Gene Modal */}
      <CreateGeneModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          // Refresh the traits list after successful creation
          window.location.reload();
        }}
      />
    </Layout>
  );
};

export default TraitsPage;
