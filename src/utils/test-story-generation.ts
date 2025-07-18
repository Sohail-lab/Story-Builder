import { type PlayerProfile, type StoryResponse } from '@/types';
import { getStoryService } from '@/services/story-service';

// Test player profile for story generation testing
export const testPlayerProfile: PlayerProfile = {
  name: 'Aria',
  gender: 'Female',
  race: 'Elf',
  specialty: 'Scholar',
  lifestyle: 'Mystical',
  romanceInterest: true,
  romanticPartner: 'Male Warrior',
  personalityTrait: 'Wise',
  favoriteEnvironment: 'Forest',
  magicalAffinity: 'Nature',
  socialPreference: 'Small Groups',
  moralAlignment: 'Neutral',
  primaryMotivation: 'Knowledge',
  additionalChoices: {},
  customAnswers: {}
};

// Test story generation service
export async function testStoryGeneration(): Promise<StoryResponse | void> {
  console.log('🧪 Testing Story Generation Service...');
  
  try {
    // Test service configuration
    const storyService = getStoryService();
    const serviceStatus = await storyService.testService();
    
    console.log('📊 Service Status:', serviceStatus);
    
    if (!serviceStatus.serverAPI && !serviceStatus.clientService) {
      console.warn('⚠️ Neither server API nor client service is available');
      return;
    }
    
    // Test story generation
    console.log('🎭 Generating test story...');
    const startTime = Date.now();
    
    const story = await storyService.generateStory(testPlayerProfile);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('✅ Story generated successfully!');
    console.log(`⏱️ Generation time: ${duration}ms`);
    console.log('📖 Story preview:');
    console.log('Character Introduction:', story.characterIntroduction.substring(0, 100) + '...');
    console.log('World Description:', story.worldDescription.substring(0, 100) + '...');
    console.log('Plot Setup:', story.plotSetup.substring(0, 100) + '...');
    console.log('Narrative:', story.narrative.substring(0, 100) + '...');
    console.log('Suspenseful Ending:', story.suspensefulEnding.substring(0, 100) + '...');
    
    return story;
    
  } catch (error) {
    console.error('❌ Story generation test failed:', error);
    throw error;
  }
}

// Test fallback story generation
export async function testFallbackStory(): Promise<void> {
  console.log('🧪 Testing Fallback Story Generation...');
  
  try {
    const { generateFallbackStory } = await import('@/services/story-service');
    const fallbackStory = generateFallbackStory(testPlayerProfile);
    
    console.log('✅ Fallback story generated successfully!');
    console.log('📖 Fallback story preview:');
    console.log('Character Introduction:', fallbackStory.characterIntroduction.substring(0, 100) + '...');
    console.log('World Description:', fallbackStory.worldDescription.substring(0, 100) + '...');
    console.log('Plot Setup:', fallbackStory.plotSetup.substring(0, 100) + '...');
    console.log('Narrative:', fallbackStory.narrative.substring(0, 100) + '...');
    console.log('Suspenseful Ending:', fallbackStory.suspensefulEnding.substring(0, 100) + '...');
    
  } catch (error) {
    console.error('❌ Fallback story generation test failed:', error);
    throw error;
  }
}

// Comprehensive test function
export async function runStoryGenerationTests(): Promise<void> {
  console.log('🚀 Running Story Generation Tests...\n');
  
  try {
    // Test fallback story first (doesn't require API)
    await testFallbackStory();
    console.log('');
    
    // Test main story generation
    await testStoryGeneration();
    console.log('');
    
    console.log('🎉 All story generation tests passed!');
    
  } catch (error) {
    console.error('💥 Story generation tests failed:', error);
    throw error;
  }
}

// Export test runner for use in development
if (typeof window !== 'undefined') {
  // Make test functions available in browser console
  const globalWindow = window as typeof window & {
    testStoryGeneration: typeof testStoryGeneration;
    testFallbackStory: typeof testFallbackStory;
    runStoryGenerationTests: typeof runStoryGenerationTests;
  };
  
  globalWindow.testStoryGeneration = testStoryGeneration;
  globalWindow.testFallbackStory = testFallbackStory;
  globalWindow.runStoryGenerationTests = runStoryGenerationTests;
}