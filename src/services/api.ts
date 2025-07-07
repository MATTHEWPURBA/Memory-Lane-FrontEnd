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
      throw new Error('No internet connection. Please check your network settings and try again.');
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
        console.log(`Making ${method} request to: ${url}`);
        const response = await fetch(url, {
          ...requestOptions,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        console.log(`Response status: ${response.status} for ${url}`);

        // Handle CORS errors
        if (response.status === 0) {
          throw new Error('CORS error: Unable to connect to the server. Please check if the backend is running.');
        }

        // Handle different content types
        let data: ApiResponse<T>;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          // Handle non-JSON responses
          const text = await response.text();
          console.warn(`Non-JSON response from ${url}:`, text);
          throw new Error(`Unexpected response format from server: ${text.substring(0, 100)}`);
        }

        // Handle token refresh if needed
        if (response.status === 401 && retryCount < API_CONFIG.MAX_RETRIES) {
          console.log('Token expired, attempting refresh...');
          const refreshed = await this.refreshAccessToken();
          if (refreshed) {
            console.log('Token refreshed successfully, retrying request...');
            return this.request<T>(endpoint, method, body, contentType, retryCount + 1);
          } else {
            console.log('Token refresh failed, clearing tokens...');
            await this.clearTokens();
            throw new Error('Authentication failed. Please log in again.');
          }
        }

        if (!response.ok) {
          // Enhanced error handling
          let errorMessage = 'An error occurred while processing your request.';
          
          if (data && data.error) {
            errorMessage = data.error;
          } else if (data && data.message) {
            errorMessage = data.message;
          } else {
            switch (response.status) {
              case 400:
                errorMessage = 'Bad request. Please check your input and try again.';
                break;
              case 401:
                errorMessage = 'Authentication required. Please log in again.';
                break;
              case 403:
                errorMessage = 'Access denied. You do not have permission to perform this action.';
                break;
              case 404:
                errorMessage = 'The requested resource was not found.';
                break;
              case 409:
                errorMessage = 'Conflict. The resource already exists or is in an invalid state.';
                break;
              case 422:
                errorMessage = 'Validation error. Please check your input and try again.';
                break;
              case 429:
                errorMessage = 'Too many requests. Please wait a moment and try again.';
                break;
              case 500:
                errorMessage = 'Server error. Please try again later.';
                break;
              case 502:
                errorMessage = 'Bad gateway. The server is temporarily unavailable.';
                break;
              case 503:
                errorMessage = 'Service unavailable. Please try again later.';
                break;
              default:
                errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
          }
          
          console.error(`API Error (${response.status}):`, errorMessage);
          throw new Error(errorMessage);
        }

        return (data.data || data) as T;
      } catch (error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout. The server took too long to respond. Please try again.');
        }
        throw error;
      }
    } catch (error) {
      console.error(`Request failed (attempt ${retryCount + 1}/${API_CONFIG.MAX_RETRIES + 1}):`, error);
      
      if (retryCount < API_CONFIG.MAX_RETRIES) {
        console.log(`Retrying request in ${API_CONFIG.RETRY_DELAY}ms...`);
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
        return this.request<T>(endpoint, method, body, contentType, retryCount + 1);
      }
      
      // Final error handling
      if (error.message.includes('CORS')) {
        throw new Error('Unable to connect to the server. Please ensure the backend is running and accessible.');
      } else if (error.message.includes('timeout')) {
        throw new Error('Request timeout. Please check your internet connection and try again.');
      } else if (error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection and try again.');
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

  async checkUsernameAvailability(username: string): Promise<{ available: boolean }> {
    try {
      console.log(`Checking username availability for: ${username}`);
      const result = await this.request<{ available: boolean }>(
        API_ENDPOINTS.AUTH.CHECK_USERNAME,
        HTTP_METHODS.POST,
        { username }
      );
      console.log(`Username availability result:`, result);
      return result;
    } catch (error) {
      console.error('Username availability check failed:', error);
      // Return a default response to prevent UI blocking
      return { available: false };
    }
  }

  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    try {
      console.log(`Checking email availability for: ${email}`);
      const result = await this.request<{ available: boolean }>(
        API_ENDPOINTS.AUTH.CHECK_EMAIL,
        HTTP_METHODS.POST,
        { email }
      );
      console.log(`Email availability result:`, result);
      return result;
    } catch (error) {
      console.error('Email availability check failed:', error);
      // Return a default response to prevent UI blocking
      return { available: false };
    }
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
    try {
      console.log('Performing health check...');
      const result = await this.request(API_ENDPOINTS.HEALTH, HTTP_METHODS.GET);
      console.log('Health check successful:', result);
      return result;
    } catch (error) {
      console.error('Health check failed:', error);
      throw new Error('Unable to connect to the server. Please check if the backend is running.');
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
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