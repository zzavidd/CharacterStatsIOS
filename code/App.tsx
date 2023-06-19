import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { ThemeProvider } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import type React from 'react';

import ContextInitialiser from 'src/fragments/ContextInitialiser';

import HomeScreen from './src/screens/Home';
import theme from './src/styles/Theme.styles';

const client = new ApolloClient({
  uri: 'https://beta.pokeapi.co/graphql/v1beta',
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <ContextInitialiser>
          <StatusBar style={'auto'} />
          <HomeScreen />
        </ContextInitialiser>
      </ThemeProvider>
    </ApolloProvider>
  );
}
