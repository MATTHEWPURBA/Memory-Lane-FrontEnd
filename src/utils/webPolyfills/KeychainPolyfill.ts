// src/utils/webPolyfills/KeychainPolyfill.ts
export default {
    setInternetCredentials: (server: string, username: string, password: string) => {
      localStorage.setItem(`keychain_${server}`, JSON.stringify({ username, password }));
      return Promise.resolve();
    },
    getInternetCredentials: (server: string) => {
      const data = localStorage.getItem(`keychain_${server}`);
      return data ? Promise.resolve(JSON.parse(data)) : Promise.reject(new Error('Not found'));
    },
    resetInternetCredentials: (server: string) => {
      localStorage.removeItem(`keychain_${server}`);
      return Promise.resolve();
    },
  };
  