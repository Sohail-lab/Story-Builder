'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MobileOptimizedInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  error?: string;
  success?: boolean;
  className?: string;
  autoFocus?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const MobileOptimizedInput: React.FC<MobileOptimizedInputProps> = ({
  value,
  onChange,
  placeholder = '',
  maxLength = 50,
  disabled = false,
  error,
  success = false,
  className = '',
  autoFocus = false,
  onFocus,
  onBlur
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus handling
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      // Delay to ensure proper mobile keyboard handling
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [autoFocus]);

  const handleFocus = () => {
    setIsFocused(true);
    setHasInteracted(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  // Determine input state styling
  const getInputStateClasses = () => {
    if (error && hasInteracted) {
      return 'border-fantasy-crimson focus:border-fantasy-crimson';
    }
    if (success && value.trim()) {
      return 'border-fantasy-emerald focus:border-fantasy-emerald';
    }
    return 'border-fantasy-copper focus:border-fantasy-gold-luminous';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Input Container */}
      <motion.div
        className="relative"
        animate={{
          scale: isFocused ? 1.02 : 1,
          boxShadow: isFocused 
            ? '0 0 20px rgba(255, 215, 0, 0.3)' 
            : '0 0 0px rgba(255, 215, 0, 0)'
        }}
        transition={{ duration: 0.3 }}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={`
            w-full
            px-4 py-4
            text-lg
            bg-fantasy-midnight/80
            backdrop-blur-sm
            border-2
            rounded-lg
            text-fantasy-parchment
            placeholder:text-fantasy-charcoal
            placeholder:italic
            transition-all duration-300
            ${getInputStateClasses()}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            focus:outline-none
            focus:ring-0
            text-center
            min-h-[52px]
          `}
          // Mobile-specific attributes
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="words"
          spellCheck="false"
        />

        {/* Magical Border Effect */}
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 rounded-lg border-2 border-fantasy-gold-luminous pointer-events-none"
            style={{
              background: 'linear-gradient(45deg, transparent, rgba(255, 215, 0, 0.1), transparent)',
            }}
          />
        )}

        {/* Success Indicator */}
        {success && value.trim() && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-fantasy-emerald text-xl"
          >
            ✓
          </motion.div>
        )}

        {/* Error Indicator */}
        {error && hasInteracted && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-fantasy-crimson text-xl"
          >
            ⚠
          </motion.div>
        )}
      </motion.div>

      {/* Character Count and Status */}
      <div className="flex justify-between items-center mt-2 text-sm">
        <div className="text-fantasy-charcoal">
          {value.length}/{maxLength} characters
        </div>
        
        {value.trim() && !error && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-fantasy-gold-luminous flex items-center gap-1"
          >
            <span>✨</span>
            <span>Great choice!</span>
          </motion.div>
        )}
      </div>

      {/* Error Message */}
      {error && hasInteracted && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-fantasy-crimson text-sm text-center"
        >
          {error}
        </motion.div>
      )}

      {/* Mobile Keyboard Spacer */}
      {isFocused && (
        <div className="h-64 md:h-0" />
      )}
    </div>
  );
};