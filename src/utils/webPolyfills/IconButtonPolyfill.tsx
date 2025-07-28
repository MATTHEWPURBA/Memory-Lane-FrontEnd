import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface IconButtonPolyfillProps {
  icon: string;
  size?: number;
  onPress?: () => void;
  disabled?: boolean;
  style?: any;
  iconColor?: string;
}

const IconButtonPolyfill: React.FC<IconButtonPolyfillProps> = ({
  icon,
  size = 24,
  onPress,
  disabled = false,
  style,
  iconColor = '#000',
}) => {
  console.log('🔍 IconButtonPolyfill being used with icon:', icon);
  
  // Convert icon names to simple text representations
  const getIconText = (iconName: string) => {
    const iconMap: { [key: string]: string } = {
      'arrow-left': '←',
      'arrow-right': '→',
      'check': '✓',
      'close': '✕',
      'plus': '+',
      'minus': '-',
      'camera': '📷',
      'video': '🎥',
      'microphone': '🎤',
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
      'map-marker': '📍',
      'map-marker-off': '❌',
      'crosshairs-gps': '🎯',
      'content-save': '💾',
      'play-circle': '▶️',
      'play': '▶️',
      'stop': '⏹️',
      'folder-video': '📁',
      'folder-music': '🎵',
      'pencil': '✏️',
      'share-variant': '📤',
      'image': '🖼️',
      'music': '🎵',
      'audio': '🎤',
      'text': '📝',
      'photo': '📸',
      'record': '🔴',
      'pause': '⏸️',
      'volume': '🔊',
      'mute': '🔇',
      'download': '⬇️',
      'upload': '⬆️',
      'refresh': '🔄',
      'sync': '🔄',
      'wifi': '📶',
      'bluetooth': '📡',
      'battery': '🔋',
      'flash': '⚡',
      'timer': '⏱️',
      'alarm': '⏰',
      'calendar': '📅',
      'clock': '🕐',
      'location': '📍',
      'navigation': '🧭',
      'compass': '🧭',
      'flag': '🏁',
      'bookmark': '🔖',
      'tag': '🏷️',
      'label': '🏷️',
      'folder': '📁',
      'file': '📄',
      'document': '📄',
      'pdf': '📄',
      'word': '📄',
      'excel': '📊',
      'powerpoint': '📊',
      'zip': '📦',
      'archive': '📦',
      'cloud': '☁️',
      'database': '🗄️',
      'server': '🖥️',
      'laptop': '💻',
      'desktop': '🖥️',
      'mobile': '📱',
      'tablet': '📱',
      'watch': '⌚',
      'headphones': '🎧',
      'speaker': '🔊',
      'microphone-off': '🎤',
      'video-off': '🎥',
      'camera-off': '📷',
      'image-off': '🖼️',
      'wifi-off': '📶',
      'bluetooth-off': '📡',
      'volume-off': '🔇',
      'mute-off': '🔊',
      'play-off': '▶️',
      'pause-off': '⏸️',
      'stop-off': '⏹️',
      'record-off': '🔴',
      'timer-off': '⏱️',
      'alarm-off': '⏰',
      'location-off': '📍',
      'navigation-off': '🧭',
      'compass-off': '🧭',
      'flag-off': '🏁',
      'bookmark-off': '🔖',
      'tag-off': '🏷️',
      'label-off': '🏷️',
      'folder-off': '📁',
      'document-off': '📄',
      'cloud-off': '☁️',
      'database-off': '🗄️',
      'server-off': '🖥️',
      'laptop-off': '💻',
      'desktop-off': '🖥️',
      'mobile-off': '📱',
      'tablet-off': '📱',
      'watch-off': '⌚',
      'headphones-off': '🎧',
      'speaker-off': '🔊',
    };
    
    return iconMap[iconName] || iconName.charAt(0).toUpperCase();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { width: size, height: size },
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.icon, { fontSize: size * 0.6, color: iconColor }]}>
        {getIconText(icon)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  disabled: {
    opacity: 0.5,
  },
  icon: {
    textAlign: 'center',
  },
});

export default IconButtonPolyfill; 