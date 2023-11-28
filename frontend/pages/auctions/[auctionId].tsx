import AuctionCard from '@/components/auction-card';
import { useAuction, useAuctionProposeVisuals } from '@/resources/auctions';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import VoteButton from '../../src/components/actions/vote-button';


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
              <>
              <div key={proposeVisual.visualId}>
                Proposal visualId {proposeVisual.visualId} by{' '}
                {proposeVisual.proposer.address}
              </div>
              <VoteButton auctionId={auctionId} catId={proposeVisual.catEnum} vizId={proposeVisual.visualId} />
              </>
            ))}

          </div>

        </div>
      )}
    </Layout>
  );
};

export default AuctionPage;
