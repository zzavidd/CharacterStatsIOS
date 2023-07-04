import React from 'react';

import { DEFAULT_STATS } from 'src/utils/constants/defaults';
import type { Type } from 'src/utils/constants/enums';

export const InitialCharacterFormState: CharacterFormState = {
  character: {
    name: '',
    universe: undefined,
    type1: null,
    type2: null,
    ability1: null,
    ability2: null,
    abilityX: null,
    stats: DEFAULT_STATS,
    learnset: {},
  },
  selectedAbility: {
    isMenuOpen: false,
    key: 'ability1',
    selectedValue: undefined,
  },
  selectedMove: {
    isMenuOpen: false,
    level: '1',
    selectedMoveIndex: -1,
    selectedValue: undefined,
  },
  selectedType: {
    isMenuOpen: false,
    key: 'type1',
    selectedValue: undefined,
  },
  selectedUniverse: {
    isMenuOpen: false,
    selectedValue: undefined,
  },
};

export const CharacterFormContextState =
  React.createContext<CharacterFormState>(InitialCharacterFormState);
export const CharacterFormContextDispatch = React.createContext<
  ReactDispatch<CharacterFormState>
>(() => {});

export interface CharacterFormState {
  character: Omit<Character, 'createTime'>;
  selectedAbility: PropertyWithKey<number, AbilityKey>;
  selectedMove: MoveProperty;
  selectedType: PropertyWithKey<Type, TypeKey>;
  selectedUniverse: Property<number>;
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
