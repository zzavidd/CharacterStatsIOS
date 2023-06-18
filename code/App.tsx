import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { ThemeProvider } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

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
        <StatusBar style={'auto'} />
        <HomeScreen />
      </ThemeProvider>
    </ApolloProvider>
  );
}
