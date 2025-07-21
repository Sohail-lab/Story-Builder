'use client';

import React, { useEffect, useState } from 'react';

interface FloatingOrbsProps {
  orbCount?: number;
  className?: string;
}

interface Orb {
  size: number;
  color: string;
  left: string;
  top: string;
  animationDuration: string;
  animationDelay: string;
  glowIntensity: number;
}

export const FloatingOrbs: React.FC<FloatingOrbsProps> = ({ orbCount = 6, className = '' }) => {
  const [orbs, setOrbs] = useState<Orb[]>([]);

  useEffect(() => {
    const orbColors = [
      'rgba(255, 215, 0, 0.4)', // Gold
      'rgba(139, 69, 19, 0.3)', // Copper
      'rgba(108, 33, 168, 0.3)', // Purple
      'rgba(5, 150, 105, 0.3)', // Emerald
      'rgba(220, 38, 38, 0.3)', // Crimson
      'rgba(229, 231, 235, 0.2)', // Silver
    ];
    const generatedOrbs: Orb[] = Array.from({ length: orbCount }).map((_, index) => ({
      size: Math.random() * 60 + 30, // 30-90px
      color: orbColors[index % orbColors.length] || 'rgba(255, 215, 0, 0.4)',
      left: `${Math.random() * 80 + 10}%`, // 10-90%
      top: `${Math.random() * 80 + 10}%`, // 10-90%
      animationDuration: `${Math.random() * 4 + 3}s`, // 3-7s
      animationDelay: `${Math.random() * 2}s`, // 0-2s delay
      glowIntensity: Math.random() * 20 + 10, // 10-30px glow
    }));
    setOrbs(generatedOrbs);
  }, [orbCount]);

  if (orbs.length === 0) return null;

  return (
    <div className={`pointer-events-none fixed inset-0 z-0 ${className}`} aria-hidden="true">
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            left: orb.left,
            top: orb.top,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            boxShadow: `0 0 ${orb.glowIntensity}px ${orb.color}`,
            animationDuration: orb.animationDuration,
            animationDelay: orb.animationDelay,
          }}
          className="absolute rounded-full animate-float"
        />
      ))}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
          100% { transform: translateY(0px) scale(1); }
        }
        .animate-float {
          animation-name: float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};

export default FloatingOrbs;