import { TokenUriImage } from '@/components/aminal-card';
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
  const { data: gene, isLoading } = useGene(id as string);

  if (isLoading) {
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

  if (!gene) {
    return (
      <Layout>
        <div className="container max-w-5xl mx-auto px-4 py-8">
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Gene not found.</p>
          </div>
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
              <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full font-medium">
                {category.name}
              </span>
            </div>
            <Link
              href="/genes"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Back to all Genes
            </Link>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - SVG Display */}
            <div className="aspect-square rounded-xl overflow-hidden bg-indigo-50 flex items-center justify-center p-6 border border-gray-200">
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
              <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
                <h2 className="text-xl font-semibold">Creator</h2>
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                    👤
                  </div>
                  <div>
                    <div className="font-medium">Address</div>
                    <div className="font-mono text-sm text-gray-600">
                      {gene.creator.address}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
                <h2 className="text-xl font-semibold">Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="text-sm text-gray-600">Category</div>
                    <div className="text-xl font-semibold flex items-center gap-2">
                      <span>{category.emoji}</span>
                      {category.name}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="text-sm text-gray-600">Used by</div>
                    <div className="text-xl font-semibold text-purple-600">
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
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No Aminals have this gene yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {uniqueAminals.map((aminal: any) => {
                  const aminalWithDetails =
                    aminal as unknown as AminalWithDetails;
                  return (
                    <div
                      key={aminalWithDetails.id}
                      className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-square bg-indigo-50 relative">
                        {aminalWithDetails.tokenURI && (
                          <TokenUriImage
                            tokenUri={aminalWithDetails.tokenURI}
                            aminalId={aminalWithDetails.aminalIndex}
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <Link
                          href={`/aminals/${
                            aminalWithDetails.contractAddress ||
                            aminalWithDetails.aminalIndex
                          }`}
                          className="text-xl font-bold hover:text-blue-600 transition-colors"
                        >
                          Aminal #{aminalWithDetails.aminalIndex}
                        </Link>

                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <div className="text-sm">
                            <div className="text-gray-500">Energy</div>
                            <div className="font-medium text-purple-600">
                              {(
                                Number(aminalWithDetails.energy) / 1e18
                              ).toFixed(2)}{' '}
                              ⚡
                            </div>
                          </div>
                          <div className="text-sm">
                            <div className="text-gray-500">Love</div>
                            <div className="font-medium text-pink-600">
                              {(
                                Number(aminalWithDetails.totalLove) / 1e18
                              ).toFixed(2)}{' '}
                              ❤️
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <Link
                            href={`/aminals/${aminalWithDetails.aminalIndex}`}
                            className="w-full inline-block text-center px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
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
