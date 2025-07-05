import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DiscoverScreen from '@/screens/discover/DiscoverScreen';
import MemoryDetailScreen from '@/screens/discover/MemoryDetailScreen';
import UserProfileScreen from '@/screens/profile/UserProfileScreen';
import PopularLocationsScreen from '@/screens/discover/PopularLocationsScreen';
import { DiscoverStackParamList } from '@/types';

const Stack = createStackNavigator<DiscoverStackParamList>();

const DiscoverNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="DiscoverScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="DiscoverScreen" component={DiscoverScreen} />
      <Stack.Screen name="MemoryDetail" component={MemoryDetailScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="PopularLocations" component={PopularLocationsScreen} />
    </Stack.Navigator>
  );
};

export default DiscoverNavigator; 