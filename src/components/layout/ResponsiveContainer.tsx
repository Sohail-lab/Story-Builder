'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  variant?: 'default' | 'narrow' | 'wide' | 'full';
  className?: string;
  enableMotion?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  variant = 'default',
  className = '',
  enableMotion = false,
  padding = 'medium'
}) => {
  // Define container variants with responsive breakpoints
  const containerVariants = {
    default: 'max-w-4xl mx-auto',
    narrow: 'max-w-2xl mx-auto',
    wide: 'max-w-6xl mx-auto',
    full: 'w-full'
  };

  // Define padding variants
  const paddingVariants = {
    none: '',
    small: 'px-4 sm:px-6',
    medium: 'px-4 sm:px-6 lg:px-8',
    large: 'px-4 sm:px-6 lg:px-8 xl:px-12'
  };

  const containerClasses = `
    ${containerVariants[variant]}
    ${paddingVariants[padding]}
    ${className}
  `.trim();

  if (enableMotion) {
    return (
      <motion.div
        className={containerClasses}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};