'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TouchOptimizedButton } from './TouchOptimizedButton';

interface MobileNavigationProps {
  canGoBack?: boolean;
  canGoForward?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  onComplete?: () => void;
  isLastQuestion?: boolean;
  className?: string;
  progress?: number;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  canGoBack = false,
  canGoForward = false,
  onPrevious,
  onNext,
  onComplete,
  isLastQuestion = false,
  className = '',
  progress = 0
}) => {
  return (
    <motion.div
      className={`
        fixed bottom-0 left-0 right-0 z-50
        bg-fantasy-midnight-dark/95 backdrop-blur-lg
        border-t-2 border-fantasy-copper/30
        p-4 pb-6
        ${className}
      `}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Progress Indicator */}
      <div className="mb-4">
        <div className="fantasy-progress">
          <motion.div
            className="fantasy-progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        {/* Previous Button */}
        <TouchOptimizedButton
          variant="secondary"
          size="medium"
          disabled={!canGoBack}
          onClick={onPrevious}
          icon="←"
          iconPosition="left"
          className="flex-1"
        >
          Previous
        </TouchOptimizedButton>

        {/* Next/Complete Button */}
        <TouchOptimizedButton
          variant="primary"
          size="medium"
          disabled={!canGoForward}
          onClick={isLastQuestion ? onComplete : onNext}
          icon={isLastQuestion ? "✨" : "→"}
          iconPosition="right"
          className="flex-2"
        >
          {isLastQuestion ? 'Complete Quest' : 'Next'}
        </TouchOptimizedButton>
      </div>

      {/* Safe Area Padding for devices with home indicator */}
      <div className="h-safe-area-inset-bottom" />
    </motion.div>
  );
};