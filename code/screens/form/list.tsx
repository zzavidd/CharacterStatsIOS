import React from 'react';
import type {
  ListRenderItemInfo} from 'react-native';
import {
  ActionSheetIOS,
  FlatList,
  Text,
  TouchableOpacity
} from 'react-native';

import styles from '../../styles/Form.styles';
import type { GenericListItem, PokeAbility, PokeMove } from '../../types';
import type { Character } from '../../types/classes';

export default function DisplayedList({ items, field, characterMethods }: DisplayedListProps) {
  const { addToCharacterLearnset, setCharacterProperty } = characterMethods;

  const renderItem = ({ item, index }: ListRenderItemInfo<GenericListItem>) => {
    let onPress, onLongPress;
    if (field === 'learnset') {
      onPress = () => addToCharacterLearnset(item as PokeMove);
    } else {
      onPress = () => setCharacterProperty(item.name, field);
    }

    if (field !== 'type1' && field !== 'type2') {
      onLongPress = () => {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            title: item.name,
            message: (item as PokeAbility | PokeMove).description,
            options: ['Close'],
            cancelButtonIndex: 0
          },
          () => {
            return;
          }
        );
      };
    }
    return (
      <DisplayedListItem
        item={item}
        index={index}
        onPress={onPress}
        onLongPress={onLongPress}
      />
    );
  };

  return (
    <FlatList
      data={items}
      keyExtractor={(item: GenericListItem) => item.id.toString()}
      renderItem={renderItem}
      removeClippedSubviews={true}
      initialNumToRender={20}
      keyboardShouldPersistTaps={'handled'}
    />
  );
}

const DisplayedListItem = React.memo((props: DisplayedListItemProps) => {
  const { item, index, onPress, onLongPress } = props;
  const itemStyle = {
    backgroundColor: item.color
  };

  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress} key={index}>
      <Text style={[styles.listItem, itemStyle]}>{item.name}</Text>
    </TouchableOpacity>
  );
});

interface DisplayedListProps {
  items: GenericListItem[];
  field: keyof Character;
  characterMethods: {
    addToCharacterLearnset: (move: PokeMove) => void;
    setCharacterProperty: (value: any, property: keyof Character) => void;
  };
}

interface DisplayedListItemProps {
  item: GenericListItem;
  index: number;
  onPress: any;
  onLongPress: any;
}
