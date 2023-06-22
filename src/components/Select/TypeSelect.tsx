import type { IInputProps } from 'native-base';
import {
  Actionsheet,
  Button,
  CheckIcon,
  ChevronDownIcon,
  FlatList,
  HStack,
  Image,
  Input,
  Pressable,
  Text,
  VStack,
} from 'native-base';
import React, { useState } from 'react';

import { Type } from 'src/utils/constants/enums';
import PokeIcon from 'src/utils/constants/icons';

export default function TypeSelect(props: IInputProps) {
  const { value, onChangeText } = props;
  const [state, setState] = useState({ isTypeListShown: false });

  function toggleTypeList(visible: boolean) {
    setState((s) => ({ ...s, isTypeListShown: visible }));
  }

  function onSelect(type: Type) {
    onChangeText?.(type);
    toggleTypeList(false);
  }

  return (
    <React.Fragment>
      <VStack>
        <Input
          {...props}
          pl={value ? 1 : undefined}
          isReadOnly={true}
          InputLeftElement={
            value ? (
              <Image
                source={PokeIcon[value as Type]}
                alt={value}
                width={6}
                height={6}
                key={value}
                ml={3}
              />
            ) : undefined
          }
          InputRightElement={
            <Button onPress={() => toggleTypeList(true)}>
              <ChevronDownIcon />
            </Button>
          }
        />
      </VStack>
      <Actionsheet
        isOpen={state.isTypeListShown}
        onClose={() => toggleTypeList(false)}>
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
              const selected = value === type;
              return (
                <Pressable
                  bgColor={selected ? 'primary.900' : undefined}
                  onPress={() => onSelect(type)}
                  _pressed={{ bgColor: 'gray.900' }}
                  flex={1}>
                  <HStack alignItems={'center'} space={4} p={3}>
                    <Image
                      source={PokeIcon[type]}
                      alt={type}
                      width={30}
                      height={30}
                    />
                    <Text fontSize={20}>{type}</Text>
                    {selected ? <CheckIcon size={'5'} /> : null}
                  </HStack>
                </Pressable>
              );
            }}
          />
        </Actionsheet.Content>
      </Actionsheet>
    </React.Fragment>
  );
}
