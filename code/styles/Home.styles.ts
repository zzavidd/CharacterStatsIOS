import { StyleSheet } from 'react-native';

import Color from '../constants/colors';

export default StyleSheet.create({
  cell: {
    flex: 1 / 3,
  },
  cellLinGrad: {
    borderRadius: 10,
    margin: 5,
    padding: 10
  },
  container: {
    backgroundColor: Color.DARK,
    flex: 1
  },
  metadata: {
    color: Color.WHITE,
    fontSize: 11
  },
  name: {
    color: Color.WHITE,
    fontSize: 15,
    fontWeight: 'bold'
  },
  table: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 8
  }
});
