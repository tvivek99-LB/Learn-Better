import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { GripVertical, ArrowUp, ArrowDown, Check, X } from 'lucide-react';

interface ReorderingStepsQuestionData {
  steps: string[];
  correctOrder: string[];
  explanation?: string;
}

interface ReorderingStepsQuestionProps {
  questionData: ReorderingStepsQuestionData;
  onAnswer: (answer: { userOrder: string[]; isCorrect: boolean }) => void;
}

export function ReorderingStepsQuestion({ questionData, onAnswer }: ReorderingStepsQuestionProps) {
  const [steps, setSteps] = useState<string[]>([...questionData.steps]);
  const [showResult, setShowResult] = useState(false);
  const [userOrder, setUserOrder] = useState<string[]>([]);

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (showResult) return;
    
    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newSteps.length) {
      [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
      setSteps(newSteps);
    }
  };

  const handleSubmit = () => {
    const currentOrder = [...steps];
    const isCorrect = JSON.stringify(currentOrder) === JSON.stringify(questionData.correctOrder);
    
    setUserOrder(currentOrder);
    setShowResult(true);
    onAnswer({ userOrder: currentOrder, isCorrect });
  };

  const getStepStatus = (step: string, currentIndex: number) => {
    if (!showResult) return 'neutral';
    
    const correctIndex = questionData.correctOrder.indexOf(step);
    if (currentIndex === correctIndex) return 'correct';
    return 'incorrect';
  };

  const isCorrectOrder = showResult && userOrder.length > 0 && 
    JSON.stringify(userOrder) === JSON.stringify(questionData.correctOrder);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg mb-2">Arrange in Correct Order</h3>
        <p className="text-muted-foreground">
          Reorder these steps into the correct sequence
        </p>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const status = getStepStatus(step, index);
          const correctPosition = questionData.correctOrder.indexOf(step) + 1;
          
          return (
            <Card
              key={`${step}-${index}`}
              className={`p-4 transition-all duration-200 ${
                showResult
                  ? status === 'correct'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                  : 'hover:shadow-md'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex flex-col space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    Step {index + 1}
                  </span>
                  {showResult && (
                    <div className="flex items-center space-x-1">
                      {status === 'correct' ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <X className="w-3 h-3 text-red-600" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        Should be #{correctPosition}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <p className="text-sm">{step}</p>
                </div>
                
                {!showResult && (
                  <div className="flex flex-col space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveStep(index, 'up')}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveStep(index, 'down')}
                      disabled={index === steps.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                  </div>
                )}
                
                {!showResult && (
                  <div className="flex items-center text-muted-foreground">
                    <GripVertical className="w-4 h-4" />
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {showResult && (
        <div className={`p-4 rounded-lg border ${
          isCorrectOrder 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <h4 className={`font-medium mb-2 ${
            isCorrectOrder ? 'text-green-900' : 'text-red-900'
          }`}>
            {isCorrectOrder ? 'Correct!' : 'Not quite right'}
          </h4>
          {questionData.explanation && (
            <p className={`text-sm ${
              isCorrectOrder ? 'text-green-800' : 'text-red-800'
            }`}>
              {questionData.explanation}
            </p>
          )}
        </div>
      )}

      {!showResult && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Use the arrow buttons to reorder the steps
          </p>
          <Button onClick={handleSubmit}>
            Submit Order
          </Button>
        </div>
      )}
    </div>
  );
}