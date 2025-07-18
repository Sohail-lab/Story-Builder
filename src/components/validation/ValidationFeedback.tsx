'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ValidationFeedbackProps {
  isValid?: boolean;
  isValidating?: boolean;
  successMessage?: string;
  className?: string;
}

export const ValidationFeedback: React.FC<ValidationFeedbackProps> = ({
  isValid,
  isValidating,
  successMessage = "Perfect! Your answer looks magical ✨",
  className = ''
}) => {
  if (isValidating) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center justify-center gap-2 text-amber-300 text-sm ${className}`}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full"
        />
        <span>Validating your magical input...</span>
      </motion.div>
    );
  }

  if (!isValid) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
          boxShadow: '0 0 15px rgba(34, 197, 94, 0.3)'
        }}
        exit={{ opacity: 0, scale: 0.8, y: 10 }}
        transition={{ 
          duration: 0.4,
          type: "spring",
          stiffness: 200,
          damping: 15
        }}
        className={`
          flex items-center justify-center gap-2 
          text-green-300 text-sm font-medium
          bg-green-900/20 border border-green-600/50 rounded-lg p-2
          backdrop-blur-sm
          ${className}
        `}
      >
        {/* Success Icon with Magical Animation */}
        <motion.span
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-green-400"
        >
          ✓
        </motion.span>
        
        <span>{successMessage}</span>

        {/* Floating Sparkles */}
        <motion.div
          animate={{ 
            y: [-2, -8, -2],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-green-400 text-xs"
        >
          ✨
        </motion.div>

        {/* Animated Border Glow */}
        <motion.div
          className="absolute inset-0 rounded-lg border border-green-500/30 pointer-events-none"
          animate={{
            boxShadow: [
              '0 0 5px rgba(34, 197, 94, 0.2)',
              '0 0 15px rgba(34, 197, 94, 0.4)',
              '0 0 5px rgba(34, 197, 94, 0.2)'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};