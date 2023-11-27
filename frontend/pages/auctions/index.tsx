import AuctionCard from '@/components/auction-card';
import { useAuctions } from '@/resources/auctions';
import type { NextPage } from 'next';
import Layout from '../_layout';

const AuctionsPage: NextPage = () => {
  const { data: auctions, isLoading: isLoadingAuctions } = useAuctions();
  return (
    <Layout>
      <div className="flex flex-col gap-4">
        {isLoadingAuctions || !auctions
          ? 'Loading...'
          : auctions.map((auction) => (
              <AuctionCard key={auction.auctionId} auction={auction} />
            ))}
      </div>
    </Layout>
  );
};

export default AuctionsPage;
