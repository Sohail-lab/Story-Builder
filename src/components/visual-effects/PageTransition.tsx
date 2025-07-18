'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SparkleProps {
  x: number;
  y: number;
  delay: number;
  size: number;
  color: string;
}

const Sparkle: React.FC<SparkleProps> = ({ x, y, delay, size, color }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: `${size}px`,
      height: `${size}px`,
    }}
    initial={{ scale: 0, rotate: 0, opacity: 0 }}
    animate={{
      scale: [0, 1.2, 0.8, 0],
      rotate: [0, 180, 360],
      opacity: [0, 1, 0.8, 0]
    }}
    transition={{
      duration: 2.5,
      delay,
      ease: "easeOut"
    }}
  >
    <div
      className="w-full h-full"
      style={{
        background: `radial-gradient(circle, ${color} 0%, ${color}80 30%, transparent 70%)`,
        boxShadow: `0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px ${color}40`,
        clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
      }}
    />
  </motion.div>
);

interface PageTransitionProps {
  isTransitioning: boolean;
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down' | 'fade';
  duration?: number;
  sparkleCount?: number;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  isTransitioning,
  children,
  direction = 'fade',
  duration = 0.6,
  sparkleCount = 20,
  className = ''
}) => {
  // Generate sparkles with random positions and properties
  const sparkles = React.useMemo(() => {
    const sparkleColors = [
      'rgba(255, 215, 0, 0.8)', // Gold
      'rgba(139, 69, 19, 0.6)', // Copper
      'rgba(107, 33, 168, 0.7)', // Purple
      'rgba(5, 150, 105, 0.6)', // Emerald
      'rgba(229, 231, 235, 0.5)', // Silver
    ];

    return Array.from({ length: sparkleCount }, (_, index) => ({
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 1.5, // Longer stagger for better visibility
      size: Math.random() * 12 + 8, // 8-20px - larger sparkles
      color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)] || 'rgba(255, 215, 0, 0.8)'
    }));
  }, [sparkleCount]);

  const getTransitionVariants = () => {
    const distance = 100;
    
    switch (direction) {
      case 'left':
        return {
          initial: { x: -distance, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: distance, opacity: 0 }
        };
      case 'right':
        return {
          initial: { x: distance, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: -distance, opacity: 0 }
        };
      case 'up':
        return {
          initial: { y: distance, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: -distance, opacity: 0 }
        };
      case 'down':
        return {
          initial: { y: -distance, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: distance, opacity: 0 }
        };
      default: // fade
        return {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.05 }
        };
    }
  };

  const variants = getTransitionVariants();

  return (
    <div className={`relative ${className}`}>
      {/* Sparkle Overlay - only show during transitions */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {sparkles.map((sparkle) => (
              <Sparkle
                key={sparkle.id}
                x={sparkle.x}
                y={sparkle.y}
                delay={sparkle.delay}
                size={sparkle.size}
                color={sparkle.color}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isTransitioning ? 'transitioning' : 'stable'}
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={{
            duration,
            ease: "easeInOut",
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PageTransition;