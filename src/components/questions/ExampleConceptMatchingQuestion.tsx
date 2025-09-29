import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface ExampleConceptMatchingQuestionProps {
  questionData: {
    concepts: string[];
    examples: string[];
    matches: Record<string, string>;
    explanation: string;
  };
  onAnswer: (answer: Record<string, string>) => void;
  currentAnswer?: Record<string, string>;
}

export function ExampleConceptMatchingQuestion({ questionData, onAnswer, currentAnswer }: ExampleConceptMatchingQuestionProps) {
  const [matches, setMatches] = useState<Record<string, string>>(currentAnswer || {});
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Convert arrays to objects for easier handling
  const concepts = questionData.concepts.map(concept => ({ 
    id: concept, 
    name: concept, 
    description: concept 
  }));
  const examples = questionData.examples.map(example => ({ 
    id: example, 
    text: example 
  }));

  useEffect(() => {
    if (currentAnswer) {
      setMatches(currentAnswer);
    }
  }, [currentAnswer]);

  const handleExampleClick = (exampleId: string) => {
    if (selectedExample === exampleId) {
      setSelectedExample(null);
    } else {
      setSelectedExample(exampleId);
      setSelectedConcept(null);
    }
  };

  const handleConceptClick = (conceptId: string) => {
    if (selectedConcept === conceptId) {
      setSelectedConcept(null);
    } else if (selectedExample) {
      // Create a match
      const newMatches = { ...matches };
      
      // Remove any existing matches for this example and concept
      Object.keys(newMatches).forEach(key => {
        if (newMatches[key] === conceptId) {
          delete newMatches[key];
        }
      });
      delete newMatches[selectedExample];
      
      // Create new match
      newMatches[selectedExample] = conceptId;
      
      setMatches(newMatches);
      onAnswer(newMatches);
      setSelectedExample(null);
      setSelectedConcept(null);
    } else {
      setSelectedConcept(conceptId);
      setSelectedExample(null);
    }
  };

  const removeMatch = (exampleId: string) => {
    const newMatches = { ...matches };
    delete newMatches[exampleId];
    setMatches(newMatches);
    onAnswer(newMatches);
  };

  const getMatchedConcept = (exampleId: string) => {
    const conceptId = matches[exampleId];
    return concepts.find(concept => concept.id === conceptId);
  };

  const getExamplesForConcept = (conceptId: string) => {
    return Object.keys(matches)
      .filter(exampleId => matches[exampleId] === conceptId)
      .map(exampleId => examples.find(ex => ex.id === exampleId))
      .filter(Boolean);
  };

  const isExampleMatched = (exampleId: string) => {
    return exampleId in matches;
  };

  const isCorrectMatch = (exampleId: string) => {
    return matches[exampleId] === questionData.matches[exampleId];
  };

  const checkAnswer = () => {
    setShowFeedback(true);
  };

  const getUnmatchedExamples = () => {
    return examples.filter(example => !isExampleMatched(example.id));
  };

  return (
    <div className="space-y-6">
      <div className="text-lg">
        Match each example with the concept it best illustrates. Click an example, then click the corresponding concept.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Examples Column */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Examples
              <Badge variant="outline">{getUnmatchedExamples().length} unmatched</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {examples.map(example => {
              const matchedConcept = getMatchedConcept(example.id);
              const isSelected = selectedExample === example.id;
              const isMatched = isExampleMatched(example.id);
              
              return (
                <div key={example.id} className="space-y-2">
                  <div
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : isMatched
                          ? showFeedback
                            ? isCorrectMatch(example.id)
                              ? 'border-green-500 bg-green-50'
                              : 'border-red-500 bg-red-50'
                            : 'border-blue-500 bg-blue-50'
                          : 'border-border hover:bg-accent'
                    }`}
                    onClick={() => handleExampleClick(example.id)}
                  >
                    <div className="text-sm leading-relaxed mb-2">{example.text}</div>
                    {example.context && (
                      <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                        <strong>Context:</strong> {example.context}
                      </div>
                    )}
                  </div>
                  
                  {matchedConcept && (
                    <div className="ml-4 p-3 bg-muted rounded border-l-4 border-blue-500">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-sm">{matchedConcept.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">{matchedConcept.description}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMatch(example.id)}
                          className="ml-2 h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Concepts Column */}
        <Card>
          <CardHeader>
            <CardTitle>Concepts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {concepts.map(concept => {
              const examplesForConcept = getExamplesForConcept(concept.id);
              const isSelected = selectedConcept === concept.id;
              
              return (
                <div key={concept.id} className="space-y-3">
                  <div
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : examplesForConcept.length > 0
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-border hover:bg-accent'
                    }`}
                    onClick={() => handleConceptClick(concept.id)}
                  >
                    <div className="font-medium mb-2">{concept.name}</div>
                    <div className="text-sm text-muted-foreground">{concept.description}</div>
                    {examplesForConcept.length > 0 && (
                      <Badge variant="secondary" className="mt-2">
                        {examplesForConcept.length} example{examplesForConcept.length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                  
                  {examplesForConcept.length > 0 && (
                    <div className="ml-4 space-y-2">
                      {examplesForConcept.map(example => example && (
                        <div key={example.id} className="p-2 bg-muted rounded border-l-4 border-blue-500 text-sm">
                          <div className="flex justify-between items-start">
                            <span>{example.text}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMatch(example.id)}
                              className="ml-2 h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <Button 
          variant="outline" 
          onClick={() => {
            setMatches({});
            onAnswer({});
            setSelectedExample(null);
            setSelectedConcept(null);
          }}
        >
          Clear All Matches
        </Button>
        <Button onClick={checkAnswer} variant="outline">
          Check Answer
        </Button>
      </div>

      {showFeedback && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium mb-3">Correct Matches:</h4>
          <div className="space-y-4 mb-4">
            {concepts.map(concept => {
              const correctExamples = examples.filter(example => 
                questionData.matches[example.id] === concept.id
              );
              
              if (correctExamples.length === 0) return null;
              
              return (
                <div key={concept.id} className="bg-white rounded-lg p-4 border">
                  <div className="font-medium text-sm mb-2">{concept.name}</div>
                  <div className="text-xs text-muted-foreground mb-3">{concept.description}</div>
                  <div className="space-y-2">
                    {correctExamples.map(example => (
                      <div key={example.id} className="p-2 bg-accent rounded text-sm">
                        {example.text}
                        {example.context && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Context: {example.context}
                          </div>
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