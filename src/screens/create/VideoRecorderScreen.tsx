import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
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

// Web-specific IconButton import to avoid font loading issues
const IconButton = Platform.OS === 'web' 
  ? require('../../utils/webPolyfills/IconButtonPolyfill').default
  : require('react-native-paper').IconButton;

import { launchCamera, launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { useLocation } from '../../store/LocationContext';
import { useMemory } from '../../store/MemoryContext';
import { useAuth } from '../../store/AuthContext';
import { CreateMemoryRequest, PrivacyLevel } from '../../types';

interface VideoRecorderScreenProps {
  navigation?: any;
}

const VideoRecorderScreen: React.FC<VideoRecorderScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { currentLocation } = useLocation();
  const { createMemory, isLoading } = useMemory();
  const { isAuthenticated } = useAuth();

  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>('public');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [mood, setMood] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

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

  const handleStartRecording = () => {
    // In a real app, you would use a library like react-native-video-recorder
    // For now, we'll simulate recording
    setIsRecording(true);
    setRecordingTime(0);
    
    // Simulate recording timer
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    // Store interval to clear it later
    (global as any).videoRecordingInterval = interval;
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    clearInterval((global as any).videoRecordingInterval);
    
    // Simulate creating a video file
    const mockVideoFile = {
      uri: 'mock-video-uri',
      type: 'video/mp4',
      fileSize: 5 * 1024 * 1024, // 5MB
      duration: recordingTime,
    };
    
    setSelectedVideo(mockVideoFile);
    Alert.alert('Recording Complete', 'Your video has been recorded successfully!');
  };

  const handleTakeVideo = () => {
    const options = {
      mediaType: 'video' as MediaType,
      includeBase64: false,
      maxHeight: 1080,
      maxWidth: 1920,
      quality: 0.8 as any,
      videoQuality: 'high' as any,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        Alert.alert('Error', 'Failed to record video. Please try again.');
        return;
      }
      if (response.assets && response.assets[0]) {
        setSelectedVideo(response.assets[0]);
      }
    });
  };

  const handleSelectFromLibrary = () => {
    const options = {
      mediaType: 'video' as MediaType,
      includeBase64: false,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        Alert.alert('Error', 'Failed to select video file. Please try again.');
        return;
      }
      if (response.assets && response.assets[0]) {
        setSelectedVideo(response.assets[0]);
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = async () => {
    if (!selectedVideo) {
      Alert.alert('Video Required', 'Please record or select a video file.');
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
      // In a real app, you would upload the video to your server first
      // For now, we'll simulate the upload process
      await new Promise(resolve => setTimeout(resolve, 3000));

      const memoryData: CreateMemoryRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
        content_type: 'video',
        content_url: selectedVideo.uri, // In real app, this would be the uploaded URL
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        location_name: currentLocation.location_name,
        privacy_level: privacyLevel,
        category_tags: tags,
        mood: mood || undefined,
        content_size: selectedVideo.fileSize,
        content_duration: selectedVideo.duration,
        media_format: selectedVideo.type,
      };

      const newMemory = await createMemory(memoryData);
      
      Alert.alert(
        'Success!',
        'Your video memory has been created successfully.',
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
              setSelectedVideo(null);
              setTitle('');
              setDescription('');
              setTags([]);
              setMood('');
              setRecordingTime(0);
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
    if (isRecording) {
      Alert.alert('Recording in Progress', 'Please stop recording before leaving.');
      return;
    }

    if (selectedVideo || title.trim() || description.trim()) {
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
        <Text style={styles.headerTitle}>Create Video Memory</Text>
        <IconButton
          icon="content-save"
          size={24}
          onPress={handleSave}
          disabled={!selectedVideo || !title.trim() || isLoading || isUploading}
          style={styles.saveButton}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!selectedVideo ? (
          <Card style={styles.videoSelectionCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Record or Select Video</Text>
              <Text style={styles.sectionSubtitle}>
                Record a new video or select one from your gallery
              </Text>
              
              <View style={styles.videoButtonsContainer}>
                <TouchableOpacity
                  style={[styles.videoButton, isRecording && styles.recordingButton]}
                  onPress={isRecording ? handleStopRecording : handleStartRecording}
                >
                  <IconButton 
                    icon={isRecording ? "stop" : "video"} 
                    size={32} 
                    iconColor={isRecording ? "#FF4444" : "#007AFF"} 
                  />
                  <Text style={[styles.videoButtonText, isRecording && styles.recordingText]}>
                    {isRecording ? 'Stop Recording' : 'Record Video'}
                  </Text>
                  {isRecording && (
                    <Text style={styles.recordingTimer}>
                      {formatTime(recordingTime)}
                    </Text>
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.videoButton}
                  onPress={handleTakeVideo}
                >
                  <IconButton icon="camera" size={32} iconColor="#007AFF" />
                  <Text style={styles.videoButtonText}>Camera</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.videoButton}
                  onPress={handleSelectFromLibrary}
                >
                  <IconButton icon="folder-video" size={32} iconColor="#007AFF" />
                  <Text style={styles.videoButtonText}>Gallery</Text>
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>
        ) : (
          <Card style={styles.videoPreviewCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Video Preview</Text>
              <View style={styles.videoPreviewContainer}>
                <IconButton icon="play-circle" size={64} iconColor="#007AFF" />
                <Text style={styles.videoInfo}>
                  Duration: {formatTime(selectedVideo.duration || 0)}
                </Text>
                <Text style={styles.videoInfo}>
                  Size: {(selectedVideo.fileSize / 1024 / 1024).toFixed(2)} MB
                </Text>
                <Text style={styles.videoInfo}>
                  Format: {selectedVideo.type || 'video/mp4'}
                </Text>
              </View>
              <Button
                mode="outlined"
                onPress={() => setSelectedVideo(null)}
                style={styles.changeVideoButton}
              >
                Change Video
              </Button>
            </Card.Content>
          </Card>
        )}

        {selectedVideo && (
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
                  placeholder="Share the story behind this video..."
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
              <Text style={styles.uploadingText}>Uploading video...</Text>
              <Text style={styles.uploadingSubtext}>This may take a few minutes</Text>
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
  videoSelectionCard: {
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
  videoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  videoButton: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    minWidth: 100,
    marginBottom: 8,
  },
  recordingButton: {
    backgroundColor: '#ffe6e6',
  },
  videoButtonText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  recordingText: {
    color: '#FF4444',
  },
  recordingTimer: {
    marginTop: 4,
    fontSize: 12,
    color: '#FF4444',
    fontWeight: 'bold',
  },
  videoPreviewCard: {
    marginBottom: 16,
  },
  videoPreviewContainer: {
    alignItems: 'center',
    padding: 20,
  },
  videoInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  changeVideoButton: {
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
  uploadingSubtext: {
    marginTop: 4,
    fontSize: 12,
    color: '#999',
  },
});

export default VideoRecorderScreen; 