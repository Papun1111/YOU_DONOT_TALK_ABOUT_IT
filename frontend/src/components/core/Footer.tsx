import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

const Footer = () => {
  const { reduceMotion, toggleReduceMotion } = useSettings();

  return (
    <footer className="bg-gray-900 border-t border-gray-700/50 mt-auto">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500">
        <div className="flex justify-center items-center gap-4">
            <Link to="/safety" className="hover:text-red-400 transition-colors">Safety Policy</Link>
            <span>|</span>
            <button onClick={toggleReduceMotion} className="hover:text-red-400 transition-colors">
              {reduceMotion ? 'Enable Motion' : 'Reduce Motion'}
            </button>
        </div>
        <p className="mt-2">
            The first rule of Digital Fight Club: You don’t talk about it.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
