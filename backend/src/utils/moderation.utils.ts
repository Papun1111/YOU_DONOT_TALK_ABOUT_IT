/**
 * @fileoverview Utility functions for generating anonymous user identities.
 * Includes pseudonym generation and procedural SVG avatar creation.
 */

// --- Pseudonym Generation ---

// Thematic word lists for generating subversive pseudonyms.
const ADJECTIVES = [
  'Silent', 'Glitched', 'Hidden', 'Rogue', 'Static', 'Fading', 'Broken',
  'Anonymous', 'Forgotten', 'Nameless', 'Digital', 'Volatile', 'Erratic',
];
const NOUNS = [
  'Variable', 'Echo', 'Cipher', 'Ghost', 'Signal', 'Glitch', 'Agent',
  'Anomaly', 'Phantom', 'Relic', 'Byte', 'Protocol', 'Void', 'Fragment',
];

/**
 * Generates a unique, thematic pseudonym.
 * @returns {string} A pseudonym in the format "Adjective_Noun_123".
 */
export const generatePseudonym = (): string => {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const number = Math.floor(100 + Math.random() * 900); // 3-digit number
  return `${adjective}_${noun}_${number}`;
};


// --- Glitchy SVG Avatar Generation ---

/**
 * Creates a deterministic, glitchy SVG avatar based on a seed string (e.g., a pseudonym).
 * The same seed will always produce the same avatar.
 * @param {string} seed - The input string to seed the generator.
 * @returns {string} A string containing the full SVG markup.
 */
export const generateAvatar = (seed: string): string => {
  // Simple hashing function to convert the seed string into a number.
  const simpleHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  const hash = simpleHash(seed);

  // Use the hash to generate deterministic properties for the SVG.
  const hue = hash % 360;
  const saturation = 50 + (hash % 25); // Keep saturation in a cool, dark range
  const lightness = 25 + (hash % 15); // Darker avatars
  const backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  const foregroundHue = (hue + 180) % 360; // Opposite color for contrast
  const foregroundColor = `hsl(${foregroundHue}, 70%, 75%)`;

  // Generate random-looking but deterministic shapes.
  const rects = Array.from({ length: 5 }).map((_, i) => {
    const x = (hash * (i + 1)) % 80 + 10;
    const y = (hash * (i + 3)) % 80 + 10;
    const width = (hash * (i + 5)) % 30 + 10;
    const height = (hash * (i + 7)) % 30 + 10;
    const opacity = `0.${(hash * (i + 2)) % 5 + 3}`; // Opacity between 0.3 and 0.8
    return `<rect x="${x}" y="${y}" width="${width}" height="${height}" opacity="${opacity}" />`;
  }).join('');
  
  // The SVG filter creates the glitch effect.
  // feTurbulence creates noise, and feDisplacementMap uses that noise to distort the shapes.
  const svg = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glitch">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" result="turbulence" />
          <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="${(hash % 5) + 1}" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <rect width="100" height="100" fill="${backgroundColor}" />
      <g fill="${foregroundColor}" filter="url(#glitch)">
        ${rects}
      </g>
    </svg>
  `;

  // Return a base64 encoded version for easy use in image tags.
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

