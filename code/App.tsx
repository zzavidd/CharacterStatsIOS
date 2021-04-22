import { AntDesign } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Provider } from 'react-redux';

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
import request from './utils/request';
import { PokeMeta } from './utils/types';

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

    request('https://pokeapi.co/api/v2/type', async (results) => {
      const bannedTypes = ['Shadow', 'Unknown'];
      const typeList = await results
        .map(Helper.formatMetaName)
        .filter((type: PokeMeta) => !bannedTypes.includes(type.name))
        .sort(Helper.sortMetaByName);
      dispatch(setTypes(typeList));
    });
  };

  const getPokeAbilities = () => {
    if (abilities.length) return;

    request('https://pokeapi.co/api/v2/ability', async (results) => {
      const seenAbilities: Array<string> = [];
      const abilityList = await results
        .map(Helper.formatMetaName)
        .filter(({ name }: PokeMeta) => {
          if (seenAbilities.includes(name)) return false;
          seenAbilities.push(name);
          return true;
        })
        .sort(Helper.sortMetaByName);
      dispatch(setAbilities(abilityList));
    });
  };

  const getPokeMoves = () => {
    if (moves.length) return;

    request('https://pokeapi.co/api/v2/move', async (results) => {
      const moveList = await results
        .map(Helper.formatMetaName)
        .sort(Helper.sortMetaByName);
      dispatch(setMoves(moveList));
    });
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
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
  headerButton: {
    paddingRight: 8
  }
});
