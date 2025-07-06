// src/utils/webPolyfills/LinearGradientPolyfill.js
import React from 'react';
import { View } from 'react-native';

const LinearGradient = ({ 
  colors = ['#ffffff', '#000000'], 
  start = { x: 0, y: 0 }, 
  end = { x: 1, y: 1 }, 
  locations,
  style, 
  children, 
  ...props 
}) => {
  // Convert React Native gradient props to CSS
  const angle = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI + 90;
  
  let gradientStops;
  if (locations && locations.length === colors.length) {
    gradientStops = colors.map((color, index) => 
      `${color} ${locations[index] * 100}%`
    ).join(', ');
  } else {
    gradientStops = colors.join(', ');
  }
  
  const gradientStyle = {
    background: `linear-gradient(${angle}deg, ${gradientStops})`,
  };

  return (
    <View 
      style={[gradientStyle, style]} 
      {...props}
    >
      {children}
    </View>
  );
};

export default LinearGradient;