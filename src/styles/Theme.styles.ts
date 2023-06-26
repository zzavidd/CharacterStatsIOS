import { extendTheme } from 'native-base';

const theme = extendTheme({
  components: {
    Button: {
      defaultProps: {
        variant: 'ghost',
        borderRadius: 10,
      },
    },
    Divider: {
      defaultProps: {
        bg: 'muted.200',
      },
    },
    FormControlLabel: {
      defaultProps: {
        mb: 2,
      },
    },
    Input: {
      defaultProps: {
        variant: 'rounded',
        fontFamily: 'body',
        keyboardAppearance: 'dark',
        p: 4,
        rounded: 'xl',
        size: 'lg',
      },
    },
    Text: {
      baseStyle: {
        color: 'text.200',
        fontWeight: '500',
      },
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
