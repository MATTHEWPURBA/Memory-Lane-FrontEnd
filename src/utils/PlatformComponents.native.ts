// src/utils/PlatformComponents.native.ts
import LinearGradient from 'react-native-linear-gradient';

export { LinearGradient };

export { default as MapView } from './webPolyfills/MapViewPolyfill';

// Handle Geolocation import with error handling
let Geolocation;
try {
  Geolocation = require('react-native-geolocation-service').default;
} catch (error) {
  // Fallback for when native module is not available
  Geolocation = {
    getCurrentPosition: () => Promise.reject(new Error('Geolocation not available')),
    watchPosition: () => Promise.reject(new Error('Geolocation not available')),
    clearWatch: () => {},
    stopObserving: () => {},
  };
}
export { Geolocation };

import * as ImagePicker from 'react-native-image-picker';
export { ImagePicker };

// Handle ImageCropPicker import with error handling
let ImageCropPicker;
try {
  ImageCropPicker = require('react-native-image-crop-picker').default;
} catch (error) {
  // Fallback for when native module is not available
  ImageCropPicker = {
    openPicker: () => Promise.reject(new Error('Image picker not available')),
    openCamera: () => Promise.reject(new Error('Camera not available')),
    openCropper: () => Promise.reject(new Error('Image cropper not available')),
    clean: () => Promise.resolve(),
  };
}
export { default as ImageCropPicker } from 'react-native-image-crop-picker';

import * as Keychain from 'react-native-keychain';
export { Keychain };

export { default as SplashScreen } from 'react-native-splash-screen';