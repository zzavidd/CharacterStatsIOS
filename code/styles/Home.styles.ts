import { StyleSheet } from 'react-native';

import Color from '../constants/colors';

export default StyleSheet.create({
  container: {
    backgroundColor: Color.DARK,
    flex: 1,
    flexDirection: 'column'
  },
  cell: {
    flex: 1 / 3
  },
  cellLinGrad: {
    borderRadius: 10,
    flex: 1,
    margin: 5,
    padding: 10
  },
  name: {
    color: Color.WHITE,
    fontSize: 15,
    fontWeight: 'bold'
  },
  metadata: {
    color: Color.WHITE,
    fontSize: 11
  },

  table: {
    flex: 9,
    paddingVertical: 8
  },
  footer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  }
});
