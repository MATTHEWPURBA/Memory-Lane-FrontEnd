import React from 'react';
import { PaperProvider as OriginalPaperProvider } from 'react-native-paper';

interface PaperProviderPolyfillProps {
  children: React.ReactNode;
  theme?: any;
}

const PaperProviderPolyfill: React.FC<PaperProviderPolyfillProps> = ({ 
  children, 
  theme 
}) => {
  // Create a theme that disables font icons
  const webSafeTheme = {
    ...theme,
    // Disable font icons in the theme
    fonts: {
      ...theme?.fonts,
      // Override any font-related properties
    },
  };

  return (
    <OriginalPaperProvider theme={webSafeTheme}>
      {children}
    </OriginalPaperProvider>
  );
};

export default PaperProviderPolyfill; 