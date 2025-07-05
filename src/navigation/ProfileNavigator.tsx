import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import EditProfileScreen from '@/screens/profile/EditProfileScreen';
import SettingsScreen from '@/screens/profile/SettingsScreen';
import MyMemoriesScreen from '@/screens/profile/MyMemoriesScreen';
import SavedMemoriesScreen from '@/screens/profile/SavedMemoriesScreen';
import UserProfileScreen from '@/screens/profile/UserProfileScreen';
import MemoryDetailScreen from '@/screens/profile/MemoryDetailScreen';
import { ProfileStackParamList } from '@/types';

const Stack = createStackNavigator<ProfileStackParamList>();

const ProfileNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProfileScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="MyMemories" component={MyMemoriesScreen} />
      <Stack.Screen name="SavedMemories" component={SavedMemoriesScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="MemoryDetail" component={MemoryDetailScreen} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator; 