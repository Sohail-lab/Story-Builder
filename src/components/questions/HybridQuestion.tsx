'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionComponentProps } from '@/types';
import { ErrorMessage, ValidationFeedback, useQuestionValidation } from '@/components/validation';
import { MobileOptimizedCard, MobileOptimizedInput } from '@/components/layout';
import { useMediaQuery } from '@/hooks';

export const HybridQuestion: React.FC<QuestionComponentProps> = ({
  question,
  value = '',
  onChange,
  error
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Check if we're on mobile for optimizations
  const isMobile = useMediaQuery('(max-width: 768px)');

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

  // Initialize state from value prop
  useEffect(() => {
    if (value) {
      const isPresetOption = question.options?.includes(value);
      if (isPresetOption) {
        setSelectedOption(value);
        setCustomText('');
        setShowCustomInput(false);
      } else {
        setSelectedOption('custom');
        setCustomText(value);
        setShowCustomInput(true);
      }
    }
  }, [value, question.options]);

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
    
    if (option === 'custom') {
      setShowCustomInput(true);
      // Don't change the main value yet, wait for custom input
      if (customText) {
        onChange(customText);
        validateQuestion(customText);
      }
    } else {
      setShowCustomInput(false);
      setCustomText('');
      onChange(option);
      // Validate immediately when preset option is selected
      validateQuestion(option);
    }
  };

  const handleCustomTextChange = (newValue: string) => {
    setCustomText(newValue);
    if (selectedOption === 'custom') {
      onChange(newValue);
      // Trigger validation with debounce for custom text
      if (newValue.trim()) {
        debouncedValidate(newValue);
      }
    }
  };

  const handleCustomInputFocus = () => {
    // Validate immediately on blur for custom text
    if (selectedOption === 'custom' && customText.trim()) {
      validateQuestion(customText);
    }
  };

  return (
    <MobileOptimizedCard
      variant="default"
      enableHover={true}
      enableTouchFeedback={true}
      className="fantasy-starfield fantasy-orbs w-full max-w-2xl mx-auto"
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

        {/* Preset Options */}
        <div className="space-y-3">
          {question.options?.map((option, index) => (
            <motion.label
              key={option}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`
                flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-300
                ${selectedOption === option 
                  ? 'border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20' 
                  : 'border-amber-700 bg-slate-800/50 hover:border-yellow-600 hover:bg-yellow-600/5'
                }
                hover:transform hover:scale-[1.01] active:scale-[0.99]
              `}
              htmlFor={`${question.id}-${option}`}
            >
              <input
                type="radio"
                id={`${question.id}-${option}`}
                name={question.id}
                value={option}
                checked={selectedOption === option}
                onChange={() => handleOptionChange(option)}
                className="fantasy-radio mr-3 flex-shrink-0"
              />
              <span className="fantasy-body font-medium flex-grow">
                {option}
              </span>
              {selectedOption === option && (
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

          {/* Custom Option */}
          {question.allowCustom && (
            <motion.label
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: (question.options?.length || 0) * 0.1 }}
              className={`
                flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-300
                ${selectedOption === 'custom' 
                  ? 'border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20' 
                  : 'border-amber-700 bg-slate-800/50 hover:border-yellow-600 hover:bg-yellow-600/5'
                }
                hover:transform hover:scale-[1.01] active:scale-[0.99]
              `}
              htmlFor={`${question.id}-custom`}
            >
              <input
                type="radio"
                id={`${question.id}-custom`}
                name={question.id}
                value="custom"
                checked={selectedOption === 'custom'}
                onChange={() => handleOptionChange('custom')}
                className="fantasy-radio mr-3 flex-shrink-0"
              />
              <span className="fantasy-body font-medium flex-grow">
                Other (please specify)
              </span>
              {selectedOption === 'custom' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-2 text-yellow-400"
                >
                  ✨
                </motion.div>
              )}
            </motion.label>
          )}
        </div>

        {/* Custom Text Input */}
        <AnimatePresence>
          {showCustomInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4">
                <MobileOptimizedInput
                  value={customText}
                  onChange={handleCustomTextChange}
                  placeholder="Enter your custom answer..."
                  maxLength={30}
                  error={displayError && selectedOption === 'custom' ? displayError : undefined}
                  success={isValid && selectedOption === 'custom' && customText.trim().length > 0}
                  onBlur={handleCustomInputFocus}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Validation Feedback */}
        <div className="space-y-2">
          <ErrorMessage error={displayError} />
          <ValidationFeedback 
            isValid={isValid && ((selectedOption !== 'custom' && selectedOption !== '') || (selectedOption === 'custom' && customText.trim().length > 0))}
            isValidating={isValidating && selectedOption === 'custom'}
            successMessage={selectedOption === 'custom' 
              ? "Your unique choice adds magic to the realm! ✨" 
              : "A wise selection, adventurer! ✨"
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
            Choose from the options above, or select &quot;Other&quot; to create your own unique answer
          </motion.p>
        </div>

        {/* Magical Divider */}
        <div className="fantasy-divider"></div>
      </div>
    </MobileOptimizedCard>
  );
};