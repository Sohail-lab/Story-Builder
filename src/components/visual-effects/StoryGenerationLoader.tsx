'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner } from './LoadingSpinner';

interface StoryGenerationLoaderProps {
  isVisible: boolean;
  progress?: number; // 0-100
  className?: string;
  onComplete?: () => void;
}

const STORY_PHASES = [
  { text: "Gathering your character essence...", duration: 2000 },
  { text: "Weaving the threads of destiny...", duration: 3000 },
  { text: "Consulting the ancient tomes...", duration: 2500 },
  { text: "Shaping your world...", duration: 3500 },
  { text: "Breathing life into your tale...", duration: 2000 },
  { text: "Adding the final magical touches...", duration: 1500 }
];

export const StoryGenerationLoader: React.FC<StoryGenerationLoaderProps> = ({
  isVisible,
  progress = 0,
  className = '',
  onComplete
}) => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);

  // Auto-advance phases based on progress or time
  useEffect(() => {
    if (!isVisible) {
      setCurrentPhaseIndex(0);
      setDisplayProgress(0);
      return;
    }

    // If progress is provided, use it to determine phase
    if (progress > 0) {
      const phaseIndex = Math.min(
        Math.floor((progress / 100) * STORY_PHASES.length),
        STORY_PHASES.length - 1
      );
      setCurrentPhaseIndex(phaseIndex);
      setDisplayProgress(progress);
      return;
    }

    // Otherwise, auto-advance phases with timing
    const timer = setTimeout(() => {
      setCurrentPhaseIndex(prev => {
        const next = prev + 1;
        if (next >= STORY_PHASES.length) {
          if (onComplete) onComplete();
          return prev;
        }
        return next;
      });
    }, STORY_PHASES[currentPhaseIndex]?.duration || 2000);

    return () => clearTimeout(timer);
  }, [isVisible, currentPhaseIndex, progress, onComplete]);

  // Animate progress bar
  useEffect(() => {
    if (!isVisible) return;

    const targetProgress = progress > 0 
      ? progress 
      : ((currentPhaseIndex + 1) / STORY_PHASES.length) * 100;

    const progressTimer = setInterval(() => {
      setDisplayProgress(prev => {
        const diff = targetProgress - prev;
        if (Math.abs(diff) < 1) return targetProgress;
        return prev + diff * 0.1;
      });
    }, 50);

    return () => clearInterval(progressTimer);
  }, [isVisible, currentPhaseIndex, progress]);

  const currentPhase = STORY_PHASES[currentPhaseIndex];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`flex items-center justify-center min-h-[600px] ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Enhanced Magical Particles - more visible and themed */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 20 }).map((_, index) => (
              <motion.div
                key={index}
                className="absolute rounded-full"
                style={{
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  background: 'radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, transparent 70%)',
                  boxShadow: '0 0 12px rgba(255, 215, 0, 0.6)',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, Math.random() * 30 - 15, 0],
                  opacity: [0.4, 1, 0.4],
                  scale: [0.5, 1.2, 0.5]
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeInOut"
                }}
              />
            ))}

            {/* Additional sparkle effects */}
            {Array.from({ length: 8 }).map((_, index) => (
              <motion.div
                key={`sparkle-${index}`}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: '4px',
                  height: '4px',
                }}
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  delay: Math.random() * 4,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              >
                <div
                  className="w-full h-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.9) 0%, transparent 70%)',
                    boxShadow: '0 0 8px rgba(255, 215, 0, 0.8)',
                    clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center max-w-md mx-auto px-6">
            {/* Loading Spinner */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="mb-8"
            >
              <LoadingSpinner
                size="large"
                variant="magical"
                showText={false}
              />
            </motion.div>

            {/* Phase Text */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhaseIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-amber-100 mb-2">
                  Crafting Your Legend
                </h2>
                <p className="text-amber-200/80 text-lg">
                  {currentPhase?.text || "Preparing your adventure..."}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-amber-300/70 mb-2">
                <span>Progress</span>
                <span>{Math.round(displayProgress)}%</span>
              </div>
              
              <div className="w-full h-3 bg-slate-800/50 rounded-full border border-amber-500/20 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full relative"
                  style={{ width: `${displayProgress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Animated Glow */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </motion.div>
              </div>
            </div>

            {/* Phase Indicators */}
            <div className="flex justify-center space-x-2">
              {STORY_PHASES.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index <= currentPhaseIndex 
                      ? 'bg-amber-400 shadow-lg shadow-amber-400/50' 
                      : 'bg-slate-600'
                  }`}
                  animate={index === currentPhaseIndex ? {
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7]
                  } : {}}
                  transition={{
                    duration: 1.5,
                    repeat: index === currentPhaseIndex ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>

            {/* Mystical Quote */}
            <motion.p
              className="text-amber-300/60 text-sm italic mt-6"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              &ldquo;Every great story begins with a single spark of imagination...&rdquo;
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StoryGenerationLoader;