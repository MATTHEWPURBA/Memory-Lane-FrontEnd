import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
  Share,
  Platform,
} from 'react-native';
import {
  Text,
  Card,
  Chip,
  Button,
  useTheme,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

// Web-specific IconButton import to avoid font loading issues
const IconButton = Platform.OS === 'web' 
  ? require('../../utils/webPolyfills/IconButtonPolyfill').default
  : require('react-native-paper').IconButton;

import { Memory } from '../../types';

interface MemoryPreviewScreenProps {
  navigation?: any;
  route?: {
    params: {
      memory: Memory;
    };
  };
}

const MemoryPreviewScreen: React.FC<MemoryPreviewScreenProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const memory = route?.params?.memory;

  if (!memory) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Memory not found</Text>
          <Button mode="contained" onPress={() => navigation?.goBack()}>
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const handleBack = () => {
    navigation?.goBack();
  };

  const handleEdit = () => {
    // Navigate to edit screen (not implemented yet)
    Alert.alert('Edit Feature', 'Edit functionality will be implemented soon.');
  };

  const handleShare = async () => {
    try {
      const shareContent = {
        title: memory.title,
        message: `${memory.title}\n\n${memory.description || ''}\n\nCreated with Memory Lane`,
        url: memory.content_url, // In real app, this would be a shareable link
      };

      await Share.share(shareContent);
    } catch (error) {
      console.error('Error sharing memory:', error);
      Alert.alert('Error', 'Failed to share memory.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Memory',
      'Are you sure you want to delete this memory? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // In a real app, you would call the delete API
            Alert.alert('Success', 'Memory deleted successfully.');
            navigation?.goBack();
          },
        },
      ]
    );
  };

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'photo':
        return '📸';
      case 'video':
        return '🎥';
      case 'audio':
        return '🎤';
      case 'text':
        return '📝';
      default:
        return '📄';
    }
  };

  const getPrivacyIcon = (privacyLevel: string) => {
    switch (privacyLevel) {
      case 'public':
        return '🌍';
      case 'friends':
        return '👥';
      case 'private':
        return '🔒';
      default:
        return '🌍';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        <Text style={styles.headerTitle}>Memory Preview</Text>
        <View style={styles.headerActions}>
          <IconButton
            icon="share-variant"
            size={24}
            onPress={handleShare}
            style={styles.actionButton}
          />
          <IconButton
            icon="pencil"
            size={24}
            onPress={handleEdit}
            style={styles.actionButton}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.memoryCard}>
          <Card.Content>
            <View style={styles.memoryHeader}>
              <Text style={styles.contentTypeIcon}>
                {getContentTypeIcon(memory.content_type)}
              </Text>
              <View style={styles.memoryInfo}>
                <Text style={styles.memoryTitle}>{memory.title}</Text>
                <Text style={styles.memoryDate}>
                  {formatDate(memory.created_at)}
                </Text>
              </View>
              <Text style={styles.privacyIcon}>
                {getPrivacyIcon(memory.privacy_level)}
              </Text>
            </View>

            {memory.description && (
              <Text style={styles.memoryDescription}>{memory.description}</Text>
            )}

            {memory.content_type === 'photo' && memory.content_url && (
              <Image
                source={{ uri: memory.content_url }}
                style={styles.memoryImage}
                resizeMode="cover"
              />
            )}

            {memory.content_type === 'video' && (
              <View style={styles.videoPreview}>
                <IconButton icon="play-circle" size={64} iconColor="#007AFF" />
                <Text style={styles.videoInfo}>
                  Duration: {formatDuration(memory.content_duration)}
                </Text>
                <Text style={styles.videoInfo}>
                  Size: {formatFileSize(memory.content_size)}
                </Text>
              </View>
            )}

            {memory.content_type === 'audio' && (
              <View style={styles.audioPreview}>
                <IconButton icon="play" size={48} iconColor="#007AFF" />
                <Text style={styles.audioInfo}>
                  Duration: {formatDuration(memory.content_duration)}
                </Text>
                <Text style={styles.audioInfo}>
                  Size: {formatFileSize(memory.content_size)}
                </Text>
              </View>
            )}

            <Divider style={styles.divider} />

            <View style={styles.memoryStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Likes</Text>
                <Text style={styles.statValue}>❤️ {memory.likes_count}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Comments</Text>
                <Text style={styles.statValue}>💬 {memory.comments_count}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Views</Text>
                <Text style={styles.statValue}>👁️ {memory.views_count}</Text>
              </View>
            </View>

            {memory.category_tags && memory.category_tags.length > 0 && (
              <View style={styles.tagsSection}>
                <Text style={styles.sectionTitle}>Tags</Text>
                <View style={styles.tagsContainer}>
                  {memory.category_tags.map((tag, index) => (
                    <Chip key={index} style={styles.tagChip}>
                      {tag}
                    </Chip>
                  ))}
                </View>
              </View>
            )}

            {memory.mood && (
              <View style={styles.moodSection}>
                <Text style={styles.sectionTitle}>Mood</Text>
                <Chip style={styles.moodChip}>{memory.mood}</Chip>
              </View>
            )}

            <View style={styles.locationSection}>
              <Text style={styles.sectionTitle}>Location</Text>
              <Text style={styles.locationText}>
                📍 {memory.location_name || `${memory.latitude.toFixed(4)}, ${memory.longitude.toFixed(4)}`}
              </Text>
            </View>

            <View style={styles.technicalInfo}>
              <Text style={styles.sectionTitle}>Technical Details</Text>
              <Text style={styles.technicalText}>
                Type: {memory.content_type.toUpperCase()}
              </Text>
              {memory.content_size && (
                <Text style={styles.technicalText}>
                  Size: {formatFileSize(memory.content_size)}
                </Text>
              )}
              {memory.content_duration && (
                <Text style={styles.technicalText}>
                  Duration: {formatDuration(memory.content_duration)}
                </Text>
              )}
              {memory.media_format && (
                <Text style={styles.technicalText}>
                  Format: {memory.media_format}
                </Text>
              )}
            </View>
          </Card.Content>
        </Card>

        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            onPress={() => navigation?.navigate('Map')}
            style={styles.actionButton}
            icon="map-marker"
          >
            View on Map
          </Button>
          <Button
            mode="outlined"
            onPress={handleShare}
            style={styles.actionButton}
            icon="share-variant"
          >
            Share Memory
          </Button>
        </View>

        <Card style={styles.dangerZone}>
          <Card.Content>
            <Text style={styles.dangerTitle}>Danger Zone</Text>
            <Button
              mode="outlined"
              onPress={handleDelete}
              style={styles.deleteButton}
              textColor="#d32f2f"
              icon="delete"
            >
              Delete Memory
            </Button>
          </Card.Content>
        </Card>
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
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    margin: 0,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  memoryCard: {
    marginBottom: 16,
  },
  memoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contentTypeIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  memoryInfo: {
    flex: 1,
  },
  memoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  memoryDate: {
    fontSize: 14,
    color: '#666',
  },
  privacyIcon: {
    fontSize: 20,
  },
  memoryDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
  },
  memoryImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  videoPreview: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    marginBottom: 16,
  },
  videoInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  audioPreview: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    marginBottom: 16,
  },
  audioInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  divider: {
    marginVertical: 16,
  },
  memoryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  tagsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    marginBottom: 4,
  },
  moodSection: {
    marginBottom: 16,
  },
  moodChip: {
    alignSelf: 'flex-start',
  },
  locationSection: {
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: '#2e7d32',
  },
  technicalInfo: {
    marginBottom: 16,
  },
  technicalText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dangerZone: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 12,
  },
  deleteButton: {
    borderColor: '#d32f2f',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
});

export default MemoryPreviewScreen; 