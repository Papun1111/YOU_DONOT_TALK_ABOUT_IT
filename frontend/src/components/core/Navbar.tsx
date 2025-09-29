import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';
// A glitch text component will be created later in ui/
// For now, we'll just style it.

import FuzzyText from '../ui/FuzzyText';

const Navbar = () => {
  const { user, logout } = useAuth();
  
  // Updated linkClass function to use template literals instead of the 'cn' utility.
  // Tailwind v4 handles merging these classes automatically.
  const linkClass = ({ isActive }: { isActive: boolean }) => {
    const baseClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-700 hover:text-white";
    const activeClasses = "bg-gray-800 text-red-400";
    const inactiveClasses = "text-gray-300";
    
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <header className="bg-transparent backdrop-blur-sm sticky top-0 z-50 border-b border-gray-700/50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <NavLink to="/" className="text-white">
               <FuzzyText  baseIntensity={0.1} 
  hoverIntensity={0.5} 
  enableHover={true}
  fontSize={"clamp(1rem, 1.5vw, 1rem)"}
  color='red'>
Fight Club
        </FuzzyText>
            </NavLink>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {user && (
                <>
                  <NavLink to="/rooms" className={linkClass}>Rooms</NavLink>
                  <NavLink to="/feed" className={linkClass}>Feed</NavLink>
                  <NavLink to="/leaderboard" className={linkClass}>Leaderboard</NavLink>
                  <NavLink to="/profile" className={linkClass}>Profile</NavLink>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400 hidden sm:block">
                  :: {user.publicName} ::
                </span>
                <button
                  onClick={logout}
                  className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors"
                  aria-label="Log out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <NavLink to="/auth" className={linkClass}>
                Join_The_Club
              </NavLink>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

