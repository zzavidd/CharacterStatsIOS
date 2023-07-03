import {
  Actionsheet,
  AddIcon,
  Button,
  DeleteIcon,
  Icon,
  Text,
} from 'native-base';
import React, { useEffect, useState } from 'react';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CharacterGrid from 'src/fragments/Home/CharacterGrid';
import HomeContext, { InitialHomeState } from './Home.context';

export default function HomeScreen({ navigation }: ScreenProps<'Home'>) {
  const [state, setState] = useState(InitialHomeState);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() =>
            navigation.navigate('Form', {
              isEditing: false,
              selectedCharacter: null,
            })
          }
          startIcon={<AddIcon />}>
          Add
        </Button>
      ),
    });
  }, []);

  function onActionSheetClose() {
    setState((s) => ({ ...s, selectedCharacter: null }));
  }

  function onEditPress() {
    navigation.navigate('Form', {
      isEditing: true,
      selectedCharacter: state.selectedCharacter,
    });
    onActionSheetClose();
  }

  return (
    <HomeContext.Provider value={[state, setState]}>
      <CharacterGrid />
      <Actionsheet
        isOpen={!!state.selectedCharacter}
        onClose={onActionSheetClose}>
        <Actionsheet.Content>
          <Actionsheet.Item>
            <Text>Do what with "{state.selectedCharacter?.name}"?</Text>
          </Actionsheet.Item>
          <Actionsheet.Item
            onPress={onEditPress}
            startIcon={
              <Icon as={MaterialIcons} name={'edit'} alignSelf={'center'} />
            }>
            Edit
          </Actionsheet.Item>
          <Actionsheet.Item startIcon={<DeleteIcon alignSelf={'center'} />}>
            Delete
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </HomeContext.Provider>
  );
}
