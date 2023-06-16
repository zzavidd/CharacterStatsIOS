module.exports = {
  extends: '@zzavidd/eslint-config/react-ts',
  env: {
    'react-native/react-native': true
  },
  plugins: ['react', 'react-native'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['**/tsconfig.json']
  },
  rules: {
    'react-native/no-color-literals': 1,
    'react-native/no-inline-styles': 0,
    'react-native/no-raw-text': 2,
    'react-native/no-single-element-style-arrays': 2,
    'react-native/no-unused-styles': 1,
    'react-native/sort-styles': [1, 'asc', { ignoreClassNames: true }],
    'react-native/split-platform-components': 0
  }
};
