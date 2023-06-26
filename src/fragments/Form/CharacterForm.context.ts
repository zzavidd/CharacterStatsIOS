import React from 'react';

import { DEFAULT_STATS } from 'src/utils/constants/defaults';

export const InitialCharacterFormState: CharacterFormState = {
  character: {
    name: '',
    universe: undefined,
    type1: null,
    type2: null,
    ability1: '',
    ability2: null,
    abilityX: null,
    stats: DEFAULT_STATS,
    learnset: {},
  },
  isAddingMove: false,
};

const CharacterFormContext = React.createContext<
  ReactUseState<CharacterFormState>
>([InitialCharacterFormState, () => {}]);

export default CharacterFormContext;

interface CharacterFormState {
  character: Omit<Character, 'createTime'>;
  isAddingMove: boolean;
}
