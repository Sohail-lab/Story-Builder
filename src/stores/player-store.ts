import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type PlayerProfile, PlayerProfileSchema } from '@/types';

interface PlayerStore {
  // State
  profile: Partial<PlayerProfile>;
  isProfileComplete: boolean;
  
  // Actions
  updateProfile: (updates: Partial<PlayerProfile>) => void;
  setProfileField: <K extends keyof PlayerProfile>(field: K, value: PlayerProfile[K]) => void;
  resetProfile: () => void;
  validateProfile: () => { isValid: boolean; errors: string[] };
  
  // Computed getters
  getCompletionPercentage: () => number;
  getRequiredFields: () => (keyof PlayerProfile)[];
  getMissingRequiredFields: () => (keyof PlayerProfile)[];
  
  // Profile building helpers
  buildProfileFromAnswers: (answers: Record<string, string>) => void;
  getProfileForStoryGeneration: () => PlayerProfile | null;
}

const initialProfile: Partial<PlayerProfile> = {
  additionalChoices: {},
  customAnswers: {}
};

const requiredFields: (keyof PlayerProfile)[] = [
  'name',
  'gender',
  'race',
  'specialty',
  'lifestyle',
  'personalityTrait',
  'favoriteEnvironment',
  'magicalAffinity',
  'socialPreference',
  'moralAlignment',
  'primaryMotivation',
  'romanceInterest'
];

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      // Initial state
      profile: initialProfile,
      isProfileComplete: false,
      
      // Actions
      updateProfile: (updates: Partial<PlayerProfile>) => {
        set((state) => {
          const newProfile = { ...state.profile, ...updates };
          const missingFields = get().getMissingRequiredFields();
          const isComplete = missingFields.length === 0;
          
          return {
            profile: newProfile,
            isProfileComplete: isComplete
          };
        });
      },
      
      setProfileField: <K extends keyof PlayerProfile>(field: K, value: PlayerProfile[K]) => {
        set((state) => {
          const newProfile = { ...state.profile, [field]: value };
          const missingFields = get().getMissingRequiredFields();
          const isComplete = missingFields.length === 0;
          
          return {
            profile: newProfile,
            isProfileComplete: isComplete
          };
        });
      },
      
      resetProfile: () => {
        set({
          profile: initialProfile,
          isProfileComplete: false
        });
      },
      
      validateProfile: () => {
        const state = get();
        try {
          PlayerProfileSchema.parse(state.profile);
          return { isValid: true, errors: [] };
        } catch (error) {
          if (error instanceof Error) {
            const zodError = JSON.parse(error.message);
            const errors = zodError.map((err: { path: string[]; message: string }) => `${err.path.join('.')}: ${err.message}`);
            return { isValid: false, errors };
          }
          return { isValid: false, errors: ['Unknown validation error'] };
        }
      },
      
      // Computed getters
      getCompletionPercentage: () => {
        const state = get();
        const totalRequired = requiredFields.length;
        const completed = requiredFields.filter(field => {
          const value = state.profile[field];
          return value !== undefined && value !== null && value !== '';
        }).length;
        
        return Math.round((completed / totalRequired) * 100);
      },
      
      getRequiredFields: () => requiredFields,
      
      getMissingRequiredFields: () => {
        const state = get();
        return requiredFields.filter(field => {
          const value = state.profile[field];
          return value === undefined || value === null || value === '';
        });
      },
      
      // Profile building helpers
      buildProfileFromAnswers: (answers: Record<string, string>) => {
        const profile: Partial<PlayerProfile> = {
          additionalChoices: {},
          customAnswers: {}
        };
        
        // Map quiz answers to profile fields
        Object.entries(answers).forEach(([questionId, answer]) => {
          switch (questionId) {
            case 'name':
              profile.name = answer;
              break;
            case 'gender':
              profile.gender = answer as 'Male' | 'Female';
              break;
            case 'race':
              profile.race = answer;
              break;
            case 'specialty':
              profile.specialty = answer;
              break;
            case 'lifestyle':
              profile.lifestyle = answer;
              break;
            case 'personalityTrait':
              profile.personalityTrait = answer;
              break;
            case 'favoriteEnvironment':
              profile.favoriteEnvironment = answer;
              break;
            case 'magicalAffinity':
              profile.magicalAffinity = answer;
              break;
            case 'socialPreference':
              profile.socialPreference = answer as PlayerProfile['socialPreference'];
              break;
            case 'moralAlignment':
              profile.moralAlignment = answer as PlayerProfile['moralAlignment'];
              break;
            case 'primaryMotivation':
              profile.primaryMotivation = answer;
              break;
            case 'romanceInterest':
              profile.romanceInterest = answer === 'Yes';
              break;
            case 'romanticPartner':
              if (answer) {
                profile.romanticPartner = answer;
              }
              break;
            default:
              // Store additional answers
              if (profile.additionalChoices) {
                profile.additionalChoices[questionId] = answer;
              }
              break;
          }
        });
        
        get().updateProfile(profile);
      },
      
      getProfileForStoryGeneration: () => {
        const state = get();
        const validation = state.validateProfile();
        
        if (!validation.isValid) {
          return null;
        }
        
        return state.profile as PlayerProfile;
      }
    }),
    {
      name: 'player-store',
      partialize: (state) => ({
        profile: state.profile,
        isProfileComplete: state.isProfileComplete
      })
    }
  )
);