'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0-100
  currentQuestion: number;
  totalQuestions: number;
  className?: string;
}

export function ProgressBar({ 
  progress, 
  currentQuestion, 
  totalQuestions, 
  className = '' 
}: ProgressBarProps) {
  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      {/* Progress Text */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-amber-200">
          Question {currentQuestion + 1} of {totalQuestions}
        </span>
        <span className="text-sm font-medium text-amber-200">
          {Math.round(progress)}% Complete
        </span>
      </div>
      
      {/* Magical Energy Bar Container */}
      <div className="relative h-4 bg-slate-800/50 rounded-full border border-amber-600/30 overflow-hidden shadow-lg">
        {/* Background Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 via-yellow-800/20 to-amber-900/20" />
        
        {/* Progress Fill */}
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-full shadow-lg"
          style={{
            background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 25%, #fcd34d 50%, #fbbf24 75%, #f59e0b 100%)',
            boxShadow: '0 0 20px rgba(251, 191, 36, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
        />
        
        {/* Magical Sparkle Effect */}
        {progress > 0 && (
          <motion.div
            className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-transparent via-white/30 to-transparent"
            style={{ right: `${100 - progress}%` }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scaleX: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
        
        {/* Energy Particles */}
        {progress > 10 && (
          <>
            <motion.div
              className="absolute top-1 left-2 w-1 h-1 bg-yellow-200 rounded-full"
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
                y: [0, -2, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.2
              }}
            />
            <motion.div
              className="absolute bottom-1 left-6 w-1 h-1 bg-amber-300 rounded-full"
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
                y: [0, 2, 0]
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: 0.8
              }}
            />
          </>
        )}
        
        {/* Completion Burst Effect */}
        {progress >= 100 && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0, 0.8, 0],
              scale: [0.8, 1.1, 1]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </div>
      
      {/* Mystical Border Glow */}
      <div className="absolute inset-0 rounded-full border border-amber-400/20 pointer-events-none" 
           style={{
             boxShadow: '0 0 15px rgba(251, 191, 36, 0.3)'
           }} 
      />
    </div>
  );
}