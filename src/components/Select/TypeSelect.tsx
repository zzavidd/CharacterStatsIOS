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
import React, { useContext } from 'react';

import CharacterFormContext from 'src/fragments/Form/CharacterForm.context';
import CSColor from 'src/utils/constants/colors';
import { Type } from 'src/utils/constants/enums';
import PokeIcon from 'src/utils/constants/icons';

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
      isReadOnly={true}
      onPressOut={showTypeMenu}
      InputLeftElement={
        value ? (
          <Image
            source={PokeIcon[value]}
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

export function TypeMenu({ onChange }: TypeMenuProps) {
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

  return (
    <Actionsheet
      isOpen={context.selectedType.isMenuOpen}
      onClose={hideTypeMenu}>
      <Actionsheet.Content>
        <FlatList
          data={Object.values(Type)}
          keyExtractor={(item) => item}
          maxToRenderPerBatch={20}
          initialNumToRender={20}
          numColumns={2}
          key={'1'}
          w={'full'}
          renderItem={({ item: type }) => {
            const selected = context.selectedType.selectedValue === type;
            const onPress = () => {
              onChange(type);
              hideTypeMenu();
            };
            return (
              <TypeEntry type={type} selected={selected} onPress={onPress} />
            );
          }}
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
          <Image source={PokeIcon[type]} alt={type} width={30} height={30} />
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

interface TypeMenuProps {
  onChange: (type: Type) => void;
}

interface TypeEntryProps {
  type: Type;
  selected: boolean;
  onPress: () => void;
}
