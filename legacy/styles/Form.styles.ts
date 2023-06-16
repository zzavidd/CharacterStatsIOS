import { StyleSheet } from 'react-native';

import Color from '../constants/colors';

export default StyleSheet.create({
  container: {
    backgroundColor: Color.DARK,
    flex: 1
  },
  main: {
    flexDirection: 'row',
    flex: 1
  },
  form: {
    flex: 0.7,
    paddingHorizontal: 8,
    paddingTop: 5
  },
  label: {
    color: Color.WHITE,
    fontWeight: '600',
    paddingBottom: 6,
    paddingHorizontal: 8,
    paddingTop: 12
  },
  textInput: {
    borderBottomColor: Color.WHITE,
    borderBottomWidth: 1,
    color: Color.WHITE,
    margin: 8,
    paddingRight: 8,
    paddingVertical: 8
  },
  formOrigin: {
    flexDirection: 'row'
  },
  formOriginField:{
    flex: 1
  },
  formTypes: {
    display: 'flex',
    flexDirection: 'row'
  },
  formTypesField: {
    flex: 1
  },
  formTypesFieldSelected: {
    borderBottomWidth: 0,
    borderRadius: 8,
    flex: 1,
    paddingHorizontal: 8
  },
  formStats: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  formStatsField: {
    flex: 1
  },
  learnsetList: {
    flex: 1,
    padding: 8
  },
  learnsetRow: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  learnsetRowArrow: {
    padding: 8
  },
  learnsetRowArrowText: {
    color: Color.WHITE
  },
  learnsetMove: {
    alignItems: 'center',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
    padding: 8
  },
  learnsetMoveText: {
    color: Color.WHITE,
    fontSize: 13
  },
  learnsetDamage: {
    borderRadius: 10
  },
  learnsetDamageText: {
    fontSize: 6,
    padding: 5
  },
  moveSelect: {
    marginVertical: 10,
    paddingVertical: 10
  },
  list: {
    borderLeftColor: Color.PLACEHOLDER_TEXT_COLOR,
    borderLeftWidth: 2,
    flex: 0.4
  },
  listItem: {
    color: Color.WHITE,
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 8
  }
});
