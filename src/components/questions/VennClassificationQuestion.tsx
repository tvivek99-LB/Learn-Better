import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

interface VennClassificationQuestionProps {
  questionData: {
    circles: string[];
    items: string[];
    classification: Record<string, string[]>;
    explanation: string;
  };
  onAnswer: (answer: Record<string, 'A' | 'B' | 'AB' | 'neither'>) => void;
  currentAnswer?: Record<string, 'A' | 'B' | 'AB' | 'neither'>;
}

type VennRegion = 'A' | 'B' | 'AB' | 'neither';

export function VennClassificationQuestion({ questionData, onAnswer, currentAnswer }: VennClassificationQuestionProps) {
  const [classifications, setClassifications] = useState<Record<string, VennRegion>>(currentAnswer || {});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Convert data to expected format
  const setA = { 
    name: questionData.circles[0], 
    description: `Items that belong to ${questionData.circles[0]}`,
    color: 'blue'
  };
  const setB = { 
    name: questionData.circles[1], 
    description: `Items that belong to ${questionData.circles[1]}`,
    color: 'orange'
  };
  const items = questionData.items.map(item => ({ id: item, text: item }));
  
  // Convert classification data to expected format
  const correctClassification: Record<string, VennRegion> = {};
  Object.entries(questionData.classification).forEach(([item, sets]) => {
    if (sets.length === 0) {
      correctClassification[item] = 'neither';
    } else if (sets.length === 1) {
      correctClassification[item] = sets[0] === questionData.circles[0] ? 'A' : 'B';
    } else {
      correctClassification[item] = 'AB';
    }
  });

  useEffect(() => {
    if (currentAnswer) {
      setClassifications(currentAnswer);
    }
  }, [currentAnswer]);

  const handleItemClick = (itemId: string) => {
    if (selectedItem === itemId) {
      setSelectedItem(null);
    } else {
      setSelectedItem(itemId);
    }
  };

  const handleRegionClick = (region: VennRegion) => {
    if (selectedItem) {
      const newClassifications = { ...classifications };
      
      // Toggle: if item was already in this region, remove it; otherwise add it
      if (classifications[selectedItem] === region) {
        delete newClassifications[selectedItem];
      } else {
        newClassifications[selectedItem] = region;
      }
      
      setClassifications(newClassifications);
      onAnswer(newClassifications);
      setSelectedItem(null);
    }
  };

  const removeItemFromRegion = (itemId: string) => {
    const newClassifications = { ...classifications };
    delete newClassifications[itemId];
    setClassifications(newClassifications);
    onAnswer(newClassifications);
  };

  const getUnclassifiedItems = () => {
    return items.filter(item => !classifications[item.id]);
  };

  const getItemsInRegion = (region: VennRegion) => {
    return items.filter(item => classifications[item.id] === region);
  };

  const isCorrect = (itemId: string) => {
    return classifications[itemId] === correctClassification[itemId];
  };

  const getRegionLabel = (region: VennRegion) => {
    switch (region) {
      case 'A': return `Only ${setA.name}`;
      case 'B': return `Only ${setB.name}`;
      case 'AB': return `Both ${setA.name} & ${setB.name}`;
      case 'neither': return 'Neither';
    }
  };

  const getRegionDescription = (region: VennRegion) => {
    switch (region) {
      case 'A': return `Items that belong only to ${setA.name}`;
      case 'B': return `Items that belong only to ${setB.name}`;
      case 'AB': return `Items that belong to both sets`;
      case 'neither': return `Items that don't belong to either set`;
    }
  };

  const checkAnswer = () => {
    setShowFeedback(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-lg">
        Classify each item based on which set(s) it belongs to. Click an item, then click the appropriate region.
      </div>

      {/* Set Descriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <h4 className="font-medium text-blue-900 mb-2">Set A: {setA.name}</h4>
            <p className="text-sm text-blue-700">{setA.description}</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <h4 className="font-medium text-orange-900 mb-2">Set B: {setB.name}</h4>
            <p className="text-sm text-orange-700">{setB.description}</p>
          </CardContent>
        </Card>
      </div>

      {/* Unclassified Items */}
      <div>
        <h4 className="font-medium mb-3 flex items-center gap-2">
          Items to Classify
          <Badge variant="outline">{getUnclassifiedItems().length} remaining</Badge>
        </h4>
        <div className="flex flex-wrap gap-2 min-h-[80px] p-4 border-2 border-dashed border-muted rounded-lg">
          {getUnclassifiedItems().map(item => (
            <div
              key={item.id}
              className={`px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                selectedItem === item.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-background hover:bg-accent'
              }`}
              onClick={() => handleItemClick(item.id)}
              title={item.description || item.text}
            >
              <div className="text-sm font-medium">{item.text}</div>
              {item.description && (
                <div className="text-xs text-muted-foreground mt-1">{item.description}</div>
              )}
            </div>
          ))}
          {getUnclassifiedItems().length === 0 && (
            <p className="text-muted-foreground text-sm">All items have been classified</p>
          )}
        </div>
      </div>

      {/* Venn Diagram Regions */}
      <div className="space-y-4">
        <h4 className="font-medium text-center">Venn Diagram Classification</h4>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Only A */}
          <Card 
            className="border-blue-500 bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors"
            onClick={() => handleRegionClick('A')}
          >
            <CardContent className="p-4">
              <h5 className="font-medium text-blue-900 mb-2 flex items-center justify-between">
                {getRegionLabel('A')}
                <Badge variant="secondary">{getItemsInRegion('A').length}</Badge>
              </h5>
              <p className="text-sm text-blue-700 mb-3">{getRegionDescription('A')}</p>
              <div className="space-y-2 min-h-[60px]">
                {getItemsInRegion('A').map(item => (
                  <div
                    key={item.id}
                    className={`p-2 rounded border text-sm cursor-pointer transition-all ${
                      showFeedback
                        ? isCorrect(item.id)
                          ? 'bg-green-100 border-green-500 text-green-700'
                          : 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-white border-blue-300 hover:bg-blue-50'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItemFromRegion(item.id);
                    }}
                    title="Click to remove"
                  >
                    <div className="flex justify-between items-start">
                      <span>{item.text}</span>
                      <span className="text-muted-foreground hover:text-destructive">×</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Only B */}
          <Card 
            className="border-orange-500 bg-orange-50 cursor-pointer hover:bg-orange-100 transition-colors"
            onClick={() => handleRegionClick('B')}
          >
            <CardContent className="p-4">
              <h5 className="font-medium text-orange-900 mb-2 flex items-center justify-between">
                {getRegionLabel('B')}
                <Badge variant="secondary">{getItemsInRegion('B').length}</Badge>
              </h5>
              <p className="text-sm text-orange-700 mb-3">{getRegionDescription('B')}</p>
              <div className="space-y-2 min-h-[60px]">
                {getItemsInRegion('B').map(item => (
                  <div
                    key={item.id}
                    className={`p-2 rounded border text-sm cursor-pointer transition-all ${
                      showFeedback
                        ? isCorrect(item.id)
                          ? 'bg-green-100 border-green-500 text-green-700'
                          : 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-white border-orange-300 hover:bg-orange-50'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItemFromRegion(item.id);
                    }}
                    title="Click to remove"
                  >
                    <div className="flex justify-between items-start">
                      <span>{item.text}</span>
                      <span className="text-muted-foreground hover:text-destructive">×</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Both A and B (Intersection) */}
          <Card 
            className="border-purple-500 bg-purple-50 cursor-pointer hover:bg-purple-100 transition-colors"
            onClick={() => handleRegionClick('AB')}
          >
            <CardContent className="p-4">
              <h5 className="font-medium text-purple-900 mb-2 flex items-center justify-between">
                {getRegionLabel('AB')}
                <Badge variant="secondary">{getItemsInRegion('AB').length}</Badge>
              </h5>
              <p className="text-sm text-purple-700 mb-3">{getRegionDescription('AB')}</p>
              <div className="space-y-2 min-h-[60px]">
                {getItemsInRegion('AB').map(item => (
                  <div
                    key={item.id}
                    className={`p-2 rounded border text-sm cursor-pointer transition-all ${
                      showFeedback
                        ? isCorrect(item.id)
                          ? 'bg-green-100 border-green-500 text-green-700'
                          : 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-white border-purple-300 hover:bg-purple-50'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItemFromRegion(item.id);
                    }}
                    title="Click to remove"
                  >
                    <div className="flex justify-between items-start">
                      <span>{item.text}</span>
                      <span className="text-muted-foreground hover:text-destructive">×</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Neither */}
          <Card 
            className="border-gray-500 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => handleRegionClick('neither')}
          >
            <CardContent className="p-4">
              <h5 className="font-medium text-gray-900 mb-2 flex items-center justify-between">
                {getRegionLabel('neither')}
                <Badge variant="secondary">{getItemsInRegion('neither').length}</Badge>
              </h5>
              <p className="text-sm text-gray-700 mb-3">{getRegionDescription('neither')}</p>
              <div className="space-y-2 min-h-[60px]">
                {getItemsInRegion('neither').map(item => (
                  <div
                    key={item.id}
                    className={`p-2 rounded border text-sm cursor-pointer transition-all ${
                      showFeedback
                        ? isCorrect(item.id)
                          ? 'bg-green-100 border-green-500 text-green-700'
                          : 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-white border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItemFromRegion(item.id);
                    }}
                    title="Click to remove"
                  >
                    <div className="flex justify-between items-start">
                      <span>{item.text}</span>
                      <span className="text-muted-foreground hover:text-destructive">×</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <Button 
          variant="outline" 
          onClick={() => {
            setClassifications({});
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
          <h4 className="font-medium mb-3">Correct Classification:</h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {(['A', 'B', 'AB', 'neither'] as VennRegion[]).map(region => {
              const correctItems = items.filter(item => 
                correctClassification[item.id] === region
              );
              
              if (correctItems.length === 0) return null;
              
              const regionColors = {
                A: 'border-blue-500 bg-blue-50',
                B: 'border-orange-500 bg-orange-50',
                AB: 'border-purple-500 bg-purple-50',
                neither: 'border-gray-500 bg-gray-50'
              };
              
              return (
                <div key={region} className={`border rounded-lg p-3 ${regionColors[region]}`}>
                  <div className="font-medium text-sm mb-2">{getRegionLabel(region)}</div>
                  <div className="space-y-1">
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