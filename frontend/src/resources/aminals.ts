import { useQuery } from '@tanstack/react-query';
import { Aminal, AminalsListDocument, execute } from '../../.graphclient';

const BASE_KEY = 'aminals';

export const useAminals = () => {
  return useQuery<Aminal[]>({
    queryKey: [BASE_KEY],
    queryFn: async () => {
      const response = await execute(AminalsListDocument, {
        first: 10,
        skip: 0,
      });
      if (response.errors) throw new Error(response.errors[0].message);
      return response.data.aminals;
    },
  });
};
