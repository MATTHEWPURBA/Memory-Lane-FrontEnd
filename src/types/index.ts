// User Types
export interface User {
  user_id: string;
  username: string;
  email: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  last_active: string;
  memories_count: number;
  followers_count: number;
  following_count: number;
  privacy_settings: PrivacySettings;
}

export interface PrivacySettings {
  profile_visibility: 'public' | 'friends' | 'private';
  location_sharing: boolean;
  memory_visibility: 'public' | 'friends' | 'private';
  allow_messages: boolean;
}

// Memory Types
export interface Memory {
  memory_id: string;
  creator_id: string;
  creator: User;
  title: string;
  description?: string;
  content_type: 'photo' | 'audio' | 'video' | 'text';
  content_url?: string;
  content_text?: string;
  content_size?: number;
  content_duration?: number;
  thumbnail_url?: string;
  latitude: number;
  longitude: number;
  location_name?: string;
  privacy_level: 'public' | 'friends' | 'private';
  is_active: boolean;
  is_reported: boolean;
  created_at: string;
  updated_at: string;
  expiration_date?: string;
  likes_count: number;
  comments_count: number;
  views_count: number;
  discoveries_count: number;
  category_tags: string[];
  ai_generated_tags: string[];
  mood?: string;
  media_duration?: number;
  media_size?: number;
  media_format?: string;
  has_liked?: boolean;
  distance_km?: number;
}

export interface CreateMemoryRequest {
  title: string;
  description?: string;
  content_type: 'photo' | 'audio' | 'video' | 'text';
  content_url?: string;
  content_text?: string;
  latitude: number;
  longitude: number;
  location_name?: string;
  privacy_level?: 'public' | 'friends' | 'private';
  category_tags?: string[];
  mood?: string;
  expiration_hours?: number;
  content_size?: number;
  content_duration?: number;
  media_format?: string;
}

export interface UpdateMemoryRequest {
  title?: string;
  description?: string;
  privacy_level?: 'public' | 'friends' | 'private';
  category_tags?: string[];
  mood?: string;
}

// Interaction Types
export interface Interaction {
  interaction_id: string;
  user_id: string;
  memory_id: string;
  interaction_type: 'like' | 'comment' | 'view' | 'discover' | 'share';
  content?: string;
  created_at: string;
  user?: User;
}

export interface Comment {
  comment_id: string;
  user_id: string;
  memory_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user: User;
}

// Location Types
export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  timestamp: number;
  location_name?: string;
}

export interface NearbyMemory extends Memory {
  distance_km: number;
  direction?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  has_next: boolean;
  has_prev: boolean;
}

// Authentication Types
export interface LoginRequest {
  username?: string;
  email?: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  display_name?: string;
  bio?: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface TokenResponse {
  access_token: string;
}

// Search Types
export interface SearchFilters {
  content_type?: 'photo' | 'audio' | 'video' | 'text';
  privacy_level?: 'public' | 'friends' | 'private';
  mood?: string;
  category_tags?: string[];
  date_from?: string;
  date_to?: string;
  radius_km?: number;
  sort_by?: 'recent' | 'popular' | 'distance' | 'relevance';
}

// Media Types
export interface MediaFile {
  uri: string;
  type: 'photo' | 'audio' | 'video';
  name: string;
  size: number;
  duration?: number;
  width?: number;
  height?: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Splash: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
};

export type MainTabParamList = {
  Map: undefined;
  Feed: undefined;
  Create: undefined;
  Discover: undefined;
  Profile: undefined;
};

export type MapStackParamList = {
  MapScreen: undefined;
  MemoryDetail: { memoryId: string };
  UserProfile: { userId: string };
};

export type FeedStackParamList = {
  FeedScreen: undefined;
  MemoryDetail: { memoryId: string };
  UserProfile: { userId: string };
  Search: undefined;
};

export type CreateStackParamList = {
  CreateMemory: undefined;
  Camera: undefined;
  AudioRecorder: undefined;
  VideoRecorder: undefined;
  TextEditor: undefined;
  LocationPicker: undefined;
  MemoryPreview: { memory: CreateMemoryRequest };
};

export type DiscoverStackParamList = {
  DiscoverScreen: undefined;
  MemoryDetail: { memoryId: string };
  UserProfile: { userId: string };
  PopularLocations: undefined;
};

export type ProfileStackParamList = {
  ProfileScreen: undefined;
  EditProfile: undefined;
  Settings: undefined;
  MyMemories: undefined;
  SavedMemories: undefined;
  UserProfile: { userId: string };
  MemoryDetail: { memoryId: string };
};

// Context Types
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

export interface LocationContextType {
  currentLocation: Location | null;
  hasLocationPermission: boolean;
  isLocationEnabled: boolean;
  requestLocationPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<Location | null>;
  watchLocation: (callback: (location: Location) => void) => void;
  stopWatchingLocation: () => void;
}

export interface MemoryContextType {
  memories: Memory[];
  nearbyMemories: NearbyMemory[];
  isLoading: boolean;
  error: string | null;
  createMemory: (memory: CreateMemoryRequest) => Promise<Memory>;
  updateMemory: (memoryId: string, updates: UpdateMemoryRequest) => Promise<Memory>;
  deleteMemory: (memoryId: string) => Promise<void>;
  getNearbyMemories: (location: Location, radius?: number) => Promise<NearbyMemory[]>;
  searchMemories: (query: string, filters?: SearchFilters) => Promise<Memory[]>;
  likeMemory: (memoryId: string) => Promise<void>;
  unlikeMemory: (memoryId: string) => Promise<void>;
  addComment: (memoryId: string, content: string) => Promise<Comment>;
  refreshMemories: () => Promise<void>;
}

// Component Props Types
export interface MemoryCardProps {
  memory: Memory;
  onPress: (memory: Memory) => void;
  onLike: (memoryId: string) => void;
  onComment: (memoryId: string) => void;
  onShare: (memory: Memory) => void;
  showDistance?: boolean;
  showCreator?: boolean;
}

export interface MemoryDetailProps {
  memory: Memory;
  onBack: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onLike: (memoryId: string) => void;
  onComment: (memoryId: string) => void;
  onShare: (memory: Memory) => void;
}

export interface CreateMemoryProps {
  onSuccess: (memory: Memory) => void;
  onCancel: () => void;
  initialLocation?: Location;
}

// Utility Types
export type ContentType = 'photo' | 'audio' | 'video' | 'text';
export type PrivacyLevel = 'public' | 'friends' | 'private';
export type InteractionType = 'like' | 'comment' | 'view' | 'discover' | 'share';
export type SortOrder = 'recent' | 'popular' | 'distance' | 'relevance'; 