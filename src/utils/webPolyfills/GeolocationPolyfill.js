// src/utils/webPolyfills/GeolocationPolyfill.js
const GeolocationPolyfill = {
    getCurrentPosition: (successCallback, errorCallback, options = {}) => {
      if (!navigator.geolocation) {
        errorCallback({ code: 2, message: 'Geolocation not supported' });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          successCallback({
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude,
            },
            timestamp: position.timestamp,
          });
        },
        (error) => {
          errorCallback({
            code: error.code,
            message: error.message,
          });
        },
        options
      );
    },
  
    watchPosition: (successCallback, errorCallback, options = {}) => {
      if (!navigator.geolocation) {
        errorCallback({ code: 2, message: 'Geolocation not supported' });
        return -1;
      }

      return navigator.geolocation.watchPosition(
        (position) => {
          successCallback({
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude,
            },
            timestamp: position.timestamp,
          });
        },
        (error) => {
          errorCallback({
            code: error.code,
            message: error.message,
          });
        },
        options
      );
    },
  
    clearWatch: (watchId) => {
      if (navigator.geolocation) {
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
  
  export default GeolocationPolyfill;