import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StatusBar, View, Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { AuthProvider } from '@/store/AuthContext';
import { LocationProvider } from '@/store/LocationContext';
import { MemoryProvider } from '@/store/MemoryContext';
import { theme } from '@/constants/theme';
import RootNavigator from '@/navigation/RootNavigator';
import ErrorReportingClass from '@/utils/error-reporting';
const ErrorReporting = ErrorReportingClass.getInstance();
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
      
      // Initialize error reporting
      await Logger.logInfo('Initializing error reporting');
      // ErrorReporting is already initialized

      // Load persisted logs
      await Logger.logInfo('Loading persisted logs');
      await Logger.loadPersistedLogs();
      
      // Log app start
      await Logger.logInfo('Logging app start');
      await Logger.logAppStart();

      // Preload assets
      await Logger.logInfo('Preloading assets');
      await AssetLoader.preloadAssets();

      await Logger.logInfo('App initialization completed successfully');
      setIsLoading(false);
    } catch (error) {
      await Logger.logError(error, { context: 'App Initialization' });
      await ErrorReporting.reportError(error);
      setError(error);
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
                    Logger.logNavigationEvent(currentRoute.name, currentRoute.params);
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