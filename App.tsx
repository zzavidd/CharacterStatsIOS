import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider, theme } from 'native-base';
import React from 'react';

import ContextInitializer from 'src/fragments/ContextInitializer';
import FontInitializer from 'src/fragments/FontInitializer';

import HomeScreen from './src/screens/Home';

const client = new ApolloClient({
  uri: 'https://beta.pokeapi.co/graphql/v1beta',
  cache: new InMemoryCache(),
});

const config = {
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
            <HomeScreen />
          </FontInitializer>
        </ContextInitializer>
      </NativeBaseProvider>
    </ApolloProvider>
  );
}
