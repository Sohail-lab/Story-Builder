'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QuestionComponentProps } from '@/types';
import { ErrorMessage, ValidationFeedback, useQuestionValidation } from '@/components/validation';

export const TextInputQuestion: React.FC<QuestionComponentProps> = ({
  question,
  value = '',
  onChange,
  error
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  
  // Use validation hook
  const {
    validateQuestion,
    debouncedValidate,
    isValidating,
    isValid,
    error: validationError
  } = useQuestionValidation(question.id);

  // Use validation error if available, otherwise use prop error
  const displayError = validationError || error;

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    
    // Trigger validation with debounce
    if (newValue.trim()) {
      debouncedValidate(newValue);
    }
  };

  const handleFocus = () => setIsFocused(true);
  
  const handleBlur = () => {
    setIsFocused(false);
    // Validate immediately on blur
    if (inputValue.trim()) {
      validateQuestion(inputValue);
    }
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

        {/* Input Field */}
        <div className="relative">
          <motion.div
            animate={{
              scale: isFocused ? 1.02 : 1,
              boxShadow: isFocused 
                ? '0 0 20px rgba(255, 215, 0, 0.3)' 
                : '0 0 0px rgba(255, 215, 0, 0)'
            }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <input
              type="text"
              id={question.id}
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Enter your answer..."
              className={`
                fantasy-input w-full text-lg py-4 px-6 text-center
                ${displayError 
                  ? 'border-red-500 focus:border-red-400' 
                  : isValid 
                    ? 'border-green-500 focus:border-green-400'
                    : 'border-amber-700 focus:border-yellow-400'
                }
                placeholder:text-slate-400 placeholder:italic
                transition-all duration-300
              `}
              maxLength={question.id === 'name' ? 50 : 30}
            />
            
            {/* Magical Border Effect */}
            {isFocused && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 rounded-lg border-2 border-yellow-400 pointer-events-none"
                style={{
                  background: 'linear-gradient(45deg, transparent, rgba(255, 215, 0, 0.1), transparent)',
                  animation: 'shimmer 2s ease-in-out infinite'
                }}
              />
            )}
          </motion.div>

          {/* Character Count */}
          <div className="flex justify-between items-center mt-2 text-sm fantasy-secondary">
            <span>
              {inputValue.length}/{question.id === 'name' ? 50 : 30} characters
            </span>
            {inputValue && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-yellow-400"
              >
                ✨ Looking good!
              </motion.span>
            )}
          </div>
        </div>

        {/* Validation Feedback */}
        <div className="space-y-2">
          <ErrorMessage error={displayError} />
          <ValidationFeedback 
            isValid={isValid && inputValue.trim().length > 0}
            isValidating={isValidating}
            successMessage={question.id === 'name' 
              ? "A worthy name for a legendary hero! ✨" 
              : "Your answer resonates with magical energy! ✨"
            }
          />
        </div>

        {/* Helpful Hints */}
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="fantasy-secondary text-sm italic"
          >
            {question.id === 'name' 
              ? "Choose a name that feels right for your fantasy adventure"
              : "Share your thoughts - be creative and descriptive"
            }
          </motion.p>
        </div>

        {/* Magical Divider */}
        <div className="fantasy-divider"></div>
      </div>
    </motion.div>
  );
};