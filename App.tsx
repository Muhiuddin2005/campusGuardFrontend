import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppThemeProvider } from './src/contexts/AppThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { ReportDraftProvider } from './src/contexts/ReportDraftContext';
import RootNavigator from './src/navigation/RootNavigator';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <AuthProvider>
          <ReportDraftProvider>
            <StatusBar style="light" />
            <RootNavigator />
          </ReportDraftProvider>
        </AuthProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}
