import React, { useState, useEffect, useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Import the beautiful plant images
import thrivingPlantImg from 'figma:asset/21f3fa5b67f4b25ccfa710361389d67902687a93.png';
import healthyPlantImg from 'figma:asset/7c96ebb87c27c13b4f301d4229b69371c63c5a87.png';
import wiltingPlantImg from 'figma:asset/9c8a01a248607371afd34953da476d740ae00624.png';
import needsAttentionPlantImg from 'figma:asset/9fd2c414f4fb9060867182bd17cf1168a7326524.png';

interface AnimatedPlantProps {
  mood: 'thriving' | 'healthy' | 'wilting' | 'dying' | 'needs-attention';
  size: number;
  isHovered: boolean;
}

export function AnimatedPlant({ mood, size, isHovered }: AnimatedPlantProps) {
  const [animationKey, setAnimationKey] = useState(0);
  const [playCount, setPlayCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout>();

  // Estimated loop durations for each plant animation (in milliseconds)
  const getLoopDuration = () => {
    switch (mood) {
      case 'thriving':
        return 1200; // Vibrant growing animation
      case 'healthy':
        return 1500; // Gentle swaying animation
      case 'wilting':
        return 1800; // Slow drooping movement
      case 'dying':
        return 2000; // Very slow, barely moving
      case 'needs-attention':
        return 1600; // Moderate attention-seeking movement
      default:
        return 1500;
    }
  };

  const getPlantImage = () => {
    switch (mood) {
      case 'thriving':
        return thrivingPlantImg; // Lush multiple plants
      case 'healthy':
        return healthyPlantImg; // Flowering plant
      case 'wilting':
      case 'dying':
        return wiltingPlantImg; // Dying plant with brown leaves
      case 'needs-attention':
        return needsAttentionPlantImg; // Small sprouts needing care
      default:
        return healthyPlantImg;
    }
  };

  // Start animation cycle
  const startAnimation = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setIsPlaying(true);
    setPlayCount(0);
    setAnimationKey(prev => prev + 1); // Force re-render to restart animation

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
      className="animated-plant-container relative flex items-center justify-center transition-transform duration-200"
      style={{ 
        width: size, 
        height: size,
        transform: isHovered ? 'scale(1.05)' : 'scale(1)'
      }}
    >
      <ImageWithFallback
        key={`${mood}-${animationKey}`} // Force re-render to restart animation
        src={getPlantImage()}
        alt={`${mood} plant`}
        className={`w-full h-full object-contain transition-opacity duration-300 ${
          mood === 'needs-attention' ? 'plant-image-white-bg' : 'plant-image'
        }`}
        style={{
          opacity: isPlaying ? 1 : 0.85,
          filter: !isPlaying ? 'brightness(0.95) saturate(0.9)' : 'brightness(1) saturate(1)'
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
          🌿
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
          🌱
        </div>
      )}
    </div>
  );
}