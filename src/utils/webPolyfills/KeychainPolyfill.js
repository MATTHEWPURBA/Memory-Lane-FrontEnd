// src/utils/webPolyfills/KeychainPolyfill.js
const KEYCHAIN_PREFIX = 'keychain_';

const KeychainPolyfill = {
  setInternetCredentials: async (server, username, password) => {
    // Store in localStorage for web
    localStorage.setItem(`keychain_${server}_${username}`, password);
    return true;
  },
  getInternetCredentials: async (server, username) => {
    // Retrieve from localStorage for web
    const password = localStorage.getItem(`keychain_${server}_${username}`);
    return password ? { username, password } : null;
  },
  resetInternetCredentials: async (server, username) => {
    // Remove from localStorage for web
    localStorage.removeItem(`keychain_${server}_${username}`);
    return true;
  },
};

export default KeychainPolyfill;