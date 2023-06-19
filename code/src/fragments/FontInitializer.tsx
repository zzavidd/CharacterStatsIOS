import {
  Mulish_300Light,
  Mulish_300Light_Italic,
  Mulish_500Medium,
  Mulish_500Medium_Italic,
  Mulish_700Bold,
  Mulish_700Bold_Italic,
  Mulish_900Black,
  Mulish_900Black_Italic,
} from '@expo-google-fonts/mulish';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback } from 'react';

export default function FontInitializer({ children }: React.PropsWithChildren) {
  const [fontsLoaded] = useFonts({
    Mulish_300Light,
    Mulish_300Light_Italic,
    Mulish_500Medium,
    Mulish_500Medium_Italic,
    Mulish_700Bold,
    Mulish_700Bold_Italic,
    Mulish_900Black,
    Mulish_900Black_Italic,
  });

  useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
