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
    setActiveEffects(prev => ({ ...prev, [effect]: !prev[effect] }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {activeEffects.starfield && <StarfieldBackground />}
      {activeEffects.orbs && <FloatingOrbs />}
      {activeEffects.gradient && (
        <AnimatedGradient 
          variant={gradientVariant}
          intensity="medium"
          speed="normal"
        />
      )}
      <div className="relative z-20 p-8 space-y-8">
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
          {activeEffects.border && (
            <MagicalBorder
              variant={borderVariant}
              glowColor={borderColor}
              animated={true}
              className="mt-8"
            >
              <div className="p-8 text-center">
                <h2 className="fantasy-heading text-2xl mb-2">Ornate Border Example</h2>
                <p className="fantasy-body text-base">
                  This card uses the <b>Ornate</b> border variant with a glowing <b>{borderColor}</b> effect.
                </p>
              </div>
            </MagicalBorder>
          )}
          {activeEffects.border && (
            <MagicalBorder
              variant="simple"
              glowColor={borderColor}
              animated={false}
              className="mt-8"
            >
              <div className="p-8 text-center">
                <h2 className="fantasy-heading text-2xl mb-2">Simple Border Example</h2>
                <p className="fantasy-body text-base">
                  This card uses the <b>Simple</b> border variant with a glowing <b>{borderColor}</b> effect.
                </p>
              </div>
            </MagicalBorder>
          )}
          {activeEffects.border && (
            <MagicalBorder
              variant="runes"
              glowColor={borderColor}
              animated={true}
              className="mt-8"
            >
              <div className="p-8 text-center">
                <h2 className="fantasy-heading text-2xl mb-2">Runes Border Example</h2>
                <p className="fantasy-body text-base">
                  This card uses the <b>Runes</b> border variant with a glowing <b>{borderColor}</b> effect.
                </p>
              </div>
            </MagicalBorder>
          )}
        </MagicalBorder>
        <div className="mt-12 max-w-3xl mx-auto">
          <h2 className="fantasy-heading text-2xl mb-4 text-center">Effect Descriptions</h2>
          <ul className="list-disc list-inside text-fantasy-parchment/80 text-base space-y-2">
            <li><b>Starfield:</b> Animated star background for a magical feel.</li>
            <li><b>Orbs:</b> Floating orbs for depth and fantasy ambiance.</li>
            <li><b>Gradient:</b> Animated background gradient for color and motion.</li>
            <li><b>Border:</b> Magical glowing borders for cards and panels.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VisualEffectsDemo;