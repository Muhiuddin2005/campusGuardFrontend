import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthorityProfile } from '../types';
import { deleteSecureItem, getSecureItem, setSecureItem } from '../storage/secureStorage';

type AuthContextType = {
  token: string | null;
  user: AuthorityProfile | null;
  isLoading: boolean;
  login: (token: string, user: AuthorityProfile) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'campusguard_auth_token';
const USER_KEY = 'campusguard_auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthorityProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load stored auth on mount
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await getSecureItem(TOKEN_KEY);
      const storedUser = await getSecureItem(USER_KEY);
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to load auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (newToken: string, newUser: AuthorityProfile) => {
    setToken(newToken);
    setUser(newUser);
    
    await setSecureItem(TOKEN_KEY, newToken);
    await setSecureItem(USER_KEY, JSON.stringify(newUser));
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    
    await deleteSecureItem(TOKEN_KEY);
    await deleteSecureItem(USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
