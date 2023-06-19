import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { ThemeProvider } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import ContextInitializer from 'src/fragments/ContextInitializer';
import FontInitializer from 'src/fragments/FontInitializer';

import HomeScreen from './src/screens/Home';
import theme from './src/styles/Theme.styles';

const client = new ApolloClient({
  uri: 'https://beta.pokeapi.co/graphql/v1beta',
  cache: new InMemoryCache(),
});

// void SplashScreen.preventAutoHideAsync();

export default function App() {
  return (
    <FontInitializer>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <ContextInitializer>
            <StatusBar style={'auto'} />
            <HomeScreen />
          </ContextInitializer>
        </ThemeProvider>
      </ApolloProvider>
    </FontInitializer>
  );
}
