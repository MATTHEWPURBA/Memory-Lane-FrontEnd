import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CreateMemoryScreen from '@/screens/create/CreateMemoryScreen';
import CameraScreen from '@/screens/create/CameraScreen';
import AudioRecorderScreen from '@/screens/create/AudioRecorderScreen';
import VideoRecorderScreen from '@/screens/create/VideoRecorderScreen';
import TextEditorScreen from '@/screens/create/TextEditorScreen';
import LocationPickerScreen from '@/screens/create/LocationPickerScreen';
import MemoryPreviewScreen from '@/screens/create/MemoryPreviewScreen';
import { CreateStackParamList } from '@/types';

const Stack = createStackNavigator<CreateStackParamList>();

const CreateNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="CreateMemory"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="CreateMemory" component={CreateMemoryScreen} />
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="AudioRecorder" component={AudioRecorderScreen} />
      <Stack.Screen name="VideoRecorder" component={VideoRecorderScreen} />
      <Stack.Screen name="TextEditor" component={TextEditorScreen} />
      <Stack.Screen name="LocationPicker" component={LocationPickerScreen} />
      <Stack.Screen name="MemoryPreview" component={MemoryPreviewScreen} />
    </Stack.Navigator>
  );
};

export default CreateNavigator; 