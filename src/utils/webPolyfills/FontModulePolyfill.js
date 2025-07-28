// Polyfill for expo-font/build/Font and related modules (CommonJS only)
console.log('🔍 FontModulePolyfill.js is being loaded');

// Create a comprehensive polyfill that handles all possible access patterns
const polyfill = {
  default: {
    isLoaded: (fontFamily) => {
      console.log('🔍 Font.default.isLoaded() called with:', fontFamily);
      return true;
    },
    loadAsync: async (fontMap) => {
      console.log('🔍 Font.default.loadAsync() called');
      return Promise.resolve();
    },
    getFontFamily: (fontFamily) => {
      console.log('🔍 Font.default.getFontFamily() called with:', fontFamily);
      return fontFamily;
    },
    getFontFamilyAsync: async (fontFamily) => {
      console.log('🔍 Font.default.getFontFamilyAsync() called with:', fontFamily);
      return fontFamily;
    },
  },
  isLoaded: (fontFamily) => {
    console.log('🔍 Font.isLoaded() called with:', fontFamily);
    return true;
  },
  loadAsync: async (fontMap) => {
    console.log('🔍 Font.loadAsync() called');
    return Promise.resolve();
  },
  getFontFamily: (fontFamily) => {
    console.log('🔍 Font.getFontFamily() called with:', fontFamily);
    return fontFamily;
  },
  getFontFamilyAsync: async (fontFamily) => {
    console.log('🔍 Font.getFontFamilyAsync() called with:', fontFamily);
    return fontFamily;
  },
  // Add the specific function that's causing the error
  isLoadedInCache: (fontFamily) => {
    console.log('🔍 Font.isLoadedInCache() called with:', fontFamily);
    return false;
  },
  isLoadedNative: (fontFamily) => {
    console.log('🔍 Font.isLoadedNative() called with:', fontFamily);
    return true;
  },
  // Add the specific functions that expo-font/build/Font.js uses
  ExpoFontLoader: {
    isLoaded: (fontFamily) => {
      console.log('🔍 Font.ExpoFontLoader.isLoaded() called with:', fontFamily);
      return true;
    },
    loadAsync: async (fontMap) => {
      console.log('🔍 Font.ExpoFontLoader.loadAsync() called');
      return Promise.resolve();
    },
  },
};

console.log('🔍 FontModulePolyfill.js exports:', Object.keys(polyfill));
console.log('🔍 FontModulePolyfill.js default:', Object.keys(polyfill.default));

module.exports = polyfill; 