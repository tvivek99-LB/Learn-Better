import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface FillInBlankQuestionProps {
  questionData: {
    text: string;
    blanks: string[];
    explanation: string;
  };
  onAnswer: (answer: string[]) => void;
  currentAnswer?: string[];
}

export function FillInBlankQuestion({ questionData, onAnswer, currentAnswer }: FillInBlankQuestionProps) {
  const [answers, setAnswers] = useState<string[]>(currentAnswer || Array(questionData.blanks.length).fill(''));
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (currentAnswer) {
      setAnswers(currentAnswer);
    }
  }, [currentAnswer]);

  const handleInputChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    onAnswer(newAnswers);
  };

  const checkAnswer = () => {
    setShowFeedback(true);
  };

  const renderTextWithBlanks = () => {
    const parts = questionData.text.split('_______');
    const result = [];
    
    for (let i = 0; i < parts.length; i++) {
      result.push(<span key={`text-${i}`}>{parts[i]}</span>);
      
      if (i < parts.length - 1) {
        const isCorrect = showFeedback && answers[i].toLowerCase().trim() === questionData.blanks[i].toLowerCase().trim();
        const hasAnswer = answers[i].trim() !== '';
        
        result.push(
          <Input
            key={`blank-${i}`}
            value={answers[i]}
            onChange={(e) => handleInputChange(i, e.target.value)}
            className={`inline-block w-40 mx-1 text-center ${
              showFeedback 
                ? isCorrect 
                  ? 'border-green-500 bg-green-50' 
                  : hasAnswer 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-yellow-500 bg-yellow-50'
                : ''
            }`}
            placeholder={`Blank ${i + 1}`}
          />
        );
      }
    }
    
    return result;
  };

  return (
    <div className="space-y-6">
      <div className="text-lg leading-relaxed">
        {renderTextWithBlanks()}
      </div>
      
      <div className="flex justify-center">
        <Button onClick={checkAnswer} variant="outline">
          Check Answer
        </Button>
      </div>
      
      {showFeedback && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium mb-2">Correct Answers:</h4>
          <ul className="list-disc list-inside space-y-1 mb-3">
            {questionData.blanks.map((blank, index) => (
              <li key={index} className="text-sm">
                Blank {index + 1}: <strong>{blank}</strong>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">{questionData.explanation}</p>
        </div>
      )}
    </div>
  );
}