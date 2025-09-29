import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';

interface DropdownClozeQuestionProps {
  questionData: {
    text: string;
    dropdowns: Array<{ options: string[] }>;
    correctAnswers: string[];
    explanation: string;
  };
  onAnswer: (answer: string[]) => void;
  currentAnswer?: string[];
}

export function DropdownClozeQuestion({ questionData, onAnswer, currentAnswer }: DropdownClozeQuestionProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>(currentAnswer || Array(questionData.dropdowns.length).fill(''));
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (currentAnswer) {
      setSelectedValues(currentAnswer);
    }
  }, [currentAnswer]);

  const handleSelectionChange = (index: number, value: string) => {
    const newValues = [...selectedValues];
    newValues[index] = value;
    setSelectedValues(newValues);
    onAnswer(newValues);
  };

  const checkAnswer = () => {
    setShowFeedback(true);
  };

  const renderTextWithDropdowns = () => {
    const parts = questionData.text.split('_______');
    const result = [];
    
    for (let i = 0; i < parts.length; i++) {
      result.push(<span key={`text-${i}`}>{parts[i]}</span>);
      
      if (i < parts.length - 1 && i < questionData.dropdowns.length) {
        const isCorrect = showFeedback && selectedValues[i] === questionData.correctAnswers[i];
        const hasAnswer = selectedValues[i] !== '';
        
        result.push(
          <Select
            key={`dropdown-${i}`}
            value={selectedValues[i]}
            onValueChange={(value) => handleSelectionChange(i, value)}
          >
            <SelectTrigger 
              className={`inline-flex w-40 mx-1 ${
                showFeedback 
                  ? isCorrect 
                    ? 'border-green-500 bg-green-50' 
                    : hasAnswer 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-yellow-500 bg-yellow-50'
                  : ''
              }`}
            >
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {questionData.dropdowns[i].options.map((option, optionIndex) => (
                <SelectItem key={optionIndex} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
    }
    
    return result;
  };

  return (
    <div className="space-y-6">
      <div className="text-lg leading-relaxed">
        {renderTextWithDropdowns()}
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
            {questionData.correctAnswers.map((answer, index) => (
              <li key={index} className="text-sm">
                Dropdown {index + 1}: <strong>{answer}</strong>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">{questionData.explanation}</p>
        </div>
      )}
    </div>
  );
}