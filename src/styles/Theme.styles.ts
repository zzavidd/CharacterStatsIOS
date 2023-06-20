import { createTheme } from '@rneui/themed';

const theme = createTheme({
  mode: 'dark',
  components: {
    CardDivider: {
      style: {
        marginVertical: 14,
      },
    },
    Text: {
      style: {
        fontFamily: 'Mulish_500Medium',
      },
    },
  },
});

export default theme;
