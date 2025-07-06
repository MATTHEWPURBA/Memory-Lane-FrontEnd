// src/utils/PlatformComponents.ts
import { Platform } from 'react-native';

// Platform-specific LinearGradient
export const LinearGradient = Platform.select({
  web: require('./webPolyfills/LinearGradientPolyfill').default,
  default: require('react-native-linear-gradient').default,
});

// Platform-specific Maps
export const MapView = Platform.select({
  web: require('./webPolyfills/MapViewPolyfill').default,
  default: require('react-native-maps').default,
});

// Platform-specific Device Info
export const DeviceInfo = Platform.select({
  web: require('./webPolyfills/DeviceInfoPolyfill').default,
  default: require('react-native-device-info').default,
});

// Platform-specific Geolocation
export const Geolocation = Platform.select({
  web: require('./webPolyfills/GeolocationPolyfill').default,
  default: require('react-native-geolocation-service').default,
});

// Platform-specific Image Picker
export const ImagePicker = Platform.select({
  web: require('./webPolyfills/ImagePickerPolyfill').default,
  default: require('react-native-image-picker'),
});

// Platform-specific Image Crop Picker
export const ImageCropPicker = Platform.select({
  web: require('./webPolyfills/ImagePickerPolyfill').default,
  default: require('react-native-image-crop-picker').default,
});

// Platform-specific Keychain
export const Keychain = Platform.select({
  web: require('./webPolyfills/KeychainPolyfill').default,
  default: require('react-native-keychain').default,
});

// Platform-specific SplashScreen
export const SplashScreen = Platform.select({
  web: require('./webPolyfills/SplashScreenPolyfill').default,
  default: require('react-native-splash-screen').default,
});