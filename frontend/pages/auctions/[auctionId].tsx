import AuctionCard from '@/components/auction-card';
import VisualCard from '@/components/visual-card';
import { useAuction, useAuctionProposeVisuals } from '@/resources/auctions';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Layout from '../_layout';

const AuctionPage: NextPage = () => {
  const router = useRouter();
  const auctionId = router.query.auctionId;

  const { data: auctions, isLoading: isLoadingAuction } = useAuction(
    auctionId as string
  );
  const { data: proposeVisuals, isLoading: isLoadingProposeVisuals } =
    useAuctionProposeVisuals(auctionId as string);

  return (
    <Layout>
      {isLoadingAuction && isLoadingProposeVisuals ? (
        'Loading...'
      ) : (
        <div>
          {auctions && <AuctionCard auction={auctions[0]} />}
          <hr />
          <h3>Proposals</h3>
          <div className="flex flex-col gap-4">
            {proposeVisuals?.map((proposeVisual) => (
              <VisualCard visual={proposeVisual} key={proposeVisual.visualId} />
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AuctionPage;
