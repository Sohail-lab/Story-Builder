'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'magical' | 'runic' | 'ethereal' | 'cosmic';
  showText?: boolean;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className = '',
  size = 'medium',
  variant = 'magical',
  showText = true,
  text = 'Weaving magic...'
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small': return 'w-8 h-8';
      case 'large': return 'w-16 h-16';
      default: return 'w-12 h-12';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'runic':
        return {
          primary: '#8B4513', // Copper
          secondary: '#FFD700', // Gold
          accent: '#6B21A8', // Purple
          glow: 'rgba(255, 215, 0, 0.4)'
        };
      case 'ethereal':
        return {
          primary: '#E5E7EB', // Silver
          secondary: '#FFD700', // Gold
          accent: '#6B21A8', // Purple
          glow: 'rgba(229, 231, 235, 0.3)'
        };
      case 'cosmic':
        return {
          primary: '#1E293B', // Dark blue
          secondary: '#6B21A8', // Purple
          accent: '#059669', // Emerald
          glow: 'rgba(107, 33, 168, 0.4)'
        };
      default: // magical
        return {
          primary: '#FFD700', // Gold
          secondary: '#6B21A8', // Purple
          accent: '#059669', // Emerald
          glow: 'rgba(255, 215, 0, 0.4)'
        };
    }
  };

  const colors = getVariantStyles();

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Main Spinner Container */}
      <div className={`relative ${getSizeClasses()}`}>
        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: colors.primary,
            borderRightColor: colors.secondary,
            filter: `drop-shadow(0 0 8px ${colors.glow})`
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Middle Ring */}
        <motion.div
          className="absolute inset-1 rounded-full border-2 border-transparent"
          style={{
            borderBottomColor: colors.accent,
            borderLeftColor: colors.secondary,
            filter: `drop-shadow(0 0 6px ${colors.glow})`
          }}
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Inner Ring */}
        <motion.div
          className="absolute inset-2 rounded-full border border-transparent"
          style={{
            borderTopColor: colors.primary,
            borderBottomColor: colors.accent,
            filter: `drop-shadow(0 0 4px ${colors.glow})`
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Center Orb */}
        <motion.div
          className="absolute inset-3 rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors.primary}40 0%, ${colors.accent}20 50%, transparent 100%)`,
            boxShadow: `0 0 12px ${colors.glow}`
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Magical Particles */}
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: colors.accent,
              boxShadow: `0 0 4px ${colors.accent}`,
              left: '50%',
              top: '50%',
              transformOrigin: `0 ${size === 'large' ? '32px' : size === 'small' ? '16px' : '24px'}`
            }}
            animate={{
              rotate: 360,
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Loading Text */}
      {showText && (
        <motion.div
          className={`mt-4 text-center ${getTextSize()}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.p
            className="text-amber-200 font-medium"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {text}
          </motion.p>
          
          {/* Animated Dots */}
          <motion.span
            className="text-amber-300"
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            ...
          </motion.span>
        </motion.div>
      )}
    </div>
  );
};

export default LoadingSpinner;