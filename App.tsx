import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import type { INativebaseConfig } from 'native-base';
import { NativeBaseProvider } from 'native-base';
import React from 'react';

import ContextInitializer from 'src/fragments/ContextInitializer';
import FontInitializer from 'src/fragments/FontInitializer';
import Navigator from 'src/fragments/Navigator';
import theme from 'src/styles/Theme.styles';

const client = new ApolloClient({
  uri: 'https://beta.pokeapi.co/graphql/v1beta',
  cache: new InMemoryCache(),
});

const config: INativebaseConfig = {
  dependencies: {
    'linear-gradient': LinearGradient,
  },
};

// void SplashScreen.preventAutoHideAsync();

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NativeBaseProvider config={config} theme={theme}>
        <ContextInitializer>
          <FontInitializer>
            <StatusBar style={'light'} />
            <Navigator />
          </FontInitializer>
        </ContextInitializer>
      </NativeBaseProvider>
    </ApolloProvider>
  );
}
