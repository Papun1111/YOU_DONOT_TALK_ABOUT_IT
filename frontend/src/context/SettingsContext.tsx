import { createContext, useState, useEffect, useContext,type ReactNode } from 'react';

interface SettingsContextType {
  reduceMotion: boolean;
  toggleReduceMotion: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [reduceMotion, setReduceMotion] = useState(
    () => window.matchMedia(MOTION_QUERY).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOTION_QUERY);
    
    const handleChange = () => {
      setReduceMotion(mediaQuery.matches);
    };
    
    // Use the modern addEventListener syntax
    mediaQuery.addEventListener('change', handleChange);
    
    // Cleanup listener on component unmount
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleReduceMotion = () => {
    setReduceMotion(prev => !prev);
  };

  return (
    <SettingsContext.Provider value={{ reduceMotion, toggleReduceMotion }}>
      {children}
    </SettingsContext.Provider>
  );
};

/**
 * Custom hook to easily access the SettingsContext.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
