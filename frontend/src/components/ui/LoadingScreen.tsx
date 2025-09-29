import { motion, type Variants } from "framer-motion";
import naratorimg from "../../assets/narator.jpg";
import tylerimg from "../../assets/tyler.jpg";
import FuzzyText from "./FuzzyText";
const LoadingScreen = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
    exit: { opacity: 0, transition: { duration: 1, delay: 0.5 } },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 0.5, y: 0, transition: { duration: 1, delay: 0.5 } },
  };

  const textContainerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.3, delayChildren: 1.5 } },
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Background Image: Book Cover */}
      <motion.div
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-10"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=2070&auto=format&fit=crop')",
        }}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 6 }}
      />

      {/* Left Image: The Narrator (Edward Norton) - responsive */}
      <motion.img
        src={naratorimg}
        alt="The Narrator"
        className="absolute left-0 bottom-0 w-1/2 h-2/3 md:w-1/3 md:h-full object-cover object-top opacity-50 mix-blend-screen"
        variants={imageVariants}
      />

      {/* Right Image: Tyler Durden (Brad Pitt) - responsive */}
      <motion.img
        src={tylerimg}
        alt="Tyler Durden"
        className="absolute right-0 bottom-0 w-1/2 h-2/3 md:w-1/3 md:h-full object-cover object-top opacity-50 mix-blend-screen"
        variants={imageVariants}
      />

      {/* Welcome Message - responsive */}
      <motion.div
        className="relative z-10 text-center  text-3xl sm:text-4xl md:text-6xl font-bold uppercase tracking-widest px-4"
        variants={textContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.span
          variants={textVariants}
          className="text-white mix-blend-overlay"
        >
          Welcome
        </motion.span>
        <motion.span
          variants={textVariants}
          className="text-white mx-2 md:mx-4 mix-blend-overlay"
        >
          to
        </motion.span>
        <motion.div variants={textVariants} className="relative inline-block text-red-500">
          <FuzzyText
          baseIntensity={0.3}
          hoverIntensity={0.5}
          color="red"
          enableHover={true}
          >Fight Club</FuzzyText>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen