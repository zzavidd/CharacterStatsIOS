import React from 'react';
import { ActionSheetIOS, Button, View } from 'react-native';

import styles from '../../styles/Home.styles';
import {
  setGroupValue,
  setSortValue,
  useAppDispatch,
  useAppSelector
} from '../../utils/reducers';
import Settings from '../../utils/settings';
import * as Storage from '../../utils/storage';

export function CharacterToolbar() {
  const dispatch = useAppDispatch();

  /**
   * Displays the sheet of sort options.
   */
  const showSortSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Sort By Name', 'Sort By Type', 'Sort By BST'],
        cancelButtonIndex: 0
      },
      (sortId) => {
        if (sortId > 0) {
          dispatch(setSortValue(sortId));
        }
      }
    );
  };

  /**
   * Displays the sheet of grouping options.
   */
  const showGroupSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [
          'Cancel',
          'No Grouping',
          'Group By Type',
          'Group By Universe'
        ],
        cancelButtonIndex: 0
      },
      (groupId) => {
        if (groupId > 0) {
          dispatch(setGroupValue(groupId));
        }
      }
    );
  };

  return (
    <View style={styles.footer}>
      <Button title={'Sort By...'} onPress={showSortSheet} />
      <Button title={'Group By...'} onPress={showGroupSheet} />
    </View>
  );
}

export function DevToolbar({ refreshCharacters }: DevToolbarProps) {
  if (!Settings.showDevTools) return null;

  const appState = useAppSelector((state) => state);
  return (
    <View style={styles.footer}>
      <Button
        title={'Ingest Example Data'}
        onPress={() => {
          Storage.ingestExampleData(appState);
          refreshCharacters();
        }}
      />
      <Button
        title={'Clear Data'}
        onPress={async () => {
          await Storage.clearAllData();
          refreshCharacters();
        }}
      />
    </View>
  );
}

interface DevToolbarProps {
  refreshCharacters: () => void;
}
