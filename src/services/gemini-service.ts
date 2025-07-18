import { GoogleGenerativeAI } from '@google/generative-ai';
import { type PlayerProfile, type StoryResponse, StoryResponseSchema } from '@/types';

// Configuration constants
const GEMINI_MODEL = 'gemini-1.5-flash';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const REQUEST_TIMEOUT_MS = 30000;

// Error types for better error handling
export class GeminiServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly retryable: boolean = false
  ) {
    super(message);
    this.name = 'GeminiServiceError';
  }
}

export class GeminiAPIError extends GeminiServiceError {
  constructor(message: string, retryable: boolean = true) {
    super(message, 'API_ERROR', retryable);
  }
}

export class GeminiValidationError extends GeminiServiceError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', false);
  }
}

export class GeminiConfigurationError extends GeminiServiceError {
  constructor(message: string) {
    super(message, 'CONFIGURATION_ERROR', false);
  }
}

// Service configuration interface
interface GeminiServiceConfig {
  apiKey: string;
  model?: string;
  maxRetries?: number;
  retryDelayMs?: number;
  timeoutMs?: number;
}

// Response validation helper
function validateStoryResponse(response: unknown): StoryResponse {
  try {
    return StoryResponseSchema.parse(response);
  } catch (error) {
    throw new GeminiValidationError(
      `Invalid story response format: ${error instanceof Error ? error.message : 'Unknown validation error'}`
    );
  }
}

// Retry utility with exponential backoff
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number,
  baseDelayMs: number
): Promise<T> {
  let lastError: Error = new Error('No attempts made');
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on non-retryable errors
      if (error instanceof GeminiServiceError && !error.retryable) {
        throw error;
      }
      
      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break;
      }
      
      // Calculate delay with exponential backoff
      const delay = baseDelayMs * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new GeminiAPIError(
    `Failed after ${maxRetries + 1} attempts: ${lastError.message}`
  );
}

// Main Gemini service class
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private config: Required<GeminiServiceConfig>;
  
  constructor(config: GeminiServiceConfig) {
    if (!config.apiKey) {
      throw new GeminiConfigurationError('API key is required');
    }
    
    this.config = {
      apiKey: config.apiKey,
      model: config.model || GEMINI_MODEL,
      maxRetries: config.maxRetries || MAX_RETRIES,
      retryDelayMs: config.retryDelayMs || RETRY_DELAY_MS,
      timeoutMs: config.timeoutMs || REQUEST_TIMEOUT_MS
    };
    
    this.genAI = new GoogleGenerativeAI(this.config.apiKey);
  }
  
  /**
   * Generate a fantasy story based on player profile
   */
  async generateStory(playerProfile: PlayerProfile): Promise<StoryResponse> {
    const prompt = this.buildStoryPrompt(playerProfile);
    
    return withRetry(
      async () => {
        const model = this.genAI.getGenerativeModel({ model: this.config.model });
        
        // Create timeout promise
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new GeminiAPIError('Request timeout', true));
          }, this.config.timeoutMs);
        });
        
        try {
          // Race between API call and timeout
          const result = await Promise.race([
            model.generateContent(prompt),
            timeoutPromise
          ]);
          
          if (!result.response) {
            throw new GeminiAPIError('No response received from API');
          }
          
          const text = result.response.text();
          if (!text) {
            throw new GeminiAPIError('Empty response from API');
          }
          
          // Parse the JSON response (handle markdown code blocks)
          let parsedResponse: unknown;
          try {
            // Clean the response text to handle markdown code blocks
            let cleanText = text.trim();
            
            // Remove markdown code block markers if present
            if (cleanText.startsWith('```json')) {
              cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
            } else if (cleanText.startsWith('```')) {
              cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
            }
            
            parsedResponse = JSON.parse(cleanText);
          } catch (parseError) {
            throw new GeminiValidationError(
              `Failed to parse API response as JSON: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`
            );
          }
          
          // Validate and return the story response
          return validateStoryResponse(parsedResponse);
          
        } catch (error) {
          if (error instanceof GeminiServiceError) {
            throw error;
          }
          
          // Handle Google AI API specific errors
          if (error && typeof error === 'object' && 'message' in error) {
            const message = String(error.message);
            
            // Check for specific API error types
            if (message.includes('API_KEY')) {
              throw new GeminiConfigurationError('Invalid API key');
            }
            if (message.includes('QUOTA_EXCEEDED')) {
              throw new GeminiAPIError('API quota exceeded', false);
            }
            if (message.includes('RATE_LIMIT')) {
              throw new GeminiAPIError('Rate limit exceeded', true);
            }
            
            throw new GeminiAPIError(`API error: ${message}`);
          }
          
          throw new GeminiAPIError(`Unexpected error: ${String(error)}`);
        }
      },
      this.config.maxRetries,
      this.config.retryDelayMs
    );
  }
  
  /**
   * Build the story generation prompt based on player profile
   */
  private buildStoryPrompt(profile: PlayerProfile): string {
    const romanceSection = profile.romanceInterest && profile.romanticPartner
      ? `The story should include a romantic interest: a ${profile.romanticPartner} who complements ${profile.name}'s journey.`
      : 'This story focuses on adventure and personal growth without romantic elements.';
    
    return `You are a master fantasy storyteller. Create an immersive, personalized fantasy story based on the following character profile. The story should be engaging, detailed, and end with compelling suspense.

CHARACTER PROFILE:
- Name: ${profile.name}
- Gender: ${profile.gender}
- Race: ${profile.race}
- Specialty/Profession: ${profile.specialty}
- Lifestyle: ${profile.lifestyle}
- Personality Trait: ${profile.personalityTrait}
- Favorite Environment: ${profile.favoriteEnvironment}
- Magical Affinity: ${profile.magicalAffinity}
- Social Preference: ${profile.socialPreference}
- Moral Alignment: ${profile.moralAlignment}
- Primary Motivation: ${profile.primaryMotivation}
${romanceSection}

STORY REQUIREMENTS:
1. The story must center around ${profile.name} as the protagonist
2. Incorporate ALL character traits naturally into the narrative
3. Set the story in ${profile.favoriteEnvironment} or a related fantasy setting
4. Include elements related to their ${profile.specialty} profession
5. Reflect their ${profile.personalityTrait} personality and ${profile.moralAlignment} moral alignment
6. The story should align with their ${profile.primaryMotivation} motivation
7. Include magical elements appropriate to their ${profile.magicalAffinity} affinity
8. End with a compelling cliffhanger or suspenseful moment

RESPONSE FORMAT:
Return your response as a JSON object with exactly these fields:
{
  "characterIntroduction": "A compelling introduction to the character and their current situation (2-3 sentences)",
  "worldDescription": "Rich description of the fantasy world and immediate environment (3-4 sentences)",
  "plotSetup": "The inciting incident or main conflict that drives the story forward (3-4 sentences)",
  "narrative": "The main story content with detailed descriptions, dialogue, and action (8-12 sentences)",
  "suspensefulEnding": "A cliffhanger or suspenseful conclusion that leaves the reader wanting more (2-3 sentences)"
}

Make the story immersive, detailed, and true to the character's profile. Use vivid descriptions and engaging narrative techniques. The total story should be substantial but not overwhelming - aim for a compelling short story that feels complete yet leaves room for continuation.`;
  }
  
  /**
   * Test the API connection and configuration
   */
  async testConnection(): Promise<boolean> {
    try {
      const testProfile: PlayerProfile = {
        name: 'Test',
        gender: 'Male',
        race: 'Human',
        specialty: 'Warrior',
        lifestyle: 'Adventurous',
        romanceInterest: false,
        personalityTrait: 'Brave',
        favoriteEnvironment: 'Forest',
        magicalAffinity: 'None',
        socialPreference: 'Small Groups',
        moralAlignment: 'Lawful',
        primaryMotivation: 'Justice',
        additionalChoices: {},
        customAnswers: {}
      };
      
      const model = this.genAI.getGenerativeModel({ model: this.config.model });
      const result = await model.generateContent('Test connection. Respond with: {"test": "success"}');
      
      const text = result.response.text();
      const parsed = JSON.parse(text);
      
      return parsed.test === 'success';
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

// Factory function to create service instance
export function createGeminiService(apiKey: string, config?: Partial<GeminiServiceConfig>): GeminiService {
  return new GeminiService({
    apiKey,
    ...config
  });
}

// Singleton instance for app-wide use
let geminiServiceInstance: GeminiService | null = null;

export function getGeminiService(): GeminiService {
  if (!geminiServiceInstance) {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new GeminiConfigurationError(
        'NEXT_PUBLIC_GEMINI_API_KEY environment variable is required'
      );
    }
    
    geminiServiceInstance = createGeminiService(apiKey);
  }
  
  return geminiServiceInstance;
}

// Reset singleton (useful for testing)
export function resetGeminiService(): void {
  geminiServiceInstance = null;
}