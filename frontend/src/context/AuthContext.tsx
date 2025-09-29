import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import { type User } from '../types';
import * as api from '../api/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (secretPhrase?: string) => Promise<User | null>;
  restoreSession: (publicName: string, secretPhrase: string) => Promise<User | null>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>; // Add this for manual session checking
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Start as false, not true

  // Only check session if we have reason to believe there might be one
  const checkSession = async () => {
    setIsLoading(true);
    try {
      const currentUser = await api.checkSession();
      setUser(currentUser);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Don't log error for expected 401s on landing page
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for existing session only on app load
  useEffect(() => {
    // Only check session if we're likely to have one
    // You could also check for the presence of a session cookie here
    const hasSessionCookie = document.cookie.includes('connect.sid');
    
    if (hasSessionCookie) {
      checkSession();
    }
  }, []);

  const login = async (secretPhrase?: string): Promise<User | null> => {
    setIsLoading(true);
    try {
      const newUser = await api.createAnonymousSession(secretPhrase);
      setUser(newUser);
      return newUser;
    } catch (error) {
      console.error("Login failed:", error);
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const restoreSession = async (publicName: string, secretPhrase: string): Promise<User | null> => {
    setIsLoading(true);
    try {
      const restoredUser = await api.restoreSession(publicName, secretPhrase);
      setUser(restoredUser);
      return restoredUser;
    } catch (error) {
      console.error("Session restore failed:", error);
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error("Logout failed on server:", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      restoreSession,
      logout,
      checkSession 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to easily access the AuthContext.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};