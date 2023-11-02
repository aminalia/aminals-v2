import { useAuctions } from '@/resources/auctions';
import type { NextPage } from 'next';
import Link from 'next/link';
import Layout from '../_layout';

const AuctionsPage: NextPage = () => {
  const { data: auctions, isLoading: isLoadingAuctions } = useAuctions();
  return (
    <Layout>
      <div className="flex flex-col gap-4">
        {isLoadingAuctions || !auctions
          ? 'Loading...'
          : auctions.map((auction) => (
              <div key={auction.auctionId}>
                <Link href={`/auctions/${auction.auctionId}`}>
                  Auction {auction.auctionId}
                </Link>{' '}
                between {auction.aminalIdOne} and {auction.auctionId} (
                {auction.finished ? 'Finished' : 'In Progress'}){' '}
                {auction.childAminalId}
              </div>
            ))}
      </div>
    </Layout>
  );
};

export default AuctionsPage;
