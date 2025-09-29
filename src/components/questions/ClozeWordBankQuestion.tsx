import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface ClozeWordBankQuestionProps {
  questionData: {
    text: string;
    blanks: string[];
    wordBank: string[];
    explanation: string;
  };
  onAnswer: (answer: string[]) => void;
  currentAnswer?: string[];
}

export function ClozeWordBankQuestion({ questionData, onAnswer, currentAnswer }: ClozeWordBankQuestionProps) {
  const [selectedWords, setSelectedWords] = useState<string[]>(currentAnswer || Array(questionData.blanks.length).fill(''));
  const [usedWords, setUsedWords] = useState<Set<number>>(new Set());
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (currentAnswer) {
      setSelectedWords(currentAnswer);
      // Rebuild used words set
      const used = new Set<number>();
      currentAnswer.forEach(word => {
        if (word) {
          const index = questionData.wordBank.indexOf(word);
          if (index !== -1) used.add(index);
        }
      });
      setUsedWords(used);
    }
  }, [currentAnswer, questionData.wordBank]);

  const handleWordSelect = (wordIndex: number, blankIndex: number) => {
    const word = questionData.wordBank[wordIndex];
    const newSelectedWords = [...selectedWords];
    
    // If there was a word in this blank, free it up
    if (newSelectedWords[blankIndex]) {
      const oldWordIndex = questionData.wordBank.indexOf(newSelectedWords[blankIndex]);
      if (oldWordIndex !== -1) {
        setUsedWords(prev => {
          const newSet = new Set(prev);
          newSet.delete(oldWordIndex);
          return newSet;
        });
      }
    }
    
    newSelectedWords[blankIndex] = word;
    setSelectedWords(newSelectedWords);
    setUsedWords(prev => new Set(prev).add(wordIndex));
    onAnswer(newSelectedWords);
  };

  const handleRemoveWord = (blankIndex: number) => {
    const word = selectedWords[blankIndex];
    if (word) {
      const wordIndex = questionData.wordBank.indexOf(word);
      if (wordIndex !== -1) {
        setUsedWords(prev => {
          const newSet = new Set(prev);
          newSet.delete(wordIndex);
          return newSet;
        });
      }
    }
    
    const newSelectedWords = [...selectedWords];
    newSelectedWords[blankIndex] = '';
    setSelectedWords(newSelectedWords);
    onAnswer(newSelectedWords);
  };

  const checkAnswer = () => {
    setShowFeedback(true);
  };

  const renderTextWithBlanks = () => {
    const parts = questionData.text.split('_______');
    const result = [];
    
    for (let i = 0; i < parts.length; i++) {
      result.push(<span key={`text-${i}`}>{parts[i]}</span>);
      
      if (i < parts.length - 1) {
        const selectedWord = selectedWords[i];
        const isCorrect = showFeedback && selectedWord === questionData.blanks[i];
        const hasAnswer = selectedWord !== '';
        
        result.push(
          <Button
            key={`blank-${i}`}
            variant={selectedWord ? "default" : "outline"}
            size="sm"
            className={`mx-1 min-w-[120px] ${
              showFeedback 
                ? isCorrect 
                  ? 'bg-green-100 border-green-500 text-green-700' 
                  : hasAnswer 
                    ? 'bg-red-100 border-red-500 text-red-700' 
                    : 'bg-yellow-100 border-yellow-500 text-yellow-700'
                : ''
            }`}
            onClick={() => selectedWord && handleRemoveWord(i)}
          >
            {selectedWord || `Blank ${i + 1}`}
          </Button>
        );
      }
    }
    
    return result;
  };

  return (
    <div className="space-y-6">
      <div className="text-lg leading-relaxed">
        {renderTextWithBlanks()}
      </div>
      
      <div>
        <h4 className="font-medium mb-3">Word Bank</h4>
        <div className="flex flex-wrap gap-2">
          {questionData.wordBank.map((word, index) => (
            <Badge
              key={index}
              variant={usedWords.has(index) ? "secondary" : "outline"}
              className={`cursor-pointer px-3 py-1 ${
                usedWords.has(index) ? 'opacity-50' : 'hover:bg-primary hover:text-primary-foreground'
              }`}
              onClick={() => {
                if (!usedWords.has(index)) {
                  // Find first empty blank
                  const emptyBlankIndex = selectedWords.findIndex(word => word === '');
                  if (emptyBlankIndex !== -1) {
                    handleWordSelect(index, emptyBlankIndex);
                  }
                }
              }}
            >
              {word}
            </Badge>
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
          <h4 className="font-medium mb-2">Correct Answers:</h4>
          <ul className="list-disc list-inside space-y-1 mb-3">
            {questionData.blanks.map((blank, index) => (
              <li key={index} className="text-sm">
                Blank {index + 1}: <strong>{blank}</strong>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">{questionData.explanation}</p>
        </div>
      )}
    </div>
  );
}