import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlitchHeading from '../components/ui/GlitchHeading';
import Button from '../components/ui/Button';

/**
 * The landing page with the DFClub rules and an 18+ age gate.
 */
const LandingPage = () => {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleEnter = () => {
    if (agreed) {
      navigate('/auth');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-8rem)]">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        
        <
          GlitchHeading text="The first rule of Digital Fight Club:" as="h1" className="text-3xl md:text-5xl " />
        <p className="mt-2 text-xl md:text-3xl text-gray-400">You don’t talk about it.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="mt-8">
        <GlitchHeading text="The second rule:" as="h2" className="text-2xl md:text-4xl " />
        <p className="mt-2 text-lg md:text-2xl text-gray-400">You don’t log in with your real name.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1 }} className="mt-12 p-6 border border-yellow-500/50 rounded-lg max-w-md">
        <label className="flex items-center justify-center cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
            className="h-4 w-4 bg-gray-700 border-gray-600 rounded text-red-600 focus:ring-red-500"
          />
          <span className="ml-3 text-sm text-gray-300">I confirm I am 18 or older and agree to the rules.</span>
        </label>
        <Button onClick={handleEnter} disabled={!agreed} className="w-full mt-4" variant="danger">
          [ Enter ]
        </Button>
      </motion.div>
    </div>
  );
};

export default LandingPage;
