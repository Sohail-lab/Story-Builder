'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizEngine } from '@/components/quiz';
import { StoryDisplay, StoryGenerator } from '@/components/story';
import { StarfieldBackground, FloatingOrbs } from '@/components/visual-effects';
import { usePlayerStore } from '@/stores/player-store';
import { useStoryStore } from '@/stores/story-store';

type PageState = 'quiz' | 'story-generation' | 'story-display';

export default function QuizPage() {
  const [pageState, setPageState] = useState<PageState>('quiz');
  const { getProfileForStoryGeneration, resetProfile } = usePlayerStore();
  const { generatedStory, resetStoryState } = useStoryStore();

  const handleQuizComplete = () => {
    console.log('Quiz completed!');
    const profile = getProfileForStoryGeneration();
    
    if (profile) {
      setPageState('story-generation');
    } else {
      alert('Please complete all required questions before generating your story.');
    }
  };

  const handleStoryGenerated = () => {
    console.log('Story generated successfully!');
    setPageState('story-display');
  };

  const handleStoryError = (error: string) => {
    console.error('Story generation failed:', error);
    // Stay on story generation page to allow retry
  };

  const handleStartNewQuest = () => {
    resetProfile();
    resetStoryState();
    setPageState('quiz');
  };

  const profile = getProfileForStoryGeneration();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <StarfieldBackground />
      <FloatingOrbs />
      
      {/* Main Content */}
      <div className="relative z-10 py-8">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            {pageState === 'quiz' && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-8">
                  <h1 className="text-4xl md:text-5xl font-bold text-amber-100 mb-4">
                    Character Creation Quest
                  </h1>
                  <p className="text-amber-200/80 text-lg max-w-2xl mx-auto">
                    Answer the questions below to craft your unique fantasy character and world.
                  </p>
                </div>
                
                <QuizEngine onComplete={handleQuizComplete} />
              </motion.div>
            )}

            {pageState === 'story-generation' && profile && (
              <motion.div
                key="story-generation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-8">
                  <h1 className="text-4xl md:text-5xl font-bold text-amber-100 mb-4">
                    Weaving Your Tale
                  </h1>
                  <p className="text-amber-200/80 text-lg max-w-2xl mx-auto">
                    The ancient scrolls are being consulted to craft your personalized adventure...
                  </p>
                </div>
                
                <StoryGenerator
                  playerProfile={profile}
                  onStoryGenerated={handleStoryGenerated}
                  onError={handleStoryError}
                  autoGenerate={true}
                />
              </motion.div>
            )}

            {pageState === 'story-display' && generatedStory && (
              <motion.div
                key="story-display"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-8">
                  <h1 className="text-4xl md:text-5xl font-bold text-amber-100 mb-4">
                    Your Adventure Awaits
                  </h1>
                  <p className="text-amber-200/80 text-lg max-w-2xl mx-auto">
                    Behold the tale that has been woven just for you...
                  </p>
                </div>
                
                <StoryDisplay
                  story={generatedStory}
                  onComplete={() => console.log('Story display completed')}
                  autoStart={true}
                  typewriterSpeed={25}
                  className="mb-8"
                />

                {/* Action buttons */}
                <div className="flex justify-center space-x-4 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartNewQuest}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-200"
                  >
                    Start New Quest
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPageState('story-generation')}
                    className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-200"
                  >
                    Generate New Story
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}