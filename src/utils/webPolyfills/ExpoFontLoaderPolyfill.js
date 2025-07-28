// Polyfill for ExpoFontLoader (CommonJS only)
console.log('🔍 ExpoFontLoaderPolyfill.js is being loaded');

// Create a comprehensive polyfill that handles all possible access patterns
const polyfill = {
  default: {
    isLoaded: (fontFamily) => {
      console.log('🔍 ExpoFontLoader.default.isLoaded() called with:', fontFamily);
      return true;
    },
    loadAsync: async (fontMap) => {
      console.log('🔍 ExpoFontLoader.default.loadAsync() called');
      return Promise.resolve();
    },
    getFontFamily: (fontFamily) => {
      console.log('🔍 ExpoFontLoader.default.getFontFamily() called with:', fontFamily);
      return fontFamily;
    },
    getFontFamilyAsync: async (fontFamily) => {
      console.log('🔍 ExpoFontLoader.default.getFontFamilyAsync() called with:', fontFamily);
      return fontFamily;
    },
  },
  isLoaded: (fontFamily) => {
    console.log('🔍 ExpoFontLoader.isLoaded() called with:', fontFamily);
    return true;
  },
  loadAsync: async (fontMap) => {
    console.log('🔍 ExpoFontLoader.loadAsync() called');
    return Promise.resolve();
  },
  getFontFamily: (fontFamily) => {
    console.log('🔍 ExpoFontLoader.getFontFamily() called with:', fontFamily);
    return fontFamily;
  },
  getFontFamilyAsync: async (fontFamily) => {
    console.log('🔍 ExpoFontLoader.getFontFamilyAsync() called with:', fontFamily);
    return fontFamily;
  },
};

console.log('🔍 ExpoFontLoaderPolyfill.js exports:', Object.keys(polyfill));
console.log('🔍 ExpoFontLoaderPolyfill.js default:', Object.keys(polyfill.default));

// Export both as default and as named exports
module.exports = polyfill;
module.exports.default = polyfill.default;
module.exports.isLoaded = polyfill.isLoaded;
module.exports.loadAsync = polyfill.loadAsync;
module.exports.getFontFamily = polyfill.getFontFamily;
module.exports.getFontFamilyAsync = polyfill.getFontFamilyAsync; 