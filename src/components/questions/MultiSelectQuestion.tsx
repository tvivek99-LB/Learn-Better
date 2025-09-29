import React, { useState, useEffect } from 'react';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

interface MultiSelectQuestionProps {
  questionData: {
    question: string;
    options: string[];
    correctAnswers: number[];
    explanation: string;
  };
  onAnswer: (answer: number[]) => void;
  currentAnswer?: number[];
}

export function MultiSelectQuestion({ questionData, onAnswer, currentAnswer }: MultiSelectQuestionProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(currentAnswer || []);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (currentAnswer) {
      setSelectedAnswers(currentAnswer);
    }
  }, [currentAnswer]);

  const handleAnswerChange = (optionIndex: number, checked: boolean) => {
    let newSelectedAnswers;
    if (checked) {
      newSelectedAnswers = [...selectedAnswers, optionIndex].sort((a, b) => a - b);
    } else {
      newSelectedAnswers = selectedAnswers.filter(index => index !== optionIndex);
    }
    setSelectedAnswers(newSelectedAnswers);
    onAnswer(newSelectedAnswers);
  };

  const checkAnswer = () => {
    setShowFeedback(true);
  };

  const isAnswerCorrect = () => {
    if (selectedAnswers.length !== questionData.correctAnswers.length) return false;
    return selectedAnswers.every(answer => questionData.correctAnswers.includes(answer));
  };

  return (
    <div className="space-y-6">
      <div className="text-lg mb-6">
        {questionData.question}
      </div>
      
      <div className="space-y-3">
        {questionData.options.map((option, index) => {
          const isSelected = selectedAnswers.includes(index);
          const isCorrect = questionData.correctAnswers.includes(index);
          const shouldBeSelected = showFeedback && isCorrect;
          const isWrong = showFeedback && isSelected && !isCorrect;
          const isMissed = showFeedback && !isSelected && isCorrect;
          
          return (
            <div 
              key={index} 
              className={`flex items-start space-x-3 p-3 rounded-lg border ${
                isWrong
                  ? 'border-red-500 bg-red-50'
                  : shouldBeSelected
                    ? 'border-green-500 bg-green-50'
                    : isMissed
                      ? 'border-yellow-500 bg-yellow-50'
                      : isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
              }`}
            >
              <Checkbox 
                id={`option-${index}`}
                checked={isSelected}
                onCheckedChange={(checked) => handleAnswerChange(index, checked as boolean)}
                className="mt-1"
              />
              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                <span className="font-medium text-sm text-muted-foreground mr-2">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
                {showFeedback && isCorrect && (
                  <span className="ml-2 text-green-600 text-sm">✓</span>
                )}
              </Label>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-center">
        <Button onClick={checkAnswer} variant="outline" disabled={selectedAnswers.length === 0}>
          Check Answer
        </Button>
      </div>
      
      {showFeedback && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium mb-2">
            {isAnswerCorrect() ? '✅ Correct!' : '❌ Incorrect'}
          </h4>
          <p className="text-sm mb-2">
            <strong>Correct Answers:</strong> {questionData.correctAnswers.map(index => 
              `${String.fromCharCode(65 + index)}. ${questionData.options[index]}`
            ).join(', ')}
          </p>
          <p className="text-sm text-muted-foreground">{questionData.explanation}</p>
        </div>
      )}
    </div>
  );
}