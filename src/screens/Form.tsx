import Ionicons from '@expo/vector-icons/Ionicons';
import immutate from 'immutability-helper';
import { Button, ChevronLeftIcon, Icon, Text } from 'native-base';
import React, { useEffect, useState } from 'react';

import { AbilityMenu } from 'src/components/Select/AbilitySelect';
import { MoveMenu } from 'src/components/Select/MoveSelect';
import { TypeMenu } from 'src/components/Select/TypeSelect';
import CharacterForm from 'src/fragments/Form/CharacterForm';
import CharacterFormContext, {
  InitialCharacterFormState,
} from 'src/fragments/Form/CharacterForm.context';
import type { Type } from 'src/utils/constants/enums';
import useCreateCharacters from 'src/utils/hooks/useCreateCharacters';
import useUpdateCharacters from 'src/utils/hooks/useUpdateCharacters';

export default function FormScreen({ navigation, route }: ScreenProps<'Form'>) {
  const [state, setState] = useState(InitialCharacterFormState);
  const { mutate: createCharacters } = useCreateCharacters();
  const { mutate: updateCharacters } = useUpdateCharacters();

  useEffect(() => {
    const onSave = async () => {
      const dateNow = Date.now();
      if (route.params.isEditing) {
        await updateCharacters([{ ...state.character, lastModified: dateNow }]);
      } else {
        await createCharacters([
          { ...state.character, createTime: dateNow, lastModified: dateNow },
        ]);
      }
      navigation.navigate('Home');
    };

    navigation.setOptions({
      headerLeft: () => (
        <Button
          onPress={() => navigation.goBack()}
          startIcon={<ChevronLeftIcon />}
          px={1}>
          <Text color={'primary.300'}>Back</Text>
        </Button>
      ),
      headerRight: () => (
        <Button
          onPress={onSave}
          startIcon={<Icon as={Ionicons} name={'save'} />}
          px={1}>
          <Text color={'primary.300'}>Save</Text>
        </Button>
      ),
    });
  }, [
    navigation,
    route.params.isEditing,
    state.character,
    createCharacters,
    updateCharacters,
  ]);

  useEffect(() => {
    const { isEditing, selectedCharacter } = route.params;
    if (isEditing && selectedCharacter) {
      setState((s) => ({ ...s, character: selectedCharacter }));
    }
  }, [route.params]);

  function onAbilityChange(ability: PokeAbility) {
    setState((s) =>
      immutate(s, {
        character: { [s.selectedAbility.key]: { $set: ability.name } },
      }),
    );
  }

  function onMoveChange(moveId: number) {
    setState((s) => {
      const { level, selectedMoveIndex } = s.selectedMove;
      return immutate(s, {
        character: {
          learnset: { [level]: { [selectedMoveIndex]: { $set: moveId } } },
        },
      });
    });
  }

  function onTypeChange(type: Type) {
    setState((s) =>
      immutate(s, {
        character: { [s.selectedType.key]: { $set: type } },
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
