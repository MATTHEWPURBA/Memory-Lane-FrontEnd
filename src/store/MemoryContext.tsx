import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import Toast from 'react-native-toast-message';
import apiService from '@/services/api';
import { 
  Memory, 
  NearbyMemory, 
  CreateMemoryRequest, 
  UpdateMemoryRequest, 
  Comment, 
  Location, 
  SearchFilters,
  MemoryContextType 
} from '@/types';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants/api';

// Action Types
type MemoryAction =
  | { type: 'SET_MEMORIES'; payload: Memory[] }
  | { type: 'SET_NEARBY_MEMORIES'; payload: NearbyMemory[] }
  | { type: 'ADD_MEMORY'; payload: Memory }
  | { type: 'UPDATE_MEMORY'; payload: Memory }
  | { type: 'DELETE_MEMORY'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LIKE_MEMORY'; payload: { memoryId: string; liked: boolean } }
  | { type: 'ADD_COMMENT'; payload: { memoryId: string; comment: Comment } };

// State Interface
interface MemoryState {
  memories: Memory[];
  nearbyMemories: NearbyMemory[];
  isLoading: boolean;
  error: string | null;
}

// Initial State
const initialState: MemoryState = {
  memories: [],
  nearbyMemories: [],
  isLoading: false,
  error: null,
};

// Reducer
function memoryReducer(state: MemoryState, action: MemoryAction): MemoryState {
  switch (action.type) {
    case 'SET_MEMORIES':
      return { ...state, memories: action.payload };
    case 'SET_NEARBY_MEMORIES':
      return { ...state, nearbyMemories: action.payload };
    case 'ADD_MEMORY':
      return { 
        ...state, 
        memories: [action.payload, ...state.memories],
        nearbyMemories: [action.payload as NearbyMemory, ...state.nearbyMemories]
      };
    case 'UPDATE_MEMORY':
      return {
        ...state,
        memories: state.memories.map(memory => 
          memory.memory_id === action.payload.memory_id ? action.payload : memory
        ),
        nearbyMemories: state.nearbyMemories.map(memory => 
          memory.memory_id === action.payload.memory_id ? action.payload as NearbyMemory : memory
        ),
      };
    case 'DELETE_MEMORY':
      return {
        ...state,
        memories: state.memories.filter(memory => memory.memory_id !== action.payload),
        nearbyMemories: state.nearbyMemories.filter(memory => memory.memory_id !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LIKE_MEMORY':
      return {
        ...state,
        memories: state.memories.map(memory => 
          memory.memory_id === action.payload.memoryId 
            ? { 
                ...memory, 
                has_liked: action.payload.liked,
                likes_count: action.payload.liked ? memory.likes_count + 1 : Math.max(0, memory.likes_count - 1)
              }
            : memory
        ),
        nearbyMemories: state.nearbyMemories.map(memory => 
          memory.memory_id === action.payload.memoryId 
            ? { 
                ...memory, 
                has_liked: action.payload.liked,
                likes_count: action.payload.liked ? memory.likes_count + 1 : Math.max(0, memory.likes_count - 1)
              }
            : memory
        ),
      };
    case 'ADD_COMMENT':
      return {
        ...state,
        memories: state.memories.map(memory => 
          memory.memory_id === action.payload.memoryId 
            ? { ...memory, comments_count: memory.comments_count + 1 }
            : memory
        ),
        nearbyMemories: state.nearbyMemories.map(memory => 
          memory.memory_id === action.payload.memoryId 
            ? { ...memory, comments_count: memory.comments_count + 1 }
            : memory
        ),
      };
    default:
      return state;
  }
}

// Context
const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

// Provider Component
interface MemoryProviderProps {
  children: ReactNode;
}

export const MemoryProvider: React.FC<MemoryProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(memoryReducer, initialState);

  const createMemory = async (memory: CreateMemoryRequest): Promise<Memory> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const createdMemory = await apiService.createMemory(memory);
      dispatch({ type: 'ADD_MEMORY', payload: createdMemory });
      
      Toast.show({
        type: 'success',
        text1: 'Memory Created!',
        text2: SUCCESS_MESSAGES.MEMORY_CREATED,
      });

      return createdMemory;
    } catch (error: any) {
      const errorMessage = error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      
      Toast.show({
        type: 'error',
        text1: 'Creation Failed',
        text2: errorMessage,
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateMemory = async (memoryId: string, updates: UpdateMemoryRequest): Promise<Memory> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const updatedMemory = await apiService.updateMemory(memoryId, updates);
      dispatch({ type: 'UPDATE_MEMORY', payload: updatedMemory });
      
      Toast.show({
        type: 'success',
        text1: 'Memory Updated!',
        text2: SUCCESS_MESSAGES.MEMORY_UPDATED,
      });

      return updatedMemory;
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

  const deleteMemory = async (memoryId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      await apiService.deleteMemory(memoryId);
      dispatch({ type: 'DELETE_MEMORY', payload: memoryId });
      
      Toast.show({
        type: 'success',
        text1: 'Memory Deleted',
        text2: SUCCESS_MESSAGES.MEMORY_DELETED,
      });
    } catch (error: any) {
      const errorMessage = error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      
      Toast.show({
        type: 'error',
        text1: 'Deletion Failed',
        text2: errorMessage,
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getNearbyMemories = async (location: Location, radius: number = 0.5): Promise<NearbyMemory[]> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const memories = await apiService.getNearbyMemories(location.latitude, location.longitude, radius);
      dispatch({ type: 'SET_NEARBY_MEMORIES', payload: memories });

      return memories;
    } catch (error: any) {
      const errorMessage = error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const searchMemories = async (query: string, filters?: SearchFilters): Promise<Memory[]> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const memories = await apiService.searchMemories(query, filters);
      dispatch({ type: 'SET_MEMORIES', payload: memories });

      return memories;
    } catch (error: any) {
      const errorMessage = error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const likeMemory = async (memoryId: string): Promise<void> => {
    try {
      await apiService.likeMemory(memoryId);
      dispatch({ type: 'LIKE_MEMORY', payload: { memoryId, liked: true } });
    } catch (error: any) {
      const errorMessage = error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
      Toast.show({
        type: 'error',
        text1: 'Like Failed',
        text2: errorMessage,
      });
      throw error;
    }
  };

  const unlikeMemory = async (memoryId: string): Promise<void> => {
    try {
      await apiService.unlikeMemory(memoryId);
      dispatch({ type: 'LIKE_MEMORY', payload: { memoryId, liked: false } });
    } catch (error: any) {
      const errorMessage = error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
      Toast.show({
        type: 'error',
        text1: 'Unlike Failed',
        text2: errorMessage,
      });
      throw error;
    }
  };

  const addComment = async (memoryId: string, content: string): Promise<Comment> => {
    try {
      const comment = await apiService.addComment(memoryId, content);
      dispatch({ type: 'ADD_COMMENT', payload: { memoryId, comment } });
      
      Toast.show({
        type: 'success',
        text1: 'Comment Added',
        text2: 'Your comment has been posted!',
      });

      return comment;
    } catch (error: any) {
      const errorMessage = error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
      Toast.show({
        type: 'error',
        text1: 'Comment Failed',
        text2: errorMessage,
      });
      throw error;
    }
  };

  const refreshMemories = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const memories = await apiService.getMemoryFeed();
      dispatch({ type: 'SET_MEMORIES', payload: memories });
    } catch (error: any) {
      const errorMessage = error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: MemoryContextType = {
    memories: state.memories,
    nearbyMemories: state.nearbyMemories,
    isLoading: state.isLoading,
    error: state.error,
    createMemory,
    updateMemory,
    deleteMemory,
    getNearbyMemories,
    searchMemories,
    likeMemory,
    unlikeMemory,
    addComment,
    refreshMemories,
  };

  return (
    <MemoryContext.Provider value={value}>
      {children}
    </MemoryContext.Provider>
  );
};

// Hook
export const useMemory = (): MemoryContextType => {
  const context = useContext(MemoryContext);
  if (context === undefined) {
    throw new Error('useMemory must be used within a MemoryProvider');
  }
  return context;
}; 