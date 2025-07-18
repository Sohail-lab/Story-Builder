import { z } from 'zod';
import { 
  PlayerProfileSchema, 
  QuestionSchema, 
  StoryResponseSchema,
  NameValidationSchema,
  GenderValidationSchema,
  CustomTextValidationSchema,
  BooleanChoiceValidationSchema
} from '@/types';

// Validation helper functions
export const validatePlayerProfile = (data: unknown) => {
  return PlayerProfileSchema.safeParse(data);
};

export const validateQuestion = (data: unknown) => {
  return QuestionSchema.safeParse(data);
};

export const validateStoryResponse = (data: unknown) => {
  return StoryResponseSchema.safeParse(data);
};

export const validateName = (name: string) => {
  return NameValidationSchema.safeParse(name);
};

export const validateGender = (gender: string) => {
  return GenderValidationSchema.safeParse(gender);
};

export const validateCustomText = (text: string) => {
  return CustomTextValidationSchema.safeParse(text);
};

export const validateBooleanChoice = (choice: string) => {
  return BooleanChoiceValidationSchema.safeParse(choice);
};

// Helper function to get validation schema for a specific question type
export const getValidationSchemaForQuestion = (questionId: string): z.ZodSchema => {
  switch (questionId) {
    case 'name':
      return NameValidationSchema;
    case 'gender':
      return GenderValidationSchema;
    case 'romanceInterest':
      return BooleanChoiceValidationSchema;
    case 'race':
    case 'specialty':
    case 'lifestyle':
    case 'personalityTrait':
    case 'favoriteEnvironment':
    case 'magicalAffinity':
    case 'primaryMotivation':
      return CustomTextValidationSchema;
    case 'socialPreference':
      return z.enum(['Solitary', 'Small Groups', 'Large Communities', 'Leadership Role']);
    case 'moralAlignment':
      return z.enum(['Lawful', 'Neutral', 'Chaotic']);
    case 'romanticPartner':
      return z.string().optional();
    default:
      return z.string().min(1, 'This field is required');
  }
};

// Helper function to validate form data for a specific question
export const validateQuestionAnswer = (questionId: string, answer: string) => {
  const schema = getValidationSchemaForQuestion(questionId);
  return schema.safeParse(answer);
};

// Helper function to get romantic partner options based on gender
export const getRomanticPartnerOptions = (gender: 'Male' | 'Female'): string[] => {
  if (gender === 'Male') {
    return ['Elven Maiden', 'Human Woman', 'Dwarven Lady', 'Halfling Lass', 'Mystical Sorceress', 'Noble Lady', 'Warrior Woman'];
  } else {
    return ['Elven Lord', 'Human Man', 'Dwarven Warrior', 'Halfling Gentleman', 'Mystical Wizard', 'Noble Knight', 'Warrior Hero'];
  }
};

// Type guard functions
export const isValidPlayerProfile = (data: unknown): data is import('@/types').PlayerProfile => {
  return PlayerProfileSchema.safeParse(data).success;
};

export const isValidQuestion = (data: unknown): data is import('@/types').Question => {
  return QuestionSchema.safeParse(data).success;
};

export const isValidStoryResponse = (data: unknown): data is import('@/types').StoryResponse => {
  return StoryResponseSchema.safeParse(data).success;
};