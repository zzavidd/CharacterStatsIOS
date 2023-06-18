import { createTheme } from '@rneui/themed';

const theme = createTheme({
  mode: 'dark',
  components: {
    CardDivider: {
      style: {
        marginVertical: 14,
      },
    },
  },
});

export default theme;
