import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Platform,
  Dimensions,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Text, useTheme, Button, Card, Chip, ActivityIndicator, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Callout } from '../../components/MapView.native.js';
import { useLocation } from '../../store/LocationContext';
import { useMemory } from '../../store/MemoryContext';
import { useAuth } from '../../store/AuthContext';
import { Memory, Location, NearbyMemory } from '../../types';
import apiService from '../../services/api';

const { width, height } = Dimensions.get('window');

interface MapScreenProps {
  navigation?: any;
}

const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { currentLocation, hasLocationPermission, requestLocationPermission, getCurrentLocation, showLocationSettings, checkLocationPermission } = useLocation();
  const { nearbyMemories, getNearbyMemories, isLoading, error } = useMemory();
  const { isAuthenticated } = useAuth();
  
  const [selectedMemory, setSelectedMemory] = useState<NearbyMemory | null>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 40.7128,
    longitude: -74.0060,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [searchRadius, setSearchRadius] = useState(0.5); // 500 meters
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showLocationButton, setShowLocationButton] = useState(true);
  
  const mapRef = useRef<any>(null);

  // Initialize map with user's location
  useEffect(() => {
    if (currentLocation) {
      const newRegion = {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setMapRegion(newRegion);
      
      // Fetch nearby memories when location changes
      fetchNearbyMemories();
    }
  }, [currentLocation]);

  // Request location permission on mount
  useEffect(() => {
    console.log('🔧 MapScreen useEffect - hasLocationPermission:', hasLocationPermission);
    if (!hasLocationPermission) {
      console.log('🔧 No location permission, requesting...');
      // Try to request permission first
      requestLocationPermission().then((granted) => {
        console.log('🔧 Initial permission request result:', granted);
        if (!granted) {
          console.log('🔧 Initial permission denied, opening settings...');
          // If permission was denied, automatically open settings
          showLocationSettings();
        }
      });
    } else if (!currentLocation) {
      console.log('🔧 Has permission but no location, getting current location...');
      getCurrentLocation();
    }
  }, [hasLocationPermission]);

  const fetchNearbyMemories = useCallback(async () => {
    if (!currentLocation || !isAuthenticated) return;
    
    try {
      await getNearbyMemories(currentLocation, searchRadius);
    } catch (error) {
      console.error('Failed to fetch nearby memories:', error);
      Alert.alert(
        'Error',
        'Failed to load nearby memories. Please try again.',
        [{ text: 'OK' }]
      );
    }
  }, [currentLocation, searchRadius, isAuthenticated]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchNearbyMemories();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleMemoryPress = (memory: NearbyMemory) => {
    setSelectedMemory(memory);
    if (navigation) {
      navigation.navigate('MemoryDetail', { memoryId: memory.memory_id });
    }
  };

  const handleMapPress = () => {
    setSelectedMemory(null);
  };

  const centerOnUserLocation = () => {
    if (currentLocation && mapRef.current) {
      const newRegion = {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setMapRegion(newRegion);
      setShowLocationButton(false);
      setTimeout(() => setShowLocationButton(true), 2000);
    }
  };

  const handleRadiusChange = (newRadius: number) => {
    setSearchRadius(newRadius);
    fetchNearbyMemories();
  };

  const getMarkerColor = (memory: NearbyMemory) => {
    switch (memory.content_type) {
      case 'photo':
        return '#FF6B6B';
      case 'video':
        return '#4ECDC4';
      case 'audio':
        return '#45B7D1';
      case 'text':
        return '#96CEB4';
      default:
        return '#FFA500';
    }
  };

  const formatDistance = (distanceKm: number) => {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}m`;
    }
    return `${distanceKm.toFixed(1)}km`;
  };

  const renderMemoryMarker = (memory: NearbyMemory) => (
    <Marker
      key={memory.memory_id}
      coordinate={{
        latitude: memory.latitude,
        longitude: memory.longitude,
      }}
      pinColor={getMarkerColor(memory)}
      onPress={() => handleMemoryPress(memory)}
    >
      <Callout>
        <View style={styles.calloutContainer}>
          <Text style={styles.calloutTitle} numberOfLines={1}>
            {memory.title}
          </Text>
          <Text style={styles.calloutDistance}>
            {formatDistance(memory.distance_km || 0)}
          </Text>
          <View style={styles.calloutStats}>
            <Text style={styles.calloutStat}>❤️ {memory.likes_count}</Text>
            <Text style={styles.calloutStat}>💬 {memory.comments_count}</Text>
          </View>
        </View>
      </Callout>
    </Marker>
  );

  const renderRadiusSelector = () => (
    <View style={styles.radiusSelector}>
      <Text style={styles.radiusLabel}>Search Radius</Text>
      <View style={styles.radiusButtons}>
        {[0.1, 0.5, 1.0, 2.0].map((radius) => (
          <Chip
            key={radius}
            selected={searchRadius === radius}
            onPress={() => handleRadiusChange(radius)}
            style={styles.radiusChip}
            textStyle={styles.radiusChipText}
          >
            {radius}km
          </Chip>
        ))}
      </View>
    </View>
  );

  const renderLocationButton = () => (
    <TouchableOpacity
      style={styles.locationButton}
      onPress={centerOnUserLocation}
      disabled={!currentLocation}
    >
      <IconButton
        icon="crosshairs-gps"
        size={24}
        iconColor={theme.colors.primary}
      />
    </TouchableOpacity>
  );

  const handleLocationPermissionRequest = async () => {
    console.log('🔧 Location permission button clicked');
    try {
      console.log('🔧 Attempting to request location permission...');
      // First try to request permission
      const granted = await requestLocationPermission();
      console.log('🔧 Permission request result:', granted);
      
      if (!granted) {
        console.log('🔧 Permission denied, opening settings...');
        // If permission was denied, open settings
        await showLocationSettings();
        console.log('🔧 Settings opened successfully');
      } else {
        console.log('🔧 Permission granted successfully!');
      }
    } catch (error) {
      console.error('🔧 Location permission request failed:', error);
      console.log('🔧 Fallback: opening settings directly...');
      // Fallback: open settings directly
      await showLocationSettings();
      console.log('🔧 Settings opened via fallback');
    }
  };

  const handleRefreshPermissions = async () => {
    console.log('🔧 Manually refreshing location permissions...');
    await checkLocationPermission();
  };

  const renderPermissionRequest = () => (
    <View style={styles.permissionContainer}>
      <Text style={styles.permissionTitle}>Location Access Required</Text>
      <Text style={styles.permissionText}>
        Memory Lane needs location access to show you nearby memories and help you discover new places.
      </Text>
      <Button
        mode="contained"
        onPress={handleLocationPermissionRequest}
        style={styles.permissionButton}
      >
        Enable Location Access
      </Button>
      <Button
        mode="outlined"
        onPress={handleRefreshPermissions}
        style={[styles.permissionButton, { marginTop: 12 }]}
      >
        Refresh Permissions
      </Button>
    </View>
  );

  const renderLoadingOverlay = () => (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.loadingText}>Loading nearby memories...</Text>
    </View>
  );

  const renderErrorOverlay = () => (
    <View style={styles.errorOverlay}>
      <Text style={styles.errorText}>{error}</Text>
      <Button mode="contained" onPress={fetchNearbyMemories}>
        Retry
      </Button>
    </View>
  );

  const renderMemoryCount = () => (
    <View style={styles.memoryCountContainer}>
      <Text style={styles.memoryCountText}>
        {nearbyMemories.length} memories nearby
      </Text>
    </View>
  );

  if (!hasLocationPermission) {
    return (
      <SafeAreaView style={styles.container}>
        {renderPermissionRequest()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Map View</Text>
        {renderMemoryCount()}
      </View>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={mapRegion}
          onPress={handleMapPress}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
          showsBuildings={true}
          showsTraffic={false}
          showsIndoors={true}
          loadingEnabled={true}
          loadingIndicatorColor={theme.colors.primary}
          loadingBackgroundColor={theme.colors.surface}
        >
          {nearbyMemories.map(renderMemoryMarker)}
        </MapView>

        {renderLocationButton()}
        {renderRadiusSelector()}
      </View>

      {isLoading && renderLoadingOverlay()}
      {error && renderErrorOverlay()}

      <ScrollView
        style={styles.controlsContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {selectedMemory && (
          <Card style={styles.selectedMemoryCard}>
            <Card.Content>
              <Text style={styles.selectedMemoryTitle}>{selectedMemory.title}</Text>
              {selectedMemory.description && (
                <Text style={styles.selectedMemoryDescription} numberOfLines={2}>
                  {selectedMemory.description}
                </Text>
              )}
              <View style={styles.selectedMemoryStats}>
                <Text style={styles.selectedMemoryStat}>
                  📍 {formatDistance(selectedMemory.distance_km || 0)} away
                </Text>
                <Text style={styles.selectedMemoryStat}>
                  ❤️ {selectedMemory.likes_count} likes
                </Text>
                <Text style={styles.selectedMemoryStat}>
                  💬 {selectedMemory.comments_count} comments
                </Text>
              </View>
              <Button
                mode="outlined"
                onPress={() => handleMemoryPress(selectedMemory)}
                style={styles.viewMemoryButton}
              >
                View Memory
              </Button>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  locationButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  radiusSelector: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  radiusLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    color: '#666',
  },
  radiusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  radiusChip: {
    marginRight: 4,
  },
  radiusChipText: {
    fontSize: 11,
  },
  memoryCountContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
  memoryCountText: {
    fontSize: 14,
    color: '#666',
  },
  controlsContainer: {
    maxHeight: 200,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  selectedMemoryCard: {
    marginBottom: 8,
  },
  selectedMemoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  selectedMemoryDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  selectedMemoryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  selectedMemoryStat: {
    fontSize: 12,
    color: '#888',
  },
  viewMemoryButton: {
    marginTop: 8,
  },
  calloutContainer: {
    width: 150,
    padding: 8,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  calloutDistance: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  calloutStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calloutStat: {
    fontSize: 10,
    color: '#888',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  permissionButton: {
    paddingHorizontal: 24,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default MapScreen; 