import React from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapView = ({ children, region, ...props }) => {
  return (
    <Map
      mapboxAccessToken="YOUR_MAPBOX_TOKEN"
      initialViewState={{
        longitude: region?.longitude || -100,
        latitude: region?.latitude || 40,
        zoom: 10
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      {...props}
    >
      {children}
    </Map>
  );
};

export default MapView;
export { Marker };