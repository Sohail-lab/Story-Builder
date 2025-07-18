import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type StoryResponse, type PlayerProfile } from '@/types';

interface StoryStore {
  // State
  generatedStory: StoryResponse | null;
  isGenerating: boolean;
  generationError: string | null;
  lastGenerationRequest: PlayerProfile | null;
  generationTimestamp: number | null;
  
  // Actions
  setGeneratedStory: (story: StoryResponse | null) => void;
  setGenerating: (generating: boolean) => void;
  setGenerationError: (error: string | null) => void;
  setLastGenerationRequest: (profile: PlayerProfile | null) => void;
  
  // Story generation workflow
  startStoryGeneration: (profile: PlayerProfile) => void;
  completeStoryGeneration: (story: StoryResponse) => void;
  failStoryGeneration: (error: string) => void;
  resetStoryState: () => void;
  
  // Utility methods
  hasStory: () => boolean;
  isStoryFresh: (maxAgeMinutes?: number) => boolean;
  canRegenerateStory: () => boolean;
  
  // Story content helpers
  getFormattedStory: () => string | null;
  getStoryMetadata: () => {
    hasStory: boolean;
    generatedAt: Date | null;
    characterName: string | null;
    wordCount: number;
  };
}

export const useStoryStore = create<StoryStore>()(
  persist(
    (set, get) => ({
      // Initial state
      generatedStory: null,
      isGenerating: false,
      generationError: null,
      lastGenerationRequest: null,
      generationTimestamp: null,
      
      // Basic actions
      setGeneratedStory: (story: StoryResponse | null) => {
        set({ generatedStory: story });
      },
      
      setGenerating: (generating: boolean) => {
        set({ isGenerating: generating });
      },
      
      setGenerationError: (error: string | null) => {
        set({ generationError: error });
      },
      
      setLastGenerationRequest: (profile: PlayerProfile | null) => {
        set({ lastGenerationRequest: profile });
      },
      
      // Story generation workflow
      startStoryGeneration: (profile: PlayerProfile) => {
        set({
          isGenerating: true,
          generationError: null,
          lastGenerationRequest: profile,
          generationTimestamp: Date.now()
        });
      },
      
      completeStoryGeneration: (story: StoryResponse) => {
        set({
          generatedStory: story,
          isGenerating: false,
          generationError: null,
          generationTimestamp: Date.now()
        });
      },
      
      failStoryGeneration: (error: string) => {
        set({
          isGenerating: false,
          generationError: error,
          generatedStory: null
        });
      },
      
      resetStoryState: () => {
        set({
          generatedStory: null,
          isGenerating: false,
          generationError: null,
          lastGenerationRequest: null,
          generationTimestamp: null
        });
      },
      
      // Utility methods
      hasStory: () => {
        const state = get();
        return state.generatedStory !== null;
      },
      
      isStoryFresh: (maxAgeMinutes: number = 30) => {
        const state = get();
        if (!state.generationTimestamp) return false;
        
        const ageInMinutes = (Date.now() - state.generationTimestamp) / (1000 * 60);
        return ageInMinutes <= maxAgeMinutes;
      },
      
      canRegenerateStory: () => {
        const state = get();
        return !state.isGenerating && state.lastGenerationRequest !== null;
      },
      
      // Story content helpers
      getFormattedStory: () => {
        const state = get();
        if (!state.generatedStory) return null;
        
        const { narrative, worldDescription, characterIntroduction, plotSetup, suspensefulEnding } = state.generatedStory;
        
        return [
          characterIntroduction,
          worldDescription,
          plotSetup,
          narrative,
          suspensefulEnding
        ].filter(Boolean).join('\n\n');
      },
      
      getStoryMetadata: () => {
        const state = get();
        const story = state.generatedStory;
        const timestamp = state.generationTimestamp;
        
        return {
          hasStory: !!story,
          generatedAt: timestamp ? new Date(timestamp) : null,
          characterName: state.lastGenerationRequest?.name || null,
          wordCount: story ? state.getFormattedStory()?.split(' ').length || 0 : 0
        };
      }
    }),
    {
      name: 'story-store',
      partialize: (state) => ({
        generatedStory: state.generatedStory,
        lastGenerationRequest: state.lastGenerationRequest,
        generationTimestamp: state.generationTimestamp
      })
    }
  )
);