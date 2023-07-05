import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, VStack, useTheme } from 'native-base';
import React from 'react';

import { expo } from 'app.json';
import FormScreen from 'src/screens/Form';
import HomeScreen from 'src/screens/Home';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigator() {
  const { fontConfig } = useTheme();

  const screenOptions: NativeStackNavigationOptions = {
    animation: 'fade_from_bottom',
    headerTitleStyle: {
      fontFamily: fontConfig.Mulish[500].normal,
      fontSize: 14,
    },
  };

  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator initialRouteName={'Home'} screenOptions={screenOptions}>
        <Stack.Screen
          name={'Home'}
          component={HomeScreen}
          options={{
            headerTitle: () => (
              <VStack alignItems={'center'}>
                <Text fontSize={16}>Characters</Text>
                <Text fontSize={10}>v{expo.version}</Text>
              </VStack>
            ),
          }}
        />
        <Stack.Screen
          name={'Form'}
          component={FormScreen}
          options={{ title: 'Add New Character' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
