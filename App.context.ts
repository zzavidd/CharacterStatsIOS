import React from 'react';

export const QueriesContext = React.createContext<QueriesState>({
  abilitiesResult: {} as ApolloResult<PokeAbility[]>,
  movesResult: {} as ApolloResult<PokeMoveMap>,
  typesResult: {} as ApolloResult<PokeType[]>,
  isLoading: false,
  isSuccess: false,
});

interface QueriesState {
  abilitiesResult: ApolloResult<PokeAbilityMap>;
  movesResult: ApolloResult<PokeMoveMap>;
  typesResult: ApolloResult<PokeType[]>;
  isLoading: boolean;
  isSuccess: boolean;
}
