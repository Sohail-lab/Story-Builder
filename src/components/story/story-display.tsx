'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, BookOpenIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/outline';
import { RestartButton } from '@/components/ui';
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
  const [viewMode, setViewMode] = useState<'typewriter' | 'full' | 'sections'>('typewriter');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  
  const typewriterRef = useRef<NodeJS.Timeout | null>(null);
  
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
  const startTypewriter = (text: string, sectionIndex: number, onComplete?: () => void) => {
    if (isPaused) return;
    
    setIsTyping(true);
    setDisplayedText('');
    
    let index = 0;
    const typeNextChar = () => {
      if (isPaused) return;
      
      if (index < text.length) {
        setDisplayedText(prev => prev + text[index]);
        index++;
        typewriterRef.current = setTimeout(typeNextChar, typewriterSpeed);
      } else {
        setIsTyping(false);
        setCompletedSections(prev => new Set([...prev, sectionIndex]));
        onComplete?.();
      }
    };
    
    typeNextChar();
  };
  
  // Navigate to specific section
  const goToSection = (index: number) => {
    if (typewriterRef.current) {
      clearTimeout(typewriterRef.current);
    }
    
    setCurrentSectionIndex(index);
    setIsTyping(false);
    setIsPaused(true);
    
    const section = storySections[index];
    if (section) {
      setDisplayedText(section.content);
      setCompletedSections(prev => new Set([...prev, index]));
    }
  };
  
  // Navigate to next section
  const nextSection = () => {
    if (currentSectionIndex < storySections.length - 1) {
      goToSection(currentSectionIndex + 1);
    }
  };
  
  // Navigate to previous section
  const previousSection = () => {
    if (currentSectionIndex > 0) {
      goToSection(currentSectionIndex - 1);
    }
  };
  
  // Toggle typewriter mode
  const toggleTypewriter = () => {
    if (isTyping) {
      setIsPaused(!isPaused);
    } else {
      const section = storySections[currentSectionIndex];
      if (section) {
        startTypewriter(section.content, currentSectionIndex);
      }
    }
  };
  
  // Switch to full story view
  const showFullStory = () => {
    setViewMode('full');
  };
  
  // Switch to section navigation view
  const showSectionView = () => {
    setViewMode('sections');
  };
  
  // Switch back to typewriter view
  const showTypewriterView = () => {
    setViewMode('typewriter');
    setIsPaused(false);
  };
  
  // Initialize typewriter on mount
  useEffect(() => {
    if (autoStart && viewMode === 'typewriter' && storySections.length > 0) {
      const firstSection = storySections[0];
      if (firstSection) {
        startTypewriter(firstSection.content, 0);
      }
    }
    
    return () => {
      if (typewriterRef.current) {
        clearTimeout(typewriterRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart, typewriterSpeed, viewMode]);
  
  // Full story view
  if (viewMode === 'full') {
    return (
      <div className={`relative max-w-4xl mx-auto ${className}`}>
        {/* View mode controls */}
        <div className="flex justify-center mb-6 space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={showTypewriterView}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white font-medium rounded-lg border border-slate-600 transition-all duration-200"
          >
            <PlayIcon className="w-4 h-4" />
            Typewriter
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={showSectionView}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white font-medium rounded-lg border border-slate-600 transition-all duration-200"
          >
            <ChevronRightIcon className="w-4 h-4" />
            Sections
          </motion.button>
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-amber-600/80 text-white font-medium rounded-lg border border-amber-500"
          >
            <BookOpenIcon className="w-4 h-4" />
            Full Story
          </motion.button>
        </div>
        
        <StoryDisplayStatic story={story} />
      </div>
    );
  }
  
  // Section navigation view
  if (viewMode === 'sections') {
    return (
      <div className={`relative max-w-4xl mx-auto ${className}`}>
        {/* View mode controls */}
        <div className="flex justify-center mb-6 space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={showTypewriterView}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white font-medium rounded-lg border border-slate-600 transition-all duration-200"
          >
            <PlayIcon className="w-4 h-4" />
            Typewriter
          </motion.button>
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-amber-600/80 text-white font-medium rounded-lg border border-amber-500"
          >
            <ChevronRightIcon className="w-4 h-4" />
            Sections
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={showFullStory}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white font-medium rounded-lg border border-slate-600 transition-all duration-200"
          >
            <BookOpenIcon className="w-4 h-4" />
            Full Story
          </motion.button>
        </div>
        
        {/* Section navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {storySections.map((section, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => goToSection(index)}
              className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                index === currentSectionIndex
                  ? 'bg-amber-600/20 border-amber-400/50 text-amber-200'
                  : 'bg-slate-800/40 border-slate-600/50 text-slate-300 hover:bg-slate-700/40'
              }`}
            >
              <h3 className="font-semibold mb-2">{section.title}</h3>
              <p className="text-sm opacity-75 line-clamp-2">
                {section.content.substring(0, 100)}...
              </p>
              {completedSections.has(index) && (
                <div className="mt-2 text-green-400 text-xs">✓ Read</div>
              )}
            </motion.button>
          ))}
        </div>
        
        {/* Current section display */}
        <motion.div
          key={currentSectionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/40 backdrop-blur-sm border border-amber-400/20 rounded-2xl p-6 md:p-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent mb-6 text-center">
            {storySections[currentSectionIndex]?.title}
          </h2>
          
          <p className="text-slate-200 leading-relaxed text-base md:text-lg">
            {storySections[currentSectionIndex]?.content}
          </p>
          
          {/* Navigation controls */}
          <div className="flex justify-between items-center mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={previousSection}
              disabled={currentSectionIndex === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentSectionIndex === 0
                  ? 'bg-slate-800/30 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white'
              }`}
            >
              <ChevronLeftIcon className="w-4 h-4" />
              Previous
            </motion.button>
            
            <div className="text-slate-400 text-sm">
              {currentSectionIndex + 1} of {storySections.length}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextSection}
              disabled={currentSectionIndex === storySections.length - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentSectionIndex === storySections.length - 1
                  ? 'bg-slate-800/30 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-600/80 hover:bg-amber-500/80 text-white'
              }`}
            >
              Next
              <ChevronRightIcon className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }
  
  // Typewriter view (default)
  const currentSection = storySections[currentSectionIndex];
  
  if (!currentSection) {
    return null;
  }
  
  return (
    <div className={`relative max-w-4xl mx-auto ${className}`}>
      {/* View mode controls */}
      <div className="flex justify-center mb-6 space-x-2">
        <motion.button
          className="flex items-center gap-2 px-4 py-2 bg-amber-600/80 text-white font-medium rounded-lg border border-amber-500"
        >
          <PlayIcon className="w-4 h-4" />
          Typewriter
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={showSectionView}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white font-medium rounded-lg border border-slate-600 transition-all duration-200"
        >
          <ChevronRightIcon className="w-4 h-4" />
          Sections
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={showFullStory}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white font-medium rounded-lg border border-slate-600 transition-all duration-200"
        >
          <BookOpenIcon className="w-4 h-4" />
          Full Story
        </motion.button>
      </div>
      
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
                {isTyping && !isPaused && (
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
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => goToSection(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentSectionIndex 
                    ? 'bg-amber-400 shadow-lg shadow-amber-400/50' 
                    : completedSections.has(index)
                    ? 'bg-green-400 shadow-lg shadow-green-400/50'
                    : 'bg-slate-600 hover:bg-slate-500'
                }`}
                title={storySections[index]?.title || ''}
              />
            ))}
          </div>
          
          {/* Typewriter controls */}
          <div className="flex justify-center mt-6 space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTypewriter}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600/80 hover:bg-amber-500/80 text-white font-medium rounded-lg border border-amber-500 transition-all duration-200"
            >
              {isTyping && !isPaused ? (
                <>
                  <PauseIcon className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <PlayIcon className="w-4 h-4" />
                  {isTyping ? 'Resume' : 'Replay'}
                </>
              )}
            </motion.button>
            
            {currentSectionIndex > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={previousSection}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white font-medium rounded-lg border border-slate-600 transition-all duration-200"
              >
                <ChevronLeftIcon className="w-4 h-4" />
                Previous
              </motion.button>
            )}
            
            {currentSectionIndex < storySections.length - 1 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextSection}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white font-medium rounded-lg border border-slate-600 transition-all duration-200"
              >
                Next
                <ChevronRightIcon className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
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
        <p className="text-amber-400 font-medium text-lg mb-6">
          Your adventure awaits your next choice...
        </p>
        
        {/* Restart button for story completion */}
        <RestartButton
          variant="primary"
          size="lg"
          confirmationTitle="Begin a New Quest?"
          confirmationMessage="Your current adventure has reached its conclusion. Would you like to create a completely new character and embark on a fresh journey?"
          onRestart={() => {
            // Navigate to home page for a fresh start
            if (typeof window !== 'undefined') {
              window.location.href = '/';
            }
          }}
        />
      </motion.div>
    </div>
  );
}