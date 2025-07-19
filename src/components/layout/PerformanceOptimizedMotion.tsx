'use client';

import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface PerformanceOptimizedMotionProps extends MotionProps {
  children: React.ReactNode;
  enableReducedMotion?: boolean;
  mobileOptimized?: boolean;
  as?: 'div' | 'span' | 'section' | 'article';
}

export const PerformanceOptimizedMotion: React.FC<PerformanceOptimizedMotionProps> = ({
  children,
  enableReducedMotion = true,
  mobileOptimized = true,
  as = 'div',
  ...motionProps
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  // Check if we should reduce animations
  const shouldReduceMotion = enableReducedMotion && (prefersReducedMotion || (mobileOptimized && isMobile));

  // Mobile-optimized animation variants
  const getMobileOptimizedProps = (props: MotionProps): MotionProps => {
    if (!shouldReduceMotion) return props;

    // Simplified animations for mobile/reduced motion
    return {
      ...props,
      initial: props.initial ? { opacity: 0 } : undefined,
      animate: props.animate ? { opacity: 1 } : undefined,
      exit: props.exit ? { opacity: 0 } : undefined,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      },
      // Remove complex transforms and effects
      whileHover: undefined,
      whileTap: isMobile ? { scale: 0.98 } : undefined,
      drag: undefined,
      dragConstraints: undefined
    };
  };

  const optimizedProps = getMobileOptimizedProps(motionProps);
  
  // Type-safe motion component creation
  if (as === 'div') {
    return <motion.div {...optimizedProps}>{children}</motion.div>;
  } else if (as === 'span') {
    return <motion.span {...optimizedProps}>{children}</motion.span>;
  } else if (as === 'section') {
    return <motion.section {...optimizedProps}>{children}</motion.section>;
  } else if (as === 'article') {
    return <motion.article {...optimizedProps}>{children}</motion.article>;
  } else {
    // Default to div for any other element
    return <motion.div {...optimizedProps}>{children}</motion.div>;
  }
};