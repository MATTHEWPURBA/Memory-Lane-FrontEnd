// src/utils/webPolyfills/DeviceInfoPolyfill.js
const DeviceInfo = {
    getVersion: () => Promise.resolve('1.0.0'),
    getBuildNumber: () => Promise.resolve('1'),
    getModel: () => Promise.resolve('Web Browser'),
    getSystemVersion: () => Promise.resolve(navigator.userAgent.split(' ')[0] || 'Unknown'),
    getUniqueId: () => Promise.resolve('web-unique-id-' + Date.now()),
    getManufacturer: () => Promise.resolve('Browser'),
    getBrand: () => Promise.resolve('Web'),
    getUsedMemory: () => Promise.resolve(performance.memory?.usedJSHeapSize || 0),
    getTotalMemory: () => Promise.resolve(performance.memory?.totalJSHeapSize || 0),
    getFreeDiskStorage: () => Promise.resolve(0),
    getBatteryLevel: () => {
      if (navigator.getBattery) {
        return navigator.getBattery().then(battery => battery.level);
      }
      return Promise.resolve(1);
    },
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
  
  export default DeviceInfo;