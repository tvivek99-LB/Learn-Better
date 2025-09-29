import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

interface TrueFalseQuestionProps {
  questionData: {
    statements: Array<{ statement: string; correct: boolean }>;
    explanation: string;
  };
  onAnswer: (answer: boolean[]) => void;
  currentAnswer?: boolean[];
}

export function TrueFalseQuestion({ questionData, onAnswer, currentAnswer }: TrueFalseQuestionProps) {
  const [answers, setAnswers] = useState<(boolean | null)[]>(
    currentAnswer || Array(questionData.statements.length).fill(null)
  );
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (currentAnswer) {
      setAnswers(currentAnswer);
    }
  }, [currentAnswer]);

  const handleAnswerChange = (statementIndex: number, value: boolean) => {
    const newAnswers = [...answers];
    newAnswers[statementIndex] = value;
    setAnswers(newAnswers);
    onAnswer(newAnswers.filter(a => a !== null) as boolean[]);
  };

  const checkAnswer = () => {
    setShowFeedback(true);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {questionData.statements.map((item, index) => {
          const userAnswer = answers[index];
          const isCorrect = userAnswer === item.correct;
          const showResult = showFeedback && userAnswer !== null;
          
          return (
            <div 
              key={index}
              className={`p-4 rounded-lg border ${
                showResult
                  ? isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-border'
              }`}
            >
              <p className="mb-3">{item.statement}</p>
              <RadioGroup 
                value={userAnswer?.toString() || ''} 
                onValueChange={(value) => handleAnswerChange(index, value === 'true')}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id={`true-${index}`} />
                  <Label htmlFor={`true-${index}`}>True</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id={`false-${index}`} />
                  <Label htmlFor={`false-${index}`}>False</Label>
                </div>
              </RadioGroup>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-center">
        <Button onClick={checkAnswer} variant="outline" disabled={answers.some(a => a === null)}>
          Check Answers
        </Button>
      </div>
      
      {showFeedback && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium mb-2">Correct Answers:</h4>
          <ul className="list-disc list-inside space-y-1 mb-3">
            {questionData.statements.map((item, index) => (
              <li key={index} className="text-sm">
                Statement {index + 1}: <strong>{item.correct ? 'True' : 'False'}</strong>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">{questionData.explanation}</p>
        </div>
      )}
    </div>
  );
}