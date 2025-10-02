import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';

// Core Components for Layout and Routing
import Layout from './components/core/Layout';
import ProtectedRoute from './components/core/ProtectedRoute';

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
 * The root component of the application, managing routing.
 */
function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <Layout>
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
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;