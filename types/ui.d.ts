import type { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  export type ScreenProps<T extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, T>;

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export type RootStackParamList = {
    Home: undefined;
    Form: undefined;
  };
}
