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
  IconButton,
  useTheme,
  SegmentedButtons,
  ActivityIndicator,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { useLocation } from '../../store/LocationContext';
import { useMemory } from '../../store/MemoryContext';
import { useAuth } from '../../store/AuthContext';
import { CreateMemoryRequest, PrivacyLevel } from '../../types';

interface AudioRecorderScreenProps {
  navigation?: any;
}

const AudioRecorderScreen: React.FC<AudioRecorderScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { currentLocation } = useLocation();
  const { createMemory, isLoading } = useMemory();
  const { isAuthenticated } = useAuth();

  const [selectedAudio, setSelectedAudio] = useState<any>(null);
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
    // In a real app, you would use a library like react-native-audio-recorder-player
    // For now, we'll simulate recording
    setIsRecording(true);
    setRecordingTime(0);
    
    // Simulate recording timer
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    // Store interval to clear it later
    (global as any).recordingInterval = interval;
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    clearInterval((global as any).recordingInterval);
    
    // Simulate creating an audio file
    const mockAudioFile = {
      uri: 'mock-audio-uri',
      type: 'audio/m4a',
      fileSize: 1024 * 1024, // 1MB
      duration: recordingTime,
    };
    
    setSelectedAudio(mockAudioFile);
    Alert.alert('Recording Complete', 'Your audio has been recorded successfully!');
  };

  const handleSelectFromLibrary = () => {
    const options = {
      mediaType: 'audio' as MediaType,
      includeBase64: false,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        Alert.alert('Error', 'Failed to select audio file. Please try again.');
        return;
      }
      if (response.assets && response.assets[0]) {
        setSelectedAudio(response.assets[0]);
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
    if (!selectedAudio) {
      Alert.alert('Audio Required', 'Please record or select an audio file.');
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
      // In a real app, you would upload the audio to your server first
      // For now, we'll simulate the upload process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const memoryData: CreateMemoryRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
        content_type: 'audio',
        content_url: selectedAudio.uri, // In real app, this would be the uploaded URL
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        location_name: currentLocation.location_name,
        privacy_level: privacyLevel,
        category_tags: tags,
        mood: mood || undefined,
        content_size: selectedAudio.fileSize,
        content_duration: selectedAudio.duration,
        media_format: selectedAudio.type,
      };

      const newMemory = await createMemory(memoryData);
      
      Alert.alert(
        'Success!',
        'Your audio memory has been created successfully.',
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
              setSelectedAudio(null);
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

    if (selectedAudio || title.trim() || description.trim()) {
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
        <Text style={styles.headerTitle}>Create Audio Memory</Text>
        <IconButton
          icon="content-save"
          size={24}
          onPress={handleSave}
          disabled={!selectedAudio || !title.trim() || isLoading || isUploading}
          style={styles.saveButton}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!selectedAudio ? (
          <Card style={styles.audioSelectionCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Record or Select Audio</Text>
              <Text style={styles.sectionSubtitle}>
                Record a new audio message or select one from your library
              </Text>
              
              <View style={styles.audioButtonsContainer}>
                <TouchableOpacity
                  style={[styles.audioButton, isRecording && styles.recordingButton]}
                  onPress={isRecording ? handleStopRecording : handleStartRecording}
                >
                  <IconButton 
                    icon={isRecording ? "stop" : "microphone"} 
                    size={32} 
                    iconColor={isRecording ? "#FF4444" : "#007AFF"} 
                  />
                  <Text style={[styles.audioButtonText, isRecording && styles.recordingText]}>
                    {isRecording ? 'Stop Recording' : 'Record Audio'}
                  </Text>
                  {isRecording && (
                    <Text style={styles.recordingTimer}>
                      {formatTime(recordingTime)}
                    </Text>
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.audioButton}
                  onPress={handleSelectFromLibrary}
                >
                  <IconButton icon="folder-music" size={32} iconColor="#007AFF" />
                  <Text style={styles.audioButtonText}>Select Audio</Text>
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>
        ) : (
          <Card style={styles.audioPreviewCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Audio Preview</Text>
              <View style={styles.audioPreviewContainer}>
                <IconButton icon="play" size={48} iconColor="#007AFF" />
                <Text style={styles.audioInfo}>
                  Duration: {formatTime(selectedAudio.duration || 0)}
                </Text>
                <Text style={styles.audioInfo}>
                  Size: {(selectedAudio.fileSize / 1024 / 1024).toFixed(2)} MB
                </Text>
              </View>
              <Button
                mode="outlined"
                onPress={() => setSelectedAudio(null)}
                style={styles.changeAudioButton}
              >
                Change Audio
              </Button>
            </Card.Content>
          </Card>
        )}

        {selectedAudio && (
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
                  placeholder="Share the story behind this audio..."
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
              <Text style={styles.uploadingText}>Uploading audio...</Text>
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
  audioSelectionCard: {
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
  audioButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  audioButton: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    minWidth: 120,
  },
  recordingButton: {
    backgroundColor: '#ffe6e6',
  },
  audioButtonText: {
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
  audioPreviewCard: {
    marginBottom: 16,
  },
  audioPreviewContainer: {
    alignItems: 'center',
    padding: 20,
  },
  audioInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  changeAudioButton: {
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

export default AudioRecorderScreen; 