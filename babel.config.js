module.exports = {
  presets: [
    [
      'module:metro-react-native-babel-preset',
      {
        unstable_transformProfile: 'hermes-stable',
      },
    ],
  ],
  plugins: [
    [
      'transform-inline-environment-variables',
      {
        include: ['EXPO_OS', 'API_BASE_URL', 'API_TIMEOUT', 'PRODUCTION_API_URL'],
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
          '.web.ts',
          '.web.tsx',
          '.web.js',
          '.web.jsx',
        ],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@services': './src/services',
          '@utils': './src/utils',
          '@types': './src/types',
          '@assets': './src/assets',
          '@constants': './src/constants',
          '@hooks': './src/hooks',
          '@store': './src/store',
        },
      },
    ],
    ['@babel/plugin-transform-class-properties', { loose: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-transform-private-property-in-object', { loose: true }],
    'react-native-reanimated/plugin',
    '@babel/plugin-transform-react-jsx',
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};