// Web polyfill for @expo/vector-icons
import React from 'react';
import { createIconSet } from './IconSetPolyfill';

// Create icon sets for different icon families
const Ionicons = createIconSet({}, 'Ionicons');
const MaterialIcons = createIconSet({}, 'MaterialIcons');
const FontAwesome = createIconSet({}, 'FontAwesome');
const AntDesign = createIconSet({}, 'AntDesign');
const Entypo = createIconSet({}, 'Entypo');
const EvilIcons = createIconSet({}, 'EvilIcons');
const Feather = createIconSet({}, 'Feather');
const Foundation = createIconSet({}, 'Foundation');
const MaterialCommunityIcons = createIconSet({}, 'MaterialCommunityIcons');
const Octicons = createIconSet({}, 'Octicons');
const SimpleLineIcons = createIconSet({}, 'SimpleLineIcons');
const Zocial = createIconSet({}, 'Zocial');

export {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  Foundation,
  MaterialCommunityIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
}; 