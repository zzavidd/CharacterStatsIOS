import type { Spec } from 'immutability-helper';
import immutate from 'immutability-helper';
import {
  AddIcon,
  Button,
  FormControl,
  HStack,
  Input,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  VStack,
} from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Keyboard } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { ScreenContainer } from 'src/components/Container';
import AbilitySelect from 'src/components/Select/AbilitySelect';
import MoveSelect, { LevelSelect } from 'src/components/Select/MoveSelect';
import StatInput from 'src/components/Select/StatInput';
import TypeSelect from 'src/components/Select/TypeSelect';
import UniverseSelect from 'src/components/Select/UniverseSelect';
import { StatMap } from 'src/utils/constants/defaults';
import type { Stat, Type } from 'src/utils/constants/enums';
import { Universes } from 'src/utils/constants/options';
import { calculateBST } from 'src/utils/functions';

import {
  CharacterFormContextDispatch,
  CharacterFormContextState,
} from './CharacterForm.context';

export default function CharacterForm() {
  const [state, setState] = useState({ isNameFieldFocused: false });
  const context = useContext(CharacterFormContextState);
  const setContext = useContext(CharacterFormContextDispatch);
  const abilityFields = useAbilityFields();
  const typeFields = useTypeFields();

  useEffect(() => {
    const listener = Keyboard.addListener('keyboardDidHide', () => {
      setState({ isNameFieldFocused: false });
    });
    return () => listener.remove();
  }, []);

  function onChange(spec: Spec<Omit<Character, 'createTime'>>) {
    setContext((s) => immutate(s, { character: spec }));
  }

  function onAddMovePress() {
    setContext((s) =>
      immutate(s, {
        character: {
          learnset: {
            '0': (levelMoveIds = []) => [1, ...levelMoveIds],
          },
        },
        selectedMove: {
          $set: {
            isMenuOpen: true,
            level: '0',
            selectedMoveIndex: 0,
            selectedValue: undefined,
          },
        },
      }),
    );
  }

  function onSpreadMovePress() {
    Alert.prompt(
      'Spread moves',
      'What is the final learnset level?',
      (level) => spreadMoves(Number(level)),
      'plain-text',
      '100',
      'numeric',
    );
  }

  function spreadMoves(maxLevel: number) {
    setContext((s) => {
      const min = 2;
      const max = Math.min(maxLevel, 100);

      const moveCount = Object.entries(s.character.learnset).reduce(
        (acc, [level, moveIds]) => {
          if (Number(level) === 0) {
            acc += moveIds.length;
          } else if (Number(level) >= 2) {
            acc += 1;
          }
          return acc;
        },
        0,
      );

      const interval = Math.ceil((max - min) / moveCount);

      let currentLevel = 1;
      const newLearnset = Object.entries(s.character.learnset).reduce(
        (acc, [level, moveIds]) => {
          if (Number(level) === 0) {
            moveIds.forEach((moveId) => {
              currentLevel += interval;
              const newLevel = String(Math.min(currentLevel, max));
              acc[newLevel] = [moveId];
            });
          } else if (Number(level) >= 2) {
            currentLevel += interval;
            const newLevel = String(Math.min(currentLevel, max));
            acc[newLevel] = moveIds;
          } else {
            acc[level] = moveIds;
          }
          return acc;
        },
        {} as Record<string, number[]>,
      );
      return immutate(s, {
        character: {
          learnset: {
            $set: newLearnset,
          },
        },
      });
    });
  }

  function onDeleteMovePress(level: string, moveIndex: number) {
    setContext((s) => {
      let spec: Spec<Character['learnset']> = {};
      if (s.character.learnset[level].length > 1) {
        spec = {
          [level]: { $splice: [[moveIndex, 1]] },
        };
      } else {
        spec = { $unset: [level] };
      }

      return immutate(s, {
        character: {
          learnset: spec,
        },
      });
    });
  }

  const firstHalfStats = Object.entries(StatMap).slice(0, 3);
  const secondHalfStats = Object.entries(StatMap).slice(3);
  const stats = [firstHalfStats, secondHalfStats];

  const isMenuOpen = [
    context.selectedAbility,
    context.selectedMove,
    context.selectedType,
    context.selectedUniverse,
  ].some((s) => s.isMenuOpen);
  return (
    <ScreenContainer p={4} flex={1}>
      <KeyboardAvoidingView
        behavior={'position'}
        enabled={!isMenuOpen && !state.isNameFieldFocused}
        keyboardVerticalOffset={-100}
        flex={1}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space={3} flex={1}>
            <HStack space={5}>
              <FormControl flex={1}>
                <FormControl.Label>
                  <Text>Name:</Text>
                </FormControl.Label>
                <Input
                  value={context.character.name}
                  onFocus={() => setState({ isNameFieldFocused: true })}
                  placeholder={'Enter name...'}
                  onChangeText={(value) => onChange({ name: { $set: value } })}
                  returnKeyType={'done'}
                />
              </FormControl>
              <FormControl flex={1}>
                <FormControl.Label>
                  <Text>Universe:</Text>
                </FormControl.Label>
                <UniverseSelect
                  value={Universes[context.character.universe!]}
                  placeholder={'Select universe...'}
                  onChangeText={(value) =>
                    onChange({ universe: { $set: Number(value) } })
                  }
                />
              </FormControl>
            </HStack>
            <HStack space={5}>
              {typeFields.map(({ key, label, value }) => (
                <FormControl flex={1} key={key}>
                  <FormControl.Label>
                    <Text>{label}:</Text>
                  </FormControl.Label>
                  <TypeSelect
                    name={key}
                    value={value ?? undefined}
                    placeholder={'Select type...'}
                    onChangeText={(value) =>
                      onChange({ [key]: { $set: value as Type } })
                    }
                  />
                </FormControl>
              ))}
            </HStack>
            <HStack space={5}>
              <VStack space={3} flex={5}>
                {abilityFields.map(({ key, label, value }) => (
                  <FormControl key={key}>
                    <FormControl.Label>
                      <Text>{label}:</Text>
                    </FormControl.Label>
                    <AbilitySelect
                      name={key}
                      value={value ?? undefined}
                      placeholder={'Select ability...'}
                      onChangeText={(value) =>
                        onChange({ [key]: { $set: value } })
                      }
                      key={key}
                    />
                  </FormControl>
                ))}
              </VStack>
              <VStack space={3}>
                <HStack space={4} flex={4}>
                  {stats.map((halfStats, i) => (
                    <VStack space={3} key={i}>
                      {halfStats.map(([stat, alias]) => {
                        return (
                          <FormControl key={stat}>
                            <FormControl.Label>
                              <Text>{alias}:</Text>
                            </FormControl.Label>
                            <StatInput
                              stat={stat as Stat}
                              value={context.character.stats[stat as Stat]}
                            />
                          </FormControl>
                        );
                      })}
                    </VStack>
                  ))}
                </HStack>
                <Text color={'gray.400'} textAlign={'right'} mr={2}>
                  BST: {calculateBST(context.character.stats)}
                </Text>
              </VStack>
            </HStack>
            <FormControl>
              <FormControl.Label>
                <Text>Learnset:</Text>
              </FormControl.Label>
              <Button.Group variant={'outline'} isAttached={true} mb={5}>
                <Button
                  onPress={onAddMovePress}
                  startIcon={<AddIcon />}
                  flex={4}>
                  <Text>Add Move</Text>
                </Button>
                <Button onPress={onSpreadMovePress} flex={1}>
                  <Text>Spread</Text>
                </Button>
              </Button.Group>
              <VStack space={2}>
                {Object.entries(context.character.learnset).map(
                  ([level, moveIds]) => (
                    <React.Fragment key={level}>
                      {moveIds.map((moveId, index) => (
                        <Swipeable
                          renderRightActions={() => (
                            <Button
                              onPress={() => onDeleteMovePress(level, index)}
                              ml={2}>
                              <Text>Remove</Text>
                            </Button>
                          )}
                          key={`${level}-${moveId}-${index}`}>
                          <HStack space={3}>
                            <LevelSelect
                              level={Number(level)}
                              currentMoveId={moveId}
                              moveIndex={index}
                            />
                            <MoveSelect
                              name={level}
                              index={index}
                              value={String(moveId)}
                              placeholder={'Select move...'}
                              flex={1}
                            />
                          </HStack>
                        </Swipeable>
                      ))}
                    </React.Fragment>
                  ),
                )}
              </VStack>
            </FormControl>
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

function useTypeFields(): TypeField[] {
  const context = useContext(CharacterFormContextState);
  return [
    {
      key: 'type1',
      label: 'Type 1',
      value: context.character.type1,
    },
    {
      key: 'type2',
      label: 'Type 2',
      value: context.character.type2,
    },
  ];
}

function useAbilityFields(): AbilityField[] {
  const context = useContext(CharacterFormContextState);
  return [
    {
      key: 'ability1',
      label: 'First Ability',
      value: context.character.ability1,
    },
    {
      key: 'ability2',
      label: 'Second Ability',
      value: context.character.ability2,
    },
    {
      key: 'abilityX',
      label: 'Hidden Ability',
      value: context.character.abilityX,
    },
  ];
}

interface Field {
  label: string;
}

interface AbilityField extends Field {
  key: AbilityKey;
  value: number | null;
}

interface TypeField extends Field {
  key: TypeKey;
  value: Type | null;
}
