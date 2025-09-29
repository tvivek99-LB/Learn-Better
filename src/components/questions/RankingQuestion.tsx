import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { GripVertical, ArrowUp, ArrowDown, Check, X } from 'lucide-react';

interface RankingQuestionData {
  items: string[];
  correctRanking: string[];
  explanation?: string;
}

interface RankingQuestionProps {
  questionData: RankingQuestionData;
  onAnswer: (answer: { userRanking: string[]; isCorrect: boolean }) => void;
}

export function RankingQuestion({ questionData, onAnswer }: RankingQuestionProps) {
  const [items, setItems] = useState<string[]>([...questionData.items]);
  const [showResult, setShowResult] = useState(false);
  const [userRanking, setUserRanking] = useState<string[]>([]);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (showResult) return;
    
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newItems.length) {
      [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
      setItems(newItems);
    }
  };

  const handleSubmit = () => {
    const currentRanking = [...items];
    const isCorrect = JSON.stringify(currentRanking) === JSON.stringify(questionData.correctRanking);
    
    setUserRanking(currentRanking);
    setShowResult(true);
    onAnswer({ userRanking: currentRanking, isCorrect });
  };

  const getItemStatus = (item: string, currentIndex: number) => {
    if (!showResult) return 'neutral';
    
    const correctIndex = questionData.correctRanking.indexOf(item);
    if (currentIndex === correctIndex) return 'correct';
    return 'incorrect';
  };

  const getItemScore = (item: string, currentIndex: number) => {
    if (!showResult) return null;
    
    const correctIndex = questionData.correctRanking.indexOf(item);
    const positionDifference = Math.abs(currentIndex - correctIndex);
    
    if (positionDifference === 0) return 'perfect';
    if (positionDifference === 1) return 'close';
    return 'far';
  };

  const isCorrectRanking = showResult && userRanking.length > 0 && 
    JSON.stringify(userRanking) === JSON.stringify(questionData.correctRanking);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg mb-2">Rank in Order</h3>
        <p className="text-muted-foreground">
          Arrange these items from most effective to least effective
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => {
          const status = getItemStatus(item, index);
          const score = getItemScore(item, index);
          const correctPosition = questionData.correctRanking.indexOf(item) + 1;
          
          return (
            <Card
              key={`${item}-${index}`}
              className={`p-4 transition-all duration-200 ${
                showResult
                  ? status === 'correct'
                    ? 'bg-green-50 border-green-200'
                    : score === 'close'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-red-50 border-red-200'
                  : 'hover:shadow-md'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex flex-col items-center space-y-1">
                  <Badge variant={showResult && status === 'correct' ? 'default' : 'secondary'}>
                    #{index + 1}
                  </Badge>
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
                  <p className="text-sm">{item}</p>
                </div>
                
                {!showResult && (
                  <div className="flex flex-col space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === items.length - 1}
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
          isCorrectRanking 
            ? 'bg-green-50 border-green-200' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <h4 className={`font-medium mb-2 ${
            isCorrectRanking ? 'text-green-900' : 'text-blue-900'
          }`}>
            {isCorrectRanking ? 'Perfect Ranking!' : 'Ranking Complete'}
          </h4>
          {questionData.explanation && (
            <p className={`text-sm ${
              isCorrectRanking ? 'text-green-800' : 'text-blue-800'
            }`}>
              {questionData.explanation}
            </p>
          )}
          
          {!isCorrectRanking && (
            <div className="mt-3">
              <h5 className="text-sm font-medium text-blue-900 mb-2">Correct Order:</h5>
              <div className="flex flex-wrap gap-2">
                {questionData.correctRanking.map((item, index) => (
                  <Badge key={item} variant="outline" className="text-xs">
                    #{index + 1} {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!showResult && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Use arrow buttons to reorder from most to least effective
          </p>
          <Button onClick={handleSubmit}>
            Submit Ranking
          </Button>
        </div>
      )}
    </div>
  );
}