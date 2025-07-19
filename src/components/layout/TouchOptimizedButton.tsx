'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TouchOptimizedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const TouchOptimizedButton: React.FC<TouchOptimizedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  className = '',
  fullWidth = false,
  icon,
  iconPosition = 'left'
}) => {
  // Define size variants with touch-friendly dimensions
  const sizeVariants = {
    small: 'px-4 py-3 text-sm min-h-[44px]', // 44px minimum for touch targets
    medium: 'px-6 py-4 text-base min-h-[48px]',
    large: 'px-8 py-5 text-lg min-h-[52px]'
  };

  // Define style variants
  const styleVariants = {
    primary: 'fantasy-button-primary',
    secondary: 'fantasy-button',
    ghost: 'bg-transparent border-2 border-fantasy-gold-luminous text-fantasy-gold-luminous hover:bg-fantasy-gold-luminous hover:text-fantasy-midnight-dark'
  };

  const baseClasses = `
    ${styleVariants[variant]}
    ${sizeVariants[size]}
    ${fullWidth ? 'w-full' : ''}
    font-fantasy-serif font-semibold
    rounded-lg
    transition-all duration-300
    flex items-center justify-center gap-3
    relative overflow-hidden
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim();

  // Touch-optimized interaction props
  const interactionProps = {
    whileTap: disabled || loading ? {} : { 
      scale: 0.95,
      transition: { duration: 0.1 }
    },
    whileHover: disabled || loading ? {} : {
      scale: 1.02,
      boxShadow: '0 0 25px rgba(255, 215, 0, 0.4)',
      transition: { duration: 0.2 }
    }
  };

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      // Add haptic feedback for mobile devices
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      onClick();
    }
  };

  return (
    <motion.button
      className={baseClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      {...interactionProps}
    >
      {/* Loading Spinner */}
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-inherit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="fantasy-spinner w-5 h-5" />
        </motion.div>
      )}

      {/* Button Content */}
      <motion.div
        className={`flex items-center gap-3 ${loading ? 'opacity-0' : 'opacity-100'}`}
        transition={{ duration: 0.2 }}
      >
        {icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        
        <span className="flex-grow text-center">{children}</span>
        
        {icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </motion.div>

      {/* Ripple Effect */}
      {!disabled && !loading && (
        <motion.div
          className="absolute inset-0 bg-white opacity-0 rounded-lg"
          whileTap={{
            opacity: [0, 0.1, 0],
            scale: [0.8, 1.2, 1],
            transition: { duration: 0.3 }
          }}
        />
      )}
    </motion.button>
  );
};