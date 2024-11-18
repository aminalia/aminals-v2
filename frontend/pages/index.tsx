import AminalCard from '@/components/aminal-card';
import { useAminals } from '@/resources/aminals';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useAccount } from 'wagmi';
import styles from '../styles/index.module.css';
import Layout from './_layout';

const HomePage: NextPage = () => {
  const { address } = useAccount();
  const { data: aminals, isLoading: isLoadingAminals } = useAminals(
    address as string
  );
  return (
    <div className={styles.container}>
      <Head>
        <title>Aminals</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <Layout>
        {/* VerticalStack with spacing */}
        <div className="flex flex-col gap-4">
          {isLoadingAminals || !aminals
            ? 'Loading...'
            : aminals.map((aminal) => (
                <AminalCard key={aminal.aminalId} aminal={aminal} />
              ))}
        </div>
      </Layout>
    </div>
  );
};

export default HomePage;
