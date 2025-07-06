// src/utils/webPolyfills/MapViewPolyfill.js
import React from 'react';
import { View, Text } from 'react-native';

const MapView = ({ style, children, ...props }) => {
  return (
    <View
      style={[
        {
          width: '100%',
          height: 300,
          backgroundColor: '#e0e0e0',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
          border: '1px solid #ccc',
        },
        style,
      ]}
      {...props}
    >
      <Text style={{ color: '#666', fontSize: 16 }}>Map View (Web Preview)</Text>
      {children}
    </View>
  );
};

const Marker = ({ children, ...props }) => {
  return (
    <View style={{ position: 'absolute' }} {...props}>
      {children}
    </View>
  );
};

const Callout = ({ children, ...props }) => {
  return <View {...props}>{children}</View>;
};

MapView.Marker = Marker;
MapView.Callout = Callout;

export default MapView;
export { Marker, Callout };