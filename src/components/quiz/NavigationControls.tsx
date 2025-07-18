'use client';

import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface NavigationControlsProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onPrevious: () => void;
  onNext: () => void;
  isLastQuestion: boolean;
  onComplete?: () => void;
  className?: string;
}

export function NavigationControls({
  canGoBack,
  canGoForward,
  onPrevious,
  onNext,
  isLastQuestion,
  onComplete,
  className = ''
}: NavigationControlsProps) {
  const handleNext = () => {
    if (isLastQuestion && onComplete) {
      onComplete();
    } else {
      onNext();
    }
  };

  return (
    <div className={`flex justify-between items-center w-full max-w-2xl mx-auto ${className}`}>
      {/* Previous Button */}
      <motion.button
        onClick={onPrevious}
        disabled={!canGoBack}
        className={`
          flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300
          ${canGoBack 
            ? 'bg-slate-700/50 hover:bg-slate-600/60 text-amber-200 hover:text-amber-100 border border-slate-600/50 hover:border-amber-500/30' 
            : 'bg-slate-800/30 text-slate-500 border border-slate-700/30 cursor-not-allowed'
          }
        `}
        whileHover={canGoBack ? { scale: 1.02, y: -1 } : {}}
        whileTap={canGoBack ? { scale: 0.98 } : {}}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ChevronLeftIcon className="w-5 h-5" />
        <span>Previous</span>
      </motion.button>

      {/* Next/Complete Button */}
      <motion.button
        onClick={handleNext}
        disabled={!canGoForward}
        className={`
          flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-all duration-300 relative overflow-hidden
          ${canGoForward 
            ? `${isLastQuestion 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg hover:shadow-emerald-500/25' 
                : 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white shadow-lg hover:shadow-amber-500/25'
              } border border-transparent`
            : 'bg-slate-800/30 text-slate-500 border border-slate-700/30 cursor-not-allowed'
          }
        `}
        whileHover={canGoForward ? { scale: 1.02, y: -1 } : {}}
        whileTap={canGoForward ? { scale: 0.98 } : {}}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Magical Glow Effect */}
        {canGoForward && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        )}
        
        <span className="relative z-10">
          {isLastQuestion ? 'Complete Quest' : 'Next'}
        </span>
        
        {!isLastQuestion && (
          <ChevronRightIcon className="w-5 h-5 relative z-10" />
        )}
        
        {isLastQuestion && (
          <motion.div
            className="w-5 h-5 relative z-10"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            ✨
          </motion.div>
        )}
      </motion.button>
    </div>
  );
}