import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface FABPolyfillProps {
  icon?: string;
  onPress?: () => void;
  style?: any;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  backgroundColor?: string;
}

const FABPolyfill: React.FC<FABPolyfillProps> = ({
  icon = '+',
  onPress,
  style,
  size = 'medium',
  color = '#fff',
  backgroundColor = '#007AFF',
}) => {
  const getSize = () => {
    switch (size) {
      case 'small': return 40;
      case 'large': return 56;
      default: return 56;
    }
  };

  const getIconText = (iconName: string) => {
    const iconMap: { [key: string]: string } = {
      'plus': '+',
      'minus': '-',
      'check': '✓',
      'close': '✕',
      'edit': '✏️',
      'delete': '🗑️',
      'share': '📤',
      'heart': '❤️',
      'star': '⭐',
      'settings': '⚙️',
      'search': '🔍',
      'menu': '☰',
      'home': '🏠',
      'user': '👤',
      'camera': '📷',
      'video': '🎥',
      'microphone': '🎤',
      'play': '▶️',
      'pause': '⏸️',
      'stop': '⏹️',
      'record': '🔴',
    };
    return iconMap[iconName] || iconName.charAt(0).toUpperCase();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.fab,
        {
          width: getSize(),
          height: getSize(),
          backgroundColor,
        },
        style,
      ]}
    >
      <Text style={[
        styles.icon,
        {
          color,
          fontSize: getSize() * 0.4,
        },
      ]}>
        {getIconText(icon)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  icon: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default FABPolyfill; 