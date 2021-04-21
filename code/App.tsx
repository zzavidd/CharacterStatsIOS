import { AntDesign } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Home from './src';
import Form from './src/form';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={'Home'}
          component={Home}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Home')}
                style={styles.headerButton}
              >
                <AntDesign name={'plus'} size={18} color={'black'} />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name={'Form'} component={Form} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    paddingRight: 8,
  },
});
