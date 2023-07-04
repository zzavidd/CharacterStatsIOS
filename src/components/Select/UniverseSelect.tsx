import immutate from 'immutability-helper';
import type { IInputProps } from 'native-base';
import {
  Actionsheet,
  CheckIcon,
  FlatList,
  HStack,
  Input,
  Pressable,
  Text,
} from 'native-base';
import React, { useContext } from 'react';

import {
  CharacterFormContextDispatch,
  CharacterFormContextState,
} from 'src/fragments/Form/CharacterForm.context';
import { Universes } from 'src/utils/constants/options';

export default function UniverseSelect(props: IInputProps) {
  const { value } = props;
  const setContext = useContext(CharacterFormContextDispatch);

  function showUniverseMenu() {
    setContext((c) =>
      immutate(c, {
        selectedUniverse: {
          $set: {
            isMenuOpen: true,
            selectedValue: Number(value),
          },
        },
      }),
    );
  }

  return <Input {...props} isReadOnly={true} onPressOut={showUniverseMenu} />;
}

export function UniverseMenu({ onChange }: UniverseMenuProps) {
  const context = useContext(CharacterFormContextState);
  const setContext = useContext(CharacterFormContextDispatch);

  function hideUniverseMenu() {
    setContext((c) =>
      immutate(c, {
        selectedUniverse: {
          isMenuOpen: { $set: false },
          selectedValue: { $set: undefined },
        },
      }),
    );
  }

  return (
    <Actionsheet
      isOpen={context.selectedUniverse.isMenuOpen}
      onClose={hideUniverseMenu}>
      <Actionsheet.Content>
        <FlatList
          data={Object.entries(Universes)}
          keyExtractor={([id]) => String(id)}
          maxToRenderPerBatch={20}
          initialNumToRender={20}
          numColumns={2}
          key={'1'}
          w={'full'}
          renderItem={({ item: universe }) => {
            const id = Number(universe[0]);
            const selected =
              context.selectedUniverse.selectedValue === Number(id);
            const onPress = () => {
              onChange(id);
              hideUniverseMenu();
            };
            return (
              <UniverseEntry
                universe={{ id, name: universe[1] }}
                selected={selected}
                onPress={onPress}
              />
            );
          }}
        />
      </Actionsheet.Content>
    </Actionsheet>
  );
}

const UniverseEntry = React.memo(
  function UniverseEntry({ universe, selected, onPress }: UniverseEntryProps) {
    return (
      <Pressable
        bgColor={selected ? 'primary.900' : undefined}
        onPress={onPress}
        _pressed={{ bgColor: 'gray.900' }}
        flex={1}>
        <HStack alignItems={'center'} space={4} p={3}>
          <Text fontSize={20}>{universe.name}</Text>
          {selected ? <CheckIcon size={'5'} /> : null}
        </HStack>
      </Pressable>
    );
  },
  (a, b) => a.universe === b.universe,
);

interface UniverseMenuProps {
  onChange: (universeId: number) => void;
}

interface UniverseEntryProps {
  universe: Universe;
  selected: boolean;
  onPress: () => void;
}
