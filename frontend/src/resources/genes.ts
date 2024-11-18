// import { useQuery } from '@tanstack/react-query';
// import { GenesListDocument, execute } from '../../.graphclient';

// const BASE_KEY = 'visuals';

// export const useGenes = () => {
//   return useQuery<VisualProposal[]>({
//     queryKey: [BASE_KEY],
//     queryFn: async () => {
//       const response = await execute(GenesListDocument, {
//         first: 10,
//         skip: 0,
//       });
//       if (response.errors) throw new Error(response.errors[0].message);
//       console.log('response.... visuals == ', response.data.visualProposals);
//       return response.data.visualProposals;
//     },
//   });
// };
