// Test file to verify data models and validation schemas
import { 
  PlayerProfile, 
  Question, 
  StoryResponse, 
  questionConfig,
} from '@/types';
import { 
  validatePlayerProfile, 
  validateQuestion, 
  validateStoryResponse,
  getRomanticPartnerOptions,
  validateQuestionAnswer
} from './validation';

// Test data
const testPlayerProfile: PlayerProfile = {
  name: 'Aragorn',
  gender: 'Male',
  race: 'Human',
  specialty: 'Warrior',
  lifestyle: 'Adventurous',
  romanceInterest: true,
  romanticPartner: 'Elven Maiden',
  personalityTrait: 'Brave',
  favoriteEnvironment: 'Forest',
  magicalAffinity: 'None',
  socialPreference: 'Small Groups',
  moralAlignment: 'Lawful',
  primaryMotivation: 'Justice',
  additionalChoices: {},
  customAnswers: {}
};

const testQuestion: Question = {
  id: 'test',
  text: 'Test question?',
  type: 'multiple-choice',
  options: ['Option 1', 'Option 2'],
  required: true
};

const testStoryResponse: StoryResponse = {
  narrative: 'A great adventure begins...',
  worldDescription: 'A mystical realm...',
  characterIntroduction: 'You are a brave warrior...',
  plotSetup: 'Dark forces gather...',
  suspensefulEnding: 'To be continued...'
};

// Test function
export const runValidationTests = () => {
  console.log('Testing data models and validation schemas...');
  
  // Test PlayerProfile validation
  const profileResult = validatePlayerProfile(testPlayerProfile);
  console.log('PlayerProfile validation:', profileResult.success ? 'PASS' : 'FAIL');
  if (!profileResult.success) {
    console.log('PlayerProfile errors:', profileResult.error.issues);
  }
  
  // Test Question validation
  const questionResult = validateQuestion(testQuestion);
  console.log('Question validation:', questionResult.success ? 'PASS' : 'FAIL');
  if (!questionResult.success) {
    console.log('Question errors:', questionResult.error.issues);
  }
  
  // Test StoryResponse validation
  const storyResult = validateStoryResponse(testStoryResponse);
  console.log('StoryResponse validation:', storyResult.success ? 'PASS' : 'FAIL');
  if (!storyResult.success) {
    console.log('StoryResponse errors:', storyResult.error.issues);
  }
  
  // Test question configuration array
  console.log('Question config length:', questionConfig.length);
  console.log('Question config validation:', questionConfig.every(q => validateQuestion(q).success) ? 'PASS' : 'FAIL');
  
  // Test romantic partner options
  const maleOptions = getRomanticPartnerOptions('Male');
  const femaleOptions = getRomanticPartnerOptions('Female');
  console.log('Male romantic options:', maleOptions.length > 0 ? 'PASS' : 'FAIL');
  console.log('Female romantic options:', femaleOptions.length > 0 ? 'PASS' : 'FAIL');
  
  // Test individual question answer validation
  const nameValidation = validateQuestionAnswer('name', 'Aragorn');
  const genderValidation = validateQuestionAnswer('gender', 'Male');
  console.log('Name validation:', nameValidation.success ? 'PASS' : 'FAIL');
  console.log('Gender validation:', genderValidation.success ? 'PASS' : 'FAIL');
  
  console.log('All validation tests completed!');
};

// Export test data for use in other files
export { testPlayerProfile, testQuestion, testStoryResponse };