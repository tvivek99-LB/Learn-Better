import React from 'react';
import { QuizStartCard } from './QuizStartCard';

interface WelcomeSectionProps {
  onStartRetentionExercise: () => void;
}

export function WelcomeSection({ onStartRetentionExercise }: WelcomeSectionProps) {
  return (
    <div>
      {/* Primary Retention Exercise CTA */}
      <QuizStartCard onStartQuiz={onStartRetentionExercise} />
    </div>
  );
}