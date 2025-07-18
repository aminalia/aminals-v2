import AminalGrid from '@/components/aminal-grid';
import { ContentContainer } from '@/components/layout/content-container';
import { NoAminalsFound } from '@/components/ui/empty-state';
import { AminalsFilterBar } from '@/components/ui/filter-bar';
import { PageLoadingSpinner } from '@/components/ui/loading-spinner';
import { useHasMounted } from '@/hooks/useHasMounted';
import { AminalFilter, AminalSort, useAminals } from '@/resources/aminals';
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

  const { data: aminals, isLoading: isLoadingAminals } = useAminals(
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
        <div className="py-8">
          <ContentContainer layout="single" gap="lg">
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
          </ContentContainer>
        </div>
      </Layout>
    </>
  );
};

export default HomePage;
