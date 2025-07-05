const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
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
    resolverMainFields: ['browser', 'react-native-web', 'react-native', 'main'],
    extraNodeModules: {
      'react-native': require.resolve('react-native-web'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config); 