import type { Spec } from 'immutability-helper';
import immutate from 'immutability-helper';
import type { IInputProps } from 'native-base';
import { Button, ChevronDownIcon, HStack, Image, Input } from 'native-base';
import React, { useContext, useState } from 'react';

import { QueriesContext } from 'App.context';
import { CharacterFormContextDispatch } from 'src/fragments/Form/CharacterForm.context';
import CSColor from 'src/utils/constants/colors';
import PokeIcon from 'src/utils/constants/icons';

export default function MoveSelect({
  name,
  value,
  index,
  ...props
}: MoveSelectProps) {
  const { movesResult } = useContext(QueriesContext);
  const { data: moveMap = {} } = movesResult;
  const setContext = useContext(CharacterFormContextDispatch);

  function showAbilityMenu() {
    setContext((c) =>
      immutate(c, {
        selectedMove: {
          $set: {
            isMenuOpen: true,
            level: name,
            selectedMoveIndex: index,
            selectedValue: Number(value),
          },
        },
      }),
    );
  }

  return (
    <Input
      {...props}
      value={value ? moveMap[value]?.name : undefined}
      pl={value ? 2 : undefined}
      bgColor={value ? moveMap[value]?.color : 'transparent'}
      borderColor={value ? CSColor.border(moveMap[value]?.color) : undefined}
      isReadOnly={true}
      InputLeftElement={
        value ? (
          <Image
            source={PokeIcon.Types[moveMap[value].type]}
            alt={value}
            width={6}
            height={6}
            key={value}
            ml={3}
          />
        ) : undefined
      }
      InputRightElement={
        <HStack mx={2} alignItems={'center'} space={2}>
          {value ? (
            <Image
              source={PokeIcon.Classes[moveMap[value].damageClass]}
              resizeMode={'stretch'}
              alt={value}
              width={7}
              height={5}
              key={value}
              ml={3}
            />
          ) : null}
          <Button onPress={showAbilityMenu} p={2}>
            <ChevronDownIcon />
          </Button>
        </HStack>
      }
    />
  );
}

export function LevelSelect({
  level,
  currentMoveId,
  moveIndex,
}: LevelSelectProps) {
  const [state, setState] = useState({ value: level });
  const setContext = useContext(CharacterFormContextDispatch);

  function onChangeText(value: string) {
    setState({ value: Number(value) });
  }

  function onEndEditing() {
    if (state.value === level) return;

    const newLevel = Math.min(100, Number(state.value));

    setContext((s) => {
      let deleteSpec: Spec<Character['learnset']> = {};
      if (s.character.learnset[level].length > 1) {
        deleteSpec = {
          [level]: { $splice: [[moveIndex, 1]] },
        };
      } else {
        deleteSpec = { $unset: [String(level)] };
      }
      return immutate(s, {
        character: {
          learnset: {
            [newLevel]: (levelMoveIds = []) => [...levelMoveIds, currentMoveId],
            ...deleteSpec,
          },
        },
      });
    });
  }

  return (
    <Input
      value={String(state.value)}
      onChangeText={onChangeText}
      onEndEditing={onEndEditing}
      selectTextOnFocus={true}
      variant={'filled'}
      textAlign={'right'}
      inputMode={'numeric'}
      returnKeyLabel={'Done'}
      returnKeyType={'done'}
      w={'16'}
    />
  );
}

interface MoveSelectProps extends IInputProps {
  name: string;
  index: number;
}

interface LevelSelectProps {
  currentMoveId: number;
  level: number;
  moveIndex: number;
}
