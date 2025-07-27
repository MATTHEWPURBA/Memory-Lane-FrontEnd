import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  IconButton,
  useTheme,
  TextInput,
  ActivityIndicator,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocation } from '../../store/LocationContext';
import { useAuth } from '../../store/AuthContext';
import { Location } from '../../types';

interface LocationPickerScreenProps {
  navigation?: any;
  route?: {
    params: {
      onLocationSelect?: (location: Location) => void;
    };
  };
}

const LocationPickerScreen: React.FC<LocationPickerScreenProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const { currentLocation, getCurrentLocation } = useLocation();
  const { isAuthenticated } = useAuth();

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [customLocationName, setCustomLocationName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please log in to use location features.');
      navigation?.goBack();
      return;
    }

    if (currentLocation) {
      setSelectedLocation(currentLocation);
    }
  }, [isAuthenticated, currentLocation, navigation]);

  const handleGetCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const location = await getCurrentLocation();
      if (location) {
        setSelectedLocation(location);
        Alert.alert('Location Updated', 'Your current location has been updated successfully.');
      } else {
        Alert.alert('Location Error', 'Failed to get your current location. Please check your location settings.');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Location Error', 'Failed to get your current location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmLocation = () => {
    if (!selectedLocation) {
      Alert.alert('No Location', 'Please select a location first.');
      return;
    }

    const locationToSave: Location = {
      ...selectedLocation,
      location_name: customLocationName.trim() || selectedLocation.location_name,
    };

    if (route?.params?.onLocationSelect) {
      route.params.onLocationSelect(locationToSave);
    }

    Alert.alert(
      'Location Confirmed',
      `Location set to: ${locationToSave.location_name || `${locationToSave.latitude.toFixed(4)}, ${locationToSave.longitude.toFixed(4)}`}`,
      [
        {
          text: 'OK',
          onPress: () => navigation?.goBack(),
        },
      ]
    );
  };

  const handleBack = () => {
    if (selectedLocation) {
      Alert.alert(
        'Discard Location?',
        'You have selected a location. Are you sure you want to leave without confirming?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation?.goBack() },
        ]
      );
    } else {
      navigation?.goBack();
    }
  };

  const formatCoordinates = (latitude: number, longitude: number) => {
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  };

  const getLocationAccuracy = (accuracy?: number) => {
    if (!accuracy) return 'Unknown';
    if (accuracy <= 5) return 'Excellent';
    if (accuracy <= 10) return 'Good';
    if (accuracy <= 20) return 'Fair';
    return 'Poor';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={handleBack}
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Select Location</Text>
        <IconButton
          icon="check"
          size={24}
          onPress={handleConfirmLocation}
          disabled={!selectedLocation}
          style={styles.confirmButton}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.infoTitle}>📍 Location for Your Memory</Text>
            <Text style={styles.infoText}>
              Choose where this memory took place. This helps others discover your memories and adds context to your story.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.locationCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Current Location</Text>
            
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Getting your location...</Text>
              </View>
            ) : selectedLocation ? (
              <View style={styles.locationInfo}>
                <View style={styles.coordinatesContainer}>
                  <Text style={styles.coordinatesLabel}>Coordinates:</Text>
                  <Text style={styles.coordinatesText}>
                    {formatCoordinates(selectedLocation.latitude, selectedLocation.longitude)}
                  </Text>
                </View>

                {selectedLocation.accuracy && (
                  <View style={styles.accuracyContainer}>
                    <Text style={styles.accuracyLabel}>Accuracy:</Text>
                    <Text style={styles.accuracyText}>
                      {getLocationAccuracy(selectedLocation.accuracy)} (±{selectedLocation.accuracy}m)
                    </Text>
                  </View>
                )}

                {selectedLocation.altitude && (
                  <View style={styles.altitudeContainer}>
                    <Text style={styles.altitudeLabel}>Altitude:</Text>
                    <Text style={styles.altitudeText}>
                      {selectedLocation.altitude.toFixed(0)}m above sea level
                    </Text>
                  </View>
                )}

                <View style={styles.timestampContainer}>
                  <Text style={styles.timestampLabel}>Last Updated:</Text>
                  <Text style={styles.timestampText}>
                    {new Date(selectedLocation.timestamp).toLocaleString()}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.noLocationContainer}>
                <IconButton icon="map-marker-off" size={48} iconColor="#999" />
                <Text style={styles.noLocationText}>No location available</Text>
                <Text style={styles.noLocationSubtext}>
                  Please enable location services to get your current location.
                </Text>
              </View>
            )}

            <Button
              mode="contained"
              onPress={handleGetCurrentLocation}
              disabled={isLoading}
              style={styles.updateLocationButton}
              icon="crosshairs-gps"
            >
              {isLoading ? 'Getting Location...' : 'Update Location'}
            </Button>
          </Card.Content>
        </Card>

        {selectedLocation && (
          <Card style={styles.customLocationCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Custom Location Name</Text>
              <Text style={styles.customLocationText}>
                Give this location a memorable name (optional)
              </Text>
              
              <TextInput
                mode="outlined"
                value={customLocationName}
                onChangeText={setCustomLocationName}
                placeholder="e.g., Central Park, Coffee Shop, Home"
                style={styles.locationNameInput}
                maxLength={100}
              />
              
              <Text style={styles.locationNameHint}>
                This name will be displayed with your memory
              </Text>
            </Card.Content>
          </Card>
        )}

        <Card style={styles.tipsCard}>
          <Card.Content>
            <Text style={styles.tipsTitle}>💡 Location Tips</Text>
            <View style={styles.tipItem}>
              <Text style={styles.tipText}>• Enable location services for accurate positioning</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipText}>• Add a custom name to make locations more memorable</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipText}>• Location helps others discover your memories nearby</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipText}>• You can always change the location later</Text>
            </View>
          </Card.Content>
        </Card>

        {selectedLocation && (
          <View style={styles.confirmSection}>
            <Button
              mode="contained"
              onPress={handleConfirmLocation}
              style={styles.confirmLocationButton}
              icon="check-circle"
            >
              Confirm Location
            </Button>
            <Text style={styles.confirmText}>
              This location will be saved with your memory
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    margin: 0,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  confirmButton: {
    margin: 0,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    marginBottom: 16,
    backgroundColor: '#e3f2fd',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1976d2',
  },
  infoText: {
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 20,
  },
  locationCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  locationInfo: {
    marginBottom: 16,
  },
  coordinatesContainer: {
    marginBottom: 12,
  },
  coordinatesLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  coordinatesText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'monospace',
  },
  accuracyContainer: {
    marginBottom: 12,
  },
  accuracyLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  accuracyText: {
    fontSize: 14,
    color: '#666',
  },
  altitudeContainer: {
    marginBottom: 12,
  },
  altitudeLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  altitudeText: {
    fontSize: 14,
    color: '#666',
  },
  timestampContainer: {
    marginBottom: 12,
  },
  timestampLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  timestampText: {
    fontSize: 14,
    color: '#666',
  },
  noLocationContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noLocationText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  noLocationSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 4,
  },
  updateLocationButton: {
    marginTop: 8,
  },
  customLocationCard: {
    marginBottom: 16,
  },
  customLocationText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  locationNameInput: {
    marginBottom: 8,
  },
  locationNameHint: {
    fontSize: 12,
    color: '#999',
  },
  tipsCard: {
    marginBottom: 16,
    backgroundColor: '#fff3cd',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#856404',
  },
  tipItem: {
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  confirmSection: {
    alignItems: 'center',
    marginTop: 16,
  },
  confirmLocationButton: {
    marginBottom: 8,
  },
  confirmText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default LocationPickerScreen; 