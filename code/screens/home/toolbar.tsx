import React from 'react';
import { ActionSheetIOS, Button, View } from 'react-native';

import styles from '../../styles/Home.styles';
import { organiseCharacters } from '../../utils/helper';
import {
  setCharacters,
  useAppDispatch,
  useAppSelector
} from '../../utils/reducers';
import Settings from '../../utils/settings';
import * as Storage from '../../utils/storage';

export function CharacterToolbar() {
  const { characters } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  const sortCharacters = (sortId: number) => {
    const allCharacters = organiseCharacters(characters, { sortId });
    dispatch(setCharacters(allCharacters));
  };

  return (
    <View style={styles.footer}>
      <Button
        title={'Sort By...'}
        onPress={() => {
          ActionSheetIOS.showActionSheetWithOptions(
            {
              options: [
                'Cancel',
                'Sort By Name (Ascending)',
                'Sort By Name (Descending)',
                'Sort By Type (Ascending)',
                'Sort By Type (Descending)'
              ],
              cancelButtonIndex: 0
            },
            (buttonIndex) => {
              sortCharacters(buttonIndex);
            }
          );
        }}
      />
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

type DevToolbarProps = {
  refreshCharacters: () => void;
};
