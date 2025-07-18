import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { questionConfig, type Question } from '@/types';

interface QuizStore {
  // State
  currentQuestionIndex: number;
  answers: Record<string, string>;
  isComplete: boolean;
  progress: number;
  
  // Computed getters
  getCurrentQuestion: () => Question | null;
  getVisibleQuestions: () => Question[];
  getTotalQuestions: () => number;
  
  // Actions
  setAnswer: (questionId: string, answer: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  resetQuiz: () => void;
  completeQuiz: () => void;
  
  // Validation
  isCurrentQuestionAnswered: () => boolean;
  canProceedToNext: () => boolean;
  canGoToPrevious: () => boolean;
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentQuestionIndex: 0,
      answers: {},
      isComplete: false,
      progress: 0,
      
      // Computed getters
      getCurrentQuestion: () => {
        const state = get();
        const visibleQuestions = state.getVisibleQuestions();
        return visibleQuestions[state.currentQuestionIndex] || null;
      },
      
      getVisibleQuestions: () => {
        const state = get();
        return questionConfig.filter(question => {
          // Check if question should be visible based on conditional logic
          if (!question.conditional) return true;
          
          const dependentAnswer = state.answers[question.conditional.dependsOn];
          return dependentAnswer === question.conditional.value;
        });
      },
      
      getTotalQuestions: () => {
        const state = get();
        return state.getVisibleQuestions().length;
      },
      
      // Actions
      setAnswer: (questionId: string, answer: string) => {
        set((state) => {
          const newAnswers = { ...state.answers, [questionId]: answer };
          const visibleQuestions = state.getVisibleQuestions();
          const totalQuestions = visibleQuestions.length;
          const answeredQuestions = Object.keys(newAnswers).filter(id => 
            visibleQuestions.some(q => q.id === id)
          ).length;
          
          return {
            answers: newAnswers,
            progress: Math.round((answeredQuestions / totalQuestions) * 100)
          };
        });
      },
      
      nextQuestion: () => {
        set((state) => {
          const visibleQuestions = state.getVisibleQuestions();
          const nextIndex = Math.min(state.currentQuestionIndex + 1, visibleQuestions.length - 1);
          return { currentQuestionIndex: nextIndex };
        });
      },
      
      previousQuestion: () => {
        set((state) => ({
          currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0)
        }));
      },
      
      goToQuestion: (index: number) => {
        set((state) => {
          const visibleQuestions = state.getVisibleQuestions();
          const clampedIndex = Math.max(0, Math.min(index, visibleQuestions.length - 1));
          return { currentQuestionIndex: clampedIndex };
        });
      },
      
      resetQuiz: () => {
        set({
          currentQuestionIndex: 0,
          answers: {},
          isComplete: false,
          progress: 0
        });
      },
      
      completeQuiz: () => {
        set({ isComplete: true, progress: 100 });
      },
      
      // Validation methods
      isCurrentQuestionAnswered: () => {
        const state = get();
        const currentQuestion = state.getCurrentQuestion();
        if (!currentQuestion) return false;
        
        const answer = state.answers[currentQuestion.id];
        return currentQuestion.required ? !!answer : true;
      },
      
      canProceedToNext: () => {
        const state = get();
        const visibleQuestions = state.getVisibleQuestions();
        return state.currentQuestionIndex < visibleQuestions.length - 1 && 
               state.isCurrentQuestionAnswered();
      },
      
      canGoToPrevious: () => {
        const state = get();
        return state.currentQuestionIndex > 0;
      }
    }),
    {
      name: 'quiz-store',
      partialize: (state) => ({
        currentQuestionIndex: state.currentQuestionIndex,
        answers: state.answers,
        isComplete: state.isComplete,
        progress: state.progress
      })
    }
  )
);