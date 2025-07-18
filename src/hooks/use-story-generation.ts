import { useCallback, useEffect, useState } from 'react';
import { useStoryStore } from '@/stores/story-store';
import { getStoryService, StoryServiceError } from '@/services/story-service';
import { type PlayerProfile, type StoryResponse } from '@/types';

// Hook return type
interface UseStoryGenerationReturn {
  // State
  isGenerating: boolean;
  generationError: string | null;
  generatedStory: StoryResponse | null;
  
  // Actions
  generateStory: (profile: PlayerProfile) => Promise<void>;
  retryGeneration: () => Promise<void>;
  clearError: () => void;
  resetStory: () => void;
  
  // Utilities
  canRetry: boolean;
  hasStory: boolean;
  isStoryFresh: boolean;
}

// Configuration options for the hook
interface UseStoryGenerationOptions {
  autoRetry?: boolean;
  maxAutoRetries?: number;
  retryDelayMs?: number;
  onSuccess?: (story: StoryResponse) => void;
  onError?: (error: string) => void;
}

export function useStoryGeneration(options: UseStoryGenerationOptions = {}): UseStoryGenerationReturn {
  const {
    autoRetry = false,
    maxAutoRetries = 2,
    retryDelayMs = 2000,
    onSuccess,
    onError
  } = options;
  
  // Store state and actions
  const {
    generatedStory,
    isGenerating,
    generationError,
    lastGenerationRequest,
    startStoryGeneration,
    completeStoryGeneration,
    failStoryGeneration,
    setGenerationError,
    resetStoryState,
    hasStory,
    isStoryFresh,
    canRegenerateStory
  } = useStoryStore();
  
  // Local state for auto-retry logic
  const [autoRetryCount, setAutoRetryCount] = useState(0);
  const [isAutoRetrying, setIsAutoRetrying] = useState(false);
  
  // Generate story function
  const generateStory = useCallback(async (profile: PlayerProfile): Promise<void> => {
    try {
      // Start generation in store
      startStoryGeneration(profile);
      
      // Get service instance and generate story
      const storyService = getStoryService();
      const story = await storyService.generateStory(profile);
      
      // Complete generation in store
      completeStoryGeneration(story);
      
      // Reset auto-retry count on success
      setAutoRetryCount(0);
      setIsAutoRetrying(false);
      
      // Call success callback
      onSuccess?.(story);
      
    } catch (error) {
      const errorMessage = error instanceof StoryServiceError 
        ? error.message 
        : 'An unexpected error occurred while generating your story';
      
      // Fail generation in store
      failStoryGeneration(errorMessage);
      
      // Handle auto-retry logic
      if (autoRetry && 
          autoRetryCount < maxAutoRetries && 
          error instanceof StoryServiceError && 
          error.retryable) {
        
        setIsAutoRetrying(true);
        setAutoRetryCount(prev => prev + 1);
        
        // Schedule retry
        setTimeout(() => {
          generateStory(profile);
        }, retryDelayMs);
        
        return;
      }
      
      // Reset auto-retry state
      setIsAutoRetrying(false);
      setAutoRetryCount(0);
      
      // Call error callback
      onError?.(errorMessage);
      
      // Re-throw for caller handling if needed
      throw error;
    }
  }, [
    startStoryGeneration,
    completeStoryGeneration,
    failStoryGeneration,
    autoRetry,
    autoRetryCount,
    maxAutoRetries,
    retryDelayMs,
    onSuccess,
    onError
  ]);
  
  // Retry generation with last request
  const retryGeneration = useCallback(async (): Promise<void> => {
    if (!lastGenerationRequest) {
      throw new Error('No previous generation request to retry');
    }
    
    setAutoRetryCount(0); // Reset auto-retry count for manual retry
    await generateStory(lastGenerationRequest);
  }, [lastGenerationRequest, generateStory]);
  
  // Clear error state
  const clearError = useCallback(() => {
    setGenerationError(null);
    setIsAutoRetrying(false);
    setAutoRetryCount(0);
  }, [setGenerationError]);
  
  // Reset all story state
  const resetStory = useCallback(() => {
    resetStoryState();
    setAutoRetryCount(0);
    setIsAutoRetrying(false);
  }, [resetStoryState]);
  
  // Cleanup effect
  useEffect(() => {
    return () => {
      // Clear any pending auto-retries when component unmounts
      setIsAutoRetrying(false);
      setAutoRetryCount(0);
    };
  }, []);
  
  return {
    // State
    isGenerating: isGenerating || isAutoRetrying,
    generationError,
    generatedStory,
    
    // Actions
    generateStory,
    retryGeneration,
    clearError,
    resetStory,
    
    // Utilities
    canRetry: canRegenerateStory() && !isGenerating && !isAutoRetrying,
    hasStory: hasStory(),
    isStoryFresh: isStoryFresh()
  };
}

