import { useAuction, useAuctionProposeVisuals } from '@/resources/auctions';
import type { NextPage } from 'next';
import { useParams } from 'next/navigation';
import Layout from '../_layout';

const AuctionPage: NextPage = () => {
  const params = useParams();
  const auctionId = params?.auctionId ?? 'pending'; // TODO: Next.js weirdness
  const { data: auction, isLoading: isLoadingAuction } = useAuction(auctionId);
  const { data: proposeVisuals, isLoading: isLoadingProposeVisuals } =
    useAuctionProposeVisuals(auctionId);
  return (
    <Layout>
      <div>
        <h2>Auction {auction?.auctionId}</h2>
        <hr />
        <h3>Proposals</h3>
        <div className="flex flex-col gap-4">
          {proposeVisuals?.map((proposeVisual) => (
            <div key={proposeVisual.visualId}>
              Proposal visualId {proposeVisual.visualId} by{' '}
              {proposeVisual.sender}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AuctionPage;
