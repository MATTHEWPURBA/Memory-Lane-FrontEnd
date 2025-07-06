const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

// Set environment variables
process.env.EXPO_OS = 'web';

/**
 * Metro configuration with simplified web polyfills
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'ttf', 'otf', 'woff', 'woff2'],
    sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx', 'web.js', 'web.jsx', 'web.ts', 'web.tsx'],
    platforms: ['web', 'ios', 'android'],
    resolverMainFields: ['browser', 'react-native', 'main'],
    alias: {
      'react-native$': 'react-native-web',
      // Only add aliases for libraries that have web alternatives
      'react-native-linear-gradient': 'react-native-web-linear-gradient',
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);