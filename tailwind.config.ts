import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Fantasy theme colors based on design document
        fantasy: {
          // Primary: Deep midnight blues and rich purples for mystical depth
          'midnight-dark': '#0B1426',
          'midnight': '#1E293B',
          'purple-dark': '#4C1D95',
          'purple': '#6B21A8',
          
          // Secondary: Warm copper and antique gold for magical warmth
          'copper': '#B45309',
          'gold-antique': '#D97706',
          
          // Accent: Luminous gold and ethereal silver for highlights and magic effects
          'gold-luminous': '#FBBF24',
          'silver': '#E5E7EB',
          
          // Neutral: Charcoal grays and parchment whites
          'charcoal-dark': '#374151',
          'charcoal': '#6B7280',
          'parchment': '#F9FAFB',
          'parchment-warm': '#F3F4F6',
          
          // Fantasy Elements
          'emerald': '#059669', // nature magic
          'crimson': '#DC2626', // fire magic
        },
      },
      fontFamily: {
        'sans': ['var(--font-inter)', 'Inter', 'sans-serif'],
        'fantasy-serif': ['var(--font-cinzel)', 'Cinzel', 'serif'],
        'fantasy-display': ['MedievalSharp', 'cursive'],
      },
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
        '3xl': '1920px',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1440px',
        },
      },
      backgroundImage: {
        'fantasy-gradient': 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
        'magical-glow': 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
      },
      animation: {
        'twinkle': 'twinkle 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'typewriter': 'typewriter 3s steps(40, end)',
      },
      keyframes: {
        twinkle: {
          '0%': { opacity: '0.3' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 215, 0, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.8)' },
        },
        typewriter: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
      },
      boxShadow: {
        'magical': '0 0 20px rgba(255, 215, 0, 0.3)',
        'mystical': '0 0 30px rgba(139, 69, 19, 0.4)',
        'fantasy-card': '0 8px 32px rgba(0, 0, 0, 0.5)',
        'fantasy-glow': '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3)',
        'fantasy-border': '0 0 15px rgba(255, 215, 0, 0.3)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      fontSize: {
        'fantasy-xs': ['0.75rem', { lineHeight: '1rem' }],
        'fantasy-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'fantasy-base': ['1rem', { lineHeight: '1.6rem' }],
        'fantasy-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'fantasy-xl': ['1.25rem', { lineHeight: '1.75rem' }],
        'fantasy-2xl': ['1.5rem', { lineHeight: '2rem' }],
        'fantasy-3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        'fantasy-4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        'fantasy-5xl': ['3rem', { lineHeight: '1' }],
        'fantasy-6xl': ['3.75rem', { lineHeight: '1' }],
      },
      borderRadius: {
        'fantasy': '12px',
        'fantasy-lg': '16px',
        'fantasy-xl': '20px',
      },
      backdropBlur: {
        'fantasy': '10px',
        'fantasy-lg': '16px',
      },
    },
  },
  plugins: [],
}

export default config