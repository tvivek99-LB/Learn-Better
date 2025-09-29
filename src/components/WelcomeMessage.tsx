import React from 'react';
import elephantIcon from 'figma:asset/6a6cf3248f5534ec8cbd485aa8e2c9106eadc475.png';

interface WelcomeMessageProps {
  userName?: string;
}

export function WelcomeMessage({ userName = "Alex" }: WelcomeMessageProps) {
  return (
    <div className="py-4 relative">
      {/* Subtle floating element */}
      <div className="absolute -top-4 right-2 w-20 h-20 bg-gradient-to-br from-blue-300/30 to-indigo-300/30 rounded-full opacity-60 blur-lg"></div>
      <div className="absolute top-8 right-12 w-1 h-1 bg-primary/40 rounded-full"></div>
      <div className="absolute top-12 right-8 w-0.5 h-0.5 bg-primary/30 rounded-full"></div>
      
      <div className="relative z-10 max-w-4xl">
        <h1 className="text-4xl text-primary">Hello, {userName}! Welcome back 👋</h1>
      </div>
    </div>
  );
}