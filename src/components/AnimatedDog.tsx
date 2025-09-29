import React, { useState, useEffect, useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Import the adorable dog GIFs
import dyingDogGif from 'figma:asset/5d5d9d3d5997bb74f9cafe1b291122b074b8d6b8.png';
import thrivingDogGif from 'figma:asset/af84844cebfb6e8d9ea6a58e7e011bde2100d9ce.png';
import healthyDogGif from 'figma:asset/3c896040bd2a120411a2e21e0a3012adeb66609c.png';
import sleepyDogGif from 'figma:asset/680fe01274ad9d9b9e643d4bee969953e9719d34.png';

interface AnimatedDogProps {
  mood: 'thriving' | 'healthy' | 'wilting' | 'dying';
  size: number;
  isHovered: boolean;
}

export function AnimatedDog({ mood, size, isHovered }: AnimatedDogProps) {
  const [animationKey, setAnimationKey] = useState(0);
  const [playCount, setPlayCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout>();

  // Estimated loop durations for each GIF (in milliseconds)
  const getLoopDuration = () => {
    switch (mood) {
      case 'thriving':
        return 1200; // Happy bouncy animation
      case 'healthy':
        return 1500; // Content breathing animation
      case 'wilting':
        return 1800; // Stressed movement
      case 'dying':
        return 2000; // Sleepy slow animation
      default:
        return 1500;
    }
  };

  const getDogImage = () => {
    switch (mood) {
      case 'thriving':
        return thrivingDogGif; // Happy dog with hearts
      case 'healthy':
        return healthyDogGif; // Content dog with heart
      case 'wilting':
        return dyingDogGif; // Stressed/frustrated dog
      case 'dying':
        return sleepyDogGif; // Sleepy dog needs attention
      default:
        return healthyDogGif;
    }
  };

  // Start animation cycle
  const startAnimation = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setIsPlaying(true);
    setPlayCount(0);
    setAnimationKey(prev => prev + 1); // Force re-render to restart GIF

    // Set timer to stop after 5 loops
    const loopDuration = getLoopDuration();
    timerRef.current = setTimeout(() => {
      setIsPlaying(false);
      setPlayCount(5);
    }, loopDuration * 5); // 5 loops
  };

  // Reset animation on mood change or component mount
  useEffect(() => {
    startAnimation();

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [mood]);

  // Start animation on hover
  useEffect(() => {
    if (isHovered && playCount >= 5) {
      startAnimation();
    }
  }, [isHovered]);

  return (
    <div
      className="animated-dog-container relative flex items-center justify-center transition-transform duration-200"
      style={{ 
        width: size, 
        height: size,
        transform: isHovered ? 'scale(1.05)' : 'scale(1)'
      }}
    >
      <ImageWithFallback
        key={`${mood}-${animationKey}`} // Force re-render to restart GIF
        src={getDogImage()}
        alt={`${mood} dog`}
        className="w-full h-full object-contain transition-opacity duration-300"
        style={{
          opacity: isPlaying ? 1 : 0.85,
          filter: !isPlaying ? 'brightness(0.95)' : 'brightness(1)'
        }}
      />
      
      {/* Subtle indicator when animation is paused */}
      {!isPlaying && (
        <div 
          className="absolute bottom-1 right-1 text-xs px-2 py-1 rounded-full opacity-60 transition-opacity duration-300"
          style={{ 
            backgroundColor: '#FAF5D7',
            color: '#6B7280',
            fontSize: `${Math.max(8, size * 0.08)}px`,
            opacity: isHovered ? 0 : 0.6
          }}
        >
          💤
        </div>
      )}

      {/* Hover indicator */}
      {isHovered && !isPlaying && (
        <div 
          className="absolute top-1 right-1 text-xs px-2 py-1 rounded-full transition-opacity duration-300"
          style={{ 
            backgroundColor: '#FFFBE6',
            color: '#2852E9',
            fontSize: `${Math.max(8, size * 0.08)}px`,
            border: '1px solid #F3E7B9'
          }}
        >
          ✨
        </div>
      )}
    </div>
  );
}