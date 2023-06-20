import React from 'react';

export const AppContext = React.createContext<AppState>({
  abilitiesResult: {} as ApolloResult<PokeAbility[]>,
  movesResult: {} as ApolloResult<PokeMove[]>,
  typesResult: {} as ApolloResult<PokeType[]>,
  isLoading: false,
  isSuccess: false,
});

interface AppState {
  abilitiesResult: ApolloResult<PokeAbility[]>;
  movesResult: ApolloResult<PokeMove[]>;
  typesResult: ApolloResult<PokeType[]>;
  isLoading: boolean;
  isSuccess: boolean;
}
