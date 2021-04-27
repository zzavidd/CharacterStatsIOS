import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  useQuery
} from '@apollo/client';
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
  PokeAbility,
  PokeMove,
  PokeType,
  ResponseAbility,
  ResponseData,
  ResponseMove,
  ResponseType
} from './types';
import { Type } from './types/enums';
import { findMostCommonType } from './utils/helper';
import QUERY from './utils/queries';
import store, {
  setAbilities,
  setMoves,
  setTypes,
  useAppDispatch,
  useAppSelector
} from './utils/reducers';

const Stack = createStackNavigator();

const client = new ApolloClient({
  uri: 'https://beta.pokeapi.co/graphql/v1beta',
  cache: new InMemoryCache()
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Index />
      </Provider>
    </ApolloProvider>
  );
}

function Index() {
  const { isInitialised } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  const { data, error, loading } = useQuery<ResponseData>(QUERY, {
    skip: isInitialised
  });

  useEffect(() => {
    if (error) {
      console.error(error);
    } else if (data && !loading) {
      gatherTypes(data);
      gatherAbilities(data);
      gatherMoves(data);
    }
  }, [loading]);

  const gatherTypes = (data: ResponseData) => {
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
  };

  const gatherAbilities = (data: ResponseData) => {
    const abilityList = data.abilities.map(
      (responseAbility: ResponseAbility) => {
        const { id, generation } = responseAbility;

        const commonType = findMostCommonType(responseAbility);
        const marshaledAbility: PokeAbility = {
          id,
          generation,
          name: capitalCase(responseAbility.name),
          color: Color.TYPE[commonType!],
          effect: responseAbility.effects.effect
        };
        return marshaledAbility;
      }
    );
    dispatch(setAbilities(abilityList));
  };

  const gatherMoves = (data: ResponseData) => {
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
        effect: responseMove.effect?.texts[0].text
      };
      return marshaledMove;
    });
    dispatch(setMoves(moveList));
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
