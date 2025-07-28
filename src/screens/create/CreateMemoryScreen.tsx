import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Text, useTheme, Card, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

// Web-specific IconButton import to avoid font loading issues
const IconButton = Platform.OS === 'web' 
  ? require('../../utils/webPolyfills/IconButtonPolyfill').default
  : require('react-native-paper').IconButton;

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
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.primary }]}>
          Create Memory
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Choose how you want to capture your memory:</Text>
        
        <View style={styles.grid}>
          {contentTypes.map((item) => (
            <TouchableOpacity
              key={item.type}
              style={[
                styles.card,
                { backgroundColor: item.color + '20' },
                selectedType === item.type && styles.selectedCard,
              ]}
              onPress={() => handleContentTypeSelect(item.type)}
            >
              <Text style={styles.cardIcon}>{item.icon}</Text>
              <Text style={[styles.cardTitle, { color: item.color }]}>
                {item.title}
              </Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </TouchableOpacity>
          ))}
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
  backButtonText: {
    fontSize: 16,
    color: '#333',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  placeholder: {
    width: 48,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%', // Adjust as needed for 2 columns
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedCard: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default CreateMemoryScreen; 