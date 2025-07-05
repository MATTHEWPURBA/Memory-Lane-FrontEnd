import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FeedScreen from '@/screens/feed/FeedScreen';
import MemoryDetailScreen from '@/screens/feed/MemoryDetailScreen';
import UserProfileScreen from '@/screens/profile/UserProfileScreen';
import SearchScreen from '@/screens/feed/SearchScreen';
import { FeedStackParamList } from '@/types';

const Stack = createStackNavigator<FeedStackParamList>();

const FeedNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="FeedScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="FeedScreen" component={FeedScreen} />
      <Stack.Screen name="MemoryDetail" component={MemoryDetailScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
    </Stack.Navigator>
  );
};

export default FeedNavigator; 