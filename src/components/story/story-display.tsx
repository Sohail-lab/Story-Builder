'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type StoryResponse } from '@/types';

interface StoryDisplayProps {
  story: StoryResponse;
  onComplete?: () => void;
  autoStart?: boolean;
  typewriterSpeed?: number;
  className?: string;
}

interface StorySection {
  title: string;
  content: string;
  delay: number;
}

export function StoryDisplay({ 
  story, 
  onComplete, 
  autoStart = true, 
  typewriterSpeed = 30,
  className = '' 
}: StoryDisplayProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);
  
  const typewriterRef = useRef<NodeJS.Timeout | null>(null);
  const skipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Format story into sections
  const storySections: StorySection[] = [
    {
      title: "Your Character",
      content: story.characterIntroduction,
      delay: 0
    },
    {
      title: "The World Around You",
      content: story.worldDescription,
      delay: 1000
    },
    {
      title: "Your Adventure Begins",
      content: story.plotSetup,
      delay: 1000
    },
    {
      title: "The Tale Unfolds",
      content: story.narrative,
      delay: 1000
    },
    {
      title: "To Be Continued...",
      content: story.suspensefulEnding,
      delay: 1500
    }
  ];
  
  // Start typewriter effect
  const startTypewriter = (text: string, onComplete?: () => void) => {
    setIsTyping(true);
    setDisplayedText('');
    
    let index = 0;
    const typeNextChar = () => {
      if (index < text.length) {
        setDisplayedText(prev => prev + text[index]);
        index++;
        typewriterRef.current = setTimeout(typeNextChar, typewriterSpeed);
      } else {
        setIsTyping(false);
        onComplete?.();
      }
    };
    
    typeNextChar();
  };
  
  // Skip current section
  const skipCurrentSection = () => {
    if (typewriterRef.current) {
      clearTimeout(typewriterRef.current);
    }
    const currentSection = storySections[currentSectionIndex];
    if (currentSection) {
      setDisplayedText(currentSection.content);
    }
    setIsTyping(false);
    
    // Auto-advance to next section after a brief pause
    setTimeout(() => {
      advanceToNextSection();
    }, 500);
  };
  
  // Skip to end
  const skipToEnd = () => {
    if (typewriterRef.current) {
      clearTimeout(typewriterRef.current);
    }
    const lastIndex = storySections.length - 1;
    const lastSection = storySections[lastIndex];
    if (lastSection) {
      setCurrentSectionIndex(lastIndex);
      setDisplayedText(lastSection.content);
    }
    setIsTyping(false);
    setIsComplete(true);
    onComplete?.();
  };
  
  // Advance to next section
  const advanceToNextSection = () => {
    if (currentSectionIndex < storySections.length - 1) {
      const nextIndex = currentSectionIndex + 1;
      const nextSection = storySections[nextIndex];
      
      if (nextSection) {
        setCurrentSectionIndex(nextIndex);
        
        setTimeout(() => {
          startTypewriter(nextSection.content, () => {
            if (nextIndex === storySections.length - 1) {
              setIsComplete(true);
              onComplete?.();
            } else {
              setTimeout(() => {
                advanceToNextSection();
              }, storySections[nextIndex + 1]?.delay || 1000);
            }
          });
        }, nextSection.delay);
      }
    }
  };
  
  // Initialize typewriter on mount
  useEffect(() => {
    if (autoStart && storySections.length > 0) {
      const firstSection = storySections[0];
      if (firstSection) {
        startTypewriter(firstSection.content, () => {
          if (storySections.length > 1) {
            const secondSection = storySections[1];
            setTimeout(() => {
              advanceToNextSection();
            }, secondSection?.delay || 1000);
          } else {
            setIsComplete(true);
            onComplete?.();
          }
        });
      }
      
      // Show skip button after 3 seconds
      skipTimeoutRef.current = setTimeout(() => {
        setShowSkipButton(true);
      }, 3000);
    }
    
    return () => {
      if (typewriterRef.current) {
        clearTimeout(typewriterRef.current);
      }
      if (skipTimeoutRef.current) {
        clearTimeout(skipTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart, typewriterSpeed]);
  
  const currentSection = storySections[currentSectionIndex];
  
  if (!currentSection) {
    return null;
  }
  
  return (
    <div className={`relative max-w-4xl mx-auto ${className}`}>
      {/* Ambient background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-purple-900/20 to-amber-900/30 rounded-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400/5 via-transparent to-transparent rounded-2xl" />
      </div>
      
      {/* Story container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-slate-800/40 backdrop-blur-sm border border-amber-400/20 rounded-2xl p-6 md:p-8 lg:p-12 shadow-2xl"
      >
        {/* Decorative border glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/20 via-purple-400/20 to-amber-400/20 p-[1px]">
          <div className="w-full h-full bg-slate-800/80 rounded-2xl" />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Section title */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSectionIndex}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent mb-2">
                {currentSection.title}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto rounded-full" />
            </motion.div>
          </AnimatePresence>
          
          {/* Story text with typewriter effect */}
          <div className="prose prose-lg md:prose-xl max-w-none">
            <motion.div
              key={currentSectionIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <p className="text-slate-200 leading-relaxed text-base md:text-lg lg:text-xl font-medium tracking-wide">
                {displayedText}
                {isTyping && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                    className="inline-block w-0.5 h-6 bg-amber-400 ml-1"
                  />
                )}
              </p>
              
              {/* Ambient glow effect around text */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/5 via-purple-400/5 to-amber-400/5 rounded-lg blur-xl -z-10" />
            </motion.div>
          </div>
          
          {/* Progress indicator */}
          <div className="mt-8 flex justify-center items-center space-x-2">
            {storySections.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index <= currentSectionIndex 
                    ? 'bg-amber-400 shadow-lg shadow-amber-400/50' 
                    : 'bg-slate-600'
                }`}
                animate={index === currentSectionIndex ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Control buttons */}
      <AnimatePresence>
        {showSkipButton && !isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-center mt-6 space-x-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={skipCurrentSection}
              className="px-4 py-2 bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white font-medium rounded-lg border border-slate-600 transition-all duration-200 backdrop-blur-sm"
            >
              Skip Section
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={skipToEnd}
              className="px-4 py-2 bg-amber-600/80 hover:bg-amber-500/80 text-white font-medium rounded-lg border border-amber-500 transition-all duration-200 backdrop-blur-sm"
            >
              Skip to End
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Completion indicator */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mt-8"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 1, -1, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block text-4xl mb-4"
            >
              ✨
            </motion.div>
            <p className="text-amber-400 font-medium text-lg">
              Your adventure awaits your next choice...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simplified version for quick story display without typewriter
export function StoryDisplayStatic({ 
  story, 
  className = '' 
}: { 
  story: StoryResponse; 
  className?: string; 
}) {
  const storySections = [
    { title: "Your Character", content: story.characterIntroduction },
    { title: "The World Around You", content: story.worldDescription },
    { title: "Your Adventure Begins", content: story.plotSetup },
    { title: "The Tale Unfolds", content: story.narrative },
    { title: "To Be Continued...", content: story.suspensefulEnding }
  ];
  
  return (
    <div className={`max-w-4xl mx-auto space-y-8 ${className}`}>
      {storySections.map((section, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          className="relative bg-slate-800/40 backdrop-blur-sm border border-amber-400/20 rounded-xl p-6 md:p-8"
        >
          {/* Section glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-purple-400/10 to-amber-400/10 rounded-xl blur-xl -z-10" />
          
          <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent mb-4">
            {section.title}
          </h3>
          
          <p className="text-slate-200 leading-relaxed text-base md:text-lg">
            {section.content}
          </p>
        </motion.div>
      ))}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: storySections.length * 0.2 }}
        className="text-center"
      >
        <div className="text-4xl mb-4">✨</div>
        <p className="text-amber-400 font-medium text-lg">
          Your adventure awaits your next choice...
        </p>
      </motion.div>
    </div>
  );
}