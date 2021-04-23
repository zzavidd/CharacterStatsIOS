import { AntDesign } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Provider } from 'react-redux';

import Color from './constants/colors';
import Form from './screens/form';
import Home from './screens/home';
import * as Helper from './utils/helper';
import store, {
  setAbilities,
  setMoves,
  setTypes,
  useAppDispatch,
  useAppSelector
} from './utils/reducers';
import request, { Queries } from './utils/request';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <Index />
    </Provider>
  );
}

function Index() {
  const { types, abilities, moves } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  useEffect(() => {
    getPokeTypes();
    getPokeAbilities();
    getPokeMoves();
  }, []);

  const getPokeTypes = () => {
    if (types.length) return;

    request(Queries.TYPE, (data) => {
      const types = data.types.map(Helper.formatMetaName);
      dispatch(setTypes(types));
    });
  };

  const getPokeAbilities = () => {
    if (abilities.length) return;

    request(Queries.ABILITY, (data) => {
      const abilities = data.abilities.map(Helper.formatMetaName);
      dispatch(setAbilities(abilities));
    });
  };

  const getPokeMoves = () => {
    if (moves.length) return;

    request(Queries.MOVE, (data) => {
      const moves = data.moves.map(Helper.formatMetaName);
      dispatch(setMoves(moves));
    });
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: styles.header,
          headerTitleStyle: {
            color: Color.WHITE,
            fontWeight: 'bold'
          }
        }}>
        <Stack.Screen
          name={'Home'}
          component={Home}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Form')}
                style={styles.headerButton}>
                <AntDesign name={'plus'} size={18} color={'black'} />
              </TouchableOpacity>
            )
          })}
        />
        <Stack.Screen name={'Form'} component={Form} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Color.DARK
  },
  headerButton: {
    paddingRight: 8
  }
});
