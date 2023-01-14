import { capitalCase } from 'capital-case';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { MoveSelect } from '../../components/input';
import Colors from '../../constants/colors';
import styles from '../../styles/Form.styles';
import type { PokeMove } from '../../types';
import type { Character } from '../../types/classes';
import { findMoveById } from '../../utils/helper';

export default function CharacterLearnsetForm({
  allMoves,
  useCharacterState,
  filterMatchingMoves,
  setDisplayedListItems,
  setFocusedField
}: CharacterLearnsetFormProps) {
  const [character, setCharacter] = useCharacterState;
  const [value, setValue] = useState('');

  /**
   * Moves the current move item to another position in the learnset.
   * @param item The move item.
   * @param currentIndex The item's current index.
   * @param targetIndex The item's current index.
   */
   const moveItem = (item: number, currentIndex: number, targetIndex: number) => {
    const learnset = character.learnset.slice();
    learnset.splice(currentIndex, 1);
    learnset.splice(targetIndex, 0, item);
    setCharacter((character) => ({
      ...character,
      learnset
    }));
  };
  
  /**
   * Moves the current move item to the top of the learnset.
   * @see {moveItem}
   */
  const moveToTop = (item: number, currentIndex: number) => {
    moveItem(item, currentIndex, 0);
  };

  /**
   * Moves the current move item up a position.
   * @see {moveItem}
   */
  const moveUp = (item: number, currentIndex: number,) => {
    if (currentIndex === 0) return;
    moveItem(item, currentIndex, currentIndex - 1);
  };

  /**
   * Moves the current move item down a position.
   * @see {moveItem}
   */
  const moveDown = (item: number, currentIndex: number) => {
    if (currentIndex === character.learnset.length - 1) return;
    moveItem(item, currentIndex, currentIndex + 1);
  };

  /**
   * Moves the current move item to the bottom of the learnset.
   * @see {moveItem}
   */
   const moveToBottom = (item: number, currentIndex: number) => {
    moveItem(item, currentIndex, character.learnset.length - 1);
  };

  /**
   * Deletes a move item from the learnset.
   * @param index The index of the item to delete.
   */
  const deleteMove = (index: number) => {
    const learnset = character.learnset.slice();
    learnset.splice(index, 1);
    setCharacter((character) => ({
      ...character,
      learnset
    }));
  };

  return (
    <React.Fragment>
      <Text style={styles.label}>Learnset:</Text>
      <View style={styles.learnsetList}>
        {character.learnset.map((item, key) => {
          const move = findMoveById(item, allMoves);
          if (!move) return null;

          const damageClass = capitalCase(move.damageClass);
          const damageStyle = Colors.CLASS[damageClass];

          const style = { backgroundColor: move.color };
          return (
            <View style={styles.learnsetRow} key={key}>
              <TouchableOpacity
                style={styles.learnsetRowArrow}
                onLongPress={() => moveToTop(item, key)}
                onPress={() => moveUp(item, key)}>
                <Text style={[styles.learnsetRowArrowText, { marginRight: 5 }]}>
                  &#9650;
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onLongPress={() => deleteMove(key)}
                style={{ flex: 1 }}>
                <View style={[styles.learnsetMove, style]}>
                  <Text style={styles.learnsetMoveText}>{move.name}</Text>
                  <View
                    style={[
                      styles.learnsetDamage,
                      { backgroundColor: damageStyle.bg }
                    ]}>
                    <Text
                      style={[
                        styles.learnsetDamageText,
                        { color: damageStyle.text }
                      ]}>
                      {damageClass}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.learnsetRowArrow}
                onLongPress={() => moveToBottom(item, key)}
                onPress={() => moveDown(item, key)}>
                <Text style={[styles.learnsetRowArrowText, { marginLeft: 5 }]}>
                  &#9660;
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
      <MoveSelect
        name={'learnset'}
        value={value}
        style={styles.moveSelect}
        placeholder={'Type a move to filter...'}
        onChangeText={(text) => {
          filterMatchingMoves(text);
          setValue(text);
        }}
        onSubmitEditing={() => setValue('')}
        setDisplayedListItems={setDisplayedListItems}
        setFocusedField={setFocusedField}
      />
    </React.Fragment>
  );
}

interface CharacterLearnsetFormProps {
  allMoves: PokeMove[];
  useCharacterState: [
    Character,
    React.Dispatch<React.SetStateAction<Character>>
  ];
  filterMatchingMoves: (text: string) => void;
  setDisplayedListItems: React.Dispatch<React.SetStateAction<Array<any>>>;
  setFocusedField: React.Dispatch<React.SetStateAction<keyof Character>>;
}
