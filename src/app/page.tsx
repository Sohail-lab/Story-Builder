'use client';

import { useRouter } from 'next/navigation';
import { LandingPage } from '@/components';

export default function Home() {
  const router = useRouter();

  const handleStartQuiz = () => {
    // Navigate to the quiz page
    router.push('/quiz');
  };

  return <LandingPage onStartQuiz={handleStartQuiz} />;
}
