
// src/utils/webPolyfills/MapViewPolyfill.ts
import React from 'react';

const MapView = ({ style, children, ...props }: any) => {
  return React.createElement(
    'div',
    {
      style: {
        width: '100%',
        height: 300,
        backgroundColor: '#e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        border: '1px solid #ccc',
        ...style,
      },
    },
    React.createElement('span', null, 'Map View (Web Preview)')
  );
};

const Marker = ({ children, ...props }: any) => null;

export default MapView;
export { Marker };
