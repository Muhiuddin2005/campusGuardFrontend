import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { IncidentCategory } from '../types';

type ReportDraft = {
  category: IncidentCategory | null;
  description: string;
  incidentLocation: string;
  occurredAt: string;
};

type ReportDraftContextType = {
  draft: ReportDraft;
  updateDraft: (updates: Partial<ReportDraft>) => void;
  clearDraft: () => void;
};

const initialDraft: ReportDraft = {
  category: null,
  description: '',
  incidentLocation: '',
  occurredAt: '',
};

const ReportDraftContext = createContext<ReportDraftContextType | undefined>(undefined);

export function ReportDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<ReportDraft>(initialDraft);
  const appState = useRef(AppState.currentState);

  // Clear draft when app goes to background (security requirement)
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
        // App is going to background - clear draft for security
        setDraft(initialDraft);
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  const updateDraft = (updates: Partial<ReportDraft>) => {
    setDraft((prev) => ({ ...prev, ...updates }));
  };

  const clearDraft = () => {
    setDraft(initialDraft);
  };

  return (
    <ReportDraftContext.Provider value={{ draft, updateDraft, clearDraft }}>
      {children}
    </ReportDraftContext.Provider>
  );
}

export function useReportDraft() {
  const context = useContext(ReportDraftContext);
  if (!context) {
    throw new Error('useReportDraft must be used within ReportDraftProvider');
  }
  return context;
}
