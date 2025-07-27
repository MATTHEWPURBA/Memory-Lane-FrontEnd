const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

// Set environment variables
process.env.EXPO_OS = 'web';

// Suppress deprecation warnings for web
if (process.env.NODE_ENV === 'development') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const message = args[0];
    if (typeof message === 'string') {
      if (message.includes('pointerEvents') || message.includes('shadow*')) {
        return; // Suppress these warnings
      }
    }
    originalWarn.apply(console, args);
  };
}

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
      // Font polyfill for web
      'expo-font': path.resolve(__dirname, 'src/utils/webPolyfills/FontPolyfill.js'),
      // Vector icons polyfill for web
      '@expo/vector-icons': path.resolve(__dirname, 'src/utils/webPolyfills/VectorIconsPolyfill.js'),
      // Icon set polyfill for web
      '@expo/vector-icons/build/createIconSet': path.resolve(__dirname, 'src/utils/webPolyfills/IconSetPolyfill.js'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);