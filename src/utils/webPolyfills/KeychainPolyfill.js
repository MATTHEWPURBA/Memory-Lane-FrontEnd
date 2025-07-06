// src/utils/webPolyfills/KeychainPolyfill.js
const KEYCHAIN_PREFIX = 'keychain_';

const Keychain = {
  setInternetCredentials: (server, username, password) => {
    try {
      const credentials = { username, password };
      localStorage.setItem(KEYCHAIN_PREFIX + server, JSON.stringify(credentials));
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  getInternetCredentials: (server) => {
    try {
      const data = localStorage.getItem(KEYCHAIN_PREFIX + server);
      if (data) {
        const credentials = JSON.parse(data);
        return Promise.resolve({
          username: credentials.username,
          password: credentials.password,
          service: server,
        });
      } else {
        return Promise.reject(new Error('Credentials not found'));
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },

  resetInternetCredentials: (server) => {
    try {
      localStorage.removeItem(KEYCHAIN_PREFIX + server);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  setGenericPassword: (username, password, service = 'default') => {
    return Keychain.setInternetCredentials(service, username, password);
  },

  getGenericPassword: (service = 'default') => {
    return Keychain.getInternetCredentials(service);
  },

  resetGenericPassword: (service = 'default') => {
    return Keychain.resetInternetCredentials(service);
  },

  getAllInternetPasswordServices: () => {
    try {
      const services = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(KEYCHAIN_PREFIX)) {
          services.push(key.replace(KEYCHAIN_PREFIX, ''));
        }
      }
      return Promise.resolve(services);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  // Security level constants
  SECURITY_LEVEL: {
    ANY: 'ANY',
    SECURE_SOFTWARE: 'SECURE_SOFTWARE',
    SECURE_HARDWARE: 'SECURE_HARDWARE',
  },

  // Access control constants
  ACCESS_CONTROL: {
    BIOMETRY_ANY: 'BIOMETRY_ANY',
    BIOMETRY_CURRENT_SET: 'BIOMETRY_CURRENT_SET',
    DEVICE_PASSCODE: 'DEVICE_PASSCODE',
    APPLICATION_PASSWORD: 'APPLICATION_PASSWORD',
    BIOMETRY_ANY_OR_DEVICE_PASSCODE: 'BIOMETRY_ANY_OR_DEVICE_PASSCODE',
    BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE: 'BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE',
  },
};

export default Keychain;