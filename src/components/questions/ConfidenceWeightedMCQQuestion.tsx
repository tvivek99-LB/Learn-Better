import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface ConfidenceWeightedMCQQuestionProps {
  questionData: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
  onAnswer: (answer: { selectedAnswer: number; confidence: number }) => void;
  currentAnswer?: { selectedAnswer: number; confidence: number };
}

export function ConfidenceWeightedMCQQuestion({ questionData, onAnswer, currentAnswer }: ConfidenceWeightedMCQQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>(currentAnswer?.selectedAnswer?.toString() || '');
  const [confidence, setConfidence] = useState<number[]>(currentAnswer?.confidence ? [currentAnswer.confidence] : [50]);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (currentAnswer) {
      setSelectedAnswer(currentAnswer.selectedAnswer?.toString() || '');
      setConfidence([currentAnswer.confidence || 50]);
    }
  }, [currentAnswer]);

  const handleAnswerChange = (value: string) => {
    setSelectedAnswer(value);
    updateAnswer(parseInt(value), confidence[0]);
  };

  const handleConfidenceChange = (newConfidence: number[]) => {
    setConfidence(newConfidence);
    if (selectedAnswer !== '') {
      updateAnswer(parseInt(selectedAnswer), newConfidence[0]);
    }
  };

  const updateAnswer = (answer: number, conf: number) => {
    onAnswer({
      selectedAnswer: answer,
      confidence: conf
    });
  };

  const checkAnswer = () => {
    setShowFeedback(true);
  };

  const isCorrect = selectedAnswer === questionData.correctAnswer.toString();
  const confidenceLevel = confidence[0];

  // Calculate score based on confidence and correctness
  const calculateScore = () => {
    if (selectedAnswer === '') return 0;
    
    const maxScore = 100;
    const confidenceWeight = confidenceLevel / 100;
    
    if (isCorrect) {
      // Reward high confidence when correct
      return Math.round(maxScore * (0.5 + 0.5 * confidenceWeight));
    } else {
      // Penalize high confidence when incorrect
      return Math.round(maxScore * (0.5 - 0.5 * confidenceWeight));
    }
  };

  const getConfidenceLabel = (conf: number) => {
    if (conf < 30) return 'Low Confidence';
    if (conf < 60) return 'Medium Confidence';
    if (conf < 80) return 'High Confidence';
    return 'Very High Confidence';
  };

  const getConfidenceColor = (conf: number) => {
    if (conf < 30) return 'bg-red-100 text-red-700 border-red-200';
    if (conf < 60) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    if (conf < 80) return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-green-100 text-green-700 border-green-200';
  };

  return (
    <div className="space-y-6">
      {/* Question */}
      <div className="text-lg leading-relaxed">
        {questionData.question}
      </div>

      {/* Answer Options */}
      <div>
        <h4 className="font-medium mb-4">Select your answer:</h4>
        <RadioGroup value={selectedAnswer} onValueChange={handleAnswerChange}>
          <div className="space-y-3">
            {questionData.options.map((option, index) => (
              <div 
                key={index} 
                className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                  showFeedback && selectedAnswer === index.toString()
                    ? isCorrect
                      ? 'bg-green-100 border-green-500'
                      : 'bg-red-100 border-red-500'
                    : 'hover:bg-accent'
                }`}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} className="mt-1" />
                <Label 
                  htmlFor={`option-${index}`} 
                  className="cursor-pointer leading-relaxed flex-1"
                >
                  <span className="font-medium mr-2">({String.fromCharCode(65 + index)})</span>
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Confidence Slider */}
      <Card className="bg-accent/30">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center justify-between">
            Confidence Level
            <Badge className={getConfidenceColor(confidenceLevel)}>
              {getConfidenceLabel(confidenceLevel)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              How confident are you in your answer? This affects your score.
            </p>
            
            <div className="space-y-3">
              <Slider
                value={confidence}
                onValueChange={handleConfidenceChange}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Not confident (0%)</span>
                <span className="font-medium text-foreground">{confidenceLevel}%</span>
                <span>Very confident (100%)</span>
              </div>
            </div>
          </div>

          {/* Confidence Strategy Guide */}
          <div className="bg-muted rounded-lg p-3">
            <h5 className="font-medium text-sm mb-2">Confidence Strategy:</h5>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• High confidence + Correct = Higher score</li>
              <li>• Low confidence + Correct = Moderate score</li>
              <li>• High confidence + Incorrect = Lower score</li>
              <li>• Low confidence + Incorrect = Moderate score</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Preview Score */}
      {selectedAnswer !== '' && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Current potential score: <span className="font-medium">{calculateScore()}/100</span>
          </p>
        </div>
      )}

      <div className="flex justify-center">
        <Button 
          onClick={checkAnswer} 
          variant="outline"
          disabled={selectedAnswer === ''}
        >
          Check Answer
        </Button>
      </div>

      {showFeedback && (
        <div className={`rounded-lg p-4 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{isCorrect ? '✅' : '❌'}</span>
              <h4 className="font-medium">
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </h4>
            </div>
            <Badge variant="outline" className="font-medium">
              Score: {calculateScore()}/100
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-sm font-medium mb-1">Your Answer:</p>
              <p className="text-sm">
                <span className="font-medium">({String.fromCharCode(65 + parseInt(selectedAnswer))})</span> {questionData.options[parseInt(selectedAnswer)]}
              </p>
              <p className="text-sm text-muted-foreground">
                Confidence: {confidenceLevel}% ({getConfidenceLabel(confidenceLevel)})
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-1">Correct Answer:</p>
              <p className="text-sm">
                <span className="font-medium">({String.fromCharCode(65 + questionData.correctAnswer)})</span> {questionData.options[questionData.correctAnswer]}
              </p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">Explanation:</p>
            <p className="text-sm text-muted-foreground">{questionData.explanation}</p>
          </div>
          
          <div className="mt-3 pt-3 border-t">
            <p className="text-sm text-muted-foreground">
              <strong>Score Breakdown:</strong> Your confidence level of {confidenceLevel}% was {isCorrect ? 'rewarded' : 'penalized'} because your answer was {isCorrect ? 'correct' : 'incorrect'}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}