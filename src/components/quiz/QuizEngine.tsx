'use client';

import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '@/stores/quiz-store';
import { usePlayerStore } from '@/stores/player-store';
import { ProgressBar } from './ProgressBar';
import { NavigationControls } from './NavigationControls';
import { 
  MultipleChoiceQuestion, 
  TextInputQuestion, 
  HybridQuestion, 
  GenderQuestion 
} from '@/components/questions';
import { type Question } from '@/types';

interface QuizEngineProps {
  onComplete?: () => void;
  className?: string;
}

export function QuizEngine({ onComplete, className = '' }: QuizEngineProps) {
  const {
    currentQuestionIndex,
    answers,
    progress,
    getCurrentQuestion,
    getTotalQuestions,
    setAnswer,
    nextQuestion,
    previousQuestion,
    canProceedToNext,
    canGoToPrevious,
    isCurrentQuestionAnswered,
    completeQuiz
  } = useQuizStore();

  const { buildProfileFromAnswers } = usePlayerStore();

  // Get current question and visible questions
  const currentQuestion = getCurrentQuestion();
  const totalQuestions = getTotalQuestions();
  const isLastQuestion = currentQuestionIndex >= totalQuestions - 1;

  // Handle conditional logic for romance partner options
  const processedQuestion = useMemo(() => {
    if (!currentQuestion) return null;

    // Handle romance partner question - populate options based on gender
    if (currentQuestion.id === 'romanticPartner') {
      const gender = answers.gender;
      const partnerOptions = gender === 'Male' 
        ? ['Elven Maiden', 'Human Noble', 'Dwarven Warrior', 'Mystical Sorceress', 'Halfling Bard']
        : ['Elven Lord', 'Human Knight', 'Dwarven Craftsman', 'Mystical Wizard', 'Halfling Rogue'];
      
      return {
        ...currentQuestion,
        options: partnerOptions
      };
    }

    return currentQuestion;
  }, [currentQuestion, answers.gender]);

  // Handle answer changes
  const handleAnswerChange = (value: string) => {
    if (!processedQuestion) return;
    setAnswer(processedQuestion.id, value);
  };

  // Handle navigation
  const handleNext = () => {
    if (canProceedToNext()) {
      nextQuestion();
    }
  };

  const handlePrevious = () => {
    if (canGoToPrevious()) {
      previousQuestion();
    }
  };

  // Handle quiz completion
  const handleComplete = () => {
    // Build player profile from answers
    buildProfileFromAnswers(answers);
    
    // Mark quiz as complete
    completeQuiz();
    
    // Call completion callback
    if (onComplete) {
      onComplete();
    }
  };

  // Render the appropriate question component
  const renderQuestion = (question: Question) => {
    const commonProps = {
      question,
      value: answers[question.id] || '',
      onChange: handleAnswerChange
    };

    switch (question.type) {
      case 'gender-only':
        return <GenderQuestion {...commonProps} />;
      case 'text-input':
        return <TextInputQuestion {...commonProps} />;
      case 'multiple-choice':
        return <MultipleChoiceQuestion {...commonProps} />;
      case 'hybrid':
        return <HybridQuestion {...commonProps} />;
      default:
        return <MultipleChoiceQuestion {...commonProps} />;
    }
  };

  // Auto-scroll to top when question changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentQuestionIndex]);

  if (!processedQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-amber-200 text-lg mb-2">Loading your quest...</div>
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-4xl mx-auto px-4 ${className}`}>
      {/* Progress Bar */}
      <ProgressBar
        progress={progress}
        currentQuestion={currentQuestionIndex}
        totalQuestions={totalQuestions}
        className="mb-8"
      />

      {/* Question Container */}
      <div className="min-h-[500px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ 
              duration: 0.4, 
              ease: "easeInOut",
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            className="w-full"
          >
            {/* Question Header */}
            <div className="text-center mb-8">
              <motion.h2 
                className="text-2xl md:text-3xl font-bold text-amber-100 mb-4 leading-relaxed"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {processedQuestion.text}
              </motion.h2>
              
              {processedQuestion.required && (
                <motion.p 
                  className="text-amber-300/70 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  * This question is required
                </motion.p>
              )}
            </div>

            {/* Question Component */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8"
            >
              {renderQuestion(processedQuestion)}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <NavigationControls
        canGoBack={canGoToPrevious()}
        canGoForward={isCurrentQuestionAnswered()}
        onPrevious={handlePrevious}
        onNext={handleNext}
        isLastQuestion={isLastQuestion}
        onComplete={handleComplete}
        className="mt-8"
      />

      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-slate-800/30 rounded-lg border border-slate-600/30 text-xs text-slate-400">
          <div>Current Question: {currentQuestionIndex + 1}/{totalQuestions}</div>
          <div>Question ID: {processedQuestion.id}</div>
          <div>Answer: {answers[processedQuestion.id] || 'Not answered'}</div>
          <div>Can Proceed: {isCurrentQuestionAnswered() ? 'Yes' : 'No'}</div>
          <div>Progress: {progress}%</div>
        </div>
      )}
    </div>
  );
}