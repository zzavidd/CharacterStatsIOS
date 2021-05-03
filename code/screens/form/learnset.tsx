import { capitalCase } from 'capital-case';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { MoveSelect } from '../../components/input';
import Colors from '../../constants/colors';
import styles from '../../styles/Form.styles';
import { PokeMove } from '../../types';
import { Character } from '../../types/classes';
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

  const moveUp = (item: number, index: number) => {
    if (index === 0) return;

    const learnset = character.learnset.slice();
    learnset.splice(index, 1);
    learnset.splice(index - 1, 0, item);
    setCharacter((character) => ({
      ...character,
      learnset
    }));
  };

  const moveDown = (item: number, index: number) => {
    const learnset = character.learnset.slice();
    if (index === learnset.length - 1) return;

    learnset.splice(index, 1);
    learnset.splice(index + 1, 0, item);
    setCharacter((character) => ({
      ...character,
      learnset
    }));
  };

  const deleteMove = (index: number) => {
    const learnset = character.learnset.slice();
    learnset.splice(index, 1);
    setCharacter((character) => ({
      ...character,
      learnset
    }));
  };

  return (
    <>
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
    </>
  );
}

type CharacterLearnsetFormProps = {
  allMoves: PokeMove[];
  useCharacterState: [
    Character,
    React.Dispatch<React.SetStateAction<Character>>
  ];
  filterMatchingMoves: (text: string) => void;
  setDisplayedListItems: React.Dispatch<React.SetStateAction<Array<any>>>;
  setFocusedField: React.Dispatch<React.SetStateAction<keyof Character>>;
};
