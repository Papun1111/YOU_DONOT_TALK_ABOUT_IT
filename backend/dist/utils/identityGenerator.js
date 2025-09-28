"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAvatar = exports.generatePseudonym = void 0;
const ADJECTIVES = [
    'Silent', 'Glitched', 'Hidden', 'Rogue', 'Static', 'Fading', 'Broken',
    'Anonymous', 'Forgotten', 'Nameless', 'Digital', 'Volatile', 'Erratic',
];
const NOUNS = [
    'Variable', 'Echo', 'Cipher', 'Ghost', 'Signal', 'Glitch', 'Agent',
    'Anomaly', 'Phantom', 'Relic', 'Byte', 'Protocol', 'Void', 'Fragment',
];
const generatePseudonym = () => {
    const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const number = Math.floor(100 + Math.random() * 900); // 3-digit number
    return `${adjective}_${noun}_${number}`;
};
exports.generatePseudonym = generatePseudonym;
const generateAvatar = (seed) => {
    // Simple hashing function to convert the seed string into a number.
    const simpleHash = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0;
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
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};
exports.generateAvatar = generateAvatar;
