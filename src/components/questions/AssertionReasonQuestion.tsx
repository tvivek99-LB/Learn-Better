import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface AssertionReasonQuestionProps {
  questionData: {
    assertion: string;
    reason: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
  onAnswer: (answer: number) => void;
  currentAnswer?: number;
}

export function AssertionReasonQuestion({ questionData, onAnswer, currentAnswer }: AssertionReasonQuestionProps) {
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

  const isCorrect = selectedAnswer === questionData.correctAnswer.toString();

  return (
    <div className="space-y-6">
      {/* Assertion */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
            <span className="text-2xl">A</span>
            Assertion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-800 leading-relaxed">{questionData.assertion}</p>
        </CardContent>
      </Card>

      {/* Reason */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-green-900 flex items-center gap-2">
            <span className="text-2xl">R</span>
            Reason
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-800 leading-relaxed">{questionData.reason}</p>
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="bg-muted rounded-lg p-4">
        <h4 className="font-medium mb-2">Instructions:</h4>
        <p className="text-sm text-muted-foreground">
          Consider both the assertion and reason above, then select the option that best describes their relationship.
        </p>
      </div>

      {/* Answer Options */}
      <div>
        <h4 className="font-medium mb-4">Select your answer:</h4>
        <RadioGroup value={selectedAnswer} onValueChange={handleAnswerChange}>
          <div className="space-y-3">
            {questionData.options.map((option, index) => (
              <div 
                key={index} 
                className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                  showFeedback && selectedAnswer === index.toString()
                    ? isCorrect
                      ? 'bg-green-100 border-green-500'
                      : 'bg-red-100 border-red-500'
                    : 'hover:bg-accent'
                }`}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} className="mt-1" />
                <Label 
                  htmlFor={`option-${index}`} 
                  className="cursor-pointer leading-relaxed flex-1"
                >
                  <span className="font-medium mr-2">({String.fromCharCode(65 + index)})</span>
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      <div className="flex justify-center">
        <Button onClick={checkAnswer} variant="outline">
          Check Answer
        </Button>
      </div>

      {showFeedback && (
        <div className={`rounded-lg p-4 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{isCorrect ? '✅' : '❌'}</span>
            <h4 className="font-medium">
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </h4>
          </div>
          
          <div className="mb-3">
            <p className="text-sm font-medium mb-1">Correct Answer:</p>
            <p className="text-sm">
              <span className="font-medium">({String.fromCharCode(65 + questionData.correctAnswer)})</span> {questionData.options[questionData.correctAnswer]}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">Explanation:</p>
            <p className="text-sm text-muted-foreground">{questionData.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}