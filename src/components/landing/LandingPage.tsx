'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StarfieldBackground, FloatingOrbs, AnimatedGradient, MagicalBorder } from '../visual-effects';
import { ResponsiveLayout, ResponsiveContainer, ResponsiveGrid } from '../layout';

interface LandingPageProps {
  onStartQuiz?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartQuiz }) => {
  const handleStartClick = () => {
    if (onStartQuiz) {
      onStartQuiz();
    }
  };

  return (
    <ResponsiveLayout variant="page" enableMobileOptimizations={true}>
      {/* Background Effects */}
      <StarfieldBackground className="opacity-80" starCount={150} />
      <AnimatedGradient variant="aurora" intensity="medium" speed="normal" />
      <FloatingOrbs orbCount={8} />

      {/* Main Content */}
      <ResponsiveContainer variant="default" enableMotion={true} className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center w-full">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            {/* Main Title */}
            <h1 className="fantasy-display text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 sm:mb-6 leading-tight">
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.2 }}
                className="block text-fantasy-gold-luminous drop-shadow-2xl"
              >
                Fantasy Story
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.4 }}
                className="block text-fantasy-silver drop-shadow-2xl"
              >
                Builder
              </motion.span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="fantasy-heading text-lg sm:text-xl md:text-2xl text-fantasy-parchment mb-8 leading-relaxed max-w-3xl mx-auto"
            >
              Embark on a mystical journey where your choices shape destiny. 
              Answer questions about your character and world to forge a unique, 
              AI-powered fantasy adventure that centers around you as the hero.
            </motion.p>

            {/* Feature Highlights */}
            <ResponsiveGrid
              columns={{ xs: 1, sm: 3, md: 3, lg: 3 }}
              gap="medium"
              enableStagger={true}
              className="mb-12 max-w-2xl mx-auto"
            >
              <div className="text-center">
                <div className="text-fantasy-gold-luminous text-2xl mb-2">✨</div>
                <p className="fantasy-body text-sm sm:text-base text-fantasy-parchment">
                  Personalized Stories
                </p>
              </div>
              <div className="text-center">
                <div className="text-fantasy-emerald text-2xl mb-2">🏰</div>
                <p className="fantasy-body text-sm sm:text-base text-fantasy-parchment">
                  Rich Fantasy Worlds
                </p>
              </div>
              <div className="text-center">
                <div className="text-fantasy-purple text-2xl mb-2">⚔️</div>
                <p className="fantasy-body text-sm sm:text-base text-fantasy-parchment">
                  Epic Adventures
                </p>
              </div>
            </ResponsiveGrid>
          </motion.div>

          {/* Call-to-Action Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mb-8"
          >
            <MagicalBorder
              variant="ornate"
              glowColor="gold"
              animated={true}
              thickness="medium"
              className="inline-block"
            >
              <motion.button
                onClick={handleStartClick}
                className="fantasy-button-primary text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 font-fantasy-serif font-semibold tracking-wide relative overflow-hidden group"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(255, 215, 0, 0.6)"
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Button Background Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-fantasy-gold-luminous via-fantasy-gold-antique to-fantasy-gold-luminous opacity-0 group-hover:opacity-20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
                
                {/* Button Text */}
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span>Begin Your Quest</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-2xl"
                  >
                    ⚡
                  </motion.span>
                </span>
              </motion.button>
            </MagicalBorder>
          </motion.div>

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center"
          >
            <p className="fantasy-body text-sm sm:text-base text-fantasy-charcoal max-w-lg mx-auto leading-relaxed">
              Your journey awaits, brave adventurer. Step into a world where magic flows through every choice, 
              and your story becomes legend.
            </p>
          </motion.div>
        </div>

        </ResponsiveContainer>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-fantasy-gold-luminous text-2xl opacity-60"
          >
            ✦
          </motion.div>
        </motion.div>

        {/* Ambient Glow Effects */}
        <div className="fixed inset-0 pointer-events-none z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fantasy-purple opacity-10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-fantasy-gold-luminous opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-fantasy-emerald opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
    </ResponsiveLayout>
  );
};

export default LandingPage;