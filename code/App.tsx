import { AntDesign } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Provider } from 'react-redux';

import Form from './screens/form';
import Home from './screens/home';
import { formatMetaName, sortMetaByName } from './utils/helper';
import store, {
  setAbilities,
  setTypes,
  useAppDispatch
} from './utils/reducers';
import request from './utils/request';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <Index />
    </Provider>
  );
}

function Index() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    getPokeTypes();
    getPokeAbilities();
  }, []);

  const getPokeTypes = () => {
    request('https://pokeapi.co/api/v2/type', ({ results }) => {
      const bannedTypes = ['Shadow', 'Unknown'];
      const typeList = results
        .map(formatMetaName)
        .filter((type: string) => type && !bannedTypes.includes(type))
        .sort(sortMetaByName);
      dispatch(setTypes(typeList));
    });
  };

  const getPokeAbilities = () => {
    request('https://pokeapi.co/api/v2/ability', ({ results }) => {
      const abilityList = results.map(formatMetaName).sort(sortMetaByName);
      dispatch(setAbilities(abilityList));
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
