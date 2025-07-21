'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  variant?: 'page' | 'section' | 'component';
  className?: string;
  enableMobileOptimizations?: boolean;
  mobileBottomPadding?: boolean;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  variant = 'page',
  className = '',
  enableMobileOptimizations = true,
  mobileBottomPadding = false
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');

  // Define layout variants
  const layoutVariants = {
    page: {
      mobile: 'min-h-screen px-4 py-6',
      tablet: 'min-h-screen px-6 py-8',
      desktop: 'min-h-screen px-8 py-12'
    },
    section: {
      mobile: 'px-4 py-6',
      tablet: 'px-6 py-8',
      desktop: 'px-8 py-10'
    },
    component: {
      mobile: 'px-3 py-4',
      tablet: 'px-4 py-5',
      desktop: 'px-6 py-6'
    }
  };

  // Get appropriate classes based on screen size
  const getLayoutClasses = () => {
    if (isMobile) return layoutVariants[variant].mobile;
    if (isTablet) return layoutVariants[variant].tablet;
    return layoutVariants[variant].desktop;
  };

  const layoutClasses = `
    ${getLayoutClasses()}
    ${mobileBottomPadding && isMobile ? 'pb-24' : ''}
    ${className}
  `.trim();

  // Mobile-specific optimizations
  const mobileOptimizations = enableMobileOptimizations && isMobile ? {
    // Reduce motion for better performance on mobile
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
  } : {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <motion.div
      className={layoutClasses}
      {...mobileOptimizations}
    >
      {children}
      
      {/* Mobile-specific elements */}
      {isMobile && enableMobileOptimizations && (
        <>
          {/* Scroll indicator for long content */}
          <div className="fixed top-0 left-0 right-0 h-1 bg-fantasy-midnight-dark/50 z-40">
            <motion.div
              className="h-full bg-fantasy-gold-luminous"
              style={{
                scaleX: 0,
                transformOrigin: '0%'
              }}
              whileInView={{
                scaleX: 1
              }}
              viewport={{ once: false, amount: 0.1 }}
            />
          </div>
          
          {/* Touch-friendly scroll to top */}
          <motion.button
            className="fixed bottom-20 right-4 z-40 w-12 h-12 bg-fantasy-gold-luminous text-fantasy-midnight-dark rounded-full shadow-lg flex items-center justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            ↑
          </motion.button>
        </>
      )}
    </motion.div>
  );
};