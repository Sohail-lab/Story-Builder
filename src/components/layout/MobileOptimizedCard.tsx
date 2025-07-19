'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MobileOptimizedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'expanded';
  enableHover?: boolean;
  enableTouchFeedback?: boolean;
  onClick?: () => void;
}

export const MobileOptimizedCard: React.FC<MobileOptimizedCardProps> = ({
  children,
  className = '',
  variant = 'default',
  enableHover = true,
  enableTouchFeedback = true,
  onClick
}) => {
  // Define card variants optimized for different screen sizes
  const cardVariants = {
    default: 'p-4 sm:p-6 lg:p-8',
    compact: 'p-3 sm:p-4 lg:p-6',
    expanded: 'p-6 sm:p-8 lg:p-10'
  };

  const baseClasses = `
    fantasy-card
    w-full
    ${cardVariants[variant]}
    transition-all duration-300 ease-out
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `.trim();

  // Mobile-optimized hover and touch states
  const hoverProps = enableHover ? {
    whileHover: { 
      scale: 1.02,
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(255, 215, 0, 0.4)'
    }
  } : {};

  const tapProps = enableTouchFeedback ? {
    whileTap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  } : {};

  return (
    <motion.div
      className={baseClasses}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...hoverProps}
      {...tapProps}
    >
      {children}
    </motion.div>
  );
};