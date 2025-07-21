'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
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
import { FormProvider, ErrorBoundary } from '@/components/validation';
import { QuestionTransition, LoadingSpinner } from '@/components/visual-effects';
import { ResponsiveLayout, ResponsiveContainer, MobileNavigation } from '@/components/layout';
import { useMediaQuery } from '@/hooks';
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
  
  const [navigationDirection, setNavigationDirection] = useState<'forward' | 'backward'>('forward');
  
  const isMobile = useMediaQuery('(max-width: 768px)');

  const currentQuestion = getCurrentQuestion();
  const totalQuestions = getTotalQuestions();
  const isLastQuestion = currentQuestionIndex >= totalQuestions - 1;

  const processedQuestion = useMemo(() => {
    if (!currentQuestion) return null;

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

  const handleAnswerChange = (value: string) => {
    if (!processedQuestion) return;
    setAnswer(processedQuestion.id, value);
  };

  const handleNext = () => {
    if (canProceedToNext()) {
      setNavigationDirection('forward');
      nextQuestion();
    }
  };

  const handlePrevious = () => {
    if (canGoToPrevious()) {
      setNavigationDirection('backward');
      previousQuestion();
    }
  };

  const handleComplete = () => {
    buildProfileFromAnswers(answers);
    
    completeQuiz();
    
    if (onComplete) {
      onComplete();
    }
  };

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentQuestionIndex]);

  if (!processedQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner
          size="medium"
          variant="magical"
          text="Loading your quest..."
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <FormProvider>
        <ResponsiveLayout 
          variant="page" 
          enableMobileOptimizations={true}
          mobileBottomPadding={isMobile}
          className={className}
        >
          <ResponsiveContainer variant="default" enableMotion={true}>
            {!isMobile && (
              <ProgressBar
                progress={progress}
                currentQuestion={currentQuestionIndex}
                totalQuestions={totalQuestions}
                className="mb-8"
              />
            )}

            <div className="min-h-[500px] flex flex-col justify-center">
              <QuestionTransition
                questionKey={currentQuestionIndex}
                direction={navigationDirection}
                className="w-full"
              >
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

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="mb-8"
                >
                  {renderQuestion(processedQuestion)}
                </motion.div>
              </QuestionTransition>
            </div>

            {!isMobile && (
              <NavigationControls
                canGoBack={canGoToPrevious()}
                canGoForward={isCurrentQuestionAnswered()}
                onPrevious={handlePrevious}
                onNext={handleNext}
                isLastQuestion={isLastQuestion}
                onComplete={handleComplete}
                className="mt-8"
              />
            )}

            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-slate-800/30 rounded-lg border border-slate-600/30 text-xs text-slate-400">
                <div>Current Question: {currentQuestionIndex + 1}/{totalQuestions}</div>
                <div>Question ID: {processedQuestion.id}</div>
                <div>Answer: {answers[processedQuestion.id] || 'Not answered'}</div>
                <div>Can Proceed: {isCurrentQuestionAnswered() ? 'Yes' : 'No'}</div>
                <div>Progress: {progress}%</div>
                <div>Is Mobile: {isMobile ? 'Yes' : 'No'}</div>
              </div>
            )}
          </ResponsiveContainer>

          {isMobile && (
            <MobileNavigation
              canGoBack={canGoToPrevious()}
              canGoForward={isCurrentQuestionAnswered()}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onComplete={handleComplete}
              isLastQuestion={isLastQuestion}
              progress={progress}
            />
          )}
        </ResponsiveLayout>
      </FormProvider>
    </ErrorBoundary>
  );
}