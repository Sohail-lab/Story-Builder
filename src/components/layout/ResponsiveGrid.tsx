'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'small' | 'medium' | 'large';
  className?: string;
  enableStagger?: boolean;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = { xs: 1, sm: 2, md: 2, lg: 3, xl: 3 },
  gap = 'medium',
  className = '',
  enableStagger = false
}) => {
  // Define gap variants
  const gapVariants = {
    small: 'gap-3 sm:gap-4',
    medium: 'gap-4 sm:gap-6',
    large: 'gap-6 sm:gap-8'
  };

  // Build responsive grid classes
  const gridClasses = `
    grid
    ${columns.xs ? `grid-cols-${columns.xs}` : 'grid-cols-1'}
    ${columns.sm ? `sm:grid-cols-${columns.sm}` : ''}
    ${columns.md ? `md:grid-cols-${columns.md}` : ''}
    ${columns.lg ? `lg:grid-cols-${columns.lg}` : ''}
    ${columns.xl ? `xl:grid-cols-${columns.xl}` : ''}
    ${gapVariants[gap]}
    ${className}
  `.trim();

  if (enableStagger) {
    return (
      <motion.div
        className={gridClasses}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {React.Children.map(children, (child, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.5 }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};