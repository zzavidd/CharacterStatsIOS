import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import type { INativebaseConfig } from 'native-base';
import { NativeBaseProvider } from 'native-base';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import ContextInitializer from 'src/fragments/ContextInitializer';
import FontInitializer from 'src/fragments/FontInitializer';
import Navigator from 'src/fragments/Navigator';
import theme from 'src/styles/Theme.styles';

const client = new ApolloClient({
  uri: 'https://beta.pokeapi.co/graphql/v1beta',
  cache: new InMemoryCache(),
  assumeImmutableResults: true,
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
            <GestureHandlerRootView style={{ flex: 1 }}>
              <StatusBar style={'light'} />
              <Navigator />
            </GestureHandlerRootView>
          </FontInitializer>
        </ContextInitializer>
      </NativeBaseProvider>
    </ApolloProvider>
  );
}
