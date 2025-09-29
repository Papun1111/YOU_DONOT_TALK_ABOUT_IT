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

/**
 * The root component of the application.
 * It now manages the initial loading screen state.
 */
function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    // Set a timer to hide the loading screen after 5 seconds
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 5000); // 5000 milliseconds = 5 seconds

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <AnimatePresence>
            {isAppLoading ? (
              <LoadingScreen />
            ) : (
              <Layout>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/safety" element={<SafetyPage />} />

                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/rooms" element={<RoomsPage />} />
                    <Route path="/rooms/:roomKey" element={<RoomDetailPage />} />
                    <Route path="/feed" element={<FeedPage />} />
                    <Route path="/leaderboard" element={<LeaderboardPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Route>

                  {/* Catch-all for undefined routes (optional) */}
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