// Specialized hook for story generation with loading states
export function useStoryGenerationWithLoading(options: UseStoryGenerationOptions = {}) {
  const storyGeneration = useStoryGeneration(options);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  
  // Loading message rotation
  useEffect(() => {
    if (!storyGeneration.isGenerating) {
      setLoadingMessage('');
      setLoadingProgress(0);
      return;
    }
    
    const messages = [
      'Weaving your tale...',
      'Consulting the ancient scrolls...',
      'Gathering magical energies...',
      'Crafting your destiny...',
      'Summoning your adventure...',
      'Forging your legend...'
    ];
    
    let messageIndex = 0;
    let progress = 0;
    
    const updateLoading = () => {
      setLoadingMessage(messages[messageIndex] || 'Generating your story...');
      setLoadingProgress(Math.min(progress, 90)); // Never reach 100% until complete
      
      messageIndex = (messageIndex + 1) % messages.length;
      progress += Math.random() * 15 + 5; // Random progress increments
    };
    
    // Initial message
    updateLoading();
    
    // Update every 2 seconds
    const interval = setInterval(updateLoading, 2000);
    
    return () => clearInterval(interval);
  }, [storyGeneration.isGenerating]);
  
  // Complete progress when story is generated
  useEffect(() => {
    if (storyGeneration.generatedStory && !storyGeneration.isGenerating) {
      setLoadingProgress(100);
      setTimeout(() => {
        setLoadingMessage('');
        setLoadingProgress(0);
      }, 1000);
    }
  }, [storyGeneration.generatedStory, storyGeneration.isGenerating]);
  
  return {
    ...storyGeneration,
    loadingMessage,
    loadingProgress
  };
}

// Hook for fallback story handling
export function useStoryFallback() {
  const generateFallbackStory = useCallback((profile: PlayerProfile): StoryResponse => {
    const { name, race, specialty, favoriteEnvironment, personalityTrait } = profile;
    
    return {
      characterIntroduction: `Meet ${name}, a ${personalityTrait.toLowerCase()} ${race} ${specialty.toLowerCase()} whose destiny awaits in the realm of ${favoriteEnvironment.toLowerCase()}.`,
      
      worldDescription: `The ${favoriteEnvironment.toLowerCase()} stretches endlessly before ${name}, filled with ancient mysteries and untold dangers. Whispers of magic drift through the air, and the very ground seems to pulse with otherworldly energy.`,
      
      plotSetup: `As ${name} ventures deeper into this mystical realm, a strange phenomenon begins to unfold. The balance of nature itself seems to be shifting, and only someone with ${name}'s unique skills as a ${specialty.toLowerCase()} might be able to understand what's happening.`,
      
      narrative: `${name} pauses at the edge of a clearing, sensing something amiss in the ${favoriteEnvironment.toLowerCase()}. The usual sounds of nature have fallen silent, replaced by an eerie stillness that makes the hair on the back of ${name}'s neck stand on end. Drawing upon years of experience as a ${specialty.toLowerCase()}, ${name} carefully examines the surroundings, noting subtle signs that others might miss. The ${personalityTrait.toLowerCase()} nature that has served ${name} well in the past now guides every decision, every careful step forward into the unknown.`,
      
      suspensefulEnding: `Suddenly, a shadow moves where no shadow should be, and ${name} realizes that this journey has only just begun. Something ancient stirs in the depths of the ${favoriteEnvironment.toLowerCase()}, and it has taken notice of the ${race} ${specialty.toLowerCase()} who dares to walk these forgotten paths.`
    };
  }, []);
  
  return { generateFallbackStory };
}