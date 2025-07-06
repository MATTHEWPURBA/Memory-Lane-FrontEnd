// src/utils/webPolyfills/GeolocationPolyfill.js
const Geolocation = {
    getCurrentPosition: (successCallback, errorCallback, options = {}) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Transform web position to React Native format
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              altitude: position.coords.altitude,
              accuracy: position.coords.accuracy,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              heading: position.coords.heading,
              speed: position.coords.speed,
            };
            
            successCallback({
              coords,
              timestamp: position.timestamp,
            });
          },
          (error) => {
            const errorObj = {
              code: error.code,
              message: error.message,
              PERMISSION_DENIED: 1,
              POSITION_UNAVAILABLE: 2,
              TIMEOUT: 3,
            };
            errorCallback(errorObj);
          },
          {
            enableHighAccuracy: options.enableHighAccuracy || false,
            timeout: options.timeout || 15000,
            maximumAge: options.maximumAge || 10000,
          }
        );
      } else {
        errorCallback({
          code: 2,
          message: 'Geolocation not supported',
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        });
      }
    },
  
    watchPosition: (successCallback, errorCallback, options = {}) => {
      if (navigator.geolocation) {
        return navigator.geolocation.watchPosition(
          (position) => {
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              altitude: position.coords.altitude,
              accuracy: position.coords.accuracy,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              heading: position.coords.heading,
              speed: position.coords.speed,
            };
            
            successCallback({
              coords,
              timestamp: position.timestamp,
            });
          },
          errorCallback,
          options
        );
      }
      return -1;
    },
  
    clearWatch: (watchId) => {
      if (navigator.geolocation && watchId !== -1) {
        navigator.geolocation.clearWatch(watchId);
      }
    },
  
    requestAuthorization: () => {
      return Promise.resolve('granted');
    },
  
    PERMISSIONS: {
      GRANTED: 'granted',
      DENIED: 'denied',
      RESTRICTED: 'restricted',
    },
  };
  
  export default Geolocation;