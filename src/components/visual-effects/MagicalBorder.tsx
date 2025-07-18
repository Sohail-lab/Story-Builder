'use client';

import React from 'react';

interface MagicalBorderProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'ornate' | 'simple' | 'runes' | 'elegant';
  glowColor?: 'gold' | 'purple' | 'emerald' | 'silver' | 'crimson';
  animated?: boolean;
  thickness?: 'thin' | 'medium' | 'thick';
}

export const MagicalBorder: React.FC<MagicalBorderProps> = ({
  children,
  className = '',
  variant = 'ornate',
  glowColor = 'gold',
  animated = true,
  thickness = 'medium',
}) => {
  const getGlowColor = () => {
    switch (glowColor) {
      case 'gold': return '#FFD700';
      case 'purple': return '#6B21A8';
      case 'emerald': return '#059669';
      case 'silver': return '#E5E7EB';
      case 'crimson': return '#DC2626';
      default: return '#FFD700';
    }
  };

  const getBorderThickness = () => {
    switch (thickness) {
      case 'thin': return '2px';
      case 'thick': return '4px';
      default: return '3px';
    }
  };

  const getCornerSize = () => {
    switch (thickness) {
      case 'thin': return '12px';
      case 'thick': return '20px';
      default: return '16px';
    }
  };

  const glowColorValue = getGlowColor();
  const borderThickness = getBorderThickness();
  const cornerSize = getCornerSize();

  const getVariantStyles = () => {
    const baseStyles = {
      position: 'relative' as const,
      padding: '24px',
      background: 'rgba(30, 41, 59, 0.9)',
      backdropFilter: 'blur(10px)',
    };

    switch (variant) {
      case 'simple':
        return {
          ...baseStyles,
          border: `${borderThickness} solid ${glowColorValue}`,
          borderRadius: '8px',
          boxShadow: animated 
            ? `0 0 20px ${glowColorValue}40, inset 0 0 20px ${glowColorValue}20`
            : `0 0 10px ${glowColorValue}40`,
        };
      
      case 'elegant':
        return {
          ...baseStyles,
          border: `${borderThickness} solid ${glowColorValue}`,
          borderRadius: '12px',
          boxShadow: animated 
            ? `0 0 30px ${glowColorValue}60, 0 0 60px ${glowColorValue}30`
            : `0 0 15px ${glowColorValue}60`,
        };
      
      case 'runes':
        return {
          ...baseStyles,
          border: `${borderThickness} dashed ${glowColorValue}`,
          borderRadius: '6px',
          boxShadow: animated 
            ? `0 0 25px ${glowColorValue}50, inset 0 0 25px ${glowColorValue}20`
            : `0 0 12px ${glowColorValue}50`,
        };
      
      default: // ornate
        return {
          ...baseStyles,
          borderRadius: '12px',
        };
    }
  };

  const containerStyles = getVariantStyles();

  return (
    <div
      className={`magical-border-container ${animated ? 'animated' : ''} ${className}`}
      style={containerStyles}
    >
      {variant === 'ornate' && (
        <>
          {/* Ornate corner decorations */}
          <div className="magical-corner top-left" />
          <div className="magical-corner top-right" />
          <div className="magical-corner bottom-left" />
          <div className="magical-corner bottom-right" />
          
          {/* Ornate border edges */}
          <div className="magical-edge top" />
          <div className="magical-edge right" />
          <div className="magical-edge bottom" />
          <div className="magical-edge left" />
        </>
      )}
      
      {children}

      <style jsx>{`
        .magical-border-container {
          position: relative;
        }

        .magical-border-container.animated {
          animation: magical-glow 3s ease-in-out infinite alternate;
        }

        /* Ornate corner decorations */
        .magical-corner {
          position: absolute;
          width: ${cornerSize};
          height: ${cornerSize};
          border: ${borderThickness} solid ${glowColorValue};
          background: radial-gradient(circle, ${glowColorValue}40 0%, transparent 70%);
        }

        .magical-corner.top-left {
          top: -${borderThickness};
          left: -${borderThickness};
          border-right: none;
          border-bottom: none;
          border-top-left-radius: 8px;
        }

        .magical-corner.top-right {
          top: -${borderThickness};
          right: -${borderThickness};
          border-left: none;
          border-bottom: none;
          border-top-right-radius: 8px;
        }

        .magical-corner.bottom-left {
          bottom: -${borderThickness};
          left: -${borderThickness};
          border-right: none;
          border-top: none;
          border-bottom-left-radius: 8px;
        }

        .magical-corner.bottom-right {
          bottom: -${borderThickness};
          right: -${borderThickness};
          border-left: none;
          border-top: none;
          border-bottom-right-radius: 8px;
        }

        /* Ornate border edges */
        .magical-edge {
          position: absolute;
          background: linear-gradient(90deg, transparent, ${glowColorValue}, transparent);
        }

        .magical-edge.top {
          top: -${borderThickness};
          left: ${cornerSize};
          right: ${cornerSize};
          height: ${borderThickness};
        }

        .magical-edge.bottom {
          bottom: -${borderThickness};
          left: ${cornerSize};
          right: ${cornerSize};
          height: ${borderThickness};
        }

        .magical-edge.left {
          left: -${borderThickness};
          top: ${cornerSize};
          bottom: ${cornerSize};
          width: ${borderThickness};
          background: linear-gradient(180deg, transparent, ${glowColorValue}, transparent);
        }

        .magical-edge.right {
          right: -${borderThickness};
          top: ${cornerSize};
          bottom: ${cornerSize};
          width: ${borderThickness};
          background: linear-gradient(180deg, transparent, ${glowColorValue}, transparent);
        }

        @keyframes magical-glow {
          0% {
            box-shadow: 0 0 20px ${glowColorValue}40, inset 0 0 20px ${glowColorValue}20;
          }
          100% {
            box-shadow: 0 0 40px ${glowColorValue}60, inset 0 0 30px ${glowColorValue}30;
          }
        }

        /* Hover effects for interactive elements */
        .magical-border-container:hover {
          box-shadow: 0 0 50px ${glowColorValue}70, inset 0 0 40px ${glowColorValue}40;
          transition: box-shadow 0.3s ease-in-out;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .magical-corner {
            width: calc(${cornerSize} * 0.8);
            height: calc(${cornerSize} * 0.8);
          }
          
          .magical-edge.top,
          .magical-edge.bottom {
            left: calc(${cornerSize} * 0.8);
            right: calc(${cornerSize} * 0.8);
          }
          
          .magical-edge.left,
          .magical-edge.right {
            top: calc(${cornerSize} * 0.8);
            bottom: calc(${cornerSize} * 0.8);
          }
        }
      `}</style>
    </div>
  );
};

export default MagicalBorder;