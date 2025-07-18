'use client';

import React from 'react';

interface AnimatedGradientProps {
  className?: string;
  variant?: 'aurora' | 'mystical' | 'ethereal' | 'cosmic';
  intensity?: 'low' | 'medium' | 'high';
  speed?: 'slow' | 'normal' | 'fast';
}

export const AnimatedGradient: React.FC<AnimatedGradientProps> = ({
  className = '',
  variant = 'aurora',
  intensity = 'medium',
  speed = 'normal',
}) => {
  const getGradientColors = () => {
    switch (variant) {
      case 'aurora':
        return {
          primary: 'rgba(108, 33, 168, 0.3)', // Purple
          secondary: 'rgba(5, 150, 105, 0.2)', // Emerald
          tertiary: 'rgba(255, 215, 0, 0.1)', // Gold
          quaternary: 'rgba(139, 69, 19, 0.2)', // Copper
        };
      case 'mystical':
        return {
          primary: 'rgba(139, 69, 19, 0.4)', // Copper
          secondary: 'rgba(255, 215, 0, 0.3)', // Gold
          tertiary: 'rgba(108, 33, 168, 0.2)', // Purple
          quaternary: 'rgba(220, 38, 38, 0.1)', // Crimson
        };
      case 'ethereal':
        return {
          primary: 'rgba(229, 231, 235, 0.2)', // Silver
          secondary: 'rgba(255, 215, 0, 0.1)', // Gold
          tertiary: 'rgba(108, 33, 168, 0.1)', // Purple
          quaternary: 'rgba(5, 150, 105, 0.1)', // Emerald
        };
      case 'cosmic':
        return {
          primary: 'rgba(11, 20, 38, 0.8)', // Deep midnight
          secondary: 'rgba(30, 41, 59, 0.6)', // Midnight
          tertiary: 'rgba(76, 29, 149, 0.4)', // Purple dark
          quaternary: 'rgba(107, 33, 168, 0.3)', // Purple
        };
      default:
        return {
          primary: 'rgba(108, 33, 168, 0.3)',
          secondary: 'rgba(5, 150, 105, 0.2)',
          tertiary: 'rgba(255, 215, 0, 0.1)',
          quaternary: 'rgba(139, 69, 19, 0.2)',
        };
    }
  };

  const getIntensityMultiplier = () => {
    switch (intensity) {
      case 'low': return 0.5;
      case 'high': return 1.5;
      default: return 1;
    }
  };

  const getAnimationDuration = () => {
    switch (speed) {
      case 'slow': return '20s';
      case 'fast': return '8s';
      default: return '12s';
    }
  };

  const colors = getGradientColors();
  const intensityMultiplier = getIntensityMultiplier();
  const duration = getAnimationDuration();

  // Apply intensity to colors
  const adjustedColors = Object.fromEntries(
    Object.entries(colors).map(([key, color]) => [
      key,
      color.replace(/[\d.]+\)$/, (match) => {
        const opacity = parseFloat(match.slice(0, -1));
        return `${Math.min(opacity * intensityMultiplier, 1)})`;
      })
    ])
  );

  return (
    <div className={`fixed inset-0 pointer-events-none z-5 overflow-hidden ${className}`}>
      {/* Primary gradient layer */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, ${adjustedColors.primary} 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, ${adjustedColors.secondary} 0%, transparent 50%),
            radial-gradient(ellipse at 60% 20%, ${adjustedColors.tertiary} 0%, transparent 40%),
            radial-gradient(ellipse at 30% 80%, ${adjustedColors.quaternary} 0%, transparent 45%)
          `,
          animation: `aurora-shift ${duration} ease-in-out infinite`,
        }}
      />
      
      {/* Secondary gradient layer for depth */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: `
            radial-gradient(ellipse at 70% 40%, ${adjustedColors.secondary} 0%, transparent 60%),
            radial-gradient(ellipse at 10% 60%, ${adjustedColors.primary} 0%, transparent 55%),
            radial-gradient(ellipse at 90% 10%, ${adjustedColors.quaternary} 0%, transparent 50%)
          `,
          animation: `aurora-shift-reverse ${duration} ease-in-out infinite`,
        }}
      />

      {/* Tertiary layer for subtle movement */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            linear-gradient(45deg, ${adjustedColors.tertiary} 0%, transparent 30%, ${adjustedColors.primary} 70%, transparent 100%),
            linear-gradient(-45deg, transparent 0%, ${adjustedColors.secondary} 40%, transparent 80%)
          `,
          animation: `aurora-wave ${duration} linear infinite`,
        }}
      />

      {/* CSS animations */}
      <style jsx>{`
        @keyframes aurora-shift {
          0%, 100% {
            transform: translateX(0%) translateY(0%) scale(1);
            opacity: 0.8;
          }
          25% {
            transform: translateX(2%) translateY(-1%) scale(1.02);
            opacity: 0.9;
          }
          50% {
            transform: translateX(-1%) translateY(2%) scale(0.98);
            opacity: 1;
          }
          75% {
            transform: translateX(1%) translateY(1%) scale(1.01);
            opacity: 0.85;
          }
        }

        @keyframes aurora-shift-reverse {
          0%, 100% {
            transform: translateX(0%) translateY(0%) scale(1);
            opacity: 0.6;
          }
          25% {
            transform: translateX(-2%) translateY(1%) scale(0.98);
            opacity: 0.7;
          }
          50% {
            transform: translateX(1%) translateY(-2%) scale(1.02);
            opacity: 0.8;
          }
          75% {
            transform: translateX(-1%) translateY(-1%) scale(0.99);
            opacity: 0.65;
          }
        }

        @keyframes aurora-wave {
          0% {
            transform: translateX(-100%) rotate(0deg);
            opacity: 0.4;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: translateX(100%) rotate(360deg);
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedGradient;