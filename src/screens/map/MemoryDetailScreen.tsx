import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { Text, useTheme, Button, Card, Chip, ActivityIndicator, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../store/AuthContext';
import { Memory } from '../../types';
import apiService from '../../services/api';

const { width } = Dimensions.get('window');

interface MemoryDetailScreenProps {
  route: {
    params: {
      memoryId: string;
    };
  };
  navigation: any;
}

const MemoryDetailScreen: React.FC<MemoryDetailScreenProps> = ({ route, navigation }) => {
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const { memoryId } = route.params;
  
  const [memory, setMemory] = useState<Memory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMemoryDetails();
  }, [memoryId]);

  const fetchMemoryDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const memoryData = await apiService.getMemory(memoryId);
      setMemory(memoryData);
    } catch (error: any) {
      console.error('Failed to fetch memory details:', error);
      setError(error.message || 'Failed to load memory details');
      Alert.alert('Error', 'Failed to load memory details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const formatDistance = (distanceKm?: number) => {
    if (!distanceKm) return 'Unknown distance';
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}m away`;
    }
    return `${distanceKm.toFixed(1)}km away`;
  };

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'photo':
        return '📷';
      case 'video':
        return '🎥';
      case 'audio':
        return '🎵';
      case 'text':
        return '📝';
      default:
        return '📄';
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading memory details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !memory) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error || 'Memory not found'}
          </Text>
          <Button mode="contained" onPress={fetchMemoryDetails}>
            Retry
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={handleBack}
        />
        <Text style={styles.headerTitle}>Memory Details</Text>
        <View style={{ width: 48 }} />
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
                <Text style={styles.memoryCreator}>
                  by {memory.creator?.display_name || memory.creator?.username || 'Unknown'}
                </Text>
              </View>
            </View>

            {memory.description && (
              <Text style={styles.memoryDescription}>
                {memory.description}
              </Text>
            )}

            <View style={styles.memoryStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>❤️</Text>
                <Text style={styles.statValue}>{memory.likes_count}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>💬</Text>
                <Text style={styles.statValue}>{memory.comments_count}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>👁️</Text>
                <Text style={styles.statValue}>{memory.views_count}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>📍</Text>
                <Text style={styles.statValue}>
                  {formatDistance(memory.distance_km)}
                </Text>
              </View>
            </View>

            {memory.category_tags && memory.category_tags.length > 0 && (
              <View style={styles.tagsContainer}>
                <Text style={styles.tagsLabel}>Tags:</Text>
                <View style={styles.tagsList}>
                  {memory.category_tags.map((tag, index) => (
                    <Chip key={index} style={styles.tag} textStyle={styles.tagText}>
                      {tag}
                    </Chip>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>📍 Location</Text>
              <Text style={styles.locationText}>
                {memory.location_name || 'Unknown location'}
              </Text>
              <Text style={styles.coordinatesText}>
                {memory.latitude?.toFixed(6)}, {memory.longitude?.toFixed(6)}
              </Text>
            </View>

            <View style={styles.timestampInfo}>
              <Text style={styles.timestampLabel}>📅 Created</Text>
              <Text style={styles.timestampText}>
                {new Date(memory.created_at).toLocaleDateString()} at{' '}
                {new Date(memory.created_at).toLocaleTimeString()}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.actionsContainer}>
          <Button
            mode="contained"
            icon="heart"
            onPress={() => {
              // TODO: Implement like functionality
              Alert.alert('Like', 'Like functionality coming soon!');
            }}
            style={styles.actionButton}
          >
            Like
          </Button>
          <Button
            mode="outlined"
            icon="comment"
            onPress={() => {
              // TODO: Implement comment functionality
              Alert.alert('Comment', 'Comment functionality coming soon!');
            }}
            style={styles.actionButton}
          >
            Comment
          </Button>
          <Button
            mode="outlined"
            icon="share"
            onPress={() => {
              // TODO: Implement share functionality
              Alert.alert('Share', 'Share functionality coming soon!');
            }}
            style={styles.actionButton}
          >
            Share
          </Button>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
    marginBottom: 4,
  },
  memoryCreator: {
    fontSize: 14,
    color: '#666',
  },
  memoryDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    color: '#333',
  },
  memoryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  tagsContainer: {
    marginBottom: 16,
  },
  tagsLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#666',
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
  },
  locationInfo: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  locationText: {
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  coordinatesText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  timestampInfo: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  timestampLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  timestampText: {
    fontSize: 14,
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
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

export default MemoryDetailScreen; 