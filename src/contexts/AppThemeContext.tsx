import React, { createContext, useContext, ReactNode } from 'react';
import { colors, spacing, fontSize } from '../theme/colors';

type ThemeContextType = {
  colors: typeof colors;
  spacing: typeof spacing;
  fontSize: typeof fontSize;
};

const AppThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const value: ThemeContextType = {
    colors,
    spacing,
    fontSize,
  };

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within AppThemeProvider');
  }
  return context;
}
