'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionTransitionProps {
  children: React.ReactNode;
  questionKey: string | number;
  direction?: 'forward' | 'backward';
  className?: string;
}

export const QuestionTransition: React.FC<QuestionTransitionProps> = ({
  children,
  questionKey,
  direction = 'forward',
  className = ''
}) => {
  const getTransitionVariants = () => {
    const slideDistance = 50;
    const scaleAmount = 0.95;

    if (direction === 'forward') {
      return {
        initial: { 
          opacity: 0, 
          x: slideDistance, 
          scale: scaleAmount,
          rotateY: 15
        },
        animate: { 
          opacity: 1, 
          x: 0, 
          scale: 1,
          rotateY: 0
        },
        exit: { 
          opacity: 0, 
          x: -slideDistance, 
          scale: scaleAmount,
          rotateY: -15
        }
      };
    } else {
      return {
        initial: { 
          opacity: 0, 
          x: -slideDistance, 
          scale: scaleAmount,
          rotateY: -15
        },
        animate: { 
          opacity: 1, 
          x: 0, 
          scale: 1,
          rotateY: 0
        },
        exit: { 
          opacity: 0, 
          x: slideDistance, 
          scale: scaleAmount,
          rotateY: 15
        }
      };
    }
  };

  const variants = getTransitionVariants();

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={questionKey}
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={{
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth feel
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
          className="w-full"
          style={{
            transformStyle: 'preserve-3d',
            perspective: '1000px'
          }}
        >
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: "easeInOut"
            }}
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(255, 215, 0, 0.1) 50%, transparent 70%)',
              backgroundSize: '200% 200%',
            }}
          />

          <motion.div
            initial={{ filter: 'blur(2px)' }}
            animate={{ filter: 'blur(0px)' }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {children}
          </motion.div>

          {Array.from({ length: 6 }).map((_, index) => (
            <motion.div
              key={index}
              className="absolute w-1 h-1 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, transparent 70%)',
                boxShadow: '0 0 4px rgba(255, 215, 0, 0.6)',
                left: `${20 + index * 12}%`,
                top: `${10 + (index % 2) * 80}%`,
              }}
              initial={{ 
                opacity: 0, 
                scale: 0,
                y: 0
              }}
              animate={{ 
                opacity: [0, 1, 0], 
                scale: [0, 1, 0],
                y: [0, -20, -40]
              }}
              transition={{
                duration: 1.2,
                delay: 0.1 + index * 0.1,
                ease: "easeOut"
              }}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuestionTransition;