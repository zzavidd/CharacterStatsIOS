import { AntDesign } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { capitalCase } from 'capital-case';
import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Provider } from 'react-redux';

import Color from './constants/colors';
import Form from './screens/form';
import Home from './screens/home';
import {
  ResponseAbility,
  ResponseMove,
  ResponseType,
  PokeMove,
  PokeType,
  PokeAbility
} from './types';
import { Type } from './types/enums';
import store, {
  setAbilities,
  setMoves,
  setTypes,
  useAppDispatch,
  useAppSelector
} from './utils/reducers';
import request, { Queries } from './utils/request';
import DevSettings from './utils/settings';
import * as Storage from './utils/storage';

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
    // Storage.clearAllData();
    getPokeAbilities();
    getPokeTypes();
    getPokeMoves();
  }, []);

  const getPokeTypes = () => {
    if (types.length && !DevSettings.retrieveData) return;

    request(Queries.TYPE, (data) => {
      const typeList = data.types.map((responseType: ResponseType) => {
        const typeName = capitalCase(responseType.name) as Type;
        const marshaledType: PokeType = {
          id: responseType.id,
          name: typeName,
          color: Color.TYPE[typeName]
        };
        return marshaledType;
      });
      dispatch(setTypes(typeList));
    });
  };

  const getPokeAbilities = () => {
    if (abilities.length && !DevSettings.retrieveData) return;

    request(Queries.ABILITY, (data) => {
      const abilityList = data.abilities.map(
        (responseAbility: ResponseAbility) => {
          const { id, generation } = responseAbility;
          const marshaledAbility: PokeAbility = {
            id,
            generation,
            name: capitalCase(responseAbility.name),
            color: Object.values(Color.GENERATION)[generation],
            effect: responseAbility.effects.effect
          };
          return marshaledAbility;
        }
      );
      dispatch(setAbilities(abilityList));
    });
  };

  const getPokeMoves = () => {
    if (moves.length && !DevSettings.retrieveData) return;

    request(Queries.MOVE, (data) => {
      const moveList = data.moves.map((responseMove: ResponseMove) => {
        const { id, accuracy, power, pp } = responseMove;
        const type = capitalCase(responseMove.type.name) as Type;
        const marshaledMove: PokeMove = {
          id,
          accuracy,
          power,
          pp,
          type,
          name: capitalCase(responseMove.name),
          color: Color.TYPE[type],
          damageClass: responseMove.damageClass.name,
          effect: responseMove.effect.texts[0].text
        };
        return marshaledMove;
      });
      dispatch(setMoves(moveList));
    });
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        mode={'modal'}
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
                <AntDesign name={'plus'} size={24} color={Color.WHITE} />
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
