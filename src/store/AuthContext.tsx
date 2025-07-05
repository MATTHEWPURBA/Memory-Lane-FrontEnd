import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import apiService from '@/services/api';
import { User, LoginRequest, RegisterRequest, AuthContextType } from '@/types';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants/api';

// Action Types
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' };

// State Interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial State
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        error: null 
      };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false, 
        error: null 
      };
    default:
      return state;
  }
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing authentication on app start
  useEffect(() => {
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Check if we have a valid token
      const isValid = await apiService.verifyToken();
      
      if (isValid) {
        // Get user profile
        const user = await apiService.getUserProfile();
        dispatch({ type: 'SET_USER', payload: user });
      } else {
        dispatch({ type: 'SET_AUTHENTICATED', payload: false });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      dispatch({ type: 'SET_AUTHENTICATED', payload: false });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await apiService.login(credentials);
      dispatch({ type: 'SET_USER', payload: response.user });
      
      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
        text2: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      });
    } catch (error: any) {
      const errorMessage = error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: errorMessage,
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await apiService.register(userData);
      dispatch({ type: 'SET_USER', payload: response.user });
      
      Toast.show({
        type: 'success',
        text1: 'Account Created!',
        text2: SUCCESS_MESSAGES.REGISTER_SUCCESS,
      });
    } catch (error: any) {
      const errorMessage = error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: errorMessage,
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
      
      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
      });
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const isValid = await apiService.verifyToken();
      if (!isValid) {
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const updatedUser = await apiService.updateUserProfile(userData);
      dispatch({ type: 'SET_USER', payload: updatedUser });
      
      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: SUCCESS_MESSAGES.PROFILE_UPDATED,
      });
    } catch (error: any) {
      const errorMessage = error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: errorMessage,
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    register,
    logout,
    refreshToken,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 