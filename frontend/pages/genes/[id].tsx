import AminalCard from '@/components/aminal-card';
import { PageLoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState, NoAminalsFound } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { TRAIT_CATEGORIES } from '@/constants/trait-categories';
import { useGene } from '@/resources/genes';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../_layout';

interface AminalWithDetails {
  id: string;
  aminalIndex: string;
  contractAddress: string;
  tokenURI: string;
  totalLove: string;
  energy: string;
}

const GeneDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  // Show loading state if router is not ready or ID is not available
  const isRouterReady = router.isReady && id && typeof id === 'string' && id !== 'undefined';
  
  const { data: gene, isLoading } = useGene(isRouterReady ? (id as string) : '');

  // Handle fallback state for static export
  if (router.isFallback) {
    return (
      <Layout>
        <div className="container max-w-5xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isRouterReady || isLoading) {
    return (
      <Layout>
        <div className="container max-w-5xl mx-auto px-4 py-8">
          <PageLoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (!gene) {
    return (
      <Layout>
        <div className="container max-w-5xl mx-auto px-4 py-8">
          <EmptyState
            icon="🧬"
            title="Gene not found"
            description="The gene you're looking for doesn't exist."
          />
        </div>
      </Layout>
    );
  }

  const category =
    TRAIT_CATEGORIES[gene.traitType as keyof typeof TRAIT_CATEGORIES];
  // Extract unique Aminals from proposals (each proposal has 2 Aminals)
  const uniqueAminals = gene.proposalsUsingGene
    ? Array.from(
        new Set(
          [
            ...gene.proposalsUsingGene.map((p: any) => p.auction.aminalOne),
            ...gene.proposalsUsingGene.map((p: any) => p.auction.aminalTwo),
          ].map((a) => a.id)
        )
      ).map((id) =>
        [
          ...gene.proposalsUsingGene.map((p: any) => p.auction.aminalOne),
          ...gene.proposalsUsingGene.map((p: any) => p.auction.aminalTwo),
        ].find((a) => a.id === id)
      )
    : [];
  const aminalCount = uniqueAminals.length;

  return (
    <Layout>
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <span className="text-3xl">{category.emoji}</span>
                Gene #{gene.tokenId}
              </h1>
              <Badge variant="neutral" size="lg">
                {category.name}
              </Badge>
            </div>
            <Link
              href="/genes"
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              ← Back to all Genes
            </Link>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - SVG Display */}
            <div className="aspect-square rounded-xl overflow-hidden bg-primary/5 flex items-center justify-center p-6 border">
              <svg
                viewBox="0 0 1000 1000"
                className="w-full h-full"
                dangerouslySetInnerHTML={{
                  __html: gene.svg || '',
                }}
              />
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Creator Info */}
              <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-5 space-y-3">
                <h2 className="text-xl font-semibold">Creator</h2>
                <div className="flex items-center gap-3">
                  <div className="bg-muted w-12 h-12 rounded-full flex items-center justify-center text-xl">
                    👤
                  </div>
                  <div>
                    <div className="font-medium">Address</div>
                    <div className="font-mono text-sm text-muted-foreground">
                      {gene.creator.address}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-5 space-y-3">
                <h2 className="text-xl font-semibold">Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg border">
                    <div className="text-sm text-muted-foreground">Category</div>
                    <div className="text-xl font-semibold flex items-center gap-2">
                      <span>{category.emoji}</span>
                      {category.name}
                    </div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg border">
                    <div className="text-sm text-muted-foreground">Used by</div>
                    <div className="text-xl font-semibold text-energy-600">
                      {aminalCount} {aminalCount === 1 ? 'Aminal' : 'Aminals'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Aminals with this Trait */}
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-bold">Aminals with this Gene</h2>
            {aminalCount === 0 ? (
              <EmptyState
                icon="🐾"
                title="No Aminals found"
                description="No Aminals have this gene yet."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {uniqueAminals.map((aminal: any) => {
                  const aminalWithDetails = aminal as unknown as AminalWithDetails;
                  
                  // Transform the data to match AminalCard's expected interface
                  const transformedAminal = {
                    id: aminalWithDetails.id,
                    contractAddress: aminalWithDetails.contractAddress,
                    aminalIndex: aminalWithDetails.aminalIndex,
                    energy: (Number(aminalWithDetails.energy) / 1e18).toString(),
                    totalLove: (Number(aminalWithDetails.totalLove) / 1e18).toString(),
                    tokenURI: aminalWithDetails.tokenURI,
                    backId: '',
                    armId: '',
                    tailId: '',
                    earsId: '',
                    bodyId: '',
                    faceId: '',
                    mouthId: '',
                    miscId: '',
                    lovers: [],
                  };
                  
                  return (
                    <AminalCard
                      key={aminalWithDetails.id}
                      aminal={transformedAminal}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GeneDetailPage;

// Remove static generation - use server-side rendering for dynamic routes
