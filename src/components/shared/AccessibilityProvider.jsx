import React from 'react';
import { useTheme } from '@mui/material/styles';

export const AccessibilityContext = React.createContext({});

export const AccessibilityProvider = ({ children }) => {
  const theme = useTheme();

  React.useEffect(() => {
    // Add high contrast focus outlines
    document.body.style.setProperty(
      '--focus-outline-color',
      theme.palette.mode === 'light' ? '#1a73e8' : '#90caf9'
    );
  }, [theme.palette.mode]);

  return (
    <AccessibilityContext.Provider value={{}}>
      {children}
    </AccessibilityContext.Provider>
  );
}; 