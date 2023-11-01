import { useAuctions } from '@/resources/auctions';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/index.module.css';
import { Layout } from './_layout';

const Home: NextPage = () => {
  const { data: auctions, isLoading: isLoadingAuctions } = useAuctions();
  return (
    <div className={styles.container}>
      <Head>
        <title>Aminals – Auctions</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <Layout>
        <div className="flex flex-col gap-4">
          {isLoadingAuctions || !auctions
            ? 'Loading...'
            : auctions.map((auction) => (
                <div>
                  Auction {auction.id} between {auction.aminalIdOne} and{' '}
                  {auction.auctionId} (
                  {auction.finished ? 'Finished' : 'In Progress'}){' '}
                  {auction.childAminalId}
                </div>
              ))}
        </div>
      </Layout>
    </div>
  );
};

export default Home;
