import { useQuery } from '@tanstack/react-query';
import {
  VisualListDocument,
  VisualProposal,
  execute,
} from '../../.graphclient';

const BASE_KEY = 'visuals';

export const useVisuals = () => {
  return useQuery<VisualProposal[]>({
    queryKey: [BASE_KEY],
    queryFn: async () => {
      const response = await execute(VisualListDocument, {
        first: 10,
        skip: 0,
      });
      if (response.errors) throw new Error(response.errors[0].message);
      console.log('response.... visuals == ', response.data.visualProposals);
      return response.data.visualProposals;
    },
  });
};
