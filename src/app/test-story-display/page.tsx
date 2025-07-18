'use client';

import { useState } from 'react';
import { StoryDisplay, StoryDisplayStatic } from '@/components/story';
import { type StoryResponse } from '@/types';

// Sample story data for testing
const sampleStory: StoryResponse = {
  characterIntroduction: "You are Aria Moonwhisper, a wise and cunning Elf Scholar whose thirst for ancient knowledge has led you down paths both illuminating and perilous. Your ethereal beauty is matched only by the sharp intellect that gleams in your silver eyes, and your graceful movements speak of centuries spent in quiet contemplation among dusty tomes and forgotten scrolls.",
  
  worldDescription: "The mystical realm of Aethermoor stretches before you, where towering crystal spires pierce clouds that shimmer with residual magic. Ancient forests whisper secrets in languages long forgotten, their silver-barked trees reaching toward twin moons that cast an eternal twilight across the land. Here, magic flows like rivers through the very air, and the boundary between the physical and spiritual worlds grows thin as gossamer.",
  
  plotSetup: "Your peaceful existence in the Grand Library of Lumenis is shattered when you discover a cryptic message hidden within the pages of the Codex Eternus - a tome thought to be merely decorative. The message speaks of an ancient prophecy, a coming darkness that threatens to unravel the very fabric of reality. As the only scholar capable of deciphering the old tongue, the burden of understanding falls upon your shoulders.",
  
  narrative: "As you delve deeper into the mystery, strange occurrences begin to plague the library. Books rearrange themselves in the night, whispers echo from empty halls, and shadows move independently of their sources. Your research reveals that the prophecy speaks of seven sacred artifacts scattered across Aethermoor, each one a key to either preventing the prophesied catastrophe or hastening its arrival. The choice of how to use this knowledge - and whom to trust with it - weighs heavily upon your mind.",
  
  suspensefulEnding: "Standing at the threshold of the library's forbidden vault, ancient key trembling in your hand, you hear footsteps approaching from behind. The choice before you is irrevocable: unlock the vault and claim the first artifact, potentially alerting unknown forces to your discovery, or flee into the night and abandon your research, leaving Aethermoor vulnerable to whatever darkness approaches. The footsteps grow closer, and you must decide... now."
};

export default function TestStoryDisplayPage() {
  const [showTypewriter, setShowTypewriter] = useState(true);
  const [typewriterSpeed, setTypewriterSpeed] = useState(30);
  const [storyComplete, setStoryComplete] = useState(false);

  const handleStoryComplete = () => {
    setStoryComplete(true);
    console.log('Story display completed!');
  };

  const resetStory = () => {
    setStoryComplete(false);
    setShowTypewriter(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent mb-4">
            Story Display Component Test
          </h1>
          <p className="text-slate-300 text-lg">
            Testing the typewriter effect and fantasy styling
          </p>
        </div>

        {/* Controls */}
        <div className="max-w-2xl mx-auto mb-8 p-6 bg-slate-800/50 rounded-xl border border-slate-700">
          <h2 className="text-xl font-semibold text-amber-400 mb-4">Controls</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-slate-300">Display Mode:</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowTypewriter(true)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    showTypewriter 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Typewriter
                </button>
                <button
                  onClick={() => setShowTypewriter(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    !showTypewriter 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Static
                </button>
              </div>
            </div>

            {showTypewriter && (
              <div className="flex items-center justify-between">
                <label className="text-slate-300">Typewriter Speed:</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={typewriterSpeed}
                    onChange={(e) => setTypewriterSpeed(Number(e.target.value))}
                    className="w-32"
                  />
                  <span className="text-slate-400 text-sm w-12">{typewriterSpeed}ms</span>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={resetStory}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
              >
                Reset Story
              </button>
            </div>

            {storyComplete && (
              <div className="text-center">
                <p className="text-green-400 font-medium">✅ Story completed!</p>
              </div>
            )}
          </div>
        </div>

        {/* Story Display */}
        <div className="mb-8">
          {showTypewriter ? (
            <StoryDisplay
              key={`typewriter-${typewriterSpeed}-${Date.now()}`}
              story={sampleStory}
              onComplete={handleStoryComplete}
              autoStart={true}
              typewriterSpeed={typewriterSpeed}
            />
          ) : (
            <StoryDisplayStatic
              story={sampleStory}
            />
          )}
        </div>

        {/* Story Data Preview */}
        <div className="max-w-4xl mx-auto">
          <details className="bg-slate-800/30 rounded-xl border border-slate-700">
            <summary className="p-4 cursor-pointer text-amber-400 font-medium hover:text-amber-300">
              View Raw Story Data
            </summary>
            <div className="p-4 border-t border-slate-700">
              <pre className="text-slate-300 text-sm overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(sampleStory, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}