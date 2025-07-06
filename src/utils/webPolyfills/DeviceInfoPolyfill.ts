// src/utils/webPolyfills/DeviceInfoPolyfill.ts
export default {
    getVersion: () => Promise.resolve('1.0.0'),
    getBuildNumber: () => Promise.resolve('1'),
    getModel: () => Promise.resolve('Web Browser'),
    getSystemVersion: () => Promise.resolve(navigator.userAgent),
    getUniqueId: () => Promise.resolve('web-unique-id'),
    getManufacturer: () => Promise.resolve('Browser'),
    getBrand: () => Promise.resolve('Web'),
    getUsedMemory: () => Promise.resolve(0),
    getTotalMemory: () => Promise.resolve(0),
    getFreeDiskStorage: () => Promise.resolve(0),
    getBatteryLevel: () => Promise.resolve(1),
  };
  