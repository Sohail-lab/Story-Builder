'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { QuestionComponentProps } from '@/types';
import { ErrorMessage, ValidationFeedback, useQuestionValidation } from '@/components/validation';

export const GenderQuestion: React.FC<QuestionComponentProps> = ({
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

  // Ensure only Male/Female options are available
  const genderOptions = ['Male', 'Female'];

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
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="fantasy-secondary text-sm mt-2 italic"
          >
            This choice will influence your story and available romance options
          </motion.p>
        </div>

        {/* Gender Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {genderOptions.map((option, index) => (
            <motion.label
              key={option}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.2 }}
              className={`
                relative flex flex-col items-center p-6 rounded-xl border-3 cursor-pointer 
                transition-all duration-300 group
                ${value === option 
                  ? 'border-yellow-400 bg-yellow-400/15 shadow-xl shadow-yellow-400/30 transform scale-105' 
                  : 'border-amber-700 bg-slate-800/50 hover:border-yellow-600 hover:bg-yellow-600/10'
                }
                hover:transform hover:scale-[1.03] active:scale-[0.98]
              `}
              htmlFor={`${question.id}-${option}`}
            >
              {/* Gender Icon */}
              <div className={`
                text-6xl mb-4 transition-all duration-300
                ${value === option ? 'text-yellow-400' : 'text-amber-600 group-hover:text-yellow-500'}
              `}>
                {option === 'Male' ? '⚔️' : '🌟'}
              </div>

              {/* Radio Button */}
              <input
                type="radio"
                id={`${question.id}-${option}`}
                name={question.id}
                value={option}
                checked={value === option}
                onChange={() => handleOptionChange(option)}
                className="fantasy-radio mb-3"
              />

              {/* Option Label */}
              <span className={`
                fantasy-body text-xl font-bold text-center transition-all duration-300
                ${value === option ? 'text-yellow-400' : 'text-slate-200 group-hover:text-yellow-300'}
              `}>
                {option}
              </span>

              {/* Selection Indicator */}
              {value === option && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="absolute -top-2 -right-2 bg-yellow-400 text-slate-900 rounded-full p-2 shadow-lg"
                >
                  <span className="text-lg font-bold">✓</span>
                </motion.div>
              )}

              {/* Magical Glow Effect */}
              {value === option && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 rounded-xl border-2 border-yellow-400 pointer-events-none"
                  style={{
                    background: 'linear-gradient(45deg, transparent, rgba(255, 215, 0, 0.1), transparent)',
                    animation: 'shimmer 3s ease-in-out infinite'
                  }}
                />
              )}

              {/* Hover Sparkles */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-4 right-4 text-yellow-400 animate-twinkle">✨</div>
                <div className="absolute bottom-4 left-4 text-yellow-400 animate-twinkle" style={{ animationDelay: '0.5s' }}>✨</div>
              </div>
            </motion.label>
          ))}
        </div>

        {/* Validation Feedback */}
        <div className="space-y-2">
          <ErrorMessage error={displayError} />
          <ValidationFeedback 
            isValid={isValid && value !== undefined && value !== ''}
            successMessage="Your identity has been forged in starlight! ✨"
          />
        </div>

        {/* Additional Information */}
        <div className="text-center space-y-2">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="fantasy-secondary text-sm"
          >
            Your choice will determine:
          </motion.p>
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="fantasy-secondary text-sm space-y-1"
          >
            <li>• How other characters address you in the story</li>
            <li>• Available romantic partner options (if you choose romance)</li>
            <li>• Certain story elements and character interactions</li>
          </motion.ul>
        </div>

        {/* Magical Divider */}
        <div className="fantasy-divider"></div>
      </div>
    </motion.div>
  );
};