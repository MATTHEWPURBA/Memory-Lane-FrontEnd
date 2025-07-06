// src/utils/webPolyfills/SplashScreenPolyfill.js
const SplashScreen = {
    hide: () => {
      // On web, we can hide any loading overlay if present
      const splashElement = document.getElementById('splash-screen');
      if (splashElement) {
        splashElement.style.display = 'none';
      }
      
      // Remove any loading class from body
      document.body.classList.remove('loading');
      
      console.log('SplashScreen.hide() called on web');
      return Promise.resolve();
    },
  
    show: () => {
      // On web, we can show a loading overlay if needed
      const splashElement = document.getElementById('splash-screen');
      if (splashElement) {
        splashElement.style.display = 'flex';
      }
      
      // Add loading class to body
      document.body.classList.add('loading');
      
      console.log('SplashScreen.show() called on web');
      return Promise.resolve();
    },
  
    preventAutoHideAsync: () => {
      console.log('SplashScreen.preventAutoHideAsync() called on web');
      return Promise.resolve();
    },
  
    hideAsync: () => {
      return SplashScreen.hide();
    },
  };
  
  export default SplashScreen;