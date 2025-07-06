// src/utils/PlatformComponents.web.ts
import DeviceInfoPolyfill from './webPolyfills/DeviceInfoPolyfill';
import LinearGradientPolyfill from './webPolyfills/LinearGradientPolyfill';

export const DeviceInfo = DeviceInfoPolyfill;
export const LinearGradient = LinearGradientPolyfill;

export { default as MapView } from './webPolyfills/MapViewPolyfill';
export { default as Geolocation } from './webPolyfills/GeolocationPolyfill';
export { default as ImagePicker } from './webPolyfills/ImagePickerPolyfill';
export { default as ImageCropPicker } from './webPolyfills/ImagePickerPolyfill';
export { default as Keychain } from './webPolyfills/KeychainPolyfill';
export { default as SplashScreen } from './webPolyfills/SplashScreenPolyfill';