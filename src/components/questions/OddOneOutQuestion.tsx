import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Check, X } from 'lucide-react';

interface OddOneOutQuestionData {
  items: string[];
  oddOne: string;
  explanation?: string;
}

interface OddOneOutQuestionProps {
  questionData: OddOneOutQuestionData;
  onAnswer: (answer: { selectedItem: string; isCorrect: boolean }) => void;
}

export function OddOneOutQuestion({ questionData, onAnswer }: OddOneOutQuestionProps) {
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [showResult, setShowResult] = useState(false);

  const handleSelection = (item: string) => {
    if (showResult) return;
    setSelectedItem(item);
  };

  const handleSubmit = () => {
    if (!selectedItem) return;
    
    const isCorrect = selectedItem === questionData.oddOne;
    
    setShowResult(true);
    onAnswer({ selectedItem, isCorrect });
  };

  const getItemStatus = (item: string) => {
    if (!showResult) return null;
    if (item === questionData.oddOne) return 'correct';
    if (item === selectedItem && item !== questionData.oddOne) return 'incorrect';
    return 'neutral';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg mb-2">Identify the Odd One Out</h3>
        <p className="text-muted-foreground">
          Which item doesn't belong with the others?
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {questionData.items.map((item, index) => {
          const status = getItemStatus(item);
          const isSelected = selectedItem === item;
          
          return (
            <Card
              key={`${item}-${index}`}
              className={`p-4 cursor-pointer transition-all duration-200 relative ${
                isSelected && !showResult
                  ? 'ring-2 ring-primary shadow-md'
                  : showResult
                  ? status === 'correct'
                    ? 'ring-2 ring-green-500 bg-green-50 border-green-200'
                    : status === 'incorrect'
                    ? 'ring-2 ring-red-500 bg-red-50 border-red-200'
                    : 'opacity-70'
                  : 'hover:shadow-md hover:border-gray-300'
              }`}
              onClick={() => handleSelection(item)}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">{item}</span>
                
                {showResult && (
                  <div className="ml-3 flex-shrink-0">
                    {status === 'correct' && (
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    {status === 'incorrect' && (
                      <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                        <X className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {!showResult && isSelected && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary"></div>
              )}
            </Card>
          );
        })}
      </div>

      {showResult && questionData.explanation && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Explanation</h4>
          <p className="text-blue-800 text-sm">{questionData.explanation}</p>
        </div>
      )}

      {!showResult && (
        <Button 
          onClick={handleSubmit}
          disabled={!selectedItem}
          className="w-full sm:w-auto"
        >
          Submit Answer
        </Button>
      )}
    </div>
  );
}