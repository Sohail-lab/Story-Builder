/**
 * Verification script to ensure all store functionality is working correctly
 * This validates that all sub-tasks have been completed successfully
 */

import { 
  useQuizStore, 
  usePlayerStore, 
  useUIStore, 
  useStoryStore,
  sessionStorageUtils,
  storeSyncUtils
} from '@/stores';

export const verifyStoreImplementation = () => {
  const results = {
    quizStore: false,
    playerStore: false,
    uiStore: false,
    storyStore: false,
    sessionStorage: false,
    storeSynchronization: false
  };

  console.group('🧪 Verifying Store Implementation');

  try {
    // 1. Verify Quiz Store for managing question flow and answers
    console.log('1️⃣ Testing Quiz Store...');
    const quizStore = useQuizStore.getState();
    
    // Test question flow management
    const initialQuestion = quizStore.getCurrentQuestion();
    const totalQuestions = quizStore.getTotalQuestions();
    
    // Test answer management
    quizStore.setAnswer('name', 'Test Hero');
    quizStore.setAnswer('gender', 'Male');
    
    // Test navigation
    const canProceed = quizStore.canProceedToNext();
    const canGoBack = quizStore.canGoToPrevious();
    
    // Test progress tracking
    const progress = quizStore.progress;
    
    if (initialQuestion && totalQuestions > 0 && quizStore.answers.name === 'Test Hero' && 
        typeof canProceed === 'boolean' && typeof canGoBack === 'boolean' && 
        typeof progress === 'number') {
      results.quizStore = true;
      console.log('✅ Quiz Store: Question flow and answers management working');
    } else {
      console.log('❌ Quiz Store: Failed validation');
    }

    // 2. Verify Player Profile Store with persistence
    console.log('2️⃣ Testing Player Profile Store...');
    const playerStore = usePlayerStore.getState();
    
    // Test profile building from answers
    playerStore.buildProfileFromAnswers(quizStore.answers);
    
    // Test profile validation
    const validation = playerStore.validateProfile();
    const completion = playerStore.getCompletionPercentage();
    const missingFields = playerStore.getMissingRequiredFields();
    
    // Test profile updates
    playerStore.setProfileField('race', 'Elf');
    
    if (playerStore.profile.name === 'Test Hero' && playerStore.profile.race === 'Elf' &&
        typeof validation.isValid === 'boolean' && typeof completion === 'number' &&
        Array.isArray(missingFields)) {
      results.playerStore = true;
      console.log('✅ Player Store: Profile management and persistence working');
    } else {
      console.log('❌ Player Store: Failed validation');
    }

    // 3. Verify UI State Store for loading and error states
    console.log('3️⃣ Testing UI State Store...');
    const uiStore = useUIStore.getState();
    
    // Test loading states
    uiStore.setLoading(true);
    uiStore.setStoryGenerationLoading(true);
    const hasLoading = uiStore.hasAnyLoading();
    
    // Test error states
    uiStore.setError('Test error');
    uiStore.setNetworkError('Network error');
    const hasErrors = uiStore.hasAnyError();
    const activeErrors = uiStore.getActiveErrors();
    
    // Test page navigation
    uiStore.setCurrentPage('quiz');
    
    if (hasLoading && hasErrors && activeErrors.length > 0 && 
        uiStore.currentPage === 'quiz' && uiStore.loadingStates.storyGeneration) {
      results.uiStore = true;
      console.log('✅ UI Store: Loading and error states management working');
    } else {
      console.log('❌ UI Store: Failed validation');
    }

    // 4. Verify Story Store (bonus - not explicitly required but part of complete implementation)
    console.log('4️⃣ Testing Story Store...');
    const storyStore = useStoryStore.getState();
    
    // Test story generation workflow
    const testProfile = playerStore.getProfileForStoryGeneration();
    if (testProfile) {
      storyStore.startStoryGeneration(testProfile);
    }
    
    const canRegenerate = storyStore.canRegenerateStory();
    const hasStory = storyStore.hasStory();
    const metadata = storyStore.getStoryMetadata();
    
    if (typeof canRegenerate === 'boolean' && typeof hasStory === 'boolean' &&
        typeof metadata === 'object' && storyStore.isGenerating) {
      results.storyStore = true;
      console.log('✅ Story Store: Story state management working');
    } else {
      console.log('❌ Story Store: Failed validation');
    }

    // 5. Verify Session Storage Integration
    console.log('5️⃣ Testing Session Storage Integration...');
    
    // Test session save/load
    const sessionSaved = sessionStorageUtils.saveSession();
    const hasSession = sessionStorageUtils.hasSession();
    
    // Clear and test
    const sessionCleared = sessionStorageUtils.clearSession();
    const hasSessionAfterClear = sessionStorageUtils.hasSession();
    
    if (sessionSaved && hasSession && sessionCleared && !hasSessionAfterClear) {
      results.sessionStorage = true;
      console.log('✅ Session Storage: Data persistence working');
    } else {
      console.log('❌ Session Storage: Failed validation');
    }

    // 6. Verify Store Synchronization
    console.log('6️⃣ Testing Store Synchronization...');
    
    // Reset and test sync
    quizStore.resetQuiz();
    quizStore.setAnswer('name', 'Sync Test');
    quizStore.setAnswer('gender', 'Female');
    
    // Test sync functionality
    storeSyncUtils.syncQuizToPlayer();
    
    const syncedProfile = usePlayerStore.getState().profile;
    
    if (syncedProfile.name === 'Sync Test' && syncedProfile.gender === 'Female') {
      results.storeSynchronization = true;
      console.log('✅ Store Sync: Quiz to Player synchronization working');
    } else {
      console.log('❌ Store Sync: Failed validation');
    }

    // Summary
    const allPassed = Object.values(results).every(result => result);
    const passedCount = Object.values(results).filter(result => result).length;
    const totalCount = Object.keys(results).length;

    console.log('\n📊 Verification Summary:');
    console.log(`✅ Passed: ${passedCount}/${totalCount} tests`);
    
    if (allPassed) {
      console.log('🎉 All store implementations are working correctly!');
      console.log('\n✅ Sub-task verification:');
      console.log('  ✅ Quiz store for managing question flow and answers');
      console.log('  ✅ Player profile store with persistence');
      console.log('  ✅ UI state store for loading and error states');
      console.log('  ✅ Session storage integration for data persistence');
    } else {
      console.log('⚠️  Some implementations need attention');
    }

    return { success: allPassed, results, passedCount, totalCount };

  } catch (error) {
    console.error('❌ Verification failed with error:', error);
    return { success: false, error };
  } finally {
    console.groupEnd();
  }
};