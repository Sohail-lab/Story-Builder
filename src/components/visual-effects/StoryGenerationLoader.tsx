'use client';

import React from 'react';

interface StoryGenerationLoaderProps {
  isVisible: boolean;
  progress?: number;
}

const phases = [
  { text: "Gathering your character essence...", duration: 2000 },
  { text: "Weaving the threads of destiny...", duration: 3000 },
  { text: "Consulting the ancient tomes...", duration: 2500 },
  { text: "Shaping your world...", duration: 3500 },
  { text: "Breathing life into your tale...", duration: 2000 },
  { text: "Adding the final magical touches...", duration: 1500 }
];

export const StoryGenerationLoader: React.FC<StoryGenerationLoaderProps> = ({
  isVisible,
  progress
}) => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = React.useState(0);

  React.useEffect(() => {
    if (!isVisible) {
      setCurrentPhaseIndex(0);
      return;
    }

    if (typeof progress === 'number' && progress > 0) {
      const phase = Math.floor((progress / 100) * phases.length);
      setCurrentPhaseIndex(Math.min(phase, phases.length - 1));
      return;
    }

    const phaseDuration = phases[currentPhaseIndex]?.duration ?? 2000;
    const timer = setTimeout(() => {
      setCurrentPhaseIndex((prev) => {
        if (prev < phases.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, phaseDuration);

    return () => clearTimeout(timer);
  }, [isVisible, progress, currentPhaseIndex]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="fantasy-card fantasy-starfield w-full max-w-md mx-auto p-8 text-center relative">
        <div className="mb-6">
          <h2 className="fantasy-heading text-2xl md:text-3xl mb-2 text-amber-200">
            Generating Your Story...
          </h2>
          <p className="fantasy-secondary text-base text-amber-100/80">
            {phases[currentPhaseIndex]?.text ?? ""}
          </p>
        </div>
        <div className="w-full h-3 bg-slate-800/60 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all duration-500"
            style={{ width: progress ? `${progress}%` : `${((currentPhaseIndex + 1) / phases.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StoryGenerationLoader;