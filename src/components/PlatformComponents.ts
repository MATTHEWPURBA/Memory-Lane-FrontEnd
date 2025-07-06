// src/components/PlatformComponents.ts
import { Platform } from 'react-native';

// Platform-specific LinearGradient
export const LinearGradient = Platform.select({
  web: ({ children, colors, style, ...props }: any) => {
    const gradientStyle = {
      background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
      ...style,
    };
    return React.createElement('div', { style: gradientStyle, ...props }, children);
  },
  default: require('react-native-linear-gradient').default,
});

// Platform-specific Maps
export const MapView = Platform.select({
  web: ({ children, ...props }: any) => {
    return React.createElement(
      'div',
      {
        style: {
          width: '100%',
          height: 300,
          backgroundColor: '#e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
        },
      },
      React.createElement('p', null, 'Map not available on web')
    );
  },
  default: require('react-native-maps').default,
});

// Platform-specific Image Picker
export const ImagePicker = Platform.select({
  web: {
    launchImageLibrary: (options: any, callback: any) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
          callback({ assets: [{ uri: URL.createObjectURL(file) }] });
        }
      };
      input.click();
    },
  },
  default: require('react-native-image-picker'),
});

// Platform-specific Device Info
export const DeviceInfo = Platform.select({
  web: {
    getVersion: () => Promise.resolve('1.0.0'),
    getModel: () => Promise.resolve('Web Browser'),
    getUniqueId: () => Promise.resolve('web-unique-id'),
    // Add other mock methods as needed
  },
  default: require('react-native-device-info').default,
});

// Platform-specific Geolocation
export const Geolocation = Platform.select({
  web: {
    getCurrentPosition: (success: any, error: any, options: any) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error, options);
      } else {
        error(new Error('Geolocation not supported'));
      }
    },
  },
  default: require('react-native-geolocation-service').default,
});