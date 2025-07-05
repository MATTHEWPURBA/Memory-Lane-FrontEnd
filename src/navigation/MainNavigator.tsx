import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import MapNavigator from './MapNavigator';
import FeedNavigator from './FeedNavigator';
import CreateNavigator from './CreateNavigator';
import DiscoverNavigator from './DiscoverNavigator';
import ProfileNavigator from './ProfileNavigator';
import { MainTabParamList } from '@/types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Map"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outlineVariant,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Map':
              iconName = focused ? 'map-marker' : 'map-marker-outline';
              break;
            case 'Feed':
              iconName = focused ? 'view-list' : 'view-list-outline';
              break;
            case 'Create':
              iconName = focused ? 'plus-circle' : 'plus-circle-outline';
              break;
            case 'Discover':
              iconName = focused ? 'compass' : 'compass-outline';
              break;
            case 'Profile':
              iconName = focused ? 'account' : 'account-outline';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Map" 
        component={MapNavigator}
        options={{
          tabBarLabel: 'Map',
        }}
      />
      <Tab.Screen 
        name="Feed" 
        component={FeedNavigator}
        options={{
          tabBarLabel: 'Feed',
        }}
      />
      <Tab.Screen 
        name="Create" 
        component={CreateNavigator}
        options={{
          tabBarLabel: 'Create',
        }}
      />
      <Tab.Screen 
        name="Discover" 
        component={DiscoverNavigator}
        options={{
          tabBarLabel: 'Discover',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator; 