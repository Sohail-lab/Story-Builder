import { type PlayerProfile, type StoryResponse, StoryResponseSchema } from '@/types';
import { getGeminiService, GeminiServiceError } from './gemini-service';

// Configuration for story service
interface StoryServiceConfig {
  useServerAPI?: boolean;
  fallbackToClient?: boolean;
  timeoutMs?: number;
}

// Story service error types
export class StoryServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly retryable: boolean = false
  ) {
    super(message);
    this.name = 'StoryServiceError';
  }
}

// Main story service class
export class StoryService {
  private config: Required<StoryServiceConfig>;
  
  constructor(config: StoryServiceConfig = {}) {
    this.config = {
      useServerAPI: config.useServerAPI ?? true,
      fallbackToClient: config.fallbackToClient ?? true,
      timeoutMs: config.timeoutMs ?? 30000
    };
  }
  
  /**
   * Generate story using server API or client-side service
   */
  async generateStory(playerProfile: PlayerProfile): Promise<StoryResponse> {
    // Try server API first if configured
    if (this.config.useServerAPI) {
      try {
        return await this.generateStoryViaAPI(playerProfile);
      } catch (error) {
        console.warn('Server API generation failed:', error);
        
        // If fallback is disabled, throw the error
        if (!this.config.fallbackToClient) {
          throw error;
        }
        
        // Continue to client-side fallback
        console.log('Falling back to client-side generation...');
      }
    }
    
    // Use client-side service
    return await this.generateStoryViaClient(playerProfile);
  }
  
  /**
   * Generate story via server API
   */
  private async generateStoryViaAPI(playerProfile: PlayerProfile): Promise<StoryResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeoutMs);
    
    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerProfile }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 429) {
          throw new StoryServiceError(
            'Too many requests. Please wait a moment before trying again.',
            'RATE_LIMITED',
            true
          );
        }
        
        if (response.status >= 500) {
          throw new StoryServiceError(
            errorData.error || 'Server error occurred',
            'SERVER_ERROR',
            errorData.retryable ?? true
          );
        }
        
        throw new StoryServiceError(
          errorData.error || 'Request failed',
          'REQUEST_ERROR',
          false
        );
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new StoryServiceError(
          data.error || 'Story generation failed',
          'GENERATION_ERROR',
          data.retryable ?? false
        );
      }
      
      // Validate response data
      return StoryResponseSchema.parse(data.data);
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof StoryServiceError) {
        throw error;
      }
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new StoryServiceError(
          'Request timed out. Please try again.',
          'TIMEOUT',
          true
        );
      }
      
      throw new StoryServiceError(
        'Network error occurred',
        'NETWORK_ERROR',
        true
      );
    }
  }
  
  /**
   * Generate story via client-side Gemini service
   */
  private async generateStoryViaClient(playerProfile: PlayerProfile): Promise<StoryResponse> {
    try {
      const geminiService = getGeminiService();
      return await geminiService.generateStory(playerProfile);
    } catch (error) {
      if (error instanceof GeminiServiceError) {
        throw new StoryServiceError(
          error.message,
          error.code,
          error.retryable
        );
      }
      
      throw new StoryServiceError(
        'Client-side generation failed',
        'CLIENT_ERROR',
        false
      );
    }
  }
  
  /**
   * Test the story service configuration
   */
  async testService(): Promise<{ serverAPI: boolean; clientService: boolean }> {
    const results = {
      serverAPI: false,
      clientService: false
    };
    
    // Test server API
    if (this.config.useServerAPI) {
      try {
        const response = await fetch('/api/generate-story', {
          method: 'HEAD',
          signal: AbortSignal.timeout(5000)
        });
        results.serverAPI = response.ok;
      } catch (error) {
        console.warn('Server API test failed:', error);
      }
    }
    
    // Test client service
    try {
      const geminiService = getGeminiService();
      results.clientService = await geminiService.testConnection();
    } catch (error) {
      console.warn('Client service test failed:', error);
    }
    
    return results;
  }
}

// Singleton instance
let storyServiceInstance: StoryService | null = null;

export function getStoryService(config?: StoryServiceConfig): StoryService {
  if (!storyServiceInstance) {
    storyServiceInstance = new StoryService(config);
  }
  return storyServiceInstance;
}

// Reset singleton (useful for testing)
export function resetStoryService(): void {
  storyServiceInstance = null;
}

// Convenience function for generating stories
export async function generateStory(
  playerProfile: PlayerProfile,
  config?: StoryServiceConfig
): Promise<StoryResponse> {
  const service = getStoryService(config);
  return await service.generateStory(playerProfile);
}

// Fallback story generator for when all else fails
export function generateFallbackStory(profile: PlayerProfile): StoryResponse {
  const { name, race, specialty, favoriteEnvironment, personalityTrait, magicalAffinity } = profile;
  
  const magicElement = magicalAffinity !== 'None' 
    ? `The ${magicalAffinity.toLowerCase()} energies that flow through ${name} seem to resonate with this place.`
    : `Though ${name} has no magical abilities, there's something about this place that feels significant.`;
  
  return {
    characterIntroduction: `${name} stands at the threshold of adventure, a ${personalityTrait.toLowerCase()} ${race} ${specialty.toLowerCase()} whose journey is about to begin in ways they never imagined.`,
    
    worldDescription: `The ${favoriteEnvironment.toLowerCase()} stretches out before ${name}, alive with ancient mysteries and hidden wonders. Every shadow holds a secret, every breeze carries whispers of forgotten tales. ${magicElement}`,
    
    plotSetup: `As ${name} ventures deeper into this mystical realm, strange occurrences begin to unfold around them. The very fabric of reality seems to shift and bend, responding to their presence in ways that both intrigue and unsettle the experienced ${specialty.toLowerCase()}.`,
    
    narrative: `${name} moves with the confidence of someone who has mastered their craft as a ${specialty.toLowerCase()}, yet the ${favoriteEnvironment.toLowerCase()} presents challenges unlike any they've faced before. Their ${personalityTrait.toLowerCase()} nature serves them well as they navigate through increasingly strange phenomena. The air itself seems to thicken with possibility, and ${name} can't shake the feeling that they're being watched by unseen eyes. Every step forward reveals new wonders and new dangers, testing not just their skills but their very understanding of the world around them.`,
    
    suspensefulEnding: `Just as ${name} begins to feel they understand the patterns of this strange place, a sound echoes through the ${favoriteEnvironment.toLowerCase()} that shouldn't exist - a sound that makes their blood run cold and their heart race with anticipation. Something ancient has awakened, and it knows ${name} is here.`
  };
}