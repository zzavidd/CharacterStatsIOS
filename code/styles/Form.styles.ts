import { StyleSheet } from 'react-native';

import Color from '../constants/colors';

export default StyleSheet.create({
  container: {
    backgroundColor: Color.DARK,
    display: 'flex',
    flex: 1,
    flexDirection: 'row'
  },
  form: {
    flex: 6,
    paddingHorizontal: 8
  },
  formTextInput: {
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
  list: {
    borderLeftColor: Color.PLACEHOLDER_TEXT_COLOR,
    borderLeftWidth: 2,
    flex: 4
  },
  listItem: {
    color: Color.WHITE,
    fontSize: 15,
    paddingHorizontal: 8,
    paddingVertical: 8
  }
});
