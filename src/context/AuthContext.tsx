import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, User, setStoredToken, removeStoredToken, getStoredToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const currentToken = getStoredToken();
    if (!currentToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await api.auth.getMe();
      setUser(currentUser);
      setToken(currentToken);
    } catch {
      removeStoredToken();
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string, remember: boolean = true) => {
    const res = await api.auth.login(email, password);
    setStoredToken(res.access_token, remember);
    setToken(res.access_token);
    setUser(res.user);
  };

  const register = async (fullName: string, email: string, password: string) => {
    const res = await api.auth.register(fullName, email, password);
    setStoredToken(res.access_token, true);
    setToken(res.access_token);
    setUser(res.user);
  };

  const logout = () => {
    try {
      api.auth.logout().catch(() => {});
    } finally {
      removeStoredToken();
      setUser(null);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
