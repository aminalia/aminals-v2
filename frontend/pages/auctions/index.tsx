import {
  default as AuctionCardActive,
  default as AuctionCardInactive,
} from '@/components/auction-card';
import { useAuctions } from '@/resources/auctions';
import type { NextPage } from 'next';
import Layout from '../_layout';

const AuctionsPage: NextPage = () => {
  const { data: auctions, isLoading: isLoadingAuctions } = useAuctions();

  const activeAuctions = auctions?.filter((auction) => !auction.finished) || [];
  const inactiveAuctions =
    auctions?.filter((auction) => auction.finished) || [];

  return (
    <Layout>
      <div className="flex flex-col gap-4">
        {isLoadingAuctions || !auctions ? (
          'Loading...'
        ) : (
          <>
            <div>
              <h1>Active Auctions</h1>
              {activeAuctions.length === 0 ? (
                <p>No active auctions available.</p>
              ) : (
                activeAuctions.map((auction) => (
                  <AuctionCardActive
                    key={auction.auctionId}
                    auction={auction}
                  />
                ))
              )}
            </div>

            <div>
              <h1>Inactive Auctions</h1>
              {inactiveAuctions.length === 0 ? (
                <p>No inactive auctions available.</p>
              ) : (
                inactiveAuctions.map((auction) => (
                  <AuctionCardInactive
                    key={auction.auctionId}
                    auction={auction}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default AuctionsPage;
