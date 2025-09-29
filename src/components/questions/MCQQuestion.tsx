import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

interface MCQQuestionProps {
  questionData: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
  onAnswer: (answer: number) => void;
  currentAnswer?: number;
}

export function MCQQuestion({ questionData, onAnswer, currentAnswer }: MCQQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>(currentAnswer?.toString() || '');
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (currentAnswer !== undefined) {
      setSelectedAnswer(currentAnswer.toString());
    }
  }, [currentAnswer]);

  const handleAnswerChange = (value: string) => {
    setSelectedAnswer(value);
    onAnswer(parseInt(value));
  };

  const checkAnswer = () => {
    setShowFeedback(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-lg mb-6">
        {questionData.question}
      </div>
      
      <RadioGroup value={selectedAnswer} onValueChange={handleAnswerChange}>
        {questionData.options.map((option, index) => {
          const isSelected = selectedAnswer === index.toString();
          const isCorrect = index === questionData.correctAnswer;
          const showResult = showFeedback && isSelected;
          
          return (
            <div 
              key={index} 
              className={`flex items-start space-x-3 p-3 rounded-lg border ${
                showResult
                  ? isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
              }`}
            >
              <RadioGroupItem value={index.toString()} id={`option-${index}`} className="mt-1" />
              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                <span className="font-medium text-sm text-muted-foreground mr-2">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
      
      <div className="flex justify-center">
        <Button onClick={checkAnswer} variant="outline" disabled={!selectedAnswer}>
          Check Answer
        </Button>
      </div>
      
      {showFeedback && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium mb-2">
            {parseInt(selectedAnswer) === questionData.correctAnswer ? '✅ Correct!' : '❌ Incorrect'}
          </h4>
          <p className="text-sm mb-2">
            <strong>Correct Answer:</strong> {String.fromCharCode(65 + questionData.correctAnswer)}. {questionData.options[questionData.correctAnswer]}
          </p>
          <p className="text-sm text-muted-foreground">{questionData.explanation}</p>
        </div>
      )}
    </div>
  );
}