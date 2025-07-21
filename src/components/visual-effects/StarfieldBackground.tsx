'use client';

import React, { useEffect, useRef } from 'react';

interface StarfieldBackgroundProps {
  className?: string;
  starCount?: number;
  twinkleSpeed?: number;
}

export const StarfieldBackground: React.FC<StarfieldBackgroundProps> = ({
  className = '',
  starCount = 100,
  twinkleSpeed = 2000,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const starsRef = useRef<Array<{
    x: number;
    y: number;
    size: number;
    opacity: number;
    twinkleSpeed: number;
    phase: number;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = () => {
      starsRef.current = Array.from({ length: starCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach((star) => {
        star.phase += star.twinkleSpeed;
        const twinkleOpacity = (Math.sin(star.phase) + 1) / 2;
        const finalOpacity = star.opacity * twinkleOpacity;

        ctx.save();
        
        ctx.globalAlpha = finalOpacity * 0.3;
        ctx.fillStyle = '#FFD700';
        ctx.shadowBlur = star.size * 4;
        ctx.shadowColor = '#FFD700';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = finalOpacity;
        ctx.shadowBlur = star.size * 2;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      resizeCanvas();
      createStars();
    };

    resizeCanvas();
    createStars();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [starCount, twinkleSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{
        background: 'transparent',
      }}
    />
  );
};

export default StarfieldBackground;