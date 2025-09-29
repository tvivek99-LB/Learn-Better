import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface CategoryBucketingQuestionProps {
  questionData: {
    items: string[];
    categories: string[];
    correctBuckets: Record<string, string>;
    explanation: string;
  };
  onAnswer: (answer: Record<string, string>) => void;
  currentAnswer?: Record<string, string>;
}

export function CategoryBucketingQuestion({ questionData, onAnswer, currentAnswer }: CategoryBucketingQuestionProps) {
  const [buckets, setBuckets] = useState<Record<string, string>>(currentAnswer || {});
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Convert arrays to objects for easier handling
  const items = questionData.items.map(item => ({ id: item, text: item }));
  const categories = questionData.categories.map((category, index) => ({ 
    id: category, 
    name: category, 
    description: `Items belonging to ${category}`,
    color: ['blue', 'green', 'purple', 'orange', 'red', 'yellow'][index % 6]
  }));

  useEffect(() => {
    if (currentAnswer) {
      setBuckets(currentAnswer);
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
      const newBuckets = { ...buckets };
      
      // Remove item from previous bucket if it exists
      Object.keys(newBuckets).forEach(key => {
        if (newBuckets[key] === draggedItem) {
          delete newBuckets[key];
        }
      });
      
      // Add to new bucket
      newBuckets[draggedItem] = categoryId;
      
      setBuckets(newBuckets);
      onAnswer(newBuckets);
      setDraggedItem(null);
    }
  };

  const handleItemClick = (itemId: string) => {
    if (selectedItem === itemId) {
      setSelectedItem(null);
    } else {
      setSelectedItem(itemId);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    if (selectedItem) {
      const newBuckets = { ...buckets };
      
      // Remove item from previous bucket if it exists
      Object.keys(newBuckets).forEach(key => {
        if (newBuckets[key] === selectedItem) {
          delete newBuckets[key];
        }
      });
      
      // Toggle: if item was already in this category, remove it; otherwise add it
      if (buckets[selectedItem] === categoryId) {
        delete newBuckets[selectedItem];
      } else {
        newBuckets[selectedItem] = categoryId;
      }
      
      setBuckets(newBuckets);
      onAnswer(newBuckets);
      setSelectedItem(null);
    }
  };

  const removeItemFromBucket = (itemId: string) => {
    const newBuckets = { ...buckets };
    delete newBuckets[itemId];
    setBuckets(newBuckets);
    onAnswer(newBuckets);
  };

  const getUnbucketedItems = () => {
    return items.filter(item => !buckets[item.id]);
  };

  const getItemsInCategory = (categoryId: string) => {
    return items.filter(item => buckets[item.id] === categoryId);
  };

  const isCorrect = (itemId: string) => {
    return buckets[itemId] === questionData.correctBuckets[itemId];
  };

  const getCategoryColor = (category: any) => {
    return category.color || 'blue';
  };

  const getBorderColor = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'border-blue-500',
      green: 'border-green-500',
      purple: 'border-purple-500',
      orange: 'border-orange-500',
      red: 'border-red-500',
      yellow: 'border-yellow-500',
    };
    return colorMap[color] || 'border-blue-500';
  };

  const getBgColor = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-50',
      green: 'bg-green-50',
      purple: 'bg-purple-50',
      orange: 'bg-orange-50',
      red: 'bg-red-50',
      yellow: 'bg-yellow-50',
    };
    return colorMap[color] || 'bg-blue-50';
  };

  const checkAnswer = () => {
    setShowFeedback(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-lg">
        Sort the items into the correct categories. You can drag and drop items, or click an item then click a category.
      </div>

      {/* Unbucketed Items */}
      <div>
        <h4 className="font-medium mb-3 flex items-center gap-2">
          Items to Sort
          <Badge variant="outline">{getUnbucketedItems().length} remaining</Badge>
        </h4>
        <div className="flex flex-wrap gap-2 min-h-[80px] p-4 border-2 border-dashed border-muted rounded-lg">
          {getUnbucketedItems().map(item => (
            <div
              key={item.id}
              className={`px-3 py-2 rounded-lg border cursor-move transition-all ${
                selectedItem === item.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-background hover:bg-accent'
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              onClick={() => handleItemClick(item.id)}
              title={item.description || item.text}
            >
              <div className="text-sm font-medium">{item.text}</div>
              {item.description && (
                <div className="text-xs text-muted-foreground mt-1">{item.description}</div>
              )}
            </div>
          ))}
          {getUnbucketedItems().length === 0 && (
            <p className="text-muted-foreground text-sm">All items have been sorted</p>
          )}
        </div>
      </div>

      {/* Category Buckets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => {
          const categoryItems = getItemsInCategory(category.id);
          const color = getCategoryColor(category);
          
          return (
            <Card
              key={category.id}
              className={`transition-all cursor-pointer hover:shadow-md ${getBorderColor(color)}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, category.id)}
              onClick={() => handleCategoryClick(category.id)}
            >
              <CardHeader className={`pb-3 ${getBgColor(color)}`}>
                <CardTitle className="text-lg flex items-center justify-between">
                  {category.name}
                  <Badge variant="secondary">
                    {categoryItems.length}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardHeader>
              <CardContent className="space-y-2 min-h-[120px]">
                {categoryItems.map(item => (
                  <div
                    key={item.id}
                    className={`p-2 rounded border text-sm cursor-pointer transition-all ${
                      showFeedback
                        ? isCorrect(item.id)
                          ? 'bg-green-100 border-green-500 text-green-700'
                          : 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-muted border-border hover:bg-accent'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItemFromBucket(item.id);
                    }}
                    title="Click to remove from category"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{item.text}</div>
                        {item.description && (
                          <div className="text-xs text-muted-foreground mt-1">{item.description}</div>
                        )}
                      </div>
                      <span className="text-muted-foreground hover:text-destructive">×</span>
                    </div>
                  </div>
                ))}
                {categoryItems.length === 0 && (
                  <div className="text-muted-foreground text-sm text-center py-6">
                    Drop items here or click items then click this category
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <Button 
          variant="outline" 
          onClick={() => {
            setBuckets({});
            onAnswer({});
            setSelectedItem(null);
          }}
        >
          Clear All
        </Button>
        <Button onClick={checkAnswer} variant="outline">
          Check Answer
        </Button>
      </div>

      {showFeedback && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium mb-3">Correct Categories:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {categories.map(category => {
              const correctItems = items.filter(item => 
                questionData.correctBuckets[item.id] === category.id
              );
              
              if (correctItems.length === 0) return null;
              
              const color = getCategoryColor(category);
              
              return (
                <div key={category.id} className={`border rounded-lg ${getBorderColor(color)}`}>
                  <div className={`p-3 ${getBgColor(color)} font-medium text-sm`}>
                    {category.name}
                  </div>
                  <div className="p-3 space-y-2">
                    {correctItems.map(item => (
                      <div key={item.id} className="p-2 bg-white rounded border text-sm">
                        <div className="font-medium">{item.text}</div>
                        {item.description && (
                          <div className="text-xs text-muted-foreground mt-1">{item.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-sm text-muted-foreground">{questionData.explanation}</p>
        </div>
      )}
    </div>
  );
}