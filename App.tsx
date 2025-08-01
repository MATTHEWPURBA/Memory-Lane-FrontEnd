import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StatusBar, View, Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

// Import global font polyfill for web
import './src/utils/webPolyfills/GlobalFontPolyfill';

// Add debug logging for font loading
if (typeof window !== 'undefined') {
  console.log('🔍 App.tsx: Setting up font debugging');
  
  // Set up global polyfills IMMEDIATELY
  (window as any)._ExpoFontLoader = {
    default: {
      isLoaded: (fontFamily) => {
        console.log('🔍 Global _ExpoFontLoader.default.isLoaded() called with:', fontFamily);
        return true;
      },
      loadAsync: async (fontMap) => {
        console.log('🔍 Global _ExpoFontLoader.default.loadAsync() called');
        return Promise.resolve();
      },
    },
  };

  (window as any).ExpoFontLoader = {
    isLoaded: (fontFamily) => {
      console.log('🔍 Global ExpoFontLoader.isLoaded() called with:', fontFamily);
      return true;
    },
    loadAsync: async (fontMap) => {
      console.log('🔍 Global ExpoFontLoader.loadAsync() called');
      return Promise.resolve();
    },
  };

  (window as any).Font = {
    loadAsync: async (fontMap) => {
      console.log('🔍 Global Font.loadAsync() called');
      return Promise.resolve();
    },
    isLoaded: (fontFamily) => {
      console.log('🔍 Global Font.isLoaded() called with:', fontFamily);
      return true;
    },
  };
}

import { AuthProvider } from '@/store/AuthContext';
import { LocationProvider } from '@/store/LocationContext';
import { MemoryProvider } from '@/store/MemoryContext';
import { theme } from '@/constants/theme';
import RootNavigator from '@/navigation/RootNavigator';
import ErrorReporter from '@/utils/error-reporting';
import Logger from '@/utils/logger';
import AssetLoader from '@/utils/asset-loader';
import SplashScreen from '@/components/SplashScreen';
import ErrorBoundary from '@/components/ErrorBoundary';

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await Logger.logInfo('Starting app initialization');
      
      // Completely skip font loading on web to avoid font loading errors
      if (Platform.OS !== 'web') {
        try {
          await Logger.logInfo('Loading fonts');
          const Font = require('expo-font');
          const { Ionicons } = require('@expo/vector-icons');
          await Font.loadAsync({
            ...Ionicons.font,
          });
        } catch (fontError) {
          await Logger.logWarn('Font loading failed, continuing without custom fonts', { fontError });
        }
      } else {
        await Logger.logInfo('Skipping font loading on web platform to avoid font loading errors');
        // The global polyfills are now set up at the top of the file
      }
      
      // Initialize error reporting
      await Logger.logInfo('Initializing error reporting');
      ErrorReporter.setupGlobalErrorHandler();
      
      // Log app start
      await Logger.logInfo('Logging app start');
      await Logger.logInfo('App started successfully');

      // Preload assets
      await Logger.logInfo('Preloading assets');
      await AssetLoader.preloadAssets();

      await Logger.logInfo('App initialization completed successfully');
      setIsLoading(false);
    } catch (error) {
      await Logger.logError(error, { context: 'App Initialization' });
      await ErrorReporter.reportError(error as Error, 'App Initialization');
      setError(error as Error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const observer = new MutationObserver(() => {
        console.log('document.title changed to:', document.title);
      });
      observer.observe(document.querySelector('title')!, { childList: true });
      return () => observer.disconnect();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.title !== 'Memory Lane') {
        document.title = 'Memory Lane';
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    // Show error state
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'red', marginBottom: 10 }}>Error: {error.message}</Text>
        <Text style={{ color: 'gray' }}>Check the console for more details</Text>
      </View>
    );
  }

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <LocationProvider>
            <MemoryProvider>
              <NavigationContainer
                onStateChange={(state) => {
                  const currentRoute = state?.routes[state.routes.length - 1];
                  if (currentRoute) {
                    Logger.logNavigation(currentRoute.name, currentRoute.name, currentRoute.params);
                  }
                }}
              >
                {Platform.OS !== 'web' && (
                  <StatusBar
                    barStyle="light-content"
                    backgroundColor={theme.colors.primary}
                  />
                )}
                <RootNavigator />
                <Toast />
              </NavigationContainer>
            </MemoryProvider>
          </LocationProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

const App = () => {
  useEffect(() => {
    // @ts-ignore
    if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
      console.log('Setting document.title to Memory Lane')
      document.title = 'Memory Lane';

    }
  }, []);
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
};

export default App; 