import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Check, X, Play, RotateCcw, CheckCircle, ArrowRight } from 'lucide-react';

interface MiniSimulationQuestionData {
  scenario: string;
  steps: string[];
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface MiniSimulationQuestionProps {
  questionData: MiniSimulationQuestionData;
  onAnswer: (answer: { selectedAnswer: number; isCorrect: boolean; stepsCompleted: boolean }) => void;
}

export function MiniSimulationQuestion({ questionData, onAnswer }: MiniSimulationQuestionProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(new Array(questionData.steps.length).fill(false));
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);
  const [showResult, setShowResult] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const completeCurrentStep = () => {
    if (currentStep < questionData.steps.length) {
      const newCompleted = [...completedSteps];
      newCompleted[currentStep] = true;
      setCompletedSteps(newCompleted);
      
      if (currentStep === questionData.steps.length - 1) {
        setSimulationComplete(true);
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const playFullSimulation = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    setCompletedSteps(new Array(questionData.steps.length).fill(false));
    setSimulationComplete(false);
    
    // Play through all steps automatically
    questionData.steps.forEach((_, index) => {
      setTimeout(() => {
        setCompletedSteps(prev => {
          const newCompleted = [...prev];
          newCompleted[index] = true;
          return newCompleted;
        });
        
        if (index < questionData.steps.length - 1) {
          setCurrentStep(index + 1);
        } else {
          setSimulationComplete(true);
          setIsPlaying(false);
        }
      }, (index + 1) * 1200);
    });
  };

  const resetSimulation = () => {
    setCurrentStep(0);
    setCompletedSteps(new Array(questionData.steps.length).fill(false));
    setSimulationComplete(false);
    setIsPlaying(false);
  };

  const handleSelection = (optionIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(optionIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === -1) return;
    
    const isCorrect = selectedAnswer === questionData.correctAnswer;
    
    setShowResult(true);
    onAnswer({ 
      selectedAnswer, 
      isCorrect, 
      stepsCompleted: simulationComplete 
    });
  };

  const getOptionStatus = (index: number) => {
    if (!showResult) return null;
    if (index === questionData.correctAnswer) return 'correct';
    if (index === selectedAnswer && index !== questionData.correctAnswer) return 'incorrect';
    return 'neutral';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg mb-2">Interactive Simulation</h3>
        <p className="text-muted-foreground">
          Walk through the process step by step, then answer the question
        </p>
      </div>

      {/* Scenario Setup */}
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <div className="flex items-center space-x-2 mb-3">
          <Play className="w-5 h-5 text-purple-600" />
          <Badge variant="secondary" className="text-purple-700 bg-purple-100">
            Simulation Setup
          </Badge>
        </div>
        <p className="text-sm text-gray-800 leading-relaxed">
          {questionData.scenario}
        </p>
      </Card>

      {/* Steps Simulation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Process Steps</h4>
          <div className="flex space-x-2">
            {!isPlaying && !simulationComplete && (
              <Button
                variant="outline"
                size="sm"
                onClick={playFullSimulation}
                className="flex items-center space-x-1"
              >
                <Play className="w-3 h-3" />
                <span>Auto Play</span>
              </Button>
            )}
            {(completedSteps.some(Boolean) || simulationComplete) && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetSimulation}
                className="flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </Button>
            )}
          </div>
        </div>

        {questionData.steps.map((step, index) => {
          const isCompleted = completedSteps[index];
          const isCurrent = index === currentStep && !simulationComplete;
          const isUpcoming = index > currentStep && !simulationComplete;
          
          return (
            <div key={index} className="flex items-center space-x-4">
              {/* Step Status */}
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center animate-pulse">
                    <span className="text-sm font-medium text-white">{index + 1}</span>
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
              <Card className={`flex-1 p-3 transition-all duration-500 ${
                isCompleted
                  ? 'bg-green-50 border-green-200 transform scale-100 opacity-100'
                  : isCurrent
                  ? 'bg-blue-50 border-blue-200 transform scale-105 opacity-100 shadow-md'
                  : isUpcoming
                  ? 'transform scale-95 opacity-50'
                  : 'transform scale-100 opacity-100'
              }`}>
                <div className="flex items-center justify-between">
                  <p className={`text-sm transition-all duration-300 ${
                    isUpcoming ? 'opacity-50' : 'opacity-100'
                  }`}>
                    {step}
                  </p>
                  
                  {isCompleted && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      Complete
                    </Badge>
                  )}
                  
                  {isCurrent && !isPlaying && (
                    <Button
                      size="sm"
                      onClick={completeCurrentStep}
                      className="ml-2 text-xs px-3 py-1 h-6"
                    >
                      Complete Step
                    </Button>
                  )}
                </div>
              </Card>

              {/* Arrow */}
              {index < questionData.steps.length - 1 && (
                <div className="flex-shrink-0">
                  <ArrowRight className={`w-4 h-4 transition-all duration-300 ${
                    isCompleted ? 'text-green-500 opacity-100' : 'text-muted-foreground opacity-30'
                  }`} />
                </div>
              )}
            </div>
          );
        })}

        {isPlaying && (
          <div className="text-center py-4">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Running simulation...</span>
            </div>
          </div>
        )}
      </div>

      {/* Question Section - Only show when simulation is complete */}
      {simulationComplete && (
        <>
          <div className="border-t pt-6">
            <h4 className="font-medium mb-4 text-lg">{questionData.question}</h4>
            
            <div className="space-y-3">
              {questionData.options.map((option, index) => {
                const status = getOptionStatus(index);
                const isSelected = selectedAnswer === index;
                
                return (
                  <Card
                    key={index}
                    className={`p-4 cursor-pointer transition-all duration-200 ${
                      isSelected && !showResult
                        ? 'ring-2 ring-primary shadow-md bg-primary/5'
                        : showResult
                        ? status === 'correct'
                          ? 'ring-2 ring-green-500 bg-green-50 border-green-200'
                          : status === 'incorrect'
                          ? 'ring-2 ring-red-500 bg-red-50 border-red-200'
                          : 'opacity-70'
                        : 'hover:shadow-md hover:border-gray-300'
                    }`}
                    onClick={() => handleSelection(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                          isSelected && !showResult
                            ? 'border-primary bg-primary text-white'
                            : showResult && status === 'correct'
                            ? 'border-green-500 bg-green-500 text-white'
                            : showResult && status === 'incorrect'
                            ? 'border-red-500 bg-red-500 text-white'
                            : 'border-gray-300 text-gray-500'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-sm">{option}</span>
                      </div>
                      
                      {showResult && (
                        <div className="ml-3 flex-shrink-0">
                          {status === 'correct' && (
                            <Check className="w-4 h-4 text-green-600" />
                          )}
                          {status === 'incorrect' && (
                            <X className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {showResult && questionData.explanation && (
            <div className={`p-4 border rounded-lg ${
              selectedAnswer === questionData.correctAnswer
                ? 'bg-green-50 border-green-200'
                : 'bg-blue-50 border-blue-200'
            }`}>
              <h4 className={`font-medium mb-2 ${
                selectedAnswer === questionData.correctAnswer ? 'text-green-900' : 'text-blue-900'
              }`}>
                {selectedAnswer === questionData.correctAnswer ? 'Correct!' : 'Explanation'}
              </h4>
              <p className={`text-sm ${
                selectedAnswer === questionData.correctAnswer ? 'text-green-800' : 'text-blue-800'
              }`}>
                {questionData.explanation}
              </p>
            </div>
          )}

          {!showResult && (
            <Button 
              onClick={handleSubmit}
              disabled={selectedAnswer === -1}
              className="w-full sm:w-auto"
            >
              Submit Answer
            </Button>
          )}
        </>
      )}

      {!simulationComplete && !isPlaying && (
        <div className="text-center py-4 border border-dashed border-gray-300 rounded-lg">
          <p className="text-sm text-muted-foreground mb-3">
            Complete the simulation to unlock the question
          </p>
          <div className="text-xs text-muted-foreground">
            Progress: {completedSteps.filter(Boolean).length} / {questionData.steps.length} steps
          </div>
        </div>
      )}
    </div>
  );
}