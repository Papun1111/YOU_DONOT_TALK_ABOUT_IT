import { motion,type Variants } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';

interface GlitchHeadingProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'div' | 'span';
  className?: string;
}

/**
 * A heading component that displays text with a glitchy, jittery animation effect.
 * The animation is disabled if the user has `prefers-reduced-motion` enabled.
 */
const GlitchHeading = ({
  text,
  as: Component = 'h1',
  className,
}: GlitchHeadingProps) => {
  const { reduceMotion } = useSettings();

  const jitterVariants: Variants = {
    initial: { x: 0, y: 0 },
    animate: {
      x: [-0.5, 0.5, 0, -0.5, 0.5],
      y: [0.5, 0, -0.5, 0.5, 0],
      transition: {
        duration: 0.15,
        repeat: Infinity,
        repeatType: 'reverse',
      },
    },
  };

  return (
    <Component className={className}>
      <motion.span
        initial="initial"
        whileHover={reduceMotion ? 'initial' : 'animate'}
        variants={jitterVariants}
        aria-label={text}
        className="inline-block relative"
      >
        {/* The original text */}
        <span className="relative z-10 bg-gradient-to-r from-slate-100 via-red-700 to-red-400 bg-clip-text text-transparent">{text}</span>
        {/* The glitch layers */}
        {!reduceMotion && (
          <>
            <span
              className="absolute top-0 left-0 w-full h-full text-red-500 opacity-80"
              style={{ clipPath: 'inset(25% 0 50% 0)' }}
            >
              {text}
            </span>
            <span
              className="absolute top-0 left-0 w-full h-full text-cyan-400 opacity-80"
              style={{ clipPath: 'inset(50% 0 25% 0)' }}
            >
              {text}
            </span>
          </>
        )}
      </motion.span>
    </Component>
  );
};

export default GlitchHeading;

