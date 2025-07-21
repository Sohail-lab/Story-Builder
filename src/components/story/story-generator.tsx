'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStoryGenerationWithLoading, useStoryFallback } from '@/hooks/use-story-generation';
import { StoryGenerationLoader } from '@/components/visual-effects';
import { type PlayerProfile } from '@/types';

interface StoryGeneratorProps {
  playerProfile: PlayerProfile;
  onStoryGenerated?: () => void;
  onError?: (error: string) => void;
  autoGenerate?: boolean;
}

export function StoryGenerator({ 
  playerProfile, 
  onStoryGenerated, 
  onError,
  autoGenerate = true 
}: StoryGeneratorProps) {
  const {
    isGenerating,
    generationError,
    generatedStory,
    generateStory,
    retryGeneration,
    clearError,
    loadingProgress,
    canRetry
  } = useStoryGenerationWithLoading({
    autoRetry: true,
    maxAutoRetries: 2,
    onSuccess: () => onStoryGenerated?.(),
    onError: (error) => onError?.(error)
  });
  
  const { generateFallbackStory } = useStoryFallback();
  
  // Auto-generate story when component mounts
  useEffect(() => {
    if (autoGenerate && !isGenerating && !generationError) {
      // If we already have a story, trigger the onStoryGenerated callback immediately
      if (generatedStory) {
        onStoryGenerated?.();
      } else {
        // Generate new story
        generateStory(playerProfile);
      }
    }
  }, [autoGenerate, generatedStory, isGenerating, generationError, generateStory, playerProfile, onStoryGenerated]);
  
  // Handle manual story generation
  const handleGenerateStory = async () => {
    clearError();
    await generateStory(playerProfile);
  };
  
  // Handle retry with fallback option
  const handleRetryWithFallback = async () => {
    try {
      await retryGeneration();
    } catch (error) {
      // If retry fails, offer fallback story
      console.warn('Story generation failed, using fallback story');
      const fallbackStory = generateFallbackStory(playerProfile);
      // Note: In a real implementation, you'd want to update the store with the fallback
      // For now, we'll just log it
      console.log('Fallback story generated:', fallbackStory);
    }
  };
  
  if (isGenerating) {
    return (
      <StoryGenerationLoader
        isVisible={true}
        progress={loadingProgress}
      />
    );
  }
  
  if (generationError) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center"
      >
        {/* Error icon */}
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        {/* Error message */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-red-400">
            Story Generation Failed
          </h3>
          <p className="text-slate-300 max-w-md">
            {generationError}
          </p>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {canRetry && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRetryWithFallback}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
            >
              Try Again
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const fallbackStory = generateFallbackStory(playerProfile);
              console.log('Using fallback story:', fallbackStory);
              // In a real implementation, update the store here
            }}
            className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
          >
            Use Backup Story
          </motion.button>
        </div>
      </motion.div>
    );
  }
  
  if (!generatedStory) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center"
      >
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-200">
            Ready to Begin Your Adventure?
          </h3>
          <p className="text-slate-400 max-w-md">
            Click below to generate your personalized fantasy story based on your character profile.
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGenerateStory}
          className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-200"
        >
          Generate My Story
        </motion.button>
      </motion.div>
    );
  }
  
  // Story generated successfully - this would typically be handled by a separate StoryDisplay component
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="text-center">
        <h3 className="text-2xl font-bold text-amber-400 mb-2">
          Your Adventure Awaits!
        </h3>
        <p className="text-slate-300">
          Your personalized story has been generated successfully.
        </p>
      </div>
      
      {/* Story content would be displayed here by StoryDisplay component */}
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <p className="text-slate-400 italic text-center">
          Story content will be displayed by the StoryDisplay component...
        </p>
      </div>
      
      {/* Regenerate option */}
      <div className="text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGenerateStory}
          className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
        >
          Generate New Story
        </motion.button>
      </div>
    </motion.div>
  );
}

// Loading component for story generation
export function StoryGenerationLoading({ message = "Generating your story..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
      <motion.div
        className="w-12 h-12 border-4 border-amber-400/30 border-t-amber-400 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p className="text-amber-100 font-medium">{message}</p>
    </div>
  );
}

// Error component for story generation
export function StoryGenerationError({ 
  error, 
  onRetry, 
  onUseFallback 
}: { 
  error: string;
  onRetry?: () => void;
  onUseFallback?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4 text-center">
      <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
        </svg>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-red-400">Generation Failed</h3>
        <p className="text-slate-300 max-w-sm">{error}</p>
      </div>
      
      <div className="flex gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
          >
            Try Again
          </button>
        )}
        {onUseFallback && (
          <button
            onClick={onUseFallback}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
          >
            Use Backup
          </button>
        )}
      </div>
    </div>
  );
}