import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
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
  ActivityIndicator,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchCamera, launchImageLibrary, ImagePickerResponse, MediaType, PhotoQuality } from 'react-native-image-picker';
import { useLocation } from '../../store/LocationContext';
import { useMemory } from '../../store/MemoryContext';
import { useAuth } from '../../store/AuthContext';
import { CreateMemoryRequest, PrivacyLevel } from '../../types';

// Web-specific IconButton import to avoid font loading issues
const IconButton = Platform.OS === 'web' 
  ? require('../../utils/webPolyfills/IconButtonPolyfill').default
  : require('react-native-paper').IconButton;

interface CameraScreenProps {
  navigation?: any;
}

const CameraScreen: React.FC<CameraScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { currentLocation } = useLocation();
  const { createMemory, isLoading } = useMemory();
  const { isAuthenticated } = useAuth();

  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>('public');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [mood, setMood] = useState('');
  const [isUploading, setIsUploading] = useState(false);

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

  const handleTakePhoto = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8 as PhotoQuality,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        Alert.alert('Error', 'Failed to take photo. Please try again.');
        return;
      }
      if (response.assets && response.assets[0]) {
        setSelectedImage(response.assets[0]);
      }
    });
  };

  const handleSelectFromGallery = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8 as PhotoQuality,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        Alert.alert('Error', 'Failed to select image. Please try again.');
        return;
      }
      if (response.assets && response.assets[0]) {
        setSelectedImage(response.assets[0]);
      }
    });
  };

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
    if (!selectedImage) {
      Alert.alert('Photo Required', 'Please take or select a photo.');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Title Required', 'Please enter a title for your memory.');
      return;
    }

    if (!currentLocation) {
      Alert.alert('Location Required', 'Location is required to create memories.');
      return;
    }

    setIsUploading(true);

    try {
      // In a real app, you would upload the image to your server first
      // For now, we'll simulate the upload process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const memoryData: CreateMemoryRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
        content_type: 'photo',
        content_url: selectedImage.uri, // In real app, this would be the uploaded URL
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        location_name: currentLocation.location_name,
        privacy_level: privacyLevel,
        category_tags: tags,
        mood: mood || undefined,
        content_size: selectedImage.fileSize,
        media_format: selectedImage.type,
      };

      const newMemory = await createMemory(memoryData);
      
      Alert.alert(
        'Success!',
        'Your photo memory has been created successfully.',
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
              setSelectedImage(null);
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
    } finally {
      setIsUploading(false);
    }
  };

  const handleBack = () => {
    if (selectedImage || title.trim() || description.trim()) {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={handleBack}
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Create Photo Memory</Text>
        <IconButton
          icon="content-save"
          size={24}
          onPress={handleSave}
          disabled={!selectedImage || !title.trim() || isLoading || isUploading}
          style={styles.saveButton}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!selectedImage ? (
          <Card style={styles.photoSelectionCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Choose a Photo</Text>
              <Text style={styles.sectionSubtitle}>
                Take a new photo or select one from your gallery
              </Text>
              
              <View style={styles.photoButtonsContainer}>
                <TouchableOpacity
                  style={styles.photoButton}
                  onPress={handleTakePhoto}
                >
                  <IconButton icon="camera" size={32} iconColor="#007AFF" />
                  <Text style={styles.photoButtonText}>Take Photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.photoButton}
                  onPress={handleSelectFromGallery}
                >
                  <IconButton icon="image" size={32} iconColor="#007AFF" />
                  <Text style={styles.photoButtonText}>Gallery</Text>
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>
        ) : (
          <Card style={styles.imagePreviewCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Photo Preview</Text>
              <Image
                source={{ uri: selectedImage.uri }}
                style={styles.imagePreview}
                resizeMode="cover"
              />
              <Button
                mode="outlined"
                onPress={() => setSelectedImage(null)}
                style={styles.changePhotoButton}
              >
                Change Photo
              </Button>
            </Card.Content>
          </Card>
        )}

        {selectedImage && (
          <>
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
                  placeholder="Share the story behind this photo..."
                  multiline
                  numberOfLines={4}
                  maxLength={500}
                  style={styles.descriptionInput}
                />
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
          </>
        )}

        {isUploading && (
          <Card style={styles.uploadingCard}>
            <Card.Content>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.uploadingText}>Uploading photo...</Text>
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
  saveButton: {
    margin: 0,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  photoSelectionCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  photoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  photoButton: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    minWidth: 120,
  },
  photoButtonText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  imagePreviewCard: {
    marginBottom: 16,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  changePhotoButton: {
    marginTop: 8,
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
  uploadingCard: {
    marginTop: 16,
    alignItems: 'center',
  },
  uploadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});

export default CameraScreen; 