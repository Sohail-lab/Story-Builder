'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { QuestionComponentProps } from '@/types';
import { ErrorMessage, ValidationFeedback, useQuestionValidation } from '@/components/validation';

export const MultipleChoiceQuestion: React.FC<QuestionComponentProps> = ({
  question,
  value,
  onChange,
  error
}) => {
  // Use validation hook
  const {
    validateQuestion,
    isValid,
    error: validationError
  } = useQuestionValidation(question.id);

  // Use validation error if available, otherwise use prop error
  const displayError = validationError || error;

  const handleOptionChange = (selectedValue: string) => {
    onChange(selectedValue);
    
    // Validate immediately when option is selected
    validateQuestion(selectedValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fantasy-card fantasy-starfield fantasy-orbs w-full max-w-2xl mx-auto"
    >
      <div className="space-y-6">
        {/* Question Text */}
        <div className="text-center">
          <h2 className="fantasy-heading text-2xl md:text-3xl mb-2">
            {question.text}
          </h2>
          {question.required && (
            <p className="fantasy-secondary text-sm">
              * This question is required
            </p>
          )}
        </div>

        {/* Options */}
        <div className="space-y-4">
          {question.options?.map((option, index) => (
            <motion.label
              key={option}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`
                flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-300
                ${value === option 
                  ? 'border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20' 
                  : 'border-amber-700 bg-slate-800/50 hover:border-yellow-600 hover:bg-yellow-600/5'
                }
                hover:transform hover:scale-[1.02] active:scale-[0.98]
              `}
              htmlFor={`${question.id}-${option}`}
            >
              <input
                type="radio"
                id={`${question.id}-${option}`}
                name={question.id}
                value={option}
                checked={value === option}
                onChange={() => handleOptionChange(option)}
                className="fantasy-radio mr-4 flex-shrink-0"
              />
              <span className="fantasy-body text-lg font-medium flex-grow">
                {option}
              </span>
              {value === option && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-2 text-yellow-400"
                >
                  ✨
                </motion.div>
              )}
            </motion.label>
          ))}
        </div>

        {/* Validation Feedback */}
        <div className="space-y-2">
          <ErrorMessage error={displayError} />
          <ValidationFeedback 
            isValid={isValid && value !== undefined && value !== ''}
            successMessage="Excellent choice, adventurer! ✨"
          />
        </div>

        {/* Magical Divider */}
        <div className="fantasy-divider"></div>
      </div>
    </motion.div>
  );
};