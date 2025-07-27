import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Text, useTheme, Card, Button, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocation } from '../../store/LocationContext';
import { useMemory } from '../../store/MemoryContext';
import { useAuth } from '../../store/AuthContext';
import { ContentType } from '../../types';

interface CreateMemoryScreenProps {
  navigation?: any;
}

const CreateMemoryScreen: React.FC<CreateMemoryScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { currentLocation } = useLocation();
  const { createMemory, isLoading } = useMemory();
  const { isAuthenticated } = useAuth();
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);

  const contentTypes: Array<{
    type: ContentType;
    title: string;
    description: string;
    icon: string;
    color: string;
  }> = [
    {
      type: 'photo',
      title: 'Photo Memory',
      description: 'Capture a moment with a photo',
      icon: '📸',
      color: '#FF6B6B',
    },
    {
      type: 'video',
      title: 'Video Memory',
      description: 'Record a video memory',
      icon: '🎥',
      color: '#4ECDC4',
    },
    {
      type: 'audio',
      title: 'Audio Memory',
      description: 'Record an audio message',
      icon: '🎤',
      color: '#45B7D1',
    },
    {
      type: 'text',
      title: 'Text Memory',
      description: 'Write a text memory',
      icon: '📝',
      color: '#96CEB4',
    },
  ];

  const handleContentTypeSelect = (contentType: ContentType) => {
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please log in to create memories.');
      return;
    }

    if (!currentLocation) {
      Alert.alert(
        'Location Required',
        'Please enable location services to create memories with location tagging.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: () => navigation?.navigate('Profile') },
        ]
      );
      return;
    }

    setSelectedType(contentType);
    
    // Navigate to the appropriate creation screen
    switch (contentType) {
      case 'photo':
        navigation?.navigate('Camera');
        break;
      case 'video':
        navigation?.navigate('VideoRecorder');
        break;
      case 'audio':
        navigation?.navigate('AudioRecorder');
        break;
      case 'text':
        navigation?.navigate('TextEditor');
        break;
    }
  };

  const handleBack = () => {
    navigation?.goBack();
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
        <Text style={styles.headerTitle}>Create Memory</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>What type of memory would you like to create?</Text>
          <Text style={styles.introSubtitle}>
            Choose how you'd like to capture this special moment
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {contentTypes.map((contentType) => (
            <TouchableOpacity
              key={contentType.type}
              style={[
                styles.optionCard,
                { borderColor: contentType.color },
                selectedType === contentType.type && styles.selectedCard,
              ]}
              onPress={() => handleContentTypeSelect(contentType.type)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: contentType.color }]}>
                <Text style={styles.iconText}>{contentType.icon}</Text>
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{contentType.title}</Text>
                <Text style={styles.optionDescription}>{contentType.description}</Text>
              </View>
              <IconButton
                icon="chevron-right"
                size={20}
                iconColor={contentType.color}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>
          ))}
        </View>

        {!currentLocation && (
          <Card style={styles.locationWarning}>
            <Card.Content>
              <Text style={styles.warningTitle}>📍 Location Services Required</Text>
              <Text style={styles.warningText}>
                To create memories with location tagging, please enable location services in your device settings.
              </Text>
              <Button
                mode="outlined"
                onPress={() => navigation?.navigate('Profile')}
                style={styles.warningButton}
              >
                Go to Settings
              </Button>
            </Card.Content>
          </Card>
        )}

        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 Tips for Great Memories</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>• Add a meaningful title and description</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>• Choose the right privacy level for your content</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>• Use tags to help others discover your memories</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>• Consider the mood and atmosphere of the moment</Text>
          </View>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  headerSpacer: {
    width: 48,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  introSection: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  introSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedCard: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  arrowIcon: {
    margin: 0,
  },
  locationWarning: {
    marginBottom: 24,
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
    marginBottom: 12,
  },
  warningButton: {
    borderColor: '#856404',
  },
  tipsSection: {
    paddingVertical: 16,
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  tipItem: {
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default CreateMemoryScreen; 