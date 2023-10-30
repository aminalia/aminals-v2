// TODO: Consume Graph
// TODO: Schema
export type Aminal = {
  id: number;
  name: string;
  hunger: number;
};

export const useAminals = () => {
  // DEV: Assuming tanstack react-query
  return {
    isLoading: false,
    aminals: [
      {
        id: 7,
        name: "Shiny Aminal",
        hunger: 40,
      },
    ],
  };
};
