import AminalCard from '@/components/aminal-card';
import { useAminals } from '@/hooks/resources/aminals';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/index.module.css';
import { Layout } from './_layout';

const Home: NextPage = () => {
  const { aminals, isLoading: isLoadingAminals } = useAminals();

  return (
    <div className={styles.container}>
      <Head>
        <title>Aminals</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <Layout>
        {isLoadingAminals
          ? 'Loading...'
          : aminals.map((aminal) => <AminalCard aminal={aminal} />)}
      </Layout>
    </div>
  );
};

export default Home;
