console.log('🔍 ExpoFontPolyfill.js is being loaded');

// Create a comprehensive polyfill for expo-font
const polyfill = {
  default: {
    isLoaded: (fontFamily) => {
      console.log('🔍 expo-font.default.isLoaded() called with:', fontFamily);
      return true;
    },
    loadAsync: async (fontMap) => {
      console.log('🔍 expo-font.default.loadAsync() called');
      return Promise.resolve();
    },
    getFontFamily: (fontFamily) => {
      console.log('🔍 expo-font.default.getFontFamily() called with:', fontFamily);
      return fontFamily;
    },
    getFontFamilyAsync: async (fontFamily) => {
      console.log('🔍 expo-font.default.getFontFamilyAsync() called with:', fontFamily);
      return fontFamily;
    },
  },
  isLoaded: (fontFamily) => {
    console.log('🔍 expo-font.isLoaded() called with:', fontFamily);
    return true;
  },
  loadAsync: async (fontMap) => {
    console.log('🔍 expo-font.loadAsync() called');
    return Promise.resolve();
  },
  getFontFamily: (fontFamily) => {
    console.log('🔍 expo-font.getFontFamily() called with:', fontFamily);
    return fontFamily;
  },
  getFontFamilyAsync: async (fontFamily) => {
    console.log('🔍 expo-font.getFontFamilyAsync() called with:', fontFamily);
    return fontFamily;
  },
  useFonts: (fontMap) => {
    console.log('🔍 expo-font.useFonts() called');
    return [true, null];
  },
  FontDisplay: {
    AUTO: 'auto',
    BLOCK: 'block',
    SWAP: 'swap',
    FALLBACK: 'fallback',
    OPTIONAL: 'optional',
  },
  getLoadedFonts: () => {
    console.log('🔍 expo-font.getLoadedFonts() called');
    return [];
  },
  isLoading: () => {
    console.log('🔍 expo-font.isLoading() called');
    return false;
  },
  unloadAllAsync: async () => {
    console.log('🔍 expo-font.unloadAllAsync() called');
    return Promise.resolve();
  },
  unloadAsync: async (fontFamily) => {
    console.log('🔍 expo-font.unloadAsync() called with:', fontFamily);
    return Promise.resolve();
  },
};

console.log('🔍 ExpoFontPolyfill.js exports:', Object.keys(polyfill));
console.log('🔍 ExpoFontPolyfill.js default:', Object.keys(polyfill.default));

module.exports = polyfill; 