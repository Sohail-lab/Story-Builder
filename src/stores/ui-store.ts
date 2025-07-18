import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PageType = 'landing' | 'quiz' | 'story';

interface UIStore {
  // State
  isLoading: boolean;
  error: string | null;
  currentPage: PageType;
  isTransitioning: boolean;
  
  // Loading states for specific operations
  loadingStates: {
    storyGeneration: boolean;
    profileValidation: boolean;
    dataSync: boolean;
  };
  
  // Error states for specific operations
  errorStates: {
    storyGeneration: string | null;
    profileValidation: string | null;
    dataSync: string | null;
    network: string | null;
  };
  
  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentPage: (page: PageType) => void;
  setTransitioning: (transitioning: boolean) => void;
  
  // Specific loading actions
  setStoryGenerationLoading: (loading: boolean) => void;
  setProfileValidationLoading: (loading: boolean) => void;
  setDataSyncLoading: (loading: boolean) => void;
  
  // Specific error actions
  setStoryGenerationError: (error: string | null) => void;
  setProfileValidationError: (error: string | null) => void;
  setDataSyncError: (error: string | null) => void;
  setNetworkError: (error: string | null) => void;
  
  // Utility actions
  clearAllErrors: () => void;
  clearAllLoading: () => void;
  resetUIState: () => void;
  
  // Navigation helpers
  navigateToPage: (page: PageType) => Promise<void>;
  
  // Computed getters
  hasAnyError: () => boolean;
  hasAnyLoading: () => boolean;
  getActiveErrors: () => string[];
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isLoading: false,
      error: null,
      currentPage: 'landing',
      isTransitioning: false,
      
      loadingStates: {
        storyGeneration: false,
        profileValidation: false,
        dataSync: false
      },
      
      errorStates: {
        storyGeneration: null,
        profileValidation: null,
        dataSync: null,
        network: null
      },
      
      // Basic actions
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
      
      setError: (error: string | null) => {
        set({ error });
      },
      
      setCurrentPage: (page: PageType) => {
        set({ currentPage: page });
      },
      
      setTransitioning: (transitioning: boolean) => {
        set({ isTransitioning: transitioning });
      },
      
      // Specific loading actions
      setStoryGenerationLoading: (loading: boolean) => {
        set((state) => ({
          loadingStates: { ...state.loadingStates, storyGeneration: loading },
          isLoading: loading || Object.values({ ...state.loadingStates, storyGeneration: loading }).some(Boolean)
        }));
      },
      
      setProfileValidationLoading: (loading: boolean) => {
        set((state) => ({
          loadingStates: { ...state.loadingStates, profileValidation: loading },
          isLoading: loading || Object.values({ ...state.loadingStates, profileValidation: loading }).some(Boolean)
        }));
      },
      
      setDataSyncLoading: (loading: boolean) => {
        set((state) => ({
          loadingStates: { ...state.loadingStates, dataSync: loading },
          isLoading: loading || Object.values({ ...state.loadingStates, dataSync: loading }).some(Boolean)
        }));
      },
      
      // Specific error actions
      setStoryGenerationError: (error: string | null) => {
        set((state) => ({
          errorStates: { ...state.errorStates, storyGeneration: error }
        }));
      },
      
      setProfileValidationError: (error: string | null) => {
        set((state) => ({
          errorStates: { ...state.errorStates, profileValidation: error }
        }));
      },
      
      setDataSyncError: (error: string | null) => {
        set((state) => ({
          errorStates: { ...state.errorStates, dataSync: error }
        }));
      },
      
      setNetworkError: (error: string | null) => {
        set((state) => ({
          errorStates: { ...state.errorStates, network: error }
        }));
      },
      
      // Utility actions
      clearAllErrors: () => {
        set({
          error: null,
          errorStates: {
            storyGeneration: null,
            profileValidation: null,
            dataSync: null,
            network: null
          }
        });
      },
      
      clearAllLoading: () => {
        set({
          isLoading: false,
          loadingStates: {
            storyGeneration: false,
            profileValidation: false,
            dataSync: false
          }
        });
      },
      
      resetUIState: () => {
        set({
          isLoading: false,
          error: null,
          currentPage: 'landing',
          isTransitioning: false,
          loadingStates: {
            storyGeneration: false,
            profileValidation: false,
            dataSync: false
          },
          errorStates: {
            storyGeneration: null,
            profileValidation: null,
            dataSync: null,
            network: null
          }
        });
      },
      
      // Navigation helpers
      navigateToPage: async (page: PageType) => {
        const state = get();
        if (state.currentPage === page) return;
        
        state.setTransitioning(true);
        
        // Simulate page transition delay for smooth animations
        await new Promise(resolve => setTimeout(resolve, 300));
        
        state.setCurrentPage(page);
        state.setTransitioning(false);
      },
      
      // Computed getters
      hasAnyError: () => {
        const state = get();
        return !!(state.error || Object.values(state.errorStates).some(error => error !== null));
      },
      
      hasAnyLoading: () => {
        const state = get();
        return state.isLoading || Object.values(state.loadingStates).some(Boolean);
      },
      
      getActiveErrors: () => {
        const state = get();
        const errors: string[] = [];
        
        if (state.error) errors.push(state.error);
        
        Object.values(state.errorStates).forEach(error => {
          if (error) errors.push(error);
        });
        
        return errors;
      }
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        currentPage: state.currentPage
      })
    }
  )
);