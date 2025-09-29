import React from 'react';

interface ElephantIconProps {
  className?: string;
  size?: number;
}

export function ElephantIcon({ className = "", size = 48 }: ElephantIconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main body */}
      <ellipse 
        cx="32" 
        cy="45" 
        rx="18" 
        ry="14" 
        fill="currentColor" 
        opacity="0.85"
      />
      
      {/* Head */}
      <ellipse 
        cx="32" 
        cy="28" 
        rx="16" 
        ry="18" 
        fill="currentColor" 
        opacity="0.9"
      />
      
      {/* Left ear */}
      <path 
        d="M14 22C10 18 8 20 9 26C10 32 14 30 18 28C20 26 22 24 20 22C18 20 16 20 14 22Z" 
        fill="currentColor" 
        opacity="0.75"
      />
      
      {/* Right ear */}
      <path 
        d="M50 22C54 18 56 20 55 26C54 32 50 30 46 28C44 26 42 24 44 22C46 20 48 20 50 22Z" 
        fill="currentColor" 
        opacity="0.75"
      />
      
      {/* Trunk base */}
      <ellipse 
        cx="32" 
        cy="38" 
        rx="4" 
        ry="6" 
        fill="currentColor" 
        opacity="0.85"
      />
      
      {/* Trunk middle section */}
      <path 
        d="M28 44C28 44 26 48 24 52C22 56 20 58 18 56C16 54 18 50 22 48C26 46 28 44 28 44Z" 
        fill="currentColor" 
        opacity="0.8"
      />
      
      {/* Trunk tip */}
      <ellipse 
        cx="18" 
        cy="56" 
        rx="3" 
        ry="2" 
        fill="currentColor" 
        opacity="0.8"
      />
      
      {/* Small tusks */}
      <ellipse 
        cx="28" 
        cy="36" 
        rx="1" 
        ry="3" 
        fill="currentColor" 
        opacity="0.6"
      />
      <ellipse 
        cx="36" 
        cy="36" 
        rx="1" 
        ry="3" 
        fill="currentColor" 
        opacity="0.6"
      />
      
      {/* Eyes */}
      <circle 
        cx="26" 
        cy="24" 
        r="2.5" 
        fill="currentColor" 
        opacity="0.6"
      />
      <circle 
        cx="38" 
        cy="24" 
        r="2.5" 
        fill="currentColor" 
        opacity="0.6"
      />
      
      {/* Eye highlights */}
      <circle 
        cx="26.5" 
        cy="23.5" 
        r="0.8" 
        fill="currentColor" 
        opacity="0.3"
      />
      <circle 
        cx="38.5" 
        cy="23.5" 
        r="0.8" 
        fill="currentColor" 
        opacity="0.3"
      />
      
      {/* Forehead detail - wisdom wrinkle */}
      <path 
        d="M24 18C26 16 30 16 32 16C34 16 38 16 40 18" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        opacity="0.4" 
        fill="none"
      />
      
      {/* Legs */}
      <ellipse 
        cx="22" 
        cy="58" 
        rx="3" 
        ry="4" 
        fill="currentColor" 
        opacity="0.8"
      />
      <ellipse 
        cx="32" 
        cy="58" 
        rx="3" 
        ry="4" 
        fill="currentColor" 
        opacity="0.8"
      />
      <ellipse 
        cx="42" 
        cy="58" 
        rx="3" 
        ry="4" 
        fill="currentColor" 
        opacity="0.8"
      />
    </svg>
  );
}