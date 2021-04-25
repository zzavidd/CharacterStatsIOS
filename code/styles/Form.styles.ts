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
    paddingVertical: 5
  },
  label: {
    color: Color.WHITE,
    paddingHorizontal: 8,
    paddingVertical: 12
  },
  textInput: {
    borderBottomColor: Color.WHITE,
    borderBottomWidth: 1,
    color: Color.WHITE,
    margin: 8,
    paddingRight: 8,
    paddingVertical: 8
  },
  formTypes: {
    display: 'flex',
    flexDirection: 'row'
  },
  formTypesField: {
    flex: 1
  },
  formStats: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  formStatsField: {
    flex: 1
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
