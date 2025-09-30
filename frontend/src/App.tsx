import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';

// Core Components for Layout and Routing
import Layout from './components/core/Layout';
import ProtectedRoute from './components/core/ProtectedRoute';
import LoadingScreen from './components/ui/LoadingScreen';

// Page Components
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import RoomsPage from './pages/RoomsPage';
import RoomDetailPage from './pages/RoomDetailPage';
import FeedPage from './pages/FeedPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import SafetyPage from './pages/SafetyPage';

// --- Configuration ---
const LOADER_TIMESTAMP_KEY = 'loaderLastShownTimestamp';
const LOADER_EXPIRATION_HOURS = 4; // The loader will reappear after this many hours.
const LOADER_DURATION_MS = 5000; // 5 seconds.

/**
 * Checks if the loading screen should be displayed based on the timestamp in localStorage.
 * @returns {boolean} True if the loader should be shown, otherwise false.
 */
const checkLoaderVisibility = () => {
  const lastShownTimestamp = localStorage.getItem(LOADER_TIMESTAMP_KEY);
  
  // If no timestamp exists, it's the first visit. Show the loader.
  if (!lastShownTimestamp) {
    return true;
  }

  const expirationTimeMs = LOADER_EXPIRATION_HOURS * 60 * 60 * 1000;
  const timeSinceLastShown = Date.now() - parseInt(lastShownTimestamp, 10);

  // Show the loader if the expiration time has passed.
  return timeSinceLastShown > expirationTimeMs;
};


/**
 * The root component of the application, managing routing and the initial loading screen.
 */
function App() {
  // The initial state is determined by our helper function.
  // This check runs only once when the component first mounts.
  const [isAppLoading, setIsAppLoading] = useState(checkLoaderVisibility);

  useEffect(() => {
    // This effect only proceeds if the initial check determined the loader should be shown.
    if (!isAppLoading) {
      return;
    }

    // Set a timer to hide the loading screen after the specified duration.
    const timer = setTimeout(() => {
      setIsAppLoading(false);
      // Once the loader is hidden, update the timestamp in localStorage to the current time.
      localStorage.setItem(LOADER_TIMESTAMP_KEY, Date.now().toString());
    }, LOADER_DURATION_MS);

    // Cleanup function to clear the timer if the component unmounts.
    return () => clearTimeout(timer);
  }, [isAppLoading]); // The effect depends on the loading state.

  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          {/* AnimatePresence ensures smooth transitions between the loader and the main app */}
          <AnimatePresence mode="wait">
            {isAppLoading ? (
              <LoadingScreen key="loading-screen" />
            ) : (
              <Layout key="app-layout">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/safety" element={<SafetyPage />} />

                  {/* Protected Routes that require authentication */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/rooms" element={<RoomsPage />} />
                    <Route path="/rooms/:roomKey" element={<RoomDetailPage />} />
                    <Route path="/feed" element={<FeedPage />} />
                    <Route path="/leaderboard" element={<LeaderboardPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Route>

                  {/* A catch-all route that redirects to the landing page */}
                  <Route path="*" element={<LandingPage />} />
                </Routes>
              </Layout>
            )}
          </AnimatePresence>
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;

