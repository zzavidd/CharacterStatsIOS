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
import { PokeAbility, PokeMove, PokeType } from './types';
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
    bootstrapExternalData();
  }, []);

  const bootstrapExternalData = async () => {
    getPokeAbilities();
    await getPokeTypes();
    getPokeMoves();
  };

  const getPokeTypes = async () => {
    if (types.length && !DevSettings.retrieveData) return;

    await request(Queries.TYPE, (data) => {
      const typeList = data.types.map((type: PokeType) => {
        type.name = capitalCase(type.name) as Type;
        type.color = Color.TYPE[type.name];
        return type;
      });
      dispatch(setTypes(typeList));
    });
  };

  const getPokeAbilities = async () => {
    if (abilities.length && !DevSettings.retrieveData) return;

    await request(Queries.ABILITY, (data) => {
      const abilityList = data.abilities.map((ability: PokeAbility) => {
        ability.name = capitalCase(ability.name);
        ability.color = Object.values(Color.GENERATION)[ability.generation];
        return ability;
      });
      dispatch(setAbilities(abilityList));
    });
  };

  const getPokeMoves = () => {
    if (moves.length && !DevSettings.retrieveData) return;

    request(Queries.MOVE, (data) => {
      const moveList = data.moves.map((move: PokeMove) => {
        move.name = capitalCase(move.name);
        const hello = types.find((type) => type.id === move.typeId);
        move.color = hello!.color;
        return move;
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
