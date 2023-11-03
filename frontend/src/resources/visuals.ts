import { useQuery } from '@tanstack/react-query';
import { Visual, VisualListDocument, execute } from '../../.graphclient';

const BASE_KEY = 'visuals';

export const useVisuals = () => {
  return useQuery<Visual[]>({
    queryKey: [BASE_KEY],
    queryFn: async () => {
      const response = await execute(VisualListDocument, {
        first: 10,
        skip: 0,
      });
      if (response.errors) throw new Error(response.errors[0].message);
      return response.data.visuals;
    },
  });
};
