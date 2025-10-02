import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GlitchHeading from '../components/ui/GlitchHeading';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingScreen from '../components/ui/LoadingScreen';
import marla from "../assets/marla.jpg";

// Helper component for the rule cards
const RuleCard = ({ number, text }: { number: string; text: string }) => (
  <motion.div 
    className="border border-gray-700 p-4 rounded-lg bg-black/30 backdrop-blur-sm"
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
  >
    <div className="flex items-baseline">
      <span className="text-red-600 font-black text-2xl mr-4">{number}</span>
      <p className="text-gray-300">{text}</p>
    </div>
  </motion.div>
);

/**
 * The landing page with the DFClub rules and an 18+ age gate,
 * redesigned with a stylish, modern aesthetic and a background image.
 * Shows a loading screen for 5 seconds before displaying content.
 */
const LandingPage = () => {
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Show loading screen for 5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    if (agreed) {
      navigate('/auth');
    }
  };

  const rules = [
    "You do NOT talk about FIGHT CLUB.",
    "You DO NOT talk about FIGHT CLUB.",
    "If someone says stop, goes limp, taps out, the fight is over.",
    "Only two guys to a fight.",
    "One fight at a time.",
    "No shirts, no shoes.",
    "Fights will go on as long as they have to.",
    "If this is your first night at FIGHT CLUB, you HAVE to fight."
  ];

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <LoadingScreen key="loading-screen" />
      ) : (
        <motion.div 
          key="landing-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Background Image Container */}
          <div className="fixed top-0 left-0 w-full h-full z-0">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ 
                // Placeholder image for Marla Singer
                backgroundImage: `url('${marla}')` 
              }} 
            />
            {/* Overlay to darken and style the background */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm backdrop-saturate-50"></div>
          </div>
          
          {/* Main content container, positioned above the background */}
          <div className="relative z-10 space-y-24 md:space-y-32 py-12 px-4">
            {/* Hero Section */}
            <div className="text-center pt-16 md:pt-24">
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <GlitchHeading text="The first rule of Digital Fight Club:" as="h1" className="text-3xl md:text-5xl" />
                <p className="mt-2 text-xl md:text-3xl text-gray-400">You don't talk about it.</p>
              </motion.div>
            </div>

            {/* Rules Grid */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } }
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {rules.map((rule, index) => (
                <RuleCard key={index} number={`${index + 1}`} text={rule} />
              ))}
            </motion.div>

            {/* Quote Card */}
            <motion.div
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-pink-500/50 text-center bg-black/50">
                <GlitchHeading 
                  text="You are not a beautiful or unique snowflake." 
                  as="h2" 
                  className="text-2xl md:text-4xl" 
                />
                <p className="mt-2 text-lg md:text-xl text-gray-400">
                  You're the same decaying organic matter as everything else.
                </p>
              </Card>
            </motion.div>
            
            {/* Final Call to Action / Age Gate */}
            <motion.div 
              className="mt-12 p-6 md:p-8 bg-gray-900/60 border border-gray-700 rounded-lg max-w-2xl mx-auto backdrop-blur-md"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.8 }}
            >
              <GlitchHeading text="Initiation" as="h3" className="text-2xl text-center mb-4 text-pink-500" />
              <label className="flex items-center justify-center cursor-pointer p-4 rounded-md transition-colors hover:bg-gray-700/50">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                  className="h-5 w-5 bg-gray-700 border-gray-600 rounded text-pink-500 focus:ring-pink-500"
                />
                <span className="ml-4 text-sm sm:text-base text-gray-300">I confirm I am 18 or older and agree to the rules.</span>
              </label>
              <Button 
                onClick={handleEnter} 
                disabled={!agreed} 
                className="w-full mt-6 py-3 text-lg" 
                variant="primary"
              >
                [ Join The Club ]
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LandingPage;