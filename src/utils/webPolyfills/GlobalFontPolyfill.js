// Global font polyfill to prevent font loading errors on web
console.log('🔍 GlobalFontPolyfill.js is being loaded');

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  console.log('🔍 Setting up global font polyfills for web');

  // Create the specific module that's causing the error - _ExpoFontLoader
  window._ExpoFontLoader = {
    default: {
      isLoaded: (fontFamily) => {
        console.log('🔍 Global _ExpoFontLoader.default.isLoaded() called with:', fontFamily);
        return true;
      },
      loadAsync: async (fontMap) => {
        console.log('🔍 Global _ExpoFontLoader.default.loadAsync() called');
        return Promise.resolve();
      },
      getFontFamily: (fontFamily) => {
        console.log('🔍 Global _ExpoFontLoader.default.getFontFamily() called with:', fontFamily);
        return fontFamily;
      },
      getFontFamilyAsync: async (fontFamily) => {
        console.log('🔍 Global _ExpoFontLoader.default.getFontFamilyAsync() called with:', fontFamily);
        return fontFamily;
      },
    },
    isLoaded: (fontFamily) => {
      console.log('🔍 Global _ExpoFontLoader.isLoaded() called with:', fontFamily);
      return true;
    },
    loadAsync: async (fontMap) => {
      console.log('🔍 Global _ExpoFontLoader.loadAsync() called');
      return Promise.resolve();
    },
    getFontFamily: (fontFamily) => {
      console.log('🔍 Global _ExpoFontLoader.getFontFamily() called with:', fontFamily);
      return fontFamily;
    },
    getFontFamilyAsync: async (fontFamily) => {
      console.log('🔍 Global _ExpoFontLoader.getFontFamilyAsync() called with:', fontFamily);
      return fontFamily;
    },
  };

  // Also create ExpoFontLoader for compatibility
  window.ExpoFontLoader = {
    isLoaded: (fontFamily) => {
      console.log('🔍 Global ExpoFontLoader.isLoaded() called with:', fontFamily);
      return true;
    },
    loadAsync: async (fontMap) => {
      console.log('🔍 Global ExpoFontLoader.loadAsync() called');
      return Promise.resolve();
    },
    getFontFamily: (fontFamily) => {
      console.log('🔍 Global ExpoFontLoader.getFontFamily() called with:', fontFamily);
      return fontFamily;
    },
    getFontFamilyAsync: async (fontFamily) => {
      console.log('🔍 Global ExpoFontLoader.getFontFamilyAsync() called with:', fontFamily);
      return fontFamily;
    },
  };

  // Create Font polyfill
  window.Font = {
    loadAsync: async (fontMap) => {
      console.log('🔍 Global Font.loadAsync() called');
      return Promise.resolve();
    },
    isLoaded: (fontFamily) => {
      console.log('🔍 Global Font.isLoaded() called with:', fontFamily);
      return true;
    },
    getFontFamily: (fontFamily) => {
      console.log('🔍 Global Font.getFontFamily() called with:', fontFamily);
      return fontFamily;
    },
    getFontFamilyAsync: async (fontFamily) => {
      console.log('🔍 Global Font.getFontFamilyAsync() called with:', fontFamily);
      return fontFamily;
    },
    isLoadedInCache: (fontFamily) => {
      console.log('🔍 Global Font.isLoadedInCache() called with:', fontFamily);
      return false;
    },
    isLoadedNative: (fontFamily) => {
      console.log('🔍 Global Font.isLoadedNative() called with:', fontFamily);
      return true;
    },
  };

  // Override require to intercept specific modules
  if (typeof require !== 'undefined') {
    const originalRequire = require;
    require = function(id) {
      console.log('🔍 require() called with:', id);
      
      if (id === 'expo-font/build/ExpoFontLoader') {
        console.log('🔍 Intercepting expo-font/build/ExpoFontLoader');
        return {
          default: {
            isLoaded: () => {
              console.log('🔍 Intercepted ExpoFontLoader.default.isLoaded() called');
              return true;
            },
            loadAsync: async () => {
              console.log('🔍 Intercepted ExpoFontLoader.default.loadAsync() called');
              return Promise.resolve();
            },
          },
          isLoaded: () => {
            console.log('🔍 Intercepted ExpoFontLoader.isLoaded() called');
            return true;
          },
          loadAsync: async () => {
            console.log('🔍 Intercepted ExpoFontLoader.loadAsync() called');
            return Promise.resolve();
          },
        };
      }
      
      if (id === 'expo-font/build/Font') {
        console.log('🔍 Intercepting expo-font/build/Font');
        return {
          default: {
            isLoaded: () => {
              console.log('🔍 Intercepted Font.default.isLoaded() called');
              return true;
            },
            loadAsync: async () => {
              console.log('🔍 Intercepted Font.default.loadAsync() called');
              return Promise.resolve();
            },
          },
          isLoaded: () => {
            console.log('🔍 Intercepted Font.isLoaded() called');
            return true;
          },
          loadAsync: async () => {
            console.log('🔍 Intercepted Font.loadAsync() called');
            return Promise.resolve();
          },
        };
      }
      
      return originalRequire(id);
    };
  }

  console.log('🔍 Global font polyfills set up for web platform');
  console.log('🔍 window._ExpoFontLoader:', typeof window._ExpoFontLoader);
  console.log('🔍 window.ExpoFontLoader:', typeof window.ExpoFontLoader);
  console.log('🔍 window.Font:', typeof window.Font);
} 