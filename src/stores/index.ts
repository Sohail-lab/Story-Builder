// Central store exports and utilities
export { useQuizStore } from './quiz-store';
export { usePlayerStore } from './player-store';
export { useUIStore } from './ui-store';
export { useStoryStore } from './story-store';

// Store utilities and session storage integration
import { useQuizStore } from './quiz-store';
import { usePlayerStore } from './player-store';
import { useUIStore } from './ui-store';
import { useStoryStore } from './story-store';

/**
 * Custom hook that provides access to all stores
 * Useful for components that need multiple stores
 */
export const useAllStores = () => {
  const quiz = useQuizStore();
  const player = usePlayerStore();
  const ui = useUIStore();
  const story = useStoryStore();
  
  return { quiz, player, ui, story };
};

/**
 * Reset all stores to their initial state
 * Useful for complete application reset
 */
export const resetAllStores = () => {
  useQuizStore.getState().resetQuiz();
  usePlayerStore.getState().resetProfile();
  useUIStore.getState().resetUIState();
  useStoryStore.getState().resetStoryState();
};

/**
 * Session storage utilities for additional data persistence
 */
export const sessionStorageUtils = {
  // Save current application state to session storage
  saveSession: () => {
    try {
      const quizState = useQuizStore.getState();
      const playerState = usePlayerStore.getState();
      const uiState = useUIStore.getState();
      const storyState = useStoryStore.getState();
      
      const sessionData = {
        quiz: {
          currentQuestionIndex: quizState.currentQuestionIndex,
          answers: quizState.answers,
          isComplete: quizState.isComplete,
          progress: quizState.progress
        },
        player: {
          profile: playerState.profile,
          isProfileComplete: playerState.isProfileComplete
        },
        ui: {
          currentPage: uiState.currentPage
        },
        story: {
          generatedStory: storyState.generatedStory,
          lastGenerationRequest: storyState.lastGenerationRequest,
          generationTimestamp: storyState.generationTimestamp
        },
        timestamp: Date.now()
      };
      
      sessionStorage.setItem('fantasy-quiz-session', JSON.stringify(sessionData));
      return true;
    } catch (error) {
      console.error('Failed to save session:', error);
      return false;
    }
  },
  
  // Load application state from session storage
  loadSession: () => {
    try {
      const sessionData = sessionStorage.getItem('fantasy-quiz-session');
      if (!sessionData) return false;
      
      const parsed = JSON.parse(sessionData);
      
      // Check if session is not too old (24 hours)
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      if (Date.now() - parsed.timestamp > maxAge) {
        sessionStorageUtils.clearSession();
        return false;
      }
      
      // Restore quiz state
      if (parsed.quiz) {
        const quizStore = useQuizStore.getState();
        Object.assign(quizStore, parsed.quiz);
      }
      
      // Restore player state
      if (parsed.player) {
        const playerStore = usePlayerStore.getState();
        playerStore.updateProfile(parsed.player.profile);
      }
      
      // Restore UI state
      if (parsed.ui) {
        const uiStore = useUIStore.getState();
        uiStore.setCurrentPage(parsed.ui.currentPage);
      }
      
      // Restore story state
      if (parsed.story) {
        const storyStore = useStoryStore.getState();
        if (parsed.story.generatedStory) {
          storyStore.setGeneratedStory(parsed.story.generatedStory);
        }
        if (parsed.story.lastGenerationRequest) {
          storyStore.setLastGenerationRequest(parsed.story.lastGenerationRequest);
        }
      }
      
      return true;
    } catch (loadError) {
      console.error('Failed to load session:', loadError);
      return false;
    }
  },
  
  // Clear session storage
  clearSession: () => {
    try {
      sessionStorage.removeItem('fantasy-quiz-session');
      return true;
    } catch (error) {
      console.error('Failed to clear session:', error);
      return false;
    }
  },
  
  // Check if session exists
  hasSession: () => {
    try {
      return sessionStorage.getItem('fantasy-quiz-session') !== null;
    } catch (error) {
      return false;
    }
  }
};

/**
 * Auto-save functionality
 * Automatically saves state changes to session storage
 */
export const setupAutoSave = () => {
  // Save session data whenever stores change
  const saveInterval = setInterval(() => {
    sessionStorageUtils.saveSession();
  }, 5000); // Save every 5 seconds
  
  // Save on page unload
  const handleBeforeUnload = () => {
    sessionStorageUtils.saveSession();
  };
  
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', handleBeforeUnload);
  }
  
  // Return cleanup function
  return () => {
    clearInterval(saveInterval);
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  };
};

/**
 * Store synchronization utilities
 * Keep stores in sync with each other
 */
export const storeSyncUtils = {
  // Sync quiz answers with player profile
  syncQuizToPlayer: () => {
    const quizState = useQuizStore.getState();
    const playerStore = usePlayerStore.getState();
    
    if (Object.keys(quizState.answers).length > 0) {
      playerStore.buildProfileFromAnswers(quizState.answers);
    }
  },
  
  // Update UI state based on quiz completion
  syncQuizToUI: () => {
    const quizState = useQuizStore.getState();
    const uiStore = useUIStore.getState();
    
    if (quizState.isComplete && uiStore.currentPage === 'quiz') {
      uiStore.navigateToPage('story');
    }
  },
  
  // Clear story when quiz is reset
  syncQuizResetToStory: () => {
    const storyStore = useStoryStore.getState();
    storyStore.resetStoryState();
  }
};

/**
 * Development utilities (only available in development)
 */
export const devUtils = process.env.NODE_ENV === 'development' ? {
  // Log all store states
  logAllStates: () => {
    console.group('Store States');
    console.log('Quiz:', useQuizStore.getState());
    console.log('Player:', usePlayerStore.getState());
    console.log('UI:', useUIStore.getState());
    console.log('Story:', useStoryStore.getState());
    console.groupEnd();
  },
  
  // Populate stores with test data
  populateTestData: () => {
    const quizStore = useQuizStore.getState();
    const testAnswers = {
      name: 'Test Hero',
      gender: 'Male',
      race: 'Elf',
      specialty: 'Warrior',
      lifestyle: 'Adventurous',
      personalityTrait: 'Brave',
      favoriteEnvironment: 'Forest',
      magicalAffinity: 'Nature',
      socialPreference: 'Small Groups',
      moralAlignment: 'Lawful',
      primaryMotivation: 'Justice',
      romanceInterest: 'Yes',
      romanticPartner: 'Elven Maiden'
    };
    
    Object.entries(testAnswers).forEach(([key, value]) => {
      quizStore.setAnswer(key, value);
    });
    
    storeSyncUtils.syncQuizToPlayer();
  }
} : {};