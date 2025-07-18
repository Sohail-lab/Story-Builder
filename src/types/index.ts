import { z } from 'zod';

// Core data models for the fantasy quiz application

export interface PlayerProfile {
  name: string;
  gender: 'Male' | 'Female';
  race: string;
  specialty: string;
  lifestyle: 'Peaceful' | 'Adventurous' | 'Scholarly' | 'Mercantile' | 'Noble' | 'Nomadic' | 'Mystical' | 'Artisan' | string;
  romanceInterest: boolean;
  romanticPartner?: string;
  personalityTrait: string;
  favoriteEnvironment: 'Forest' | 'Mountains' | 'Coastal' | 'Desert' | 'Urban' | 'Underground' | string;
  magicalAffinity: 'None' | 'Elemental' | 'Divine' | 'Arcane' | 'Nature' | 'Shadow' | string;
  socialPreference: 'Solitary' | 'Small Groups' | 'Large Communities' | 'Leadership Role' | string;
  moralAlignment: 'Lawful' | 'Neutral' | 'Chaotic' | string;
  primaryMotivation: 'Knowledge' | 'Power' | 'Love' | 'Justice' | 'Freedom' | 'Wealth' | 'Family' | string;
  additionalChoices: Record<string, string>;
  customAnswers: Record<string, string>;
}

// Zod validation schemas
export const PlayerProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  gender: z.enum(['Male', 'Female'], { message: 'Gender selection is required' }),
  race: z.string().min(1, 'Race is required').max(30, 'Race must be less than 30 characters'),
  specialty: z.string().min(1, 'Specialty is required').max(30, 'Specialty must be less than 30 characters'),
  lifestyle: z.string().min(1, 'Lifestyle preference is required').max(30, 'Lifestyle must be less than 30 characters'),
  romanceInterest: z.boolean(),
  romanticPartner: z.string().max(30, 'Partner type must be less than 30 characters').optional(),
  personalityTrait: z.string().min(1, 'Personality trait is required').max(30, 'Personality trait must be less than 30 characters'),
  favoriteEnvironment: z.string().min(1, 'Environment preference is required').max(30, 'Environment must be less than 30 characters'),
  magicalAffinity: z.string().min(1, 'Magical affinity is required').max(30, 'Magical affinity must be less than 30 characters'),
  socialPreference: z.enum(['Solitary', 'Small Groups', 'Large Communities', 'Leadership Role'], { message: 'Social preference is required' }),
  moralAlignment: z.enum(['Lawful', 'Neutral', 'Chaotic'], { message: 'Moral alignment is required' }),
  primaryMotivation: z.string().min(1, 'Primary motivation is required').max(30, 'Primary motivation must be less than 30 characters'),
  additionalChoices: z.record(z.string(), z.string()),
  customAnswers: z.record(z.string(), z.string())
});

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'text-input' | 'hybrid' | 'gender-only';
  options?: string[];
  allowCustom?: boolean;
  required: boolean;
  conditional?: {
    dependsOn: string;
    value: string | boolean;
  };
}

export const QuestionSchema = z.object({
  id: z.string().min(1, 'Question ID is required'),
  text: z.string().min(1, 'Question text is required'),
  type: z.enum(['multiple-choice', 'text-input', 'hybrid', 'gender-only']),
  options: z.array(z.string()).optional(),
  allowCustom: z.boolean().optional(),
  required: z.boolean(),
  conditional: z.object({
    dependsOn: z.string(),
    value: z.union([z.string(), z.boolean()])
  }).optional()
});

export interface StoryResponse {
  narrative: string;
  worldDescription: string;
  characterIntroduction: string;
  plotSetup: string;
  suspensefulEnding: string;
}

export const StoryResponseSchema = z.object({
  narrative: z.string().min(1, 'Narrative is required'),
  worldDescription: z.string().min(1, 'World description is required'),
  characterIntroduction: z.string().min(1, 'Character introduction is required'),
  plotSetup: z.string().min(1, 'Plot setup is required'),
  suspensefulEnding: z.string().min(1, 'Suspenseful ending is required')
});

// Component prop types
export interface QuestionComponentProps {
  question: Question;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// State management types
export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<string, string>;
  isComplete: boolean;
  progress: number;
}

export interface PlayerState {
  profile: Partial<PlayerProfile>;
  isProfileComplete: boolean;
}

export interface UIState {
  isLoading: boolean;
  error: string | null;
  currentPage: 'landing' | 'quiz' | 'story';
}

export interface StoryState {
  generatedStory: StoryResponse | null;
  isGenerating: boolean;
  generationError: string | null;
}

// API types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type StoryGenerationRequest = {
  playerProfile: PlayerProfile;
};

// Additional validation schemas for component props and API responses
export const QuestionComponentPropsSchema = z.object({
  question: QuestionSchema,
  value: z.string().optional(),
  onChange: z.function(),
  error: z.string().optional()
});

export const QuizStateSchema = z.object({
  currentQuestionIndex: z.number().min(0),
  answers: z.record(z.string(), z.string()),
  isComplete: z.boolean(),
  progress: z.number().min(0).max(100)
});

export const PlayerStateSchema = z.object({
  profile: PlayerProfileSchema.partial(),
  isProfileComplete: z.boolean()
});

export const UIStateSchema = z.object({
  isLoading: z.boolean(),
  error: z.string().nullable(),
  currentPage: z.enum(['landing', 'quiz', 'story'])
});

export const StoryStateSchema = z.object({
  generatedStory: StoryResponseSchema.nullable(),
  isGenerating: z.boolean(),
  generationError: z.string().nullable()
});

export const APIResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => z.object({
  success: z.boolean(),
  data: dataSchema.optional(),
  error: z.string().optional()
});

export const StoryGenerationRequestSchema = z.object({
  playerProfile: PlayerProfileSchema
});

// Form validation schemas for individual questions
export const NameValidationSchema = z.string()
  .min(1, 'Name is required')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

export const GenderValidationSchema = z.enum(['Male', 'Female'], {
  message: 'Please select your gender'
});

export const CustomTextValidationSchema = z.string()
  .min(1, 'This field is required')
  .max(30, 'Response must be less than 30 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Only letters, spaces, hyphens, and apostrophes are allowed');

export const BooleanChoiceValidationSchema = z.enum(['Yes', 'No'], {
  message: 'Please make a selection'
});

// Utility type for form field validation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValidationSchema = z.ZodString | z.ZodEnum<any> | z.ZodBoolean;

// Question configuration array
export const questionConfig: Question[] = [
  {
    id: 'name',
    text: 'What is your name, outlander?',
    type: 'text-input',
    required: true
  },
  {
    id: 'gender',
    text: 'Choose your gender:',
    type: 'gender-only',
    options: ['Male', 'Female'],
    required: true
  },
  {
    id: 'race',
    text: 'What is your heritage?',
    type: 'hybrid',
    options: ['Human', 'Elf', 'Dwarf', 'Halfling'],
    allowCustom: true,
    required: true
  },
  {
    id: 'specialty',
    text: 'What is your area of expertise?',
    type: 'hybrid',
    options: ['Warrior', 'Scholar', 'Craftsman', 'Healer', 'Merchant', 'Artist'],
    allowCustom: true,
    required: true
  },
  {
    id: 'lifestyle',
    text: 'How do you prefer to live your life?',
    type: 'hybrid',
    options: ['Peaceful', 'Adventurous', 'Scholarly', 'Mercantile', 'Noble', 'Nomadic', 'Mystical', 'Artisan'],
    allowCustom: true,
    required: true
  },
  {
    id: 'personalityTrait',
    text: 'What trait best describes your character?',
    type: 'hybrid',
    options: ['Brave', 'Wise', 'Cunning', 'Compassionate', 'Ambitious', 'Loyal', 'Independent'],
    allowCustom: true,
    required: true
  },
  {
    id: 'favoriteEnvironment',
    text: 'Where do you feel most at home?',
    type: 'hybrid',
    options: ['Forest', 'Mountains', 'Coastal', 'Desert', 'Urban', 'Underground'],
    allowCustom: true,
    required: true
  },
  {
    id: 'magicalAffinity',
    text: 'Do you have any connection to magical forces?',
    type: 'hybrid',
    options: ['None', 'Elemental', 'Divine', 'Arcane', 'Nature', 'Shadow'],
    allowCustom: true,
    required: true
  },
  {
    id: 'socialPreference',
    text: 'How do you prefer to interact with others?',
    type: 'multiple-choice',
    options: ['Solitary', 'Small Groups', 'Large Communities', 'Leadership Role'],
    required: true
  },
  {
    id: 'moralAlignment',
    text: 'How do you approach rules and order?',
    type: 'multiple-choice',
    options: ['Lawful', 'Neutral', 'Chaotic'],
    required: true
  },
  {
    id: 'primaryMotivation',
    text: 'What drives you most in life?',
    type: 'hybrid',
    options: ['Knowledge', 'Power', 'Love', 'Justice', 'Freedom', 'Wealth', 'Family'],
    allowCustom: true,
    required: true
  },
  {
    id: 'romanceInterest',
    text: 'Are you interested in finding romance in your story?',
    type: 'multiple-choice',
    options: ['Yes', 'No'],
    required: true
  },
  {
    id: 'romanticPartner',
    text: 'What type of partner appeals to you?',
    type: 'multiple-choice',
    options: [], // Populated dynamically based on gender
    conditional: {
      dependsOn: 'romanceInterest',
      value: 'Yes'
    },
    required: false
  }
];