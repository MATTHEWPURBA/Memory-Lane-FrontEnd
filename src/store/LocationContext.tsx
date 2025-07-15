import React, { createContext, useContext, useReducer, useEffect, useState, ReactNode } from 'react';
import { Platform, Alert, Linking, AppState } from 'react-native';
import * as Location from 'expo-location';
import Toast from 'react-native-toast-message';
import { Location as LocationType, LocationContextType } from '@/types';

// Action Types
type LocationAction =
  | { type: 'SET_CURRENT_LOCATION'; payload: LocationType | null }
  | { type: 'SET_HAS_PERMISSION'; payload: boolean }
  | { type: 'SET_IS_LOCATION_ENABLED'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

// State Interface
interface LocationState {
  currentLocation: LocationType | null;
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
  const [locationWatcher, setLocationWatcher] = useState<Location.LocationSubscription | null>(null);

  // Check location permission on mount
  useEffect(() => {
    checkLocationPermissionStatus();
    
    // Listen for app state changes to re-check permissions when user returns from settings
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        console.log('🔧 LocationContext: App became active, re-checking permissions...');
        checkLocationPermissionStatus();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
      if (locationWatcher) {
        locationWatcher.remove();
      }
    };
  }, []);

  const checkLocationPermissionStatus = async () => {
    console.log('🔧 LocationContext: checkLocationPermissionStatus called');
    try {
      console.log('🔧 LocationContext: Checking permission status...');
      const { status } = await Location.getForegroundPermissionsAsync();
      console.log('🔧 LocationContext: Permission check result:', status);
      
      switch (status) {
        case Location.PermissionStatus.DENIED:
          console.log('🔧 LocationContext: Permission denied');
          dispatch({ type: 'SET_HAS_PERMISSION', payload: false });
          break;
        case Location.PermissionStatus.GRANTED:
          console.log('🔧 LocationContext: Permission granted');
          dispatch({ type: 'SET_HAS_PERMISSION', payload: true });
          await getCurrentLocation();
          break;
        case Location.PermissionStatus.UNDETERMINED:
          console.log('🔧 LocationContext: Permission undetermined');
          dispatch({ type: 'SET_HAS_PERMISSION', payload: false });
          break;
      }
    } catch (error) {
      console.error('🔧 LocationContext: Permission check failed:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to check location permission' });
      dispatch({ type: 'SET_HAS_PERMISSION', payload: false });
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    console.log('🔧 LocationContext: requestLocationPermission called');
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      console.log('🔧 LocationContext: Requesting permission...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('🔧 LocationContext: Permission result:', status);
      
      switch (status) {
        case Location.PermissionStatus.GRANTED:
          console.log('🔧 LocationContext: Permission granted');
          dispatch({ type: 'SET_HAS_PERMISSION', payload: true });
          await getCurrentLocation();
          Toast.show({
            type: 'success',
            text1: 'Location Access Granted',
            text2: 'You can now discover memories around you!',
          });
          return true;
        case Location.PermissionStatus.DENIED:
          console.log('🔧 LocationContext: Permission denied');
          dispatch({ type: 'SET_HAS_PERMISSION', payload: false });
          // Automatically show settings dialog when permission is denied
          console.log('🔧 LocationContext: Opening settings...');
          showLocationSettings();
          return false;
        default:
          console.log('🔧 LocationContext: Unknown permission result:', status);
          dispatch({ type: 'SET_HAS_PERMISSION', payload: false });
          return false;
      }
    } catch (error) {
      console.error('🔧 LocationContext: Permission request failed:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to request location permission' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getCurrentLocation = async (): Promise<LocationType | null> => {
    try {
      console.log('🔧 LocationContext: Getting current location...');
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,
        distanceInterval: 10,
      });

      const locationData: LocationType = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        altitude: location.coords.altitude,
        timestamp: location.timestamp,
      };

      console.log('🔧 LocationContext: Location obtained:', locationData);
      dispatch({ type: 'SET_CURRENT_LOCATION', payload: locationData });
      dispatch({ type: 'SET_IS_LOCATION_ENABLED', payload: true });
      dispatch({ type: 'SET_HAS_PERMISSION', payload: true });
      return locationData;
    } catch (error) {
      console.error('🔧 LocationContext: Location error:', error);
      let errorMessage = 'Failed to get current location';
      
      if (error instanceof Error) {
        if (error.message.includes('permission')) {
          errorMessage = 'Location permission denied';
          dispatch({ type: 'SET_HAS_PERMISSION', payload: false });
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Location request timed out';
        } else if (error.message.includes('unavailable')) {
          errorMessage = 'Location information unavailable';
        }
      }
      
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_IS_LOCATION_ENABLED', payload: false });
      throw new Error(errorMessage);
    }
  };

  const watchLocation = (callback: (location: LocationType) => void): void => {
    // Clear existing watcher
    if (locationWatcher) {
      try {
        locationWatcher.remove();
      } catch (error) {
        console.warn('Failed to clear location watcher:', error);
      }
    }

    const startWatching = async () => {
      try {
        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 10,
          },
          (location) => {
            const locationData: LocationType = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              accuracy: location.coords.accuracy,
              altitude: location.coords.altitude,
              timestamp: location.timestamp,
            };

            dispatch({ type: 'SET_CURRENT_LOCATION', payload: locationData });
            callback(locationData);
          }
        );

        setLocationWatcher(subscription);
      } catch (error) {
        console.error('Failed to start location watching:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Location service not available' });
      }
    };

    startWatching();
  };

  const stopWatchingLocation = (): void => {
    if (locationWatcher) {
      try {
        locationWatcher.remove();
      } catch (error) {
        console.warn('Failed to clear location watcher:', error);
      }
      setLocationWatcher(null);
    }
  };

  const showLocationSettings = async () => {
    console.log('🔧 LocationContext: showLocationSettings called');
    try {
      console.log('🔧 LocationContext: Attempting to open settings...');
      if (Platform.OS === 'ios') {
        await Linking.openURL('App-Prefs:Privacy&path=LOCATION');
      } else {
        await Linking.openSettings();
      }
      console.log('🔧 LocationContext: Settings opened successfully');
    } catch (error) {
      console.error('🔧 LocationContext: Failed to open settings:', error);
      
      // Fallback: Show alert with manual instructions
      console.log('🔧 LocationContext: Showing fallback alert...');
      Alert.alert(
        'Location Access Required',
        'Memory Lane needs location access to show you nearby memories. Please enable location access in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Open Settings', 
            onPress: async () => {
              console.log('🔧 LocationContext: User clicked "Open Settings" in alert');
              try {
                if (Platform.OS === 'ios') {
                  await Linking.openURL('App-Prefs:Privacy&path=LOCATION');
                } else {
                  await Linking.openSettings();
                }
                console.log('🔧 LocationContext: Settings opened successfully via fallback');
              } catch (linkError) {
                console.error('🔧 LocationContext: Failed to open settings via fallback:', linkError);
                Alert.alert(
                  'Settings',
                  'Please manually open your device settings and enable location access for Memory Lane.',
                  [{ text: 'OK' }]
                );
              }
            }
          },
        ]
      );
    }
  };

  const value: LocationContextType = {
    currentLocation: state.currentLocation,
    hasLocationPermission: state.hasLocationPermission,
    isLocationEnabled: state.isLocationEnabled,
    requestLocationPermission,
    getCurrentLocation,
    watchLocation,
    stopWatchingLocation,
    showLocationSettings,
    checkLocationPermission: checkLocationPermissionStatus,
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