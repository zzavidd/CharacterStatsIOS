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

const CharacterFormContext = React.createContext<
  ReactUseState<CharacterFormState>
>([InitialCharacterFormState, () => {}]);

export default CharacterFormContext;

export interface CharacterFormState {
  character: Omit<Character, 'createTime'>;
  selectedAbility: PropertyWithKey<string, AbilityKey>;
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
