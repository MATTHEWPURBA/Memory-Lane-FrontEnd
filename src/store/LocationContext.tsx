import React, { createContext, useContext, useReducer, useEffect, useState, ReactNode } from 'react';
import { Platform, Alert } from 'react-native';
import { Geolocation } from '@/utils/PlatformComponents';
import Toast from 'react-native-toast-message';
import { Location, LocationContextType } from '@/types';

// Handle permissions import with error handling
let permissions;
try {
  permissions = require('react-native-permissions');
} catch (error) {
  // Fallback for when native module is not available
  permissions = {
    check: () => Promise.resolve('unavailable'),
    request: () => Promise.resolve('denied'),
    PERMISSIONS: {
      IOS: { LOCATION_WHEN_IN_USE: 'ios.permission.LOCATION_WHEN_IN_USE' },
      ANDROID: { ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION' },
    },
    RESULTS: {
      UNAVAILABLE: 'unavailable',
      DENIED: 'denied',
      LIMITED: 'limited',
      GRANTED: 'granted',
      BLOCKED: 'blocked',
    },
  };
}

const { check, request, PERMISSIONS, RESULTS } = permissions;

// Action Types
type LocationAction =
  | { type: 'SET_CURRENT_LOCATION'; payload: Location | null }
  | { type: 'SET_HAS_PERMISSION'; payload: boolean }
  | { type: 'SET_IS_LOCATION_ENABLED'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

// State Interface
interface LocationState {
  currentLocation: Location | null;
  hasLocationPermission: boolean;
  isLocationEnabled: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial State
const initialState: LocationState = {
  currentLocation: null,
  hasLocationPermission: false,
  isLocationEnabled: false,
  isLoading: false,
  error: null,
};

// Reducer
function locationReducer(state: LocationState, action: LocationAction): LocationState {
  switch (action.type) {
    case 'SET_CURRENT_LOCATION':
      return { ...state, currentLocation: action.payload };
    case 'SET_HAS_PERMISSION':
      return { ...state, hasLocationPermission: action.payload };
    case 'SET_IS_LOCATION_ENABLED':
      return { ...state, isLocationEnabled: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

// Context
const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Provider Component
interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(locationReducer, initialState);
  const [locationWatcher, setLocationWatcher] = useState<number | null>(null);

  // Check location permission on mount
  useEffect(() => {
    checkLocationPermission();
    return () => {
      if (locationWatcher) {
        Geolocation.clearWatch(locationWatcher);
      }
    };
  }, []);

  const checkLocationPermission = async () => {
    try {
      const permission = Platform.select({
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      });

      if (!permission) {
        dispatch({ type: 'SET_ERROR', payload: 'Platform not supported' });
        return;
      }

      const result = await check(permission);
      
      switch (result) {
        case RESULTS.UNAVAILABLE:
          dispatch({ type: 'SET_ERROR', payload: 'Location service is not available' });
          break;
        case RESULTS.DENIED:
          dispatch({ type: 'SET_HAS_PERMISSION', payload: false });
          break;
        case RESULTS.LIMITED:
        case RESULTS.GRANTED:
          dispatch({ type: 'SET_HAS_PERMISSION', payload: true });
          await getCurrentLocation();
          break;
        case RESULTS.BLOCKED:
          dispatch({ type: 'SET_ERROR', payload: 'Location permission is blocked' });
          break;
      }
    } catch (error) {
      console.error('Permission check failed:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to check location permission' });
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const permission = Platform.select({
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      });

      if (!permission) {
        throw new Error('Platform not supported');
      }

      const result = await request(permission);
      
      switch (result) {
        case RESULTS.GRANTED:
        case RESULTS.LIMITED:
          dispatch({ type: 'SET_HAS_PERMISSION', payload: true });
          await getCurrentLocation();
          Toast.show({
            type: 'success',
            text1: 'Location Access Granted',
            text2: 'You can now discover memories around you!',
          });
          return true;
        case RESULTS.DENIED:
        case RESULTS.BLOCKED:
          dispatch({ type: 'SET_HAS_PERMISSION', payload: false });
          Toast.show({
            type: 'error',
            text1: 'Location Access Denied',
            text2: 'Please enable location access in settings to use this feature.',
          });
          return false;
        default:
          dispatch({ type: 'SET_HAS_PERMISSION', payload: false });
          return false;
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to request location permission' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getCurrentLocation = async (): Promise<Location | null> => {
    return new Promise((resolve, reject) => {
      if (!state.hasLocationPermission) {
        reject(new Error('Location permission not granted'));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      };

      try {
        Geolocation.getCurrentPosition(
          (position) => {
            const location: Location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude,
              timestamp: position.timestamp,
            };

            dispatch({ type: 'SET_CURRENT_LOCATION', payload: location });
            dispatch({ type: 'SET_IS_LOCATION_ENABLED', payload: true });
            resolve(location);
          },
          (error) => {
            console.error('Location error:', error);
            let errorMessage = 'Failed to get current location';
            
            switch (error.code) {
              case 1: // PERMISSION_DENIED
                errorMessage = 'Location permission denied';
                dispatch({ type: 'SET_HAS_PERMISSION', payload: false });
                break;
              case 2: // POSITION_UNAVAILABLE
                errorMessage = 'Location information unavailable';
                break;
              case 3: // TIMEOUT
                errorMessage = 'Location request timed out';
                break;
              default:
                errorMessage = 'Location service not available';
                break;
            }
            
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
            dispatch({ type: 'SET_IS_LOCATION_ENABLED', payload: false });
            reject(new Error(errorMessage));
          },
          options
        );
      } catch (error) {
        console.error('Geolocation not available:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Location service not available' });
        reject(new Error('Location service not available'));
      }
    });
  };

  const watchLocation = (callback: (location: Location) => void): void => {
    if (!state.hasLocationPermission) {
      console.warn('Cannot watch location: permission not granted');
      return;
    }

    // Clear existing watcher
    if (locationWatcher) {
      try {
        Geolocation.clearWatch(locationWatcher);
      } catch (error) {
        console.warn('Failed to clear location watcher:', error);
      }
    }

    const options = {
      enableHighAccuracy: true,
      distanceFilter: 10, // Update every 10 meters
      interval: 5000, // Update every 5 seconds
      fastestInterval: 2000, // Fastest update every 2 seconds
    };

    try {
      const watcherId = Geolocation.watchPosition(
        (position) => {
          const location: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            timestamp: position.timestamp,
          };

          dispatch({ type: 'SET_CURRENT_LOCATION', payload: location });
          callback(location);
        },
        (error) => {
          console.error('Location watch error:', error);
          dispatch({ type: 'SET_ERROR', payload: 'Location tracking failed' });
        },
        options
      );

      setLocationWatcher(watcherId);
    } catch (error) {
      console.error('Failed to start location watching:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Location service not available' });
    }
  };

  const stopWatchingLocation = (): void => {
    if (locationWatcher) {
      try {
        Geolocation.clearWatch(locationWatcher);
      } catch (error) {
        console.warn('Failed to clear location watcher:', error);
      }
      setLocationWatcher(null);
    }
  };

  const showLocationSettings = () => {
    Alert.alert(
      'Location Access Required',
      'Memory Lane needs location access to show you nearby memories. Please enable location access in your device settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => {
          // TODO: Implement settings opening functionality
          // For now, just show an alert
          Alert.alert('Settings', 'Please manually open your device settings and enable location access for Memory Lane.');
        }},
      ]
    );
  };

  const value: LocationContextType = {
    currentLocation: state.currentLocation,
    hasLocationPermission: state.hasLocationPermission,
    isLocationEnabled: state.isLocationEnabled,
    requestLocationPermission,
    getCurrentLocation,
    watchLocation,
    stopWatchingLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

// Hook
export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}; 