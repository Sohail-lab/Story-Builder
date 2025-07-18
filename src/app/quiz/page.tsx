'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { QuizEngine } from '@/components/quiz';
import { StoryDisplay, StoryGenerator } from '@/components/story';
import { StarfieldBackground, FloatingOrbs, PageTransition } from '@/components/visual-effects';
import { StoryRestartButton } from '@/components/ui';
import { usePlayerStore } from '@/stores/player-store';
import { useStoryStore } from '@/stores/story-store';
import { useUIStore } from '@/stores/ui-store';

type PageState = 'quiz' | 'story-generation' | 'story-display';

export default function QuizPage() {
  const [pageState, setPageState] = useState<PageState>('quiz');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { getProfileForStoryGeneration, resetProfile } = usePlayerStore();
  const { generatedStory, resetStoryState } = useStoryStore();
  const { setTransitioning } = useUIStore();

  const handleQuizComplete = async () => {
    console.log('Quiz completed!');
    const profile = getProfileForStoryGeneration();
    
    if (profile) {
      setIsTransitioning(true);
      setTransitioning(true);
      
      // Longer delay to see the sparkles
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setPageState('story-generation');
      setIsTransitioning(false);
      setTransitioning(false);
    } else {
      alert('Please complete all required questions before generating your story.');
    }
  };

  const handleStoryGenerated = async () => {
    console.log('Story generated successfully!');
    setIsTransitioning(true);
    setTransitioning(true);
    
    // Longer delay to see the sparkles
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    setPageState('story-display');
    setIsTransitioning(false);
    setTransitioning(false);
  };

  const handleStoryError = (error: string) => {
    console.error('Story generation failed:', error);
    // Stay on story generation page to allow retry
  };

  const handleStartNewQuest = async () => {
    setIsTransitioning(true);
    setTransitioning(true);
    
    resetProfile();
    resetStoryState();
    
    // Longer delay to see the sparkles
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    setPageState('quiz');
    setIsTransitioning(false);
    setTransitioning(false);
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
          <PageTransition
            isTransitioning={isTransitioning}
            direction="fade"
            duration={0.6}
            sparkleCount={25}
          >
            {pageState === 'quiz' && (
              <div>
                <div className="text-center mb-8">
                  <h1 className="text-4xl md:text-5xl font-bold text-amber-100 mb-4">
                    Character Creation Quest
                  </h1>
                  <p className="text-amber-200/80 text-lg max-w-2xl mx-auto">
                    Answer the questions below to craft your unique fantasy character and world.
                  </p>
                </div>
                
                <QuizEngine onComplete={handleQuizComplete} />
              </div>
            )}

            {pageState === 'story-generation' && profile && (
              <div>
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
              </div>
            )}

            {pageState === 'story-display' && generatedStory && (
              <div>
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
                  <StoryRestartButton
                    onRestart={() => {
                      setPageState('quiz');
                    }}
                  />
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={async () => {
                      setIsTransitioning(true);
                      setTransitioning(true);
                      resetStoryState();
                      await new Promise(resolve => setTimeout(resolve, 1200));
                      setPageState('story-generation');
                      setIsTransitioning(false);
                      setTransitioning(false);
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-200"
                  >
                    Generate New Story
                  </motion.button>
                </div>
              </div>
            )}
          </PageTransition>
        </div>
      </div>
    </div>
  );
}