import React from 'react';
import { RetentionExercise } from './RetentionExercise';

interface QuizPageProps {
  onExit: () => void;
  onComplete?: () => void;
}

export function QuizPage({ onExit, onComplete }: QuizPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <RetentionExercise onExit={onExit} onComplete={onComplete} />
      </div>
    </div>
  );
}