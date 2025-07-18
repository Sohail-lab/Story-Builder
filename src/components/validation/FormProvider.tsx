'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { z } from 'zod';
import { getValidationSchemaForQuestion } from '@/utils/validation';

// Form context type
interface FormContextType {
  validateField: (questionId: string, value: string) => Promise<string | undefined>;
  isFieldValid: (questionId: string) => boolean;
  getFieldError: (questionId: string) => string | undefined;
  clearFieldError: (questionId: string) => void;
  validateAllFields: () => Promise<boolean>;
}

const FormContext = createContext<FormContextType | null>(null);

// Hook to use form context
export const useFormValidation = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormValidation must be used within a FormProvider');
  }
  return context;
};

interface FormProviderProps {
  children: ReactNode;
  onValidationChange?: (isValid: boolean, errors: Record<string, string>) => void;
}

export const FormProvider: React.FC<FormProviderProps> = ({ 
  children, 
  onValidationChange 
}) => {
  // Simple validation state management without React Hook Form
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [fieldValidStates, setFieldValidStates] = React.useState<Record<string, boolean>>({});

  const validateField = async (questionId: string, value: string): Promise<string | undefined> => {
    try {
      const schema = getValidationSchemaForQuestion(questionId);
      await schema.parseAsync(value);
      
      // Clear any existing error for this field
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
      
      // Mark field as valid
      setFieldValidStates(prev => ({
        ...prev,
        [questionId]: true
      }));
      
      return undefined; // No error
    } catch (error) {
      let errorMessage = 'Invalid input';
      
      if (error instanceof z.ZodError) {
        errorMessage = error.issues[0]?.message || 'Invalid input';
      }
      
      // Set error for this field
      setFieldErrors(prev => ({
        ...prev,
        [questionId]: errorMessage
      }));
      
      // Mark field as invalid
      setFieldValidStates(prev => ({
        ...prev,
        [questionId]: false
      }));
      
      return errorMessage;
    }
  };

  const isFieldValid = (questionId: string): boolean => {
    return fieldValidStates[questionId] === true;
  };

  const getFieldError = (questionId: string): string | undefined => {
    return fieldErrors[questionId];
  };

  const clearFieldError = (questionId: string): void => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[questionId];
      return newErrors;
    });
    
    setFieldValidStates(prev => ({
      ...prev,
      [questionId]: false
    }));
  };

  const validateAllFields = async (): Promise<boolean> => {
    const hasErrors = Object.keys(fieldErrors).length > 0;
    const isValid = !hasErrors;
    
    if (onValidationChange) {
      onValidationChange(isValid, fieldErrors);
    }
    
    return isValid;
  };

  const contextValue: FormContextType = {
    validateField,
    isFieldValid,
    getFieldError,
    clearFieldError,
    validateAllFields
  };

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
};

// Hook for individual question validation
export const useQuestionValidation = (questionId: string) => {
  const { validateField, isFieldValid, getFieldError, clearFieldError } = useFormValidation();
  const [isValidating, setIsValidating] = React.useState(false);
  const [lastValidatedValue, setLastValidatedValue] = React.useState<string>('');

  const validateQuestion = React.useCallback(async (value: string) => {
    if (value === lastValidatedValue) {
      return getFieldError(questionId);
    }

    setIsValidating(true);
    setLastValidatedValue(value);

    try {
      const error = await validateField(questionId, value);
      return error;
    } finally {
      setIsValidating(false);
    }
  }, [questionId, validateField, getFieldError, lastValidatedValue]);

  const debouncedValidate = React.useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    
    return (value: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        validateQuestion(value);
      }, 300); // 300ms debounce
    };
  }, [validateQuestion]);

  return {
    validateQuestion,
    debouncedValidate,
    isValidating,
    isValid: isFieldValid(questionId),
    error: getFieldError(questionId),
    clearError: () => clearFieldError(questionId)
  };
};