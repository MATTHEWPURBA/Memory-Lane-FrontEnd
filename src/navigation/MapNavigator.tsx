import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MapScreen from '@/screens/map/MapScreen';
import MemoryDetailScreen from '@/screens/map/MemoryDetailScreen';
import UserProfileScreen from '@/screens/profile/UserProfileScreen';
import { MapStackParamList } from '@/types';

const Stack = createStackNavigator<MapStackParamList>();

const MapNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="MapScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen name="MemoryDetail" component={MemoryDetailScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
    </Stack.Navigator>
  );
};

export default MapNavigator; 