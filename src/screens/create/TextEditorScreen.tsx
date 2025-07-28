import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Chip,
  useTheme,
  SegmentedButtons,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

// Web-specific IconButton import to avoid font loading issues
const IconButton = Platform.OS === 'web' 
  ? require('../../utils/webPolyfills/IconButtonPolyfill').default
  : require('react-native-paper').IconButton;

import { useLocation } from '../../store/LocationContext';
import { useMemory } from '../../store/MemoryContext';
import { useAuth } from '../../store/AuthContext';
import { CreateMemoryRequest, PrivacyLevel } from '../../types';

interface TextEditorScreenProps {
  navigation?: any;
}

const TextEditorScreen: React.FC<TextEditorScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { currentLocation } = useLocation();
  const { createMemory, isLoading } = useMemory();
  const { isAuthenticated } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>('public');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [mood, setMood] = useState('');

  const moodOptions = [
    'Happy', 'Excited', 'Peaceful', 'Nostalgic', 'Inspired', 
    'Grateful', 'Adventurous', 'Relaxed', 'Energetic', 'Thoughtful'
  ];

  const privacyOptions = [
    { value: 'public', label: 'Public', icon: 'earth' },
    { value: 'friends', label: 'Friends', icon: 'account-group' },
    { value: 'private', label: 'Private', icon: 'lock' },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please log in to create memories.');
      navigation?.goBack();
      return;
    }

    if (!currentLocation) {
      Alert.alert(
        'Location Required',
        'Location is required to create memories. Please enable location services.',
        [{ text: 'OK', onPress: () => navigation?.goBack() }]
      );
    }
  }, [isAuthenticated, currentLocation, navigation]);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Title Required', 'Please enter a title for your memory.');
      return;
    }

    if (!currentLocation) {
      Alert.alert('Location Required', 'Location is required to create memories.');
      return;
    }

    try {
      const memoryData: CreateMemoryRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
        content_type: 'text',
        content_text: description.trim(),
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        location_name: currentLocation.location_name,
        privacy_level: privacyLevel,
        category_tags: tags,
        mood: mood || undefined,
      };

      const newMemory = await createMemory(memoryData);
      
      Alert.alert(
        'Success!',
        'Your memory has been created successfully.',
        [
          {
            text: 'View Memory',
            onPress: () => {
              navigation?.navigate('MemoryPreview', { memory: newMemory });
            },
          },
          {
            text: 'Create Another',
            onPress: () => {
              setTitle('');
              setDescription('');
              setTags([]);
              setMood('');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error creating memory:', error);
      Alert.alert('Error', 'Failed to create memory. Please try again.');
    }
  };

  const handleBack = () => {
    if (title.trim() || description.trim()) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to leave?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation?.goBack() },
        ]
      );
    } else {
      navigation?.goBack();
    }
  };

  const characterCount = description.length;
  const maxCharacters = 1000;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={handleBack}
            style={styles.backButton}
          />
          <Text style={styles.headerTitle}>Create Text Memory</Text>
          <IconButton
            icon="content-save"
            size={24}
            onPress={handleSave}
            disabled={!title.trim() || isLoading}
            style={styles.saveButton}
          />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Card style={styles.inputCard}>
            <Card.Content>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                mode="outlined"
                value={title}
                onChangeText={setTitle}
                placeholder="Give your memory a title..."
                maxLength={100}
                style={styles.titleInput}
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                mode="outlined"
                value={description}
                onChangeText={setDescription}
                placeholder="Share the story behind this memory..."
                multiline
                numberOfLines={6}
                maxLength={maxCharacters}
                style={styles.descriptionInput}
              />
              <Text style={styles.characterCount}>
                {characterCount}/{maxCharacters} characters
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.inputCard}>
            <Card.Content>
              <Text style={styles.label}>Privacy Level</Text>
              <SegmentedButtons
                value={privacyLevel}
                onValueChange={setPrivacyLevel as (value: string) => void}
                buttons={privacyOptions}
                style={styles.privacyButtons}
              />
            </Card.Content>
          </Card>

          <Card style={styles.inputCard}>
            <Card.Content>
              <Text style={styles.label}>Tags</Text>
              <View style={styles.tagInputContainer}>
                <TextInput
                  mode="outlined"
                  value={newTag}
                  onChangeText={setNewTag}
                  placeholder="Add a tag..."
                  onSubmitEditing={handleAddTag}
                  style={styles.tagInput}
                />
                <Button
                  mode="contained"
                  onPress={handleAddTag}
                  disabled={!newTag.trim()}
                  style={styles.addTagButton}
                >
                  Add
                </Button>
              </View>
              {tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {tags.map((tag, index) => (
                    <Chip
                      key={index}
                      onClose={() => handleRemoveTag(tag)}
                      style={styles.tagChip}
                    >
                      {tag}
                    </Chip>
                  ))}
                </View>
              )}
            </Card.Content>
          </Card>

          <Card style={styles.inputCard}>
            <Card.Content>
              <Text style={styles.label}>Mood</Text>
              <View style={styles.moodContainer}>
                {moodOptions.map((moodOption) => (
                  <Chip
                    key={moodOption}
                    selected={mood === moodOption}
                    onPress={() => setMood(mood === moodOption ? '' : moodOption)}
                    style={styles.moodChip}
                  >
                    {moodOption}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>

          {currentLocation && (
            <Card style={styles.locationCard}>
              <Card.Content>
                <Text style={styles.label}>Location</Text>
                <Text style={styles.locationText}>
                  📍 {currentLocation.location_name || `${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`}
                </Text>
              </Card.Content>
            </Card>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
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
  saveButton: {
    margin: 0,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputCard: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  titleInput: {
    marginBottom: 16,
  },
  descriptionInput: {
    marginBottom: 8,
  },
  characterCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  privacyButtons: {
    marginTop: 8,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tagInput: {
    flex: 1,
    marginRight: 8,
  },
  addTagButton: {
    marginLeft: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    marginBottom: 4,
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  moodChip: {
    marginBottom: 4,
  },
  locationCard: {
    backgroundColor: '#e8f5e8',
  },
  locationText: {
    fontSize: 14,
    color: '#2e7d32',
    marginTop: 4,
  },
});

export default TextEditorScreen; 