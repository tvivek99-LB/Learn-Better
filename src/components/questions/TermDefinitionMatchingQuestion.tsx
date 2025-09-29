import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface TermDefinitionMatchingQuestionProps {
  questionData: {
    pairs: Array<{ term: string; definition: string }>;
    explanation: string;
  };
  onAnswer: (answer: Record<string, string>) => void;
  currentAnswer?: Record<string, string>;
}

export function TermDefinitionMatchingQuestion({ questionData, onAnswer, currentAnswer }: TermDefinitionMatchingQuestionProps) {
  const [matches, setMatches] = useState<Record<string, string>>(currentAnswer || {});
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [selectedDefinition, setSelectedDefinition] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Convert pairs to terms and definitions arrays for easier handling
  const terms = questionData.pairs.map(pair => ({ id: pair.term, text: pair.term }));
  const definitions = questionData.pairs.map(pair => ({ id: pair.definition, text: pair.definition }));
  const correctMatches = questionData.pairs.reduce((acc, pair) => {
    acc[pair.term] = pair.definition;
    return acc;
  }, {} as Record<string, string>);

  useEffect(() => {
    if (currentAnswer) {
      setMatches(currentAnswer);
    }
  }, [currentAnswer]);

  const handleTermClick = (termId: string) => {
    if (selectedTerm === termId) {
      setSelectedTerm(null);
    } else {
      setSelectedTerm(termId);
      setSelectedDefinition(null);
    }
  };

  const handleDefinitionClick = (definitionId: string) => {
    if (selectedDefinition === definitionId) {
      setSelectedDefinition(null);
    } else if (selectedTerm) {
      // Create a match
      const newMatches = { ...matches };
      
      // Remove any existing matches for this term and definition
      Object.keys(newMatches).forEach(key => {
        if (newMatches[key] === definitionId) {
          delete newMatches[key];
        }
      });
      delete newMatches[selectedTerm];
      
      // Create new match
      newMatches[selectedTerm] = definitionId;
      
      setMatches(newMatches);
      onAnswer(newMatches);
      setSelectedTerm(null);
      setSelectedDefinition(null);
    } else {
      setSelectedDefinition(definitionId);
      setSelectedTerm(null);
    }
  };

  const removeMatch = (termId: string) => {
    const newMatches = { ...matches };
    delete newMatches[termId];
    setMatches(newMatches);
    onAnswer(newMatches);
  };

  const getMatchedDefinition = (termId: string) => {
    const definitionId = matches[termId];
    return definitions.find(def => def.id === definitionId);
  };

  const getMatchedTerm = (definitionId: string) => {
    const termId = Object.keys(matches).find(key => matches[key] === definitionId);
    return termId ? terms.find(term => term.id === termId) : null;
  };

  const isTermMatched = (termId: string) => {
    return termId in matches;
  };

  const isDefinitionMatched = (definitionId: string) => {
    return Object.values(matches).includes(definitionId);
  };

  const isCorrectMatch = (termId: string) => {
    return matches[termId] === correctMatches[termId];
  };

  const checkAnswer = () => {
    setShowFeedback(true);
  };

  const getUnmatchedTerms = () => {
    return terms.filter(term => !isTermMatched(term.id));
  };

  const getUnmatchedDefinitions = () => {
    return definitions.filter(def => !isDefinitionMatched(def.id));
  };

  return (
    <div className="space-y-6">
      <div className="text-lg">
        Match each term with its correct definition. Click a term, then click its matching definition.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Terms Column */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Terms
              <Badge variant="outline">{getUnmatchedTerms().length} unmatched</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {terms.map(term => {
              const matchedDef = getMatchedDefinition(term.id);
              const isSelected = selectedTerm === term.id;
              const isMatched = isTermMatched(term.id);
              
              return (
                <div key={term.id} className="space-y-2">
                  <div
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : isMatched
                          ? showFeedback
                            ? isCorrectMatch(term.id)
                              ? 'border-green-500 bg-green-50'
                              : 'border-red-500 bg-red-50'
                            : 'border-blue-500 bg-blue-50'
                          : 'border-border hover:bg-accent'
                    }`}
                    onClick={() => handleTermClick(term.id)}
                  >
                    <div className="font-medium">{term.text}</div>
                  </div>
                  
                  {matchedDef && (
                    <div className="ml-4 p-2 bg-muted rounded border-l-4 border-blue-500 text-sm">
                      <div className="flex justify-between items-start">
                        <span>{matchedDef.text}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMatch(term.id)}
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

        {/* Definitions Column */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Definitions
              <Badge variant="outline">{getUnmatchedDefinitions().length} unmatched</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {definitions.map(definition => {
              const matchedTerm = getMatchedTerm(definition.id);
              const isSelected = selectedDefinition === definition.id;
              const isMatched = isDefinitionMatched(definition.id);
              
              return (
                <div key={definition.id} className="space-y-2">
                  <div
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : isMatched
                          ? showFeedback
                            ? matchedTerm && isCorrectMatch(matchedTerm.id)
                              ? 'border-green-500 bg-green-50'
                              : 'border-red-500 bg-red-50'
                            : 'border-blue-500 bg-blue-50'
                          : 'border-border hover:bg-accent'
                    }`}
                    onClick={() => handleDefinitionClick(definition.id)}
                  >
                    <div className="text-sm leading-relaxed">{definition.text}</div>
                  </div>
                  
                  {matchedTerm && (
                    <div className="ml-4 p-2 bg-muted rounded border-l-4 border-blue-500 text-sm">
                      <div className="flex justify-between items-start">
                        <span className="font-medium">{matchedTerm.text}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMatch(matchedTerm.id)}
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
      </div>

      {/* Quick Reset */}
      <div className="flex justify-center gap-3">
        <Button 
          variant="outline" 
          onClick={() => {
            setMatches({});
            onAnswer({});
            setSelectedTerm(null);
            setSelectedDefinition(null);
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
          <div className="space-y-3 mb-4">
            {terms.map(term => {
              const correctDef = definitions.find(def => def.id === correctMatches[term.id]);
              return (
                <div key={term.id} className="flex items-start gap-3 p-3 bg-white rounded border">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{term.text}</div>
                  </div>
                  <div className="text-muted-foreground text-sm">→</div>
                  <div className="flex-1">
                    <div className="text-sm">{correctDef?.text}</div>
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