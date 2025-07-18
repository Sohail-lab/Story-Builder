'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { StoryGenerator } from '@/components/story';
import { testPlayerProfile, testFallbackStory } from '@/utils/test-story-generation';
import { type StoryResponse } from '@/types';

export default function TestStoryPage() {
  const [testResults, setTestResults] = useState<{
    fallback?: StoryResponse;
    generated?: StoryResponse;
    error?: string;
  }>({});

  const handleTestFallback = async () => {
    try {
      await testFallbackStory();
      const { generateFallbackStory } = await import('@/services/story-service');
      const fallbackStory = generateFallbackStory(testPlayerProfile);
      setTestResults(prev => ({ ...prev, fallback: fallbackStory, error: undefined }));
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
    }
  };

  const handleStoryGenerated = () => {
    console.log('Story generated successfully via StoryGenerator component');
  };

  const handleGenerationError = (error: string) => {
    setTestResults(prev => ({ ...prev, error }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold text-amber-400">
            Story Generation Test
          </h1>
          <p className="text-slate-300">
            Test the Google Gemini API integration and fallback story generation
          </p>
        </motion.div>

        {/* Test Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
        >
          <h2 className="text-xl font-semibold text-amber-300 mb-4">
            Test Controls
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleTestFallback}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Test Fallback Story
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
            >
              Reset Tests
            </button>
          </div>
        </motion.div>

        {/* Test Character Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
        >
          <h2 className="text-xl font-semibold text-amber-300 mb-4">
            Test Character Profile
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><strong>Name:</strong> {testPlayerProfile.name}</div>
            <div><strong>Gender:</strong> {testPlayerProfile.gender}</div>
            <div><strong>Race:</strong> {testPlayerProfile.race}</div>
            <div><strong>Specialty:</strong> {testPlayerProfile.specialty}</div>
            <div><strong>Lifestyle:</strong> {testPlayerProfile.lifestyle}</div>
            <div><strong>Personality:</strong> {testPlayerProfile.personalityTrait}</div>
            <div><strong>Environment:</strong> {testPlayerProfile.favoriteEnvironment}</div>
            <div><strong>Magic:</strong> {testPlayerProfile.magicalAffinity}</div>
            <div><strong>Social:</strong> {testPlayerProfile.socialPreference}</div>
            <div><strong>Alignment:</strong> {testPlayerProfile.moralAlignment}</div>
            <div><strong>Motivation:</strong> {testPlayerProfile.primaryMotivation}</div>
            <div><strong>Romance:</strong> {testPlayerProfile.romanceInterest ? 'Yes' : 'No'}</div>
          </div>
        </motion.div>

        {/* Story Generator Component Test */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
        >
          <h2 className="text-xl font-semibold text-amber-300 mb-4">
            Story Generator Component Test
          </h2>
          
          <StoryGenerator
            playerProfile={testPlayerProfile}
            onStoryGenerated={handleStoryGenerated}
            onError={handleGenerationError}
            autoGenerate={false}
          />
        </motion.div>

        {/* Test Results */}
        {(testResults.fallback || testResults.error) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
          >
            <h2 className="text-xl font-semibold text-amber-300 mb-4">
              Test Results
            </h2>
            
            {testResults.error && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <h3 className="text-red-400 font-semibold mb-2">Error</h3>
                <p className="text-red-300">{testResults.error}</p>
              </div>
            )}
            
            {testResults.fallback && (
              <div className="space-y-4">
                <h3 className="text-green-400 font-semibold">Fallback Story Generated</h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <strong className="text-amber-300">Character Introduction:</strong>
                    <p className="text-slate-300 mt-1">{testResults.fallback.characterIntroduction}</p>
                  </div>
                  
                  <div>
                    <strong className="text-amber-300">World Description:</strong>
                    <p className="text-slate-300 mt-1">{testResults.fallback.worldDescription}</p>
                  </div>
                  
                  <div>
                    <strong className="text-amber-300">Plot Setup:</strong>
                    <p className="text-slate-300 mt-1">{testResults.fallback.plotSetup}</p>
                  </div>
                  
                  <div>
                    <strong className="text-amber-300">Narrative:</strong>
                    <p className="text-slate-300 mt-1">{testResults.fallback.narrative}</p>
                  </div>
                  
                  <div>
                    <strong className="text-amber-300">Suspenseful Ending:</strong>
                    <p className="text-slate-300 mt-1">{testResults.fallback.suspensefulEnding}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
        >
          <h2 className="text-xl font-semibold text-amber-300 mb-4">
            Setup Instructions
          </h2>
          
          <div className="space-y-3 text-sm text-slate-300">
            <p>
              <strong>1. Get a Gemini API Key:</strong> Visit{' '}
              <a 
                href="https://makersuite.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 underline"
              >
                Google AI Studio
              </a>{' '}
              to get your free API key.
            </p>
            
            <p>
              <strong>2. Set Environment Variable:</strong> Create a{' '}
              <code className="bg-slate-700 px-2 py-1 rounded">.env.local</code>{' '}
              file in the project root and add:
            </p>
            
            <pre className="bg-slate-700 p-3 rounded-lg overflow-x-auto">
              <code>NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here</code>
            </pre>
            
            <p>
              <strong>3. Test the Integration:</strong> Use the &quot;Story Generator Component Test&quot; above 
              to test the full integration, or use the &quot;Test Fallback Story&quot; button to test the 
              fallback functionality.
            </p>
            
            <p className="text-amber-300">
              <strong>Note:</strong> The fallback story generator works without an API key and 
              provides a basic story template based on the character profile.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}