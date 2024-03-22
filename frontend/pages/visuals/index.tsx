import VisualCard from '@/components/visual-card';

import { useAuctions } from '@/resources/auctions';
import { useVisuals } from '@/resources/visuals';
import type { NextPage } from 'next';
import Layout from '../_layout';

// const VisualsPage: NextPage = () => {
//   const { data: visuals, isLoading: isLoadingVisuals } = useGenes();

//   return (
//     <Layout>
//       <div className="flex flex-col gap-4">
//         {isLoadingVisuals || !visuals
//           ? 'Loading...'
//           : <>
//               <div>
//                 <h2>Existing Visuals available as Genes:</h2>
//                 { visuals
//                   .map((visual) => (
//                     <VisualCard key={visual.visualId} visual={visual} />
//                   ))}
//               </div>
//               </>
//         }
//       </div>
//     </Layout>
//   )

// }

const VisualsPage: NextPage = () => {
  const { data: visuals, isLoading: isLoadingVisuals } = useVisuals();
  const { data: auctions, isLoading: isLoadingAuctions } = useAuctions();

  const activeAuctions = auctions?.filter((auction) => !auction.finished) || [];
  const inactiveAuctions =
    auctions?.filter((auction) => auction.finished) || [];

  console.log('Inactive auctions == ', inactiveAuctions);

  // Ensure activeIds and inactiveIds default to an empty array if visuals is undefined
  const activeIds =
    visuals?.filter((visual) =>
      activeAuctions.some((auction) => auction.auctionId === visual.auctionId)
    ) || [];
  const inactiveIds =
    visuals?.filter((visual) =>
      inactiveAuctions.some((auction) => auction.auctionId === visual.auctionId)
    ) || [];

  console.log('Inactive IDs === ', inactiveIds);

  return (
    <Layout>
      <div className="flex flex-col gap-4">
        {isLoadingVisuals || isLoadingAuctions || !visuals || !auctions ? (
          'Loading...'
        ) : (
          <>
            <div>
              <h2>Proposed Visuals from Active Auctions:</h2>
              {activeIds.map((visual) => (
                <VisualCard key={visual.visualId} visual={visual} />
              ))}
            </div>
            <div>
              <h2>Proposed Visuals from Inactive Auctions:</h2>
              {inactiveIds.map((visual) => (
                <VisualCard key={visual.visualId} visual={visual} />
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default VisualsPage;
