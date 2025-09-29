import { motion, type Variants } from "framer-motion";
import naratorimg from "../../assets/narator.jpg";
import tylerimg from "../../assets/tyler.jpg";
import FuzzyText from "./FuzzyText";
const LoadingScreen = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5, delay: 1 } },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: { opacity: 0.4, filter: "blur(0px)", transition: { duration: 1.5, delay: 0.2 } },
  };

  const listVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.5, delayChildren: 1.5 } },
  };

  const listItemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Grungy Background Texture */}
      <motion.div
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1565214222393-27c11b3875d7?q=80&w=1887&auto=format&fit=crop')",
        }}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10 }}
      />

      {/* Bottom Left Image: Tyler Durden - responsive */}
      <motion.img
        src={tylerimg}
        alt="Tyler Durden"
        className="absolute left-0 bottom-0 w-1/2 h-2/3 md:w-2/5 md:h-4/5 object-cover mix-blend-hard-light"
        variants={imageVariants}
      />

      {/* Top Right Image: The Narrator - responsive */}
      <motion.img
        src={naratorimg}
        alt="The Narrator"
        className="absolute right-0 top-0 w-1/2 h-1/2 md:w-1/3 md:h-3/4 object-cover object-top mix-blend-hard-light"
        variants={imageVariants}
      />

      {/* Main Content Area */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        {/* Main Title */}
        <motion.div 
          className="w-full text-center md:text-left pt-8 md:pt-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <h1 className="font-mono text-5xl sm:text-7xl md:text-8xl font-black uppercase text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            <FuzzyText
            baseIntensity={0.3}
            hoverIntensity={0.5}
            enableHover={true}
            color="red"
            >Fight Club</FuzzyText>
          </h1>
        </motion.div>

        {/* Rules of Fight Club */}
        <motion.ul
          className="w-full max-w-md text-left font-mono text-sm sm:text-base text-gray-300 space-y-2 pb-8 md:pb-16"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.li variants={listItemVariants}>
            <span className="text-red-500 font-bold mr-2">1.</span> You do *NOT* talk about FIGHT CLUB.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <span className="text-red-500 font-bold mr-2">2.</span> You *DO NOT* talk about FIGHT CLUB.
          </motion.li>
           <motion.li variants={listItemVariants} className="text-gray-500">
            <span className="text-gray-600 font-bold mr-2">3.</span> If someone says stop, goes limp, taps out, the fight is over.
          </motion.li>
        </motion.ul>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
