import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

const LoadingDot = ({ delay }: { delay: number }) => {
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0.6,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(animation).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.loadingDot,
        {
          opacity,
        },
      ]}
    />
  );
};

const SplashScreen: React.FC = () => {
  const themeColors = useTheme();

  return (
    <LinearGradient
      colors={theme.colors.gradient.primary}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* App Icon */}
        <View style={styles.iconContainer}>
          <Icon 
            name="map-marker" 
            size={80} 
            color={themeColors.colors.onPrimary} 
          />
        </View>

        {/* App Name */}
        <Text style={styles.appName}>Memory Lane</Text>
        
        {/* Tagline */}
        <Text style={styles.tagline}>
          Capture moments, discover memories
        </Text>

        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <LoadingDot delay={0} />
          <LoadingDot delay={200} />
          <LoadingDot delay={400} />
        </View>
      </View>
    </LinearGradient>
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    ...theme.shadows.large,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
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
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
  },
});

export default SplashScreen; 