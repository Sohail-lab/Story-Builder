'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MultipleChoiceQuestion, 
  TextInputQuestion, 
  HybridQuestion, 
  GenderQuestion 
} from './';
import { Question } from '@/types';

// Sample questions for testing
const sampleQuestions: Question[] = [
  {
    id: 'gender',
    text: 'Choose your gender:',
    type: 'gender-only',
    options: ['Male', 'Female'],
    required: true
  },
  {
    id: 'name',
    text: 'What is your name, outlander?',
    type: 'text-input',
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
    id: 'socialPreference',
    text: 'How do you prefer to interact with others?',
    type: 'multiple-choice',
    options: ['Solitary', 'Small Groups', 'Large Communities', 'Leadership Role'],
    required: true
  }
];

export const QuestionDemo: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentQuestion = sampleQuestions[currentQuestionIndex];

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    // Clear error when user provides an answer
    if (errors[questionId]) {
      setErrors(prev => ({ ...prev, [questionId]: '' }));
    }
  };

  const handleNext = () => {
    // Validate current question
    if (!currentQuestion) return;
    
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      setErrors(prev => ({ 
        ...prev, 
        [currentQuestion.id]: 'This question is required' 
      }));
      return;
    }

    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setErrors({});
  };

  const renderQuestion = () => {
    if (!currentQuestion) {
      return <div>No question available</div>;
    }

    const props = {
      question: currentQuestion,
      value: answers[currentQuestion.id] || '',
      onChange: (value: string) => handleAnswerChange(currentQuestion.id, value),
      error: errors[currentQuestion.id]
    };

    switch (currentQuestion.type) {
      case 'gender-only':
        return <GenderQuestion {...props} />;
      case 'text-input':
        return <TextInputQuestion {...props} />;
      case 'hybrid':
        return <HybridQuestion {...props} />;
      case 'multiple-choice':
        return <MultipleChoiceQuestion {...props} />;
      default:
        return <div>Unknown question type</div>;
    }
  };

  const progress = ((currentQuestionIndex + 1) / sampleQuestions.length) * 100;

  return (
    <div className="min-h-screen fantasy-starfield fantasy-orbs p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="fantasy-display text-4xl md:text-5xl mb-4">
            Question Components Demo
          </h1>
          <p className="fantasy-secondary text-lg">
            Testing all four question component types
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="fantasy-secondary text-sm">
              Question {currentQuestionIndex + 1} of {sampleQuestions.length}
            </span>
            <span className="fantasy-secondary text-sm">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="fantasy-progress">
            <motion.div
              className="fantasy-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Current Question */}
        <motion.div
          key={currentQuestion?.id || currentQuestionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          {renderQuestion()}
        </motion.div>

        {/* Navigation Controls */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`
              fantasy-button px-6 py-3
              ${currentQuestionIndex === 0 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:transform hover:scale-105'
              }
            `}
          >
            ← Previous
          </button>

          <button
            onClick={handleReset}
            className="fantasy-button px-6 py-3 hover:transform hover:scale-105"
          >
            🔄 Reset Demo
          </button>

          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === sampleQuestions.length - 1}
            className={`
              fantasy-button-primary px-6 py-3
              ${currentQuestionIndex === sampleQuestions.length - 1
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:transform hover:scale-105'
              }
            `}
          >
            Next →
          </button>
        </div>

        {/* Current Answers Display */}
        <div className="fantasy-card max-w-2xl mx-auto">
          <h3 className="fantasy-heading text-xl mb-4 text-center">
            Current Answers
          </h3>
          <div className="space-y-2">
            {sampleQuestions.map((q, index) => (
              <div 
                key={q.id}
                className={`
                  flex justify-between items-center p-2 rounded
                  ${index === currentQuestionIndex ? 'bg-yellow-400/10' : ''}
                `}
              >
                <span className="fantasy-secondary text-sm">
                  {q.text}
                </span>
                <span className="fantasy-body text-sm font-medium">
                  {answers[q.id] || '(not answered)'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Component Type Info */}
        <div className="fantasy-card max-w-2xl mx-auto">
          <h3 className="fantasy-heading text-xl mb-4 text-center">
            Current Component: {currentQuestion?.type || 'Unknown'}
          </h3>
          <div className="fantasy-secondary text-sm space-y-2">
            <p><strong>Gender Question:</strong> Restricted to Male/Female with special styling</p>
            <p><strong>Text Input:</strong> Free text input with character limits and validation</p>
            <p><strong>Hybrid Question:</strong> Multiple choice + optional custom text input</p>
            <p><strong>Multiple Choice:</strong> Standard radio button selection</p>
          </div>
        </div>
      </div>
    </div>
  );
};