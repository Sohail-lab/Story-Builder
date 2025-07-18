'use client';

import React from 'react';

interface FloatingOrbsProps {
  className?: string;
  orbCount?: number;
}

interface Orb {
  id: number;
  size: number;
  color: string;
  left: string;
  top: string;
  animationDuration: string;
  animationDelay: string;
  glowIntensity: number;
}

export const FloatingOrbs: React.FC<FloatingOrbsProps> = ({
  className = '',
  orbCount = 6,
}) => {
  // Generate random orbs with different properties
  const orbs: Orb[] = React.useMemo(() => {
    const orbColors = [
      'rgba(255, 215, 0, 0.4)', // Gold
      'rgba(139, 69, 19, 0.3)', // Copper
      'rgba(108, 33, 168, 0.3)', // Purple
      'rgba(5, 150, 105, 0.3)', // Emerald
      'rgba(220, 38, 38, 0.3)', // Crimson
      'rgba(229, 231, 235, 0.2)', // Silver
    ];

    return Array.from({ length: orbCount }, (_, index) => ({
      id: index,
      size: Math.random() * 60 + 30, // 30-90px
      color: orbColors[index % orbColors.length] || 'rgba(255, 215, 0, 0.4)', // Fallback color
      left: `${Math.random() * 80 + 10}%`, // 10-90%
      top: `${Math.random() * 80 + 10}%`, // 10-90%
      animationDuration: `${Math.random() * 4 + 3}s`, // 3-7s
      animationDelay: `${Math.random() * 2}s`, // 0-2s delay
      glowIntensity: Math.random() * 20 + 10, // 10-30px glow
    }));
  }, [orbCount]);

  return (
    <div className={`fixed inset-0 pointer-events-none z-10 overflow-hidden ${className}`}>
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className="absolute rounded-full animate-float"
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
        />
      ))}
      
      {/* Additional CSS for enhanced floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.6;
          }
          25% { 
            transform: translateY(-15px) translateX(5px) scale(1.05);
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-10px) translateX(-8px) scale(0.95);
            opacity: 1;
          }
          75% { 
            transform: translateY(-20px) translateX(3px) scale(1.02);
            opacity: 0.7;
          }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default FloatingOrbs;