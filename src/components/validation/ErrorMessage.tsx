'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ErrorMessageProps {
  error?: string;
  className?: string;
  variant?: 'default' | 'inline' | 'tooltip';
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  className = '',
  variant = 'default'
}) => {
  if (!error) return null;

  const baseClasses = "text-red-300 font-medium flex items-center gap-2";
  
  const variantClasses = {
    default: "text-center p-3 bg-red-900/30 border border-red-600 rounded-lg backdrop-blur-sm",
    inline: "text-sm mt-1",
    tooltip: "absolute -bottom-8 left-0 right-0 text-xs bg-red-900/90 border border-red-600 rounded px-2 py-1 z-10"
  };

  const iconVariants = {
    default: "⚠️",
    inline: "⚠️",
    tooltip: "!"
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
          boxShadow: variant === 'default' ? '0 0 20px rgba(239, 68, 68, 0.3)' : 'none'
        }}
        exit={{ opacity: 0, scale: 0.9, y: -10 }}
        transition={{ 
          duration: 0.3,
          type: "spring",
          stiffness: 200,
          damping: 20
        }}
        className={`${variantClasses[variant]} ${baseClasses} ${className}`}
      >
        {/* Magical Error Icon with Pulse Animation */}
        <motion.span
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-red-400"
        >
          {iconVariants[variant]}
        </motion.span>
        
        {/* Error Text */}
        <span className="flex-1">
          {error}
        </span>

        {/* Magical Sparkle Effect */}
        {variant === 'default' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-1 -right-1 text-red-400 text-xs"
          >
            ✨
          </motion.div>
        )}

        {/* Animated Border Glow */}
        {variant === 'default' && (
          <motion.div
            className="absolute inset-0 rounded-lg border border-red-500/50 pointer-events-none"
            animate={{
              boxShadow: [
                '0 0 5px rgba(239, 68, 68, 0.3)',
                '0 0 15px rgba(239, 68, 68, 0.5)',
                '0 0 5px rgba(239, 68, 68, 0.3)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};