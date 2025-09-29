import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

interface ExtendedMatchingQuestionProps {
  questionData: {
    categories: Array<{ id: string; label: string }>;
    items: Array<{ id: string; text: string }>;
    matches: Record<string, string>;
    explanation: string;
  };
  onAnswer: (answer: Record<string, string>) => void;
  currentAnswer?: Record<string, string>;
}

export function ExtendedMatchingQuestion({ questionData, onAnswer, currentAnswer }: ExtendedMatchingQuestionProps) {
  const [matches, setMatches] = useState<Record<string, string>>(currentAnswer || {});
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (currentAnswer) {
      setMatches(currentAnswer);
    }
  }, [currentAnswer]);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    if (draggedItem) {
      const newMatches = { ...matches };
      
      // Remove item from previous category if it exists
      Object.keys(newMatches).forEach(key => {
        if (newMatches[key] === draggedItem) {
          delete newMatches[key];
        }
      });
      
      // Add to new category
      newMatches[draggedItem] = categoryId;
      
      setMatches(newMatches);
      onAnswer(newMatches);
      setDraggedItem(null);
    }
  };

  const handleItemClick = (itemId: string, categoryId: string) => {
    const newMatches = { ...matches };
    
    // Remove item from previous category if it exists
    Object.keys(newMatches).forEach(key => {
      if (newMatches[key] === itemId) {
        delete newMatches[key];
      }
    });
    
    // Toggle: if item was already in this category, remove it; otherwise add it
    if (matches[itemId] === categoryId) {
      delete newMatches[itemId];
    } else {
      newMatches[itemId] = categoryId;
    }
    
    setMatches(newMatches);
    onAnswer(newMatches);
  };

  const removeItemFromCategory = (itemId: string) => {
    const newMatches = { ...matches };
    delete newMatches[itemId];
    setMatches(newMatches);
    onAnswer(newMatches);
  };

  const checkAnswer = () => {
    setShowFeedback(true);
  };

  const getUnmatchedItems = () => {
    return questionData.items.filter(item => !matches[item.id]);
  };

  const getItemsForCategory = (categoryId: string) => {
    return questionData.items.filter(item => matches[item.id] === categoryId);
  };

  const isCorrect = (itemId: string) => {
    return matches[itemId] === questionData.matches[itemId];
  };

  return (
    <div className="space-y-6">
      <div className="text-lg">
        Drag items to their correct categories, or click an item then click a category to match them.
      </div>

      {/* Unmatched Items */}
      <div>
        <h4 className="font-medium mb-3">Items to Match</h4>
        <div className="flex flex-wrap gap-2 min-h-[60px] p-3 border-2 border-dashed border-muted rounded-lg">
          {getUnmatchedItems().map(item => (
            <Badge
              key={item.id}
              variant="outline"
              className="cursor-move px-3 py-2 hover:bg-accent transition-colors"
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
            >
              {item.text}
            </Badge>
          ))}
          {getUnmatchedItems().length === 0 && (
            <p className="text-muted-foreground text-sm">All items have been matched</p>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {questionData.categories.map(category => (
          <Card
            key={category.id}
            className="transition-colors hover:bg-accent/50"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, category.id)}
          >
            <CardContent className="p-4">
              <h4 className="font-medium mb-3 text-center">{category.label}</h4>
              <div className="space-y-2 min-h-[100px]">
                {getItemsForCategory(category.id).map(item => (
                  <div
                    key={item.id}
                    className={`p-2 rounded border text-sm cursor-pointer ${
                      showFeedback
                        ? isCorrect(item.id)
                          ? 'bg-green-100 border-green-500 text-green-700'
                          : 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-muted border-border hover:bg-accent'
                    }`}
                    onClick={() => removeItemFromCategory(item.id)}
                    title="Click to remove from category"
                  >
                    {item.text}
                  </div>
                ))}
                {getItemsForCategory(category.id).length === 0 && (
                  <div className="text-muted-foreground text-sm text-center py-4">
                    Drop items here
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Match Buttons */}
      <div className="space-y-3">
        <h4 className="font-medium">Quick Match</h4>
        <div className="grid grid-cols-3 gap-2">
          {questionData.categories.map(category => (
            <Button
              key={category.id}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                const unmatchedItems = getUnmatchedItems();
                if (unmatchedItems.length > 0) {
                  handleItemClick(unmatchedItems[0].id, category.id);
                }
              }}
              disabled={getUnmatchedItems().length === 0}
            >
              → {category.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={checkAnswer} variant="outline">
          Check Answer
        </Button>
      </div>

      {showFeedback && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium mb-2">Correct Matches:</h4>
          <div className="space-y-2 mb-3">
            {questionData.items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.text}</span>
                <span className="font-medium">
                  {questionData.categories.find(cat => cat.id === questionData.matches[item.id])?.label}
                </span>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{questionData.explanation}</p>
        </div>
      )}
    </div>
  );
}