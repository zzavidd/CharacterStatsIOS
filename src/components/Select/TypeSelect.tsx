import immutate from 'immutability-helper';
import type { IInputProps } from 'native-base';
import {
  Actionsheet,
  Button,
  CheckIcon,
  CloseIcon,
  FlatList,
  HStack,
  Image,
  Input,
  Pressable,
  Stack,
  Text,
} from 'native-base';
import React, { useCallback, useContext } from 'react';
import type { ListRenderItem } from 'react-native';

import CharacterFormContext from 'src/fragments/Form/CharacterForm.context';
import CSColor from 'src/utils/constants/colors';
import { Type } from 'src/utils/constants/enums';
import PokeIcon from 'src/utils/constants/icons';

const ITEM_HEIGHT = 54;

export default function TypeSelect({ name, ...props }: TypeSelectProps) {
  const value = props.value as Type;
  const [, setContext] = useContext(CharacterFormContext);

  function showTypeMenu() {
    setContext((c) =>
      immutate(c, {
        selectedType: {
          $set: {
            isMenuOpen: true,
            key: name,
            selectedValue: value,
          },
        },
      }),
    );
  }

  function onNullifyType() {
    setContext((c) => immutate(c, { character: { [name]: { $set: null } } }));
  }

  return (
    <Input
      {...props}
      pl={value ? 2 : undefined}
      bgColor={value ? CSColor.TYPE[value] : 'transparent'}
      borderColor={value ? CSColor.border(CSColor.TYPE[value]) : undefined}
      isReadOnly={true}
      onPressOut={showTypeMenu}
      InputLeftElement={
        value ? (
          <Image
            source={PokeIcon.Types[value]}
            alt={value}
            width={6}
            height={6}
            key={value}
            ml={3}
          />
        ) : undefined
      }
      InputRightElement={
        value ? (
          <Stack mx={2}>
            <Button onPress={onNullifyType} p={2}>
              <CloseIcon />
            </Button>
          </Stack>
        ) : undefined
      }
    />
  );
}

export function TypeMenu() {
  const [context, setContext] = useContext(CharacterFormContext);

  function hideTypeMenu() {
    setContext((c) =>
      immutate(c, {
        selectedType: {
          isMenuOpen: { $set: false },
          selectedValue: { $set: undefined },
        },
      }),
    );
  }

  function onTypeChange(type: Type) {
    setContext((c) =>
      immutate(c, {
        character: { [c.selectedType.key]: { $set: type } },
      }),
    );
    hideTypeMenu();
  }

  const renderType = useCallback<ListRenderItem<Type>>(({ item: type }) => {
    const selected = context.selectedType.selectedValue === type;
    return (
      <TypeEntry
        type={type}
        selected={selected}
        onPress={() => onTypeChange(type)}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Actionsheet
      isOpen={context.selectedType.isMenuOpen}
      onClose={hideTypeMenu}>
      <Actionsheet.Content>
        <FlatList
          data={Object.values(Type)}
          keyExtractor={(item) => item}
          getItemLayout={(_, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          numColumns={2}
          key={'1'}
          w={'full'}
          renderItem={renderType}
        />
      </Actionsheet.Content>
    </Actionsheet>
  );
}

const TypeEntry = React.memo(
  function TypeEntry({ type, selected, onPress }: TypeEntryProps) {
    return (
      <Pressable
        bgColor={selected ? 'primary.900' : undefined}
        onPress={onPress}
        _pressed={{ bgColor: 'gray.900' }}
        flex={1}>
        <HStack alignItems={'center'} space={4} p={3}>
          <Image
            source={PokeIcon.Types[type]}
            alt={type}
            width={30}
            height={30}
          />
          <Text fontSize={20}>{type}</Text>
          {selected ? <CheckIcon size={'5'} /> : null}
        </HStack>
      </Pressable>
    );
  },
  (a, b) => a.type === b.type,
);

interface TypeSelectProps extends IInputProps {
  name: TypeKey;
}

interface TypeEntryProps {
  type: Type;
  selected: boolean;
  onPress: () => void;
}
