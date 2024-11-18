import {
  getDefaultConfig,
  lightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { holesky, sepolia } from 'viem/chains';
import { WagmiProvider } from 'wagmi';
import '../styles/globals.css';

const wagmiConfig = getDefaultConfig({
  appName: 'Aminals',
  projectId: 'a8bd6a09bfba4f70a0b02ee66e844702',
  chains: [holesky, sepolia],
});

const rainbowTheme = lightTheme({
  accentColor: '#000',
  fontStack: 'system',
});

const queryClient = new QueryClient();

function AminalsApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rainbowTheme}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default AminalsApp;
