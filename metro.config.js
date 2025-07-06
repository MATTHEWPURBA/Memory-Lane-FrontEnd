const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration with web polyfills
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
    alias: {
      'react-native$': 'react-native-web',
      'react-native-linear-gradient': 'react-native-web-linear-gradient',
      'react-native-maps': require.resolve('./src/utils/webPolyfills/MapViewPolyfill'),
      'react-native-device-info': require.resolve('./src/utils/webPolyfills/DeviceInfoPolyfill'),
      'react-native-geolocation-service': require.resolve('./src/utils/webPolyfills/GeolocationPolyfill'),
      'react-native-image-picker': require.resolve('./src/utils/webPolyfills/ImagePickerPolyfill'),
      'react-native-image-crop-picker': require.resolve('./src/utils/webPolyfills/ImagePickerPolyfill'),
      'react-native-keychain': require.resolve('./src/utils/webPolyfills/KeychainPolyfill'),
      'react-native-splash-screen': require.resolve('./src/utils/webPolyfills/SplashScreenPolyfill'),
    },
    resolverMainFields: ['browser', 'react-native', 'main'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);