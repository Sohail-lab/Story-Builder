'use client';

import React, { useState } from 'react';
import {
  StarfieldBackground,
  FloatingOrbs,
  AnimatedGradient,
  MagicalBorder,
} from './index';

export const VisualEffectsDemo: React.FC = () => {
  const [activeEffects, setActiveEffects] = useState({
    starfield: true,
    orbs: true,
    gradient: true,
    border: true,
  });

  const [gradientVariant, setGradientVariant] = useState<'aurora' | 'mystical' | 'ethereal' | 'cosmic'>('aurora');
  const [borderVariant, setBorderVariant] = useState<'ornate' | 'simple' | 'runes' | 'elegant'>('ornate');
  const [borderColor, setBorderColor] = useState<'gold' | 'purple' | 'emerald' | 'silver' | 'crimson'>('gold');

  const toggleEffect = (effect: keyof typeof activeEffects) => {
    setActiveEffects(prev => ({
      ...prev,
      [effect]: !prev[effect],
    }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      {activeEffects.starfield && <StarfieldBackground />}
      {activeEffects.orbs && <FloatingOrbs />}
      {activeEffects.gradient && (
        <AnimatedGradient 
          variant={gradientVariant}
          intensity="medium"
          speed="normal"
        />
      )}

      {/* Demo Content */}
      <div className="relative z-20 p-8 space-y-8">
        {/* Controls Panel */}
        <MagicalBorder
          variant="simple"
          glowColor="silver"
          thickness="thin"
          className="max-w-4xl mx-auto"
        >
          <h1 className="fantasy-heading text-3xl mb-6 text-center">
            Visual Effects Demo
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Effect Toggles */}
            <div className="space-y-4">
              <h3 className="fantasy-heading text-lg">Toggle Effects</h3>
              {Object.entries(activeEffects).map(([effect, isActive]) => (
                <label key={effect} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => toggleEffect(effect as keyof typeof activeEffects)}
                    className="fantasy-checkbox"
                  />
                  <span className="fantasy-body capitalize">{effect}</span>
                </label>
              ))}
            </div>

            {/* Gradient Variants */}
            <div className="space-y-4">
              <h3 className="fantasy-heading text-lg">Gradient Style</h3>
              {(['aurora', 'mystical', 'ethereal', 'cosmic'] as const).map((variant) => (
                <label key={variant} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gradient"
                    checked={gradientVariant === variant}
                    onChange={() => setGradientVariant(variant)}
                    className="fantasy-radio"
                  />
                  <span className="fantasy-body capitalize">{variant}</span>
                </label>
              ))}
            </div>

            {/* Border Variants */}
            <div className="space-y-4">
              <h3 className="fantasy-heading text-lg">Border Style</h3>
              {(['ornate', 'simple', 'runes', 'elegant'] as const).map((variant) => (
                <label key={variant} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="border"
                    checked={borderVariant === variant}
                    onChange={() => setBorderVariant(variant)}
                    className="fantasy-radio"
                  />
                  <span className="fantasy-body capitalize">{variant}</span>
                </label>
              ))}
            </div>

            {/* Border Colors */}
            <div className="space-y-4">
              <h3 className="fantasy-heading text-lg">Border Color</h3>
              {(['gold', 'purple', 'emerald', 'silver', 'crimson'] as const).map((color) => (
                <label key={color} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="borderColor"
                    checked={borderColor === color}
                    onChange={() => setBorderColor(color)}
                    className="fantasy-radio"
                  />
                  <span className="fantasy-body capitalize">{color}</span>
                </label>
              ))}
            </div>
          </div>
        </MagicalBorder>

        {/* Sample Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Card 1 - Ornate Border */}
          {activeEffects.border && (
            <MagicalBorder
              variant={borderVariant}
              glowColor={borderColor}
              animated={true}
              thickness="medium"
            >
              <h3 className="fantasy-heading text-xl mb-4">Magical Border</h3>
              <p className="fantasy-body">
                This card demonstrates the MagicalBorder component with ornate styling, 
                animated glow effects, and customizable colors.
              </p>
            </MagicalBorder>
          )}

          {/* Card 2 - Simple Border */}
          {activeEffects.border && (
            <MagicalBorder
              variant="simple"
              glowColor="purple"
              animated={false}
              thickness="thick"
            >
              <h3 className="fantasy-heading text-xl mb-4">Simple Style</h3>
              <p className="fantasy-body">
                A simpler border variant with clean lines and subtle glow effects 
                for more minimalist designs.
              </p>
            </MagicalBorder>
          )}

          {/* Card 3 - Runes Border */}
          {activeEffects.border && (
            <MagicalBorder
              variant="runes"
              glowColor="emerald"
              animated={true}
              thickness="thin"
            >
              <h3 className="fantasy-heading text-xl mb-4">Runic Style</h3>
              <p className="fantasy-body">
                Dashed borders with mystical appearance, perfect for magical 
                content and ancient wisdom displays.
              </p>
            </MagicalBorder>
          )}
        </div>

        {/* Effect Descriptions */}
        <MagicalBorder
          variant="elegant"
          glowColor="gold"
          className="max-w-4xl mx-auto"
        >
          <h2 className="fantasy-heading text-2xl mb-6 text-center">
            Visual Effects Components
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="fantasy-heading text-lg mb-3">StarfieldBackground</h3>
              <p className="fantasy-body mb-4">
                Creates an animated starfield with twinkling stars using HTML5 Canvas. 
                Features customizable star count, twinkle speed, and glow effects.
              </p>
              
              <h3 className="fantasy-heading text-lg mb-3">FloatingOrbs</h3>
              <p className="fantasy-body">
                Generates floating magical orbs with different colors and sizes. 
                Each orb has its own animation timing and glow intensity.
              </p>
            </div>
            
            <div>
              <h3 className="fantasy-heading text-lg mb-3">AnimatedGradient</h3>
              <p className="fantasy-body mb-4">
                Creates aurora-like gradient effects with multiple variants: 
                aurora, mystical, ethereal, and cosmic. Features smooth animations 
                and customizable intensity.
              </p>
              
              <h3 className="fantasy-heading text-lg mb-3">MagicalBorder</h3>
              <p className="fantasy-body">
                Wraps content with ornate fantasy borders. Supports multiple 
                variants, colors, and animation states for versatile styling.
              </p>
            </div>
          </div>
        </MagicalBorder>
      </div>
    </div>
  );
};

export default VisualEffectsDemo;