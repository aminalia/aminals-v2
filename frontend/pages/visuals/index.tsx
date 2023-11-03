import { useVisuals } from '@/resources/visuals';
import type { NextPage } from 'next';
import Layout from '../_layout';

const VisualsPage: NextPage = () => {
  const { data: visuals, isLoading: isLoadingVisuals } = useVisuals();
  return (
    <Layout>
      <div className="flex flex-col gap-4">
        {isLoadingVisuals || !visuals
          ? 'Loading...'
          : visuals.map((visual) => (
              <div key={visual.visualId}>
                Visual {visual.visualId} by {visual.proposer}{' '}
                {visual.removed ? 'Removed' : 'Not Removed'} Love Vote:{' '}
                {visual.loveVote / 1e18}
                <img src={visual.svg} />
              </div>
            ))}
      </div>
    </Layout>
  );
};

export default VisualsPage;
