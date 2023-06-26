import Ionicons from '@expo/vector-icons/Ionicons';
import { Button, Icon } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import { TypeMenu } from 'src/components/Select/TypeSelect';

import { AppContext } from 'App.context';
import immutate from 'immutability-helper';
import { AbilityMenu } from 'src/components/Select/AbilitySelect';
import { MoveMenu } from 'src/components/Select/MoveSelect';
import CharacterForm from 'src/fragments/Form/CharacterForm';
import CharacterFormContext, {
  InitialCharacterFormState,
} from 'src/fragments/Form/CharacterForm.context';
import { Type } from 'src/utils/constants/enums';

export default function FormScreen({ navigation, route }: ScreenProps<'Form'>) {
  const [context] = useContext(AppContext);
  const [state, setState] = useState(InitialCharacterFormState);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => navigation.navigate('Home')}
          startIcon={<Icon as={Ionicons} name={'save'} />}>
          Save
        </Button>
      ),
    });
  }, []);

  useEffect(() => {
    const { isEditing, selectedCharacter } = route.params;
    if (isEditing && selectedCharacter) {
      setState((s) => ({ ...s, character: selectedCharacter }));
    }
  }, [route.params]);

  function onSave() {}

  function onAbilityChange(ability: PokeAbility) {
    setState((s) =>
      immutate(s, {
        character: { [context.ability.key]: { $set: ability.name } },
      }),
    );
  }

  function onMoveChange(moveId: number) {
    const { level, selectedMoveIndex } = context.move;
    const moveIds = state.character.learnset[level];

    setState((s) =>
      immutate(s, {
        character: {
          learnset: { [level]: { [selectedMoveIndex]: { $set: moveId } } },
        },
      }),
    );
  }

  function onTypeChange(type: Type) {
    setState((s) =>
      immutate(s, {
        character: { [context.type.key]: { $set: type } },
      }),
    );
  }

  return (
    <CharacterFormContext.Provider value={[state, setState]}>
      <CharacterForm />
      <AbilityMenu onChange={onAbilityChange} />
      <MoveMenu onChange={onMoveChange} />
      <TypeMenu onChange={onTypeChange} />
    </CharacterFormContext.Provider>
  );
}
