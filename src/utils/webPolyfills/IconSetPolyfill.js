// Web polyfill for createIconSet
import React from 'react';

const createIconSet = (glyphMap, fontFamily, fontStyle, expoAssetId) => {
  return class Icon extends React.Component {
    static defaultProps = {
      size: 24,
      color: '#000',
    };

    render() {
      const { size, color, style, name, ...props } = this.props;
      
      // For web, we'll use a simple text-based icon
      return (
        <span
          style={{
            fontSize: size,
            color: color,
            fontFamily: 'monospace',
            display: 'inline-block',
            width: size,
            height: size,
            textAlign: 'center',
            lineHeight: `${size}px`,
            ...style,
          }}
          {...props}
        >
          {name ? name.charAt(0).toUpperCase() : 'I'}
        </span>
      );
    }
  };
};

const createIconButtonComponent = (Icon) => {
  return class IconButton extends React.Component {
    static defaultProps = {
      size: 24,
      color: '#000',
    };

    render() {
      const { size, color, style, name, onPress, ...props } = this.props;
      
      return (
        <button
          onClick={onPress}
          style={{
            fontSize: size,
            color: color,
            fontFamily: 'monospace',
            display: 'inline-block',
            width: size,
            height: size,
            textAlign: 'center',
            lineHeight: `${size}px`,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            ...style,
          }}
          {...props}
        >
          {name ? name.charAt(0).toUpperCase() : 'I'}
        </button>
      );
    }
  };
};

export { createIconSet, createIconButtonComponent }; 