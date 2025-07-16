import AminalGrid from '@/components/aminal-grid';
import { AminalsFilterBar } from '@/components/ui/filter-bar';
import { NoAminalsFound, WalletNotConnected } from '@/components/ui/empty-state';
import { PageLoadingSpinner } from '@/components/ui/loading-spinner';
import { useHasMounted } from '@/hooks/useHasMounted';
import { cn } from '@/lib/utils';
import { AminalFilter, AminalSort } from '@/resources/aminals';
import { useAminalsDirect } from '@/resources/aminals-direct';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import Layout from './_layout';

const HomePage: NextPage = () => {
  const hasMounted = useHasMounted();
  const { address } = useAccount();
  const [filter, setFilter] = useState<AminalFilter>('all');
  const [sort, setSort] = useState<AminalSort>('most-loved');

  console.log('HomePage - Current address:', address);
  console.log('HomePage - Address being passed to hook:', address || '');

  const { data: aminals, isLoading: isLoadingAminals } = useAminalsDirect(
    address || '',
    filter,
    sort
  );

  return (
    <>
      <Head>
        <title>Aminals</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <Layout>
        <div className="container max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col gap-6">
            <AminalsFilterBar
              activeFilter={filter}
              onFilterChange={(value) => setFilter(value as AminalFilter)}
              activeSort={sort}
              onSortChange={(value) => setSort(value as AminalSort)}
              resultsCount={aminals?.length || 0}
              actions={
                hasMounted && !address ? (
                  <div className="text-sm text-primary bg-primary/10 px-3 py-2 rounded-full">
                    💡 Connect your wallet to interact with Aminals
                  </div>
                ) : null
              }
            />

            {isLoadingAminals ? (
              <PageLoadingSpinner />
            ) : aminals?.length === 0 ? (
              <NoAminalsFound />
            ) : (
              <AminalGrid aminals={aminals || []} />
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default HomePage;
