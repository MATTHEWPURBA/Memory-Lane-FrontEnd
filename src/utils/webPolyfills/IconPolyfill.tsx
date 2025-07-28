import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface IconPolyfillProps {
  source: any;
  size?: number;
  color?: string;
  style?: any;
}

const IconPolyfill: React.FC<IconPolyfillProps> = ({
  source,
  size = 24,
  color = '#000',
  style,
}) => {
  console.log('🔍 IconPolyfill being used with source:', source);
  
  // Extract icon name from source
  const getIconName = (source: any) => {
    if (typeof source === 'string') return source;
    if (source?.name) return source.name;
    if (source?.defaultProps?.name) return source.defaultProps.name;
    return 'unknown';
  };
  
  const iconName = getIconName(source);
  
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
    };
    return iconMap[iconName] || iconName.charAt(0).toUpperCase();
  };

  return (
    <Text style={[
      styles.icon,
      { 
        fontSize: size * 0.8, 
        color: color,
        lineHeight: size,
      },
      style,
    ]}>
      {getIconText(iconName)}
    </Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default IconPolyfill; 