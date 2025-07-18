'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowPathIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { performCompleteReset } from '@/stores';

interface RestartButtonProps {
  onRestart?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showConfirmation?: boolean;
  confirmationTitle?: string;
  confirmationMessage?: string;
  className?: string;
  disabled?: boolean;
}

export function RestartButton({
  onRestart,
  variant = 'primary',
  size = 'md',
  showConfirmation = true,
  confirmationTitle = 'Start New Adventure?',
  confirmationMessage = 'This will clear all your current progress and start a completely new quest. Your current story and character will be lost.',
  className = '',
  disabled = false
}: RestartButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  const handleRestartClick = () => {
    if (showConfirmation) {
      setShowDialog(true);
    } else {
      performRestart();
    }
  };

  const performRestart = async () => {
    setIsRestarting(true);
    
    try {
      // Perform complete reset using the centralized function
      const success = await performCompleteReset();
      
      if (!success) {
        throw new Error('Reset operation failed');
      }
      
      // Small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Call the onRestart callback if provided
      onRestart?.();
      
      // If no callback provided, reload the page to ensure clean state
      if (!onRestart && typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error during restart:', error);
    } finally {
      setIsRestarting(false);
      setShowDialog(false);
    }
  };

  const handleCancel = () => {
    setShowDialog(false);
  };

  // Button styling based on variant and size
  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900';
    
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };
    
    const variantClasses = {
      primary: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white border-purple-500 focus:ring-purple-500 shadow-lg shadow-purple-500/25',
      secondary: 'bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white border-slate-600 focus:ring-slate-500',
      danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white border-red-500 focus:ring-red-500 shadow-lg shadow-red-500/25'
    };
    
    const disabledClasses = 'opacity-50 cursor-not-allowed hover:scale-100';
    
    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? disabledClasses : 'hover:scale-105 active:scale-95'}`;
  };

  const getIconSize = () => {
    return size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
  };

  return (
    <>
      <motion.button
        whileHover={disabled ? {} : { scale: 1.05 }}
        whileTap={disabled ? {} : { scale: 0.95 }}
        onClick={handleRestartClick}
        disabled={disabled || isRestarting}
        className={`${getButtonClasses()} ${className}`}
      >
        <motion.div
          animate={isRestarting ? { rotate: 360 } : { rotate: 0 }}
          transition={isRestarting ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
        >
          <ArrowPathIcon className={getIconSize()} />
        </motion.div>
        {isRestarting ? 'Restarting...' : 'Start New Adventure'}
      </motion.button>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleCancel}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-slate-800 border border-slate-600 rounded-2xl p-6 shadow-2xl"
            >
              {/* Decorative glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-amber-500/20 to-purple-500/20 rounded-2xl blur-xl -z-10" />
              
              {/* Close button */}
              <button
                onClick={handleCancel}
                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>

              {/* Warning icon */}
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-amber-500/20 rounded-full">
                  <ExclamationTriangleIcon className="w-8 h-8 text-amber-400" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-center text-white mb-3">
                {confirmationTitle}
              </h3>

              {/* Message */}
              <p className="text-slate-300 text-center mb-6 leading-relaxed">
                {confirmationMessage}
              </p>

              {/* Action buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white font-medium rounded-lg border border-slate-600 transition-all duration-200"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={performRestart}
                  disabled={isRestarting}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-medium rounded-lg border border-red-500 transition-all duration-200 disabled:opacity-50"
                >
                  {isRestarting ? (
                    <div className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <ArrowPathIcon className="w-4 h-4" />
                      </motion.div>
                      Restarting...
                    </div>
                  ) : (
                    'Yes, Start New Adventure'
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Specialized restart button for story completion page
export function StoryRestartButton({
  onRestart,
  className = ''
}: {
  onRestart?: () => void;
  className?: string;
}) {
  return (
    <RestartButton
      onRestart={onRestart}
      variant="primary"
      size="lg"
      confirmationTitle="Begin a New Quest?"
      confirmationMessage="Your current adventure has reached its conclusion. Would you like to create a completely new character and embark on a fresh journey?"
      className={className}
    />
  );
}

// Quick restart button without confirmation (for development/testing)
export function QuickRestartButton({
  onRestart,
  className = ''
}: {
  onRestart?: () => void;
  className?: string;
}) {
  return (
    <RestartButton
      onRestart={onRestart}
      variant="secondary"
      size="sm"
      showConfirmation={false}
      className={className}
    />
  );
}