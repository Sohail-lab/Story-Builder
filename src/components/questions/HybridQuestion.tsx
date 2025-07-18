'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionComponentProps } from '@/types';

export const HybridQuestion: React.FC<QuestionComponentProps> = ({
  question,
  value = '',
  onChange,
  error
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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
      }
    } else {
      setShowCustomInput(false);
      setCustomText('');
      onChange(option);
    }
  };

  const handleCustomTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCustomText(newValue);
    if (selectedOption === 'custom') {
      onChange(newValue);
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

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
                    value={customText}
                    onChange={handleCustomTextChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="Enter your custom answer..."
                    className={`
                      fantasy-input w-full text-lg py-3 px-4 text-center
                      ${error && selectedOption === 'custom'
                        ? 'border-red-500 focus:border-red-400' 
                        : 'border-amber-700 focus:border-yellow-400'
                      }
                      placeholder:text-slate-400 placeholder:italic
                      transition-all duration-300
                    `}
                    maxLength={30}
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
                    {customText.length}/30 characters
                  </span>
                  {customText && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-yellow-400"
                    >
                      ✨ Creative choice!
                    </motion.span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-3 bg-red-900/30 border border-red-600 rounded-lg"
          >
            <p className="text-red-300 font-medium">
              ⚠️ {error}
            </p>
          </motion.div>
        )}

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
    </motion.div>
  );
};