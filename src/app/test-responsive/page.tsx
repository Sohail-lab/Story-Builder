'use client';

import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  MobileOptimizedCard, 
  ResponsiveGrid, 
  TouchOptimizedButton,
  MobileOptimizedInput,
  ResponsiveLayout
} from '@/components/layout';
import { useMediaQuery } from '@/hooks';

export default function TestResponsivePage() {
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <ResponsiveLayout variant="page" enableMobileOptimizations={true}>
        <ResponsiveContainer variant="default" enableMotion={true}>
          <div className="text-center">
            <h1 className="fantasy-display text-4xl mb-4 text-fantasy-gold-luminous">
              Loading...
            </h1>
          </div>
        </ResponsiveContainer>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout variant="page" enableMobileOptimizations={true}>
      <ResponsiveContainer variant="default" enableMotion={true}>
        <div className="text-center mb-8">
          <h1 className="fantasy-display text-4xl mb-4 text-fantasy-gold-luminous">
            Responsive Layout Test
          </h1>
          <p className="fantasy-body text-lg text-fantasy-parchment">
            Testing mobile-optimized components and responsive design
          </p>
        </div>

        {/* Device Detection */}
        <MobileOptimizedCard variant="compact" className="mb-8">
          <h2 className="fantasy-heading text-2xl mb-4">Device Detection</h2>
          <div className="space-y-2 fantasy-body">
            <p>Mobile: {isMobile ? '✅ Yes' : '❌ No'}</p>
            <p>Tablet: {isTablet ? '✅ Yes' : '❌ No'}</p>
            <p>Desktop: {isDesktop ? '✅ Yes' : '❌ No'}</p>
            <p>Screen Width: {typeof window !== 'undefined' ? `${window.innerWidth}px` : 'Unknown'}</p>
          </div>
        </MobileOptimizedCard>

        {/* Responsive Grid Test */}
        <div className="mb-8">
          <h2 className="fantasy-heading text-2xl mb-4 text-center">Responsive Grid</h2>
          <ResponsiveGrid
            columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
            gap="medium"
            enableStagger={true}
          >
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <MobileOptimizedCard key={num} variant="compact">
                <div className="text-center">
                  <div className="text-fantasy-gold-luminous text-2xl mb-2">✨</div>
                  <p className="fantasy-body">Card {num}</p>
                </div>
              </MobileOptimizedCard>
            ))}
          </ResponsiveGrid>
        </div>

        {/* Touch-Optimized Buttons */}
        <div className="mb-8">
          <h2 className="fantasy-heading text-2xl mb-4 text-center">Touch-Optimized Buttons</h2>
          <div className="space-y-4">
            <TouchOptimizedButton
              variant="primary"
              size="large"
              fullWidth={isMobile}
              icon="⚡"
              iconPosition="left"
              onClick={() => alert('Primary button clicked!')}
            >
              Primary Button
            </TouchOptimizedButton>
            
            <TouchOptimizedButton
              variant="secondary"
              size="medium"
              fullWidth={isMobile}
              icon="🏰"
              iconPosition="right"
              onClick={() => alert('Secondary button clicked!')}
            >
              Secondary Button
            </TouchOptimizedButton>
            
            <TouchOptimizedButton
              variant="ghost"
              size="small"
              fullWidth={isMobile}
              onClick={() => alert('Ghost button clicked!')}
            >
              Ghost Button
            </TouchOptimizedButton>
          </div>
        </div>

        {/* Mobile-Optimized Input */}
        <div className="mb-8">
          <h2 className="fantasy-heading text-2xl mb-4 text-center">Mobile-Optimized Input</h2>
          <MobileOptimizedCard variant="default">
            <MobileOptimizedInput
              value=""
              onChange={(value) => console.log('Input changed:', value)}
              placeholder="Enter your magical name..."
              maxLength={30}
              success={false}
            />
          </MobileOptimizedCard>
        </div>

        {/* Layout Information */}
        <MobileOptimizedCard variant="expanded">
          <h2 className="fantasy-heading text-2xl mb-4">Layout Information</h2>
          <div className="fantasy-body space-y-2">
            <p><strong>Current Layout:</strong> {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}</p>
            <p><strong>Touch Device:</strong> {'ontouchstart' in window ? 'Yes' : 'No'}</p>
            <p><strong>Viewport:</strong> {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'Unknown'}</p>
            <p><strong>Device Pixel Ratio:</strong> {typeof window !== 'undefined' ? window.devicePixelRatio : 'Unknown'}</p>
          </div>
        </MobileOptimizedCard>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <TouchOptimizedButton
            variant="primary"
            size="medium"
            onClick={() => window.location.href = '/'}
            icon="🏠"
            iconPosition="left"
          >
            Back to Home
          </TouchOptimizedButton>
        </div>
      </ResponsiveContainer>
    </ResponsiveLayout>
  );
}