import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * A component that renders its children only if the user is authenticated.
 * Otherwise, it redirects them to the authentication page.
 * It also handles the initial loading state of the session check.
 */
const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  // While the session is being verified, show a loading state to prevent
  // a flash of the login page for already authenticated users.
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Authenticating session...</p>
      </div>
    );
  }

  // If loading is finished and there's no user, redirect to the auth page.
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If the user is authenticated, render the nested routes.
  return <Outlet />;
};

export default ProtectedRoute;
