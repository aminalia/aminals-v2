import {
  getDefaultConfig,
  lightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { sepolia } from 'viem/chains';
import { WagmiProvider } from 'wagmi';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';

const wagmiConfig = getDefaultConfig({
  appName: 'Aminals',
  projectId: 'a8bd6a09bfba4f70a0b02ee66e844702',
  chains: [sepolia],
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
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: 'toast-custom',
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              },
            }}
          />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default AminalsApp;
