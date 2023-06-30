module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.ts', '.tsx'],
          root: ['.'],
        },
      ],
      [
        'module:react-native-dotenv',
        {
          allowUndefined: false,
          moduleName: '@env',
          path: '.env',
        },
      ],
    ],
  };
};
