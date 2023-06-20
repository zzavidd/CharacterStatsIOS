import { extendTheme } from 'native-base';

const theme = extendTheme({
  components: {
    Text: {
      baseStyle: () => ({
        color: 'text.50',
        fontWeight: '500',
      }),
    },
  },
  fontConfig: {
    Mulish: {
      300: {
        normal: 'Mulish_300Light',
        italic: 'Mulish_300Light_Italic',
      },
      500: {
        normal: 'Mulish_500Medium',
        italic: 'Mulish_500Medium_Italic',
      },
      700: {
        normal: 'Mulish_700Bold',
        italic: 'Mulish_700Bold_Italic',
      },
      900: {
        normal: 'Mulish_900Black',
        italic: 'Mulish_900Black_Italic',
      },
    },
  },
  fonts: {
    body: 'Mulish',
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
});

export default theme;
