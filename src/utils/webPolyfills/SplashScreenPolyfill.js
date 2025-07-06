// src/utils/webPolyfills/SplashScreenPolyfill.js
const SplashScreenPolyfill = {
    hide: () => {
      // For web, we just resolve immediately
      return Promise.resolve();
    },
  
    show: () => {
      // For web, we just resolve immediately
      return Promise.resolve();
    },
  
    preventAutoHideAsync: () => {
      console.log('SplashScreen.preventAutoHideAsync() called on web');
      return Promise.resolve();
    },
  
    hideAsync: () => {
      return SplashScreenPolyfill.hide();
    },
  };
  
  export default SplashScreenPolyfill;