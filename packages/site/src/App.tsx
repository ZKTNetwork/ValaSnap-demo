import type { FunctionComponent, ReactNode } from 'react';
import { useContext } from 'react';
import styled from 'styled-components';
import { ChakraProvider } from '@chakra-ui/react';

import { Footer, Header } from './components';
import { GlobalStyle } from './config/theme';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { lineaTestnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import { Helmet } from 'react-helmet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { InjectedConnector } from 'wagmi/connectors/injected';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [lineaTestnet],
  [publicProvider()],
);

const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains: [lineaTestnet],
    }),
    new InjectedConnector({ chains }),
  ],
  publicClient,
});

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  max-width: 100vw;
  background: #6001e1;
`;

export type AppProps = {
  children: ReactNode;
};

export const App: FunctionComponent<AppProps> = ({ children }) => {
  return (
    <>
      <GlobalStyle />
      <Helmet>
        <meta charSet="utf-8" />
        <title>Vala Portal</title>
      </Helmet>

      <ChakraProvider>
          <Wrapper>
            <Header />
            {children}
            <Footer />
          </Wrapper>
      </ChakraProvider>
    </>
  );
};
