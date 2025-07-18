'use client';

import { LandingPage } from '@/components';

export default function Home() {
  const handleStartQuiz = () => {
    // TODO: Navigate to quiz when quiz components are implemented
    console.log('Starting quiz...');
  };

  return <LandingPage onStartQuiz={handleStartQuiz} />;
}
