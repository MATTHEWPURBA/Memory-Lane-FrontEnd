// src/utils/webPolyfills/DeviceInfoPolyfill.js
const DeviceInfoPolyfill = {
    getVersion: async () => '1.0.0',
    getBuildNumber: async () => '1',
    getModel: async () => 'Web Browser',
    getSystemVersion: async () => 'Web',
    getUniqueId: async () => 'web-device-id',
    getManufacturer: async () => 'Web',
    getBrand: async () => 'Web',
    getUsedMemory: async () => 0,
    getTotalMemory: async () => 0,
    getFreeDiskStorage: async () => 0,
    getBatteryLevel: async () => 1,
    getDeviceId: () => Promise.resolve('web-device-id'),
    getApplicationName: () => Promise.resolve('Memory Lane'),
    getBundleId: () => Promise.resolve('com.memorylane.app'),
    getReadableVersion: () => Promise.resolve('1.0.0'),
    getBaseOs: () => Promise.resolve('Web'),
    getDeviceName: () => Promise.resolve('Web Browser'),
    getUserAgent: () => Promise.resolve(navigator.userAgent),
    isEmulator: () => Promise.resolve(false),
    isTablet: () => Promise.resolve(false),
  };
  
  export default DeviceInfoPolyfill;