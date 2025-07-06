import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Logger from '@/utils/logger';

const { width, height } = Dimensions.get('window');

const SplashScreen: React.FC = () => {
  const theme = useTheme();

  useEffect(() => {
    logSplashScreenMount();
  }, []);

  const logSplashScreenMount = async () => {
    try {
      await Logger.logInfo('SplashScreen mounted', {
        themeLoaded: !!theme,
        themeColors: theme.colors,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      await Logger.logError(error, { context: 'SplashScreen Mount' });
    }
  };

  const containerStyle = Platform.select({
    web: {
      ...styles.container,
      background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
    },
    default: {
      ...styles.container,
      backgroundColor: theme.colors.primary,
    },
  });

  return (
    <View style={containerStyle}>
      <View style={styles.content}>
        {/* App Icon */}
        <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
          <Icon 
            name="map-marker" 
            size={80} 
            color={theme.colors.onPrimary} 
          />
        </View>

        {/* App Name */}
        <Text style={[styles.appName, { color: theme.colors.onPrimary }]}>Memory Lane</Text>
        
        {/* Tagline */}
        <Text style={[styles.tagline, { color: theme.colors.onPrimary }]}>
          Capture moments, discover memories
        </Text>

        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <View style={[styles.loadingDot, { backgroundColor: theme.colors.onPrimary }]} />
          <View style={[styles.loadingDot, { backgroundColor: theme.colors.onPrimary, opacity: 0.8 }]} />
          <View style={[styles.loadingDot, { backgroundColor: theme.colors.onPrimary, opacity: 0.6 }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 5,
      },
    }),
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 48,
    paddingHorizontal: 32,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default SplashScreen; 