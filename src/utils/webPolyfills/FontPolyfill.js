// Web polyfill for expo-font
const Font = {
  loadAsync: async (fontMap) => {
    // On web, fonts are typically loaded via CSS
    // This is a no-op for web platform
    console.log('Font loading polyfill called for web platform');
    return Promise.resolve();
  },
  isLoaded: (fontFamily) => {
    // Check if font is loaded by testing with a canvas
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = `12px ${fontFamily}`;
      return context.font.includes(fontFamily);
    } catch (error) {
      console.log('Font isLoaded check failed:', error);
      return false;
    }
  },
  // Add other methods that might be called
  getFontFamily: (fontFamily) => fontFamily,
  getFontFamilyAsync: async (fontFamily) => fontFamily,
};

// Also create a polyfill for ExpoFontLoader
const ExpoFontLoader = {
  isLoaded: (fontFamily) => {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = `12px ${fontFamily}`;
      return context.font.includes(fontFamily);
    } catch (error) {
      console.log('ExpoFontLoader isLoaded check failed:', error);
      return false;
    }
  },
  loadAsync: async (fontMap) => {
    console.log('ExpoFontLoader loadAsync polyfill called for web platform');
    return Promise.resolve();
  },
};

// Export as default and named exports
const defaultExport = Font;
defaultExport.ExpoFontLoader = ExpoFontLoader;

export default defaultExport;
export { ExpoFontLoader }; 