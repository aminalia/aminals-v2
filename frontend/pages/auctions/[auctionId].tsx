import AuctionCard from '@/components/auction-card';
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

  const auction = auctions[0];

  return (
    <Layout>
      {isLoadingAuction && isLoadingProposeVisuals ? (
        'Loading...'
      ) : (
        <div>
          {auction && <AuctionCard auction={auction} />}
          <hr />
          <h3>Proposals</h3>
          <div className="flex flex-col gap-4">
            {proposeVisuals?.map((proposeVisual) => (
              <div key={proposeVisual.visualId}>
                Proposal visualId {proposeVisual.visualId} by{' '}
                {proposeVisual.proposer.address}
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AuctionPage;
