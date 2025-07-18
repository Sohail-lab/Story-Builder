'use client';

import { QuizEngine } from '@/components/quiz';
import { StarfieldBackground, FloatingOrbs } from '@/components/visual-effects';

export default function QuizPage() {
  const handleQuizComplete = () => {
    console.log('Quiz completed!');
    // In a real app, this would navigate to the story generation page
    alert('Quest completed! Your story will be generated...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <StarfieldBackground />
      <FloatingOrbs />
      
      {/* Main Content */}
      <div className="relative z-10 py-8">
        <div className="container mx-auto px-4">
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
      </div>
    </div>
  );
}