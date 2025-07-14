// src/utils/PlatformComponents.web.ts
import LinearGradient from 'react-native-web-linear-gradient';

export { LinearGradient };

export { default as MapView } from './webPolyfills/MapViewPolyfill';
export { default as Geolocation } from 'react-native-geolocation-service';

import * as ImagePicker from 'react-native-image-picker';
export { ImagePicker };

export { default as ImageCropPicker } from 'react-native-image-crop-picker';

import * as Keychain from 'react-native-keychain';
export { Keychain };

export { default as SplashScreen } from 'react-native-splash-screen';