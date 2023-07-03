import Ionicons from '@expo/vector-icons/Ionicons';
import immutate from 'immutability-helper';
import { Button, ChevronLeftIcon, Icon, Text, useToken } from 'native-base';
import type { ColorType } from 'native-base/lib/typescript/components/types';
import React, { useEffect, useState } from 'react';

import AbilityMenu from 'src/components/Menu/AbilityMenu';
import MoveMenu from 'src/components/Menu/MoveMenu';
import { TypeMenu } from 'src/components/Select/TypeSelect';
import { UniverseMenu } from 'src/components/Select/UniverseSelect';
import CharacterForm from 'src/fragments/Form/CharacterForm';
import CharacterFormContext, {
  InitialCharacterFormState,
} from 'src/fragments/Form/CharacterForm.context';
import CSColor from 'src/utils/constants/colors';
import type { Type } from 'src/utils/constants/enums';
import useCreateCharacters from 'src/utils/hooks/useCreateCharacters';
import useUpdateCharacters from 'src/utils/hooks/useUpdateCharacters';

export default function FormScreen({ navigation, route }: ScreenProps<'Form'>) {
  const [state, setState] = useState(InitialCharacterFormState);
  const { mutate: createCharacters } = useCreateCharacters();
  const { mutate: updateCharacters } = useUpdateCharacters();

  const [initialHeaderColor] = useToken('colors', ['gray.800']);

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

    const { type1, type2 } = state.character;
    const headerColor = type1
      ? CSColor.darken(CSColor.TYPE[type1])
      : initialHeaderColor;
    const tintColor: ColorType = type2
      ? CSColor.lighten(CSColor.TYPE[type2])
      : type1
      ? CSColor.lighten(CSColor.TYPE[type1])
      : 'primary.300';

    navigation.setOptions({
      headerStyle: {
        backgroundColor: headerColor,
      },
      headerLeft: () => (
        <Button
          onPress={() => navigation.goBack()}
          startIcon={<ChevronLeftIcon color={tintColor} />}
          px={2}>
          <Text color={tintColor}>Cancel</Text>
        </Button>
      ),
      headerRight: () => (
        <Button
          onPress={onSave}
          startIcon={<Icon as={Ionicons} name={'save'} color={tintColor} />}
          px={2}>
          <Text color={tintColor}>Save</Text>
        </Button>
      ),
    });
  }, [
    navigation,
    route.params.isEditing,
    state.character,
    createCharacters,
    updateCharacters,
    initialHeaderColor,
  ]);

  useEffect(() => {
    const { isEditing, selectedCharacter } = route.params;
    if (isEditing && selectedCharacter) {
      setState((s) => ({ ...s, character: selectedCharacter }));
    }
  }, [route.params]);

  function onTypeChange(type: Type) {
    setState((s) =>
      immutate(s, {
        character: { [s.selectedType.key]: { $set: type } },
      }),
    );
  }

  function onUniverseChange(universeId: number) {
    setState((s) =>
      immutate(s, {
        character: { universe: { $set: universeId } },
      }),
    );
  }

  return (
    <CharacterFormContext.Provider value={[state, setState]}>
      <CharacterForm />
      <AbilityMenu />
      <MoveMenu />
      <TypeMenu onChange={onTypeChange} />
      <UniverseMenu onChange={onUniverseChange} />
    </CharacterFormContext.Provider>
  );
}
