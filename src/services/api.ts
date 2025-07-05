import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { API_CONFIG, API_ENDPOINTS, HTTP_METHODS } from '@/constants/api';
import { ApiResponse, AuthResponse, TokenResponse } from '@/types';

class ApiService {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private readonly REQUEST_TIMEOUT = 30000; // 30 seconds timeout

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.loadTokens();
  }

  // Token Management
  private async loadTokens(): Promise<void> {
    try {
      this.accessToken = await AsyncStorage.getItem('access_token');
      this.refreshToken = await AsyncStorage.getItem('refresh_token');
    } catch (error) {
      console.error('Error loading tokens:', error);
    }
  }

  private async saveTokens(accessToken: string, refreshToken?: string): Promise<void> {
    try {
      await AsyncStorage.setItem('access_token', accessToken);
      if (refreshToken) {
        await AsyncStorage.setItem('refresh_token', refreshToken);
        this.refreshToken = refreshToken;
      }
      this.accessToken = accessToken;
    } catch (error) {
      console.error('Error saving tokens:', error);
    }
  }

  private async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
      this.accessToken = null;
      this.refreshToken = null;
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  // Network Check
  private async checkNetworkConnection(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.isConnected && state.isInternetReachable;
  }

  // Request Headers
  private getHeaders(contentType: string = 'application/json'): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': contentType,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  // Main Request Method
  private async request<T>(
    endpoint: string,
    method: string = HTTP_METHODS.GET,
    body?: any,
    contentType?: string,
    retryCount: number = 0
  ): Promise<T> {
    // Check network connection
    const isConnected = await this.checkNetworkConnection();
    if (!isConnected) {
      throw new Error('No internet connection');
    }

    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getHeaders(contentType);

    try {
      const requestOptions: RequestInit = {
        method,
        headers,
      };

      if (body) {
        if (contentType === 'multipart/form-data') {
          // Handle file uploads
          const formData = new FormData();
          Object.keys(body).forEach(key => {
            formData.append(key, body[key]);
          });
          requestOptions.body = formData;
        } else {
          requestOptions.body = JSON.stringify(body);
        }
      }

      // Create an AbortController for the timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT);

      try {
        const response = await fetch(url, {
          ...requestOptions,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const data: ApiResponse<T> = await response.json();

        // Handle token refresh if needed
        if (response.status === 401 && retryCount < API_CONFIG.MAX_RETRIES) {
          const refreshed = await this.refreshAccessToken();
          if (refreshed) {
            return this.request<T>(endpoint, method, body, contentType, retryCount + 1);
          }
        }

        if (!response.ok) {
          throw new Error(data.error || `HTTP ${response.status}`);
        }

        return (data.data || data) as T;
      } catch (error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
    } catch (error) {
      if (retryCount < API_CONFIG.MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
        return this.request<T>(endpoint, method, body, contentType, retryCount + 1);
      }
      throw error;
    }
  }

  // Token Refresh
  private async refreshAccessToken(): Promise<boolean> {
    try {
      if (!this.refreshToken) {
        return false;
      }

      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.AUTH.REFRESH}`, {
        method: HTTP_METHODS.POST,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.refreshToken}`,
        },
      });

      if (response.ok) {
        const data: TokenResponse = await response.json();
        await this.saveTokens(data.access_token);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    await this.clearTokens();
    return false;
  }

  // Authentication Methods
  async login(credentials: { username?: string; email?: string; password: string }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      HTTP_METHODS.POST,
      credentials
    );
    await this.saveTokens(response.access_token, response.refresh_token);
    return response;
  }

  async register(userData: {
    username: string;
    email: string;
    password: string;
    display_name?: string;
    bio?: string;
  }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      HTTP_METHODS.POST,
      userData
    );
    await this.saveTokens(response.access_token, response.refresh_token);
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request(API_ENDPOINTS.AUTH.LOGOUT, HTTP_METHODS.POST);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await this.clearTokens();
    }
  }

  async verifyToken(): Promise<boolean> {
    try {
      await this.request(API_ENDPOINTS.AUTH.VERIFY_TOKEN, HTTP_METHODS.GET);
      return true;
    } catch (error) {
      return false;
    }
  }

  // User Methods
  async getUserProfile(): Promise<any> {
    return this.request(API_ENDPOINTS.USERS.PROFILE, HTTP_METHODS.GET);
  }

  async updateUserProfile(userData: Partial<any>): Promise<any> {
    return this.request(API_ENDPOINTS.USERS.UPDATE_PROFILE, HTTP_METHODS.PUT, userData);
  }

  async uploadAvatar(imageFile: any): Promise<any> {
    return this.request(
      API_ENDPOINTS.USERS.UPLOAD_AVATAR,
      HTTP_METHODS.POST,
      imageFile,
      'multipart/form-data'
    );
  }

  // Memory Methods
  async createMemory(memoryData: any): Promise<any> {
    return this.request(API_ENDPOINTS.MEMORIES.CREATE, HTTP_METHODS.POST, memoryData);
  }

  async getMemory(memoryId: string): Promise<any> {
    return this.request(API_ENDPOINTS.MEMORIES.GET_MEMORY(memoryId), HTTP_METHODS.GET);
  }

  async updateMemory(memoryId: string, updates: any): Promise<any> {
    return this.request(API_ENDPOINTS.MEMORIES.UPDATE_MEMORY(memoryId), HTTP_METHODS.PUT, updates);
  }

  async deleteMemory(memoryId: string): Promise<void> {
    return this.request(API_ENDPOINTS.MEMORIES.DELETE_MEMORY(memoryId), HTTP_METHODS.DELETE);
  }

  async getNearbyMemories(latitude: number, longitude: number, radius: number = 0.5): Promise<any> {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radius: radius.toString(),
    });
    return this.request(`${API_ENDPOINTS.MEMORIES.NEARBY}?${params}`, HTTP_METHODS.GET);
  }

  async getMemoryFeed(page: number = 1, perPage: number = 20): Promise<any> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });
    return this.request(`${API_ENDPOINTS.MEMORIES.FEED}?${params}`, HTTP_METHODS.GET);
  }

  async searchMemories(query: string, filters?: any): Promise<any> {
    const params = new URLSearchParams({
      q: query,
      ...filters,
    });
    return this.request(`${API_ENDPOINTS.MEMORIES.SEARCH}?${params}`, HTTP_METHODS.GET);
  }

  async getUserMemories(userId: string, page: number = 1): Promise<any> {
    const params = new URLSearchParams({
      page: page.toString(),
    });
    return this.request(`${API_ENDPOINTS.MEMORIES.GET_USER_MEMORIES(userId)}?${params}`, HTTP_METHODS.GET);
  }

  // Interaction Methods
  async likeMemory(memoryId: string): Promise<void> {
    return this.request(API_ENDPOINTS.INTERACTIONS.LIKE(memoryId), HTTP_METHODS.POST);
  }

  async unlikeMemory(memoryId: string): Promise<void> {
    return this.request(API_ENDPOINTS.INTERACTIONS.UNLIKE(memoryId), HTTP_METHODS.DELETE);
  }

  async addComment(memoryId: string, content: string): Promise<any> {
    return this.request(
      API_ENDPOINTS.INTERACTIONS.COMMENT(memoryId),
      HTTP_METHODS.POST,
      { content }
    );
  }

  async getComments(memoryId: string, page: number = 1): Promise<any> {
    const params = new URLSearchParams({
      page: page.toString(),
    });
    return this.request(`${API_ENDPOINTS.INTERACTIONS.GET_COMMENTS(memoryId)}?${params}`, HTTP_METHODS.GET);
  }

  async reportMemory(memoryId: string, reason: string): Promise<void> {
    return this.request(
      API_ENDPOINTS.INTERACTIONS.REPORT(memoryId),
      HTTP_METHODS.POST,
      { reason }
    );
  }

  // Upload Methods
  async uploadMedia(file: any, onProgress?: (progress: number) => void): Promise<any> {
    return this.request(
      API_ENDPOINTS.UPLOADS.UPLOAD_MEDIA,
      HTTP_METHODS.POST,
      file,
      'multipart/form-data'
    );
  }

  // Geospatial Methods
  async getMemoriesInArea(latitude: number, longitude: number, radius: number): Promise<any> {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radius: radius.toString(),
    });
    return this.request(`${API_ENDPOINTS.GEOSPATIAL.MEMORIES_IN_AREA}?${params}`, HTTP_METHODS.GET);
  }

  async getPopularLocations(): Promise<any> {
    return this.request(API_ENDPOINTS.GEOSPATIAL.POPULAR_LOCATIONS, HTTP_METHODS.GET);
  }

  // Health Check
  async healthCheck(): Promise<any> {
    return this.request(API_ENDPOINTS.HEALTH, HTTP_METHODS.GET);
  }

  // Utility Methods
  setBaseURL(url: string): void {
    this.baseURL = url;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }
}

export default new ApiService(); 