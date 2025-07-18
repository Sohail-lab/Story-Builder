/**
 * Utility functions to test store functionality
 * This file can be used to verify that all stores are working correctly
 */

import { 
  useQuizStore, 
  usePlayerStore, 
  useUIStore, 
  useStoryStore,
  sessionStorageUtils,
  storeSyncUtils
} from '@/stores';

export const testStores = () => {
  console.group('Testing Store Functionality');
  
  try {
    // Test Quiz Store
    console.log('Testing Quiz Store...');
    const quizStore = useQuizStore.getState();
    
    // Test basic quiz operations
    quizStore.setAnswer('name', 'Test Hero');
    quizStore.setAnswer('gender', 'Male');
    quizStore.setAnswer('race', 'Elf');
    
    console.log('Quiz answers:', quizStore.answers);
    console.log('Quiz progress:', quizStore.progress);
    console.log('Current question:', quizStore.getCurrentQuestion());
    console.log('Can proceed:', quizStore.canProceedToNext());
    
    // Test Player Store
    console.log('Testing Player Store...');
    const playerStore = usePlayerStore.getState();
    
    // Build profile from quiz answers
    playerStore.buildProfileFromAnswers(quizStore.answers);
    console.log('Player profile:', playerStore.profile);
    console.log('Profile completion:', playerStore.getCompletionPercentage());
    console.log('Missing fields:', playerStore.getMissingRequiredFields());
    
    // Test UI Store
    console.log('Testing UI Store...');
    const uiStore = useUIStore.getState();
    
    uiStore.setLoading(true);
    uiStore.setStoryGenerationLoading(true);
    console.log('Loading states:', uiStore.loadingStates);
    console.log('Has any loading:', uiStore.hasAnyLoading());
    
    uiStore.setError('Test error');
    uiStore.setNetworkError('Network test error');
    console.log('Error states:', uiStore.errorStates);
    console.log('Active errors:', uiStore.getActiveErrors());
    
    // Test Story Store
    console.log('Testing Story Store...');
    const storyStore = useStoryStore.getState();
    
    const testProfile = playerStore.getProfileForStoryGeneration();
    if (testProfile) {
      storyStore.startStoryGeneration(testProfile);
      console.log('Story generation started');
      console.log('Can regenerate:', storyStore.canRegenerateStory());
    }
    
    // Test Session Storage
    console.log('Testing Session Storage...');
    const sessionSaved = sessionStorageUtils.saveSession();
    console.log('Session saved:', sessionSaved);
    console.log('Has session:', sessionStorageUtils.hasSession());
    
    // Test Store Sync
    console.log('Testing Store Sync...');
    storeSyncUtils.syncQuizToPlayer();
    console.log('Stores synced successfully');
    
    console.log('✅ All store tests passed!');
    
  } catch (error) {
    console.error('❌ Store test failed:', error);
  } finally {
    console.groupEnd();
  }
};

export const resetTestData = () => {
  console.log('Resetting test data...');
  
  useQuizStore.getState().resetQuiz();
  usePlayerStore.getState().resetProfile();
  useUIStore.getState().resetUIState();
  useStoryStore.getState().resetStoryState();
  sessionStorageUtils.clearSession();
  
  console.log('✅ Test data reset complete');
};