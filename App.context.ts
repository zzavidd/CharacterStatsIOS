import React from 'react';

import type { Type } from 'src/utils/constants/enums';

export const InitialAppState: AppState = {
  selectedCharacter: null,
  ability: {
    isMenuOpen: false,
    key: 'ability1',
    selectedValue: undefined,
  },
  move: {
    isMenuOpen: false,
    level: '1',
    selectedMoveIndex: -1,
    selectedValue: undefined,
  },
  type: {
    isMenuOpen: false,
    key: 'type1',
    selectedValue: undefined,
  },
};

export const AppContext = React.createContext<ReactUseState<AppState>>([
  InitialAppState,
  () => {},
]);

export const QueriesContext = React.createContext<QueriesState>({
  abilitiesResult: {} as ApolloResult<PokeAbility[]>,
  movesResult: {} as ApolloResult<PokeMoveMap>,
  typesResult: {} as ApolloResult<PokeType[]>,
  isLoading: false,
  isSuccess: false,
});

interface AppState {
  selectedCharacter: Character | null;
  ability: PropertyWithKey<string, AbilityKey>;
  move: MoveProperty;
  type: PropertyWithKey<Type, TypeKey>;
}

interface QueriesState {
  abilitiesResult: ApolloResult<PokeAbility[]>;
  movesResult: ApolloResult<PokeMoveMap>;
  typesResult: ApolloResult<PokeType[]>;
  isLoading: boolean;
  isSuccess: boolean;
}

interface Property<V> {
  isMenuOpen: boolean;
  selectedValue: V | undefined;
}

interface PropertyWithKey<V, K> extends Property<V> {
  key: K;
}

interface MoveProperty extends Property<number> {
  level: string;
  selectedMoveIndex: number;
}
