import { StyleSheet } from 'react-native';

import Color from '../constants/colors';

export default StyleSheet.create({
  container: {
    backgroundColor: Color.DARK,
    flex: 1,
    flexDirection: 'column'
  },
  section: {
    padding: 5
  },
  sectionHeader: {
    backgroundColor: Color.DARK,
    padding: 8
  },
  sectionHeaderTitle: {
    color: Color.WHITE,
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
    fontSize: 13,
    fontWeight: 'bold'
  },
  types: {
    color: Color.WHITE,
    fontSize: 9,
    paddingVertical: 2
  },
  universe: {
    color: Color.WHITE,
    fontSize: 7,
    fontStyle: 'italic'
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 5
  },
  statsBlockLeft: {
    flex: 0.45,
    paddingRight: 5
  },
  statsBlockRight: {
    flex: 0.55,
    paddingLeft: 5
  },
  statEntry: {
    flexDirection: 'row'
  },
  statLabel: {
    color: Color.WHITE,
    flex: 1,
    fontSize: 7
  },
  statValue: {
    color: Color.WHITE,
    fontSize: 7,
    textAlign: 'right'
  },
  bst: {
    color: Color.WHITE,
    fontSize: 7,
    fontWeight: 'bold',
    paddingTop: 5,
    textAlign: 'right'
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
