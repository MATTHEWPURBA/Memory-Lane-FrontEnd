import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

// For React Native, we'll use a placeholder that can be replaced with react-native-maps
// In a real implementation, you would import from 'react-native-maps'
const MapView = ({ 
  children, 
  region, 
  onPress, 
  showsUserLocation = true,
  showsMyLocationButton = false,
  showsCompass = true,
  showsScale = true,
  showsBuildings = true,
  showsTraffic = false,
  showsIndoors = true,
  loadingEnabled = true,
  loadingIndicatorColor,
  loadingBackgroundColor,
  style,
  ...props 
}) => {
  // Placeholder implementation for development
  return (
    <View style={[styles.container, style]} {...props}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>🗺️ Interactive Map</Text>
        <Text style={styles.coordinatesText}>
          Lat: {region?.latitude?.toFixed(4) || 'N/A'}
        </Text>
        <Text style={styles.coordinatesText}>
          Lon: {region?.longitude?.toFixed(4) || 'N/A'}
        </Text>
        <Text style={styles.instructionText}>
          Tap to interact • {children?.length || 0} markers
        </Text>
      </View>
      {children}
    </View>
  );
};

const Marker = ({ 
  coordinate, 
  pinColor = '#FF6B6B',
  onPress,
  children,
  ...props 
}) => {
  return (
    <View 
      style={[
        styles.marker, 
        { 
          left: `${((coordinate.longitude + 180) / 360) * 100}%`,
          top: `${((90 - coordinate.latitude) / 180) * 100}%`,
          backgroundColor: pinColor 
        }
      ]}
      onTouchEnd={onPress}
      {...props}
    >
      {children}
    </View>
  );
};

const Callout = ({ children, ...props }) => {
  return (
    <View style={styles.callout} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#e8f4fd',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2196F3',
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  mapText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  coordinatesText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  instructionText: {
    fontSize: 10,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  marker: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  callout: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 120,
    maxWidth: 200,
  },
});

export default MapView;
export { Marker, Callout };