import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Check, X, User, Clock, Target } from 'lucide-react';

interface ScenarioMCQQuestionData {
  scenario: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface ScenarioMCQQuestionProps {
  questionData: ScenarioMCQQuestionData;
  onAnswer: (answer: { selectedAnswer: number; isCorrect: boolean }) => void;
}

export function ScenarioMCQQuestion({ questionData, onAnswer }: ScenarioMCQQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);
  const [showResult, setShowResult] = useState(false);

  const handleSelection = (optionIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(optionIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === -1) return;
    
    const isCorrect = selectedAnswer === questionData.correctAnswer;
    
    setShowResult(true);
    onAnswer({ selectedAnswer, isCorrect });
  };

  const getOptionStatus = (index: number) => {
    if (!showResult) return null;
    if (index === questionData.correctAnswer) return 'correct';
    if (index === selectedAnswer && index !== questionData.correctAnswer) return 'incorrect';
    return 'neutral';
  };

  // Extract key information from scenario
  const parseScenario = (scenario: string) => {
    const timeMatch = scenario.match(/(\d+)\s*(month|week|day)s?/i);
    const goalMatch = scenario.match(/(goal|aim|objective)\s+is\s+to\s+(.*?)(\.|$)/i);
    const subjectMatch = scenario.match(/^(\w+)\s+is/);
    
    return {
      timeframe: timeMatch ? `${timeMatch[1]} ${timeMatch[2]}${timeMatch[1] !== '1' ? 's' : ''}` : null,
      goal: goalMatch ? goalMatch[2].trim() : null,
      subject: subjectMatch ? subjectMatch[1] : 'Person'
    };
  };

  const scenarioInfo = parseScenario(questionData.scenario);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg mb-2">Scenario-Based Question</h3>
        <p className="text-muted-foreground">
          Read the scenario carefully and choose the best solution
        </p>
      </div>

      {/* Scenario Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-3">
            <User className="w-5 h-5 text-blue-600" />
            <Badge variant="secondary" className="text-blue-700 bg-blue-100">
              Scenario
            </Badge>
          </div>
          
          <p className="text-sm leading-relaxed text-gray-800">
            {questionData.scenario}
          </p>
          
          {/* Scenario Highlights */}
          <div className="flex flex-wrap gap-3 pt-3 border-t border-blue-200">
            {scenarioInfo.subject && (
              <div className="flex items-center space-x-1 text-xs text-blue-700">
                <User className="w-3 h-3" />
                <span>{scenarioInfo.subject}</span>
              </div>
            )}
            {scenarioInfo.timeframe && (
              <div className="flex items-center space-x-1 text-xs text-blue-700">
                <Clock className="w-3 h-3" />
                <span>{scenarioInfo.timeframe}</span>
              </div>
            )}
            {scenarioInfo.goal && (
              <div className="flex items-center space-x-1 text-xs text-blue-700">
                <Target className="w-3 h-3" />
                <span className="max-w-xs truncate">{scenarioInfo.goal}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Question */}
      <div>
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
                    : 'hover:shadow-md hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleSelection(index)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
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
                    <p className="text-sm leading-relaxed flex-1 pt-0.5">{option}</p>
                  </div>
                  
                  {showResult && (
                    <div className="ml-3 flex-shrink-0">
                      {status === 'correct' && (
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      {status === 'incorrect' && (
                        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                          <X className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Result */}
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
          
          {selectedAnswer !== questionData.correctAnswer && (
            <div className="mt-3 p-2 bg-green-100 rounded border-l-4 border-green-500">
              <p className="text-sm text-green-800">
                <strong>Correct answer:</strong> {String.fromCharCode(65 + questionData.correctAnswer)}) {questionData.options[questionData.correctAnswer]}
              </p>
            </div>
          )}
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
    </div>
  );
}