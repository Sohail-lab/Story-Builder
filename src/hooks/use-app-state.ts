import { useEffect, useCallback } from 'react';
import { 
  useQuizStore, 
  usePlayerStore, 
  useUIStore, 
  useStoryStore,
  sessionStorageUtils,
  storeSyncUtils
} from '@/stores';

/**
 * Custom hook that manages the overall application state
 * Handles store synchronization and session persistence
 */
export const useAppState = () => {
  const quiz = useQuizStore();
  const player = usePlayerStore();
  const ui = useUIStore();
  const story = useStoryStore();
  
  // Auto-save functionality
  const setupAutoSave = useCallback(() => {
    const saveInterval = setInterval(() => {
      sessionStorageUtils.saveSession();
    }, 10000); // Save every 10 seconds
    
    const handleBeforeUnload = () => {
      sessionStorageUtils.saveSession();
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }
    
    return () => {
      clearInterval(saveInterval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      }
    };
  }, []);

  // Initialize app state on mount
  useEffect(() => {
    // Try to load previous session
    const sessionLoaded = sessionStorageUtils.loadSession();
    
    if (sessionLoaded) {
      // Sync stores after loading session
      storeSyncUtils.syncQuizToPlayer();
      storeSyncUtils.syncQuizToUI();
    }
    
    // Setup auto-save
    const cleanup = setupAutoSave();
    
    return cleanup;
  }, [setupAutoSave]);
  
  // Sync quiz answers to player profile whenever answers change
  useEffect(() => {
    if (Object.keys(quiz.answers).length > 0) {
      storeSyncUtils.syncQuizToPlayer();
    }
  }, [quiz.answers]);
  
  // Navigate to story page when quiz is completed
  useEffect(() => {
    if (quiz.isComplete && ui.currentPage === 'quiz') {
      ui.navigateToPage('story');
    }
  }, [quiz.isComplete, ui.currentPage, ui]);
  
  // Application-level actions
  const startNewAdventure = useCallback(() => {
    quiz.resetQuiz();
    player.resetProfile();
    story.resetStoryState();
    ui.setCurrentPage('landing');
    sessionStorageUtils.clearSession();
  }, [quiz, player, story, ui]);
  
  const startQuiz = useCallback(() => {
    ui.navigateToPage('quiz');
    ui.clearAllErrors();
  }, [ui]);
  
  const generateStory = useCallback(async () => {
    const profile = player.getProfileForStoryGeneration();
    if (!profile) {
      ui.setError('Profile is incomplete. Please answer all required questions.');
      return false;
    }
    
    try {
      ui.setStoryGenerationLoading(true);
      ui.setStoryGenerationError(null);
      story.startStoryGeneration(profile);
      
      // This would be replaced with actual API call in the story generation task
      // For now, we just set up the state management structure
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate story';
      ui.setStoryGenerationError(errorMessage);
      story.failStoryGeneration(errorMessage);
      return false;
    } finally {
      ui.setStoryGenerationLoading(false);
    }
  }, [player, ui, story]);
  
  const completeQuiz = useCallback(() => {
    quiz.completeQuiz();
    storeSyncUtils.syncQuizToPlayer();
    
    // Auto-generate story if profile is complete
    const profile = player.getProfileForStoryGeneration();
    if (profile) {
      generateStory();
    }
  }, [quiz, player, generateStory]);
  
  // Computed state
  const appState = {
    // Current state
    currentPage: ui.currentPage,
    isLoading: ui.hasAnyLoading(),
    hasErrors: ui.hasAnyError(),
    errors: ui.getActiveErrors(),
    
    // Quiz state
    quizProgress: quiz.progress,
    isQuizComplete: quiz.isComplete,
    currentQuestion: quiz.getCurrentQuestion(),
    canProceedToNext: quiz.canProceedToNext(),
    canGoToPrevious: quiz.canGoToPrevious(),
    
    // Player state
    profileCompletion: player.getCompletionPercentage(),
    isProfileComplete: player.isProfileComplete,
    missingFields: player.getMissingRequiredFields(),
    
    // Story state
    hasStory: story.hasStory(),
    isGeneratingStory: story.isGenerating,
    storyError: story.generationError,
    storyMetadata: story.getStoryMetadata(),
    
    // Session state
    hasSession: sessionStorageUtils.hasSession(),
    canResumeSession: sessionStorageUtils.hasSession() && !quiz.isComplete
  };
  
  const appActions = {
    // Navigation
    startNewAdventure,
    startQuiz,
    navigateToPage: ui.navigateToPage,
    
    // Quiz actions
    setAnswer: quiz.setAnswer,
    nextQuestion: quiz.nextQuestion,
    previousQuestion: quiz.previousQuestion,
    completeQuiz,
    
    // Story actions
    generateStory,
    
    // Error handling
    clearErrors: ui.clearAllErrors,
    clearError: ui.setError,
    
    // Session management
    saveSession: sessionStorageUtils.saveSession,
    loadSession: sessionStorageUtils.loadSession,
    clearSession: sessionStorageUtils.clearSession
  };
  
  return {
    // Individual stores (for direct access when needed)
    stores: { quiz, player, ui, story },
    
    // Computed application state
    state: appState,
    
    // Application actions
    actions: appActions
  };
};