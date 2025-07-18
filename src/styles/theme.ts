// Fantasy Theme Utilities and Constants

export const fantasyColors = {
  // Primary: Deep midnight blues and rich purples for mystical depth
  midnightDark: '#0B1426',
  midnight: '#1E293B',
  purpleDark: '#4C1D95',
  purple: '#6B21A8',
  
  // Secondary: Warm copper and antique gold for magical warmth
  copper: '#B45309',
  goldAntique: '#D97706',
  
  // Accent: Luminous gold and ethereal silver for highlights and magic effects
  goldLuminous: '#FBBF24',
  silver: '#E5E7EB',
  
  // Neutral: Charcoal grays and parchment whites
  charcoalDark: '#374151',
  charcoal: '#6B7280',
  parchment: '#F9FAFB',
  parchmentWarm: '#F3F4F6',
  
  // Fantasy Elements
  emerald: '#059669', // nature magic
  crimson: '#DC2626', // fire magic
} as const;

export const fantasyFonts = {
  sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
  fantasySerif: ['var(--font-cinzel)', 'Cinzel', 'serif'],
  fantasyDisplay: ['MedievalSharp', 'cursive'],
} as const;

export const fantasyBreakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1440px',
  '3xl': '1920px',
} as const;

// Tailwind class combinations for common fantasy elements
export const fantasyClasses = {
  // Typography
  heading: 'font-fantasy-serif font-semibold text-fantasy-gold-luminous drop-shadow-lg',
  display: 'font-fantasy-display text-fantasy-gold-luminous drop-shadow-lg',
  body: 'font-sans text-fantasy-parchment leading-relaxed',
  secondary: 'text-fantasy-charcoal',
  
  // Buttons
  button: 'fantasy-button transition-all duration-300 ease-in-out',
  buttonPrimary: 'fantasy-button-primary transition-all duration-300 ease-in-out',
  
  // Cards
  card: 'fantasy-card backdrop-blur-fantasy',
  cardGlow: 'fantasy-card-glow backdrop-blur-fantasy',
  
  // Inputs
  input: 'fantasy-input transition-all duration-300 ease-in-out',
  
  // Containers
  container: 'container mx-auto px-4 sm:px-6 lg:px-8',
  
  // Backgrounds
  gradientBg: 'bg-fantasy-gradient',
  magicalGlow: 'bg-magical-glow',
  
  // Animations
  twinkle: 'animate-twinkle',
  float: 'animate-float',
  glow: 'animate-glow',
  
  // Responsive text sizes
  textResponsive: {
    xs: 'text-fantasy-xs',
    sm: 'text-fantasy-sm',
    base: 'text-fantasy-base',
    lg: 'text-fantasy-lg',
    xl: 'text-fantasy-xl',
    '2xl': 'text-fantasy-2xl',
    '3xl': 'text-fantasy-3xl',
    '4xl': 'text-fantasy-4xl',
    '5xl': 'text-fantasy-5xl',
    '6xl': 'text-fantasy-6xl',
  },
} as const;

// Helper function to combine classes
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Responsive utility functions
export const getResponsiveClasses = (
  mobile: string,
  tablet?: string,
  desktop?: string,
  large?: string
): string => {
  const classes = [mobile];
  
  if (tablet) classes.push(`md:${tablet}`);
  if (desktop) classes.push(`lg:${desktop}`);
  if (large) classes.push(`xl:${large}`);
  
  return classes.join(' ');
};

// Fantasy theme variants for different component states
export const fantasyVariants = {
  button: {
    primary: 'fantasy-button-primary hover:shadow-fantasy-glow',
    secondary: 'fantasy-button hover:shadow-magical',
    ghost: 'bg-transparent border-2 border-fantasy-gold-luminous text-fantasy-gold-luminous hover:bg-fantasy-gold-luminous hover:text-fantasy-midnight-dark',
  },
  card: {
    default: 'fantasy-card',
    glow: 'fantasy-card-glow',
    bordered: 'fantasy-card fantasy-border',
  },
  text: {
    heading: 'fantasy-heading',
    display: 'fantasy-display',
    body: 'fantasy-body',
    secondary: 'fantasy-secondary',
  },
} as const;

export type FantasyVariant = keyof typeof fantasyVariants;
export type ButtonVariant = keyof typeof fantasyVariants.button;
export type CardVariant = keyof typeof fantasyVariants.card;
export type TextVariant = keyof typeof fantasyVariants.text;