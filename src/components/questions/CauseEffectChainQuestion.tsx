import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { ArrowRight, CheckCircle, AlertCircle, Play } from 'lucide-react';

interface CauseEffectChainQuestionData {
  chain: string[];
  explanation?: string;
}

interface CauseEffectChainQuestionProps {
  questionData: CauseEffectChainQuestionData;
  onAnswer: (answer: { completed: boolean }) => void;
}

export function CauseEffectChainQuestion({ questionData, onAnswer }: CauseEffectChainQuestionProps) {
  const [revealedSteps, setRevealedSteps] = useState<boolean[]>(new Array(questionData.chain.length).fill(false));
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const revealNextStep = () => {
    if (currentStep < questionData.chain.length) {
      const newRevealed = [...revealedSteps];
      newRevealed[currentStep] = true;
      setRevealedSteps(newRevealed);
      setCurrentStep(prev => prev + 1);
      
      // If all steps are revealed, show completion
      if (currentStep === questionData.chain.length - 1) {
        setTimeout(() => {
          setShowResult(true);
          onAnswer({ completed: true });
        }, 500);
      }
    }
  };

  const playAnimation = () => {
    setIsPlaying(true);
    setRevealedSteps(new Array(questionData.chain.length).fill(false));
    setCurrentStep(0);
    setShowResult(false);
    
    // Reveal steps one by one with animation
    questionData.chain.forEach((_, index) => {
      setTimeout(() => {
        setRevealedSteps(prev => {
          const newRevealed = [...prev];
          newRevealed[index] = true;
          return newRevealed;
        });
        
        if (index === questionData.chain.length - 1) {
          setTimeout(() => {
            setShowResult(true);
            setIsPlaying(false);
            onAnswer({ completed: true });
          }, 500);
        }
      }, (index + 1) * 800);
    });
  };

  const resetChain = () => {
    setRevealedSteps(new Array(questionData.chain.length).fill(false));
    setCurrentStep(0);
    setShowResult(false);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg mb-2">Cause-Effect Chain</h3>
        <p className="text-muted-foreground">
          Follow the sequential process step by step
        </p>
      </div>

      {/* Chain Visualization */}
      <div className="space-y-4">
        {questionData.chain.map((step, index) => {
          const isRevealed = revealedSteps[index];
          const isCurrent = index === currentStep && !showResult;
          const isCompleted = revealedSteps[index] && (index < currentStep || showResult);
          
          return (
            <div key={index} className="flex items-center space-x-4">
              {/* Step Number/Status */}
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center animate-pulse">
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm font-medium text-muted-foreground">
                      {index + 1}
                    </span>
                  </div>
                )}
              </div>

              {/* Step Content */}
              <Card className={`flex-1 p-4 transition-all duration-500 ${
                isRevealed 
                  ? isCompleted
                    ? 'bg-green-50 border-green-200 transform scale-100 opacity-100'
                    : isCurrent
                    ? 'bg-blue-50 border-blue-200 transform scale-105 opacity-100 shadow-md'
                    : 'transform scale-100 opacity-100'
                  : 'transform scale-95 opacity-50'
              }`}>
                <div className="flex items-center justify-between">
                  <p className={`text-sm transition-all duration-300 ${
                    isRevealed ? 'opacity-100' : 'opacity-30'
                  }`}>
                    {step}
                  </p>
                  
                  {isCompleted && (
                    <Badge variant="secondary" className="ml-2">
                      Step {index + 1}
                    </Badge>
                  )}
                </div>
              </Card>

              {/* Arrow */}
              {index < questionData.chain.length - 1 && (
                <div className="flex-shrink-0">
                  <ArrowRight className={`w-5 h-5 transition-all duration-300 ${
                    revealedSteps[index] ? 'text-primary opacity-100' : 'text-muted-foreground opacity-30'
                  }`} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-3">
        {!showResult && !isPlaying && (
          <>
            {currentStep === 0 ? (
              <Button onClick={playAnimation} className="flex items-center space-x-2">
                <Play className="w-4 h-4" />
                <span>Play Animation</span>
              </Button>
            ) : (
              <Button onClick={revealNextStep} disabled={currentStep >= questionData.chain.length}>
                {currentStep >= questionData.chain.length ? 'Complete' : `Reveal Step ${currentStep + 1}`}
              </Button>
            )}
            
            {currentStep > 0 && (
              <Button variant="outline" onClick={resetChain}>
                Reset
              </Button>
            )}
          </>
        )}
        
        {isPlaying && (
          <div className="flex items-center space-x-2 text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Playing animation...</span>
          </div>
        )}
      </div>

      {showResult && questionData.explanation && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Process Complete</h4>
          <p className="text-blue-800 text-sm">{questionData.explanation}</p>
        </div>
      )}

      {showResult && (
        <div className="text-center">
          <Button variant="outline" onClick={resetChain}>
            Review Again
          </Button>
        </div>
      )}
    </div>
  );
}