import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MapNavigator from './MapNavigator';
import FeedNavigator from './FeedNavigator';
import CreateNavigator from './CreateNavigator';
import DiscoverNavigator from './DiscoverNavigator';
import ProfileNavigator from './ProfileNavigator';
import { MainTabParamList } from '@/types';

const Stack = createStackNavigator<MainTabParamList>();

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Map"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Map" component={MapNavigator} />
      <Stack.Screen name="Feed" component={FeedNavigator} />
      <Stack.Screen name="Create" component={CreateNavigator} />
      <Stack.Screen name="Discover" component={DiscoverNavigator} />
      <Stack.Screen name="Profile" component={ProfileNavigator} />
    </Stack.Navigator>
  );
};

export default MainNavigator; 