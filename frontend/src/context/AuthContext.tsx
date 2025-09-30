import {  useState, useEffect, type ReactNode } from 'react';
import { type User } from '../types';
import * as api from '../api/auth';

/**
 * This interface defines the shape of the authentication context's value.
 * It's what components will receive when they use the `useAuth` hook.
 */
export interface AuthContextType {
  user: User | null;
  isLoading: boolean; // Indicates if the initial session check is running
  login: (secretPhrase?: string) => Promise<User | null>;
  logout: () => Promise<void>;
  restoreSession: (publicName: string, secretPhrase: string) => Promise<User | null>;
}

import { AuthContext } from './AuthContextProvider';

/**
 * This component provides the authentication state and functions to the entire app.
 * It handles the logic for session checking, login, logout, and restore.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  // Start in a loading state. This is crucial to prevent the app from rendering
  // before we know if the user is logged in or not.
  const [isLoading, setIsLoading] = useState(true);

  // This useEffect is the key to keeping the user logged in across reloads.
  // It runs only ONCE when the app first loads.
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        // We make an API call to the backend to check for a valid session cookie.
        const currentUser = await api.checkSession();
        setUser(currentUser); // If the call succeeds, the user is logged in.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // A 401 error here is expected if the user is not logged in.
        // It's not a bug, so we just ensure the user state is null.
        console.log("No active session found.");
        setUser(null);
      } finally {
        // No matter the outcome, the initial check is complete.
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []); // The empty dependency array [] ensures this runs only once.

  const login = async (secretPhrase?: string): Promise<User | null> => {
    setIsLoading(true);
    try {
      const newUser = await api.createAnonymousSession(secretPhrase);
      setUser(newUser);
      return newUser;
    } catch (error) {
      console.error("Login failed:", error);
      setUser(null);
      throw error; // Re-throw error for the UI component to handle
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
      throw error; // Re-throw error for the UI component to display
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout(); // Invalidate the session on the server
    } catch (error) {
      console.error("Logout failed on server:", error);
    } finally {
      setUser(null); // Always clear the user from the frontend state
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, restoreSession }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to easily access the AuthContext from any component.
 * NOTE: Exporting this from the same file may trigger a Fast Refresh warning in Vite.
 * For the best development experience, this could be moved to its own file.
 */

