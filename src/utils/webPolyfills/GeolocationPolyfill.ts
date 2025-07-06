// src/utils/webPolyfills/GeolocationPolyfill.ts
export default {
    getCurrentPosition: (
      successCallback: PositionCallback,
      errorCallback?: PositionErrorCallback,
      options?: PositionOptions
    ) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
      } else {
        errorCallback?.(new GeolocationPositionError());
      }
    },
    watchPosition: (
      successCallback: PositionCallback,
      errorCallback?: PositionErrorCallback,
      options?: PositionOptions
    ) => {
      if (navigator.geolocation) {
        return navigator.geolocation.watchPosition(successCallback, errorCallback, options);
      }
      return -1;
    },
    clearWatch: (watchId: number) => {
      if (navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    },
  };
  