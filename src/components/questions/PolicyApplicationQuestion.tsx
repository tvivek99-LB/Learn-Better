import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Check, X, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

interface PolicyApplicationQuestionData {
  policy: string;
  scenarios: string[];
  compliant: number[];
  explanation?: string;
}

interface PolicyApplicationQuestionProps {
  questionData: PolicyApplicationQuestionData;
  onAnswer: (answer: { selections: number[]; correctCount: number; totalCorrect: number }) => void;
}

export function PolicyApplicationQuestion({ questionData, onAnswer }: PolicyApplicationQuestionProps) {
  const [selectedScenarios, setSelectedScenarios] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const toggleScenario = (index: number) => {
    if (showResult) return;
    
    setSelectedScenarios(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleSubmit = () => {
    const correctCount = selectedScenarios.filter(index => 
      questionData.compliant.includes(index)
    ).length;
    
    const totalCorrect = questionData.compliant.length;
    
    setShowResult(true);
    onAnswer({ 
      selections: selectedScenarios, 
      correctCount, 
      totalCorrect
    });
  };

  const getScenarioStatus = (index: number) => {
    if (!showResult) return 'neutral';
    
    const isCompliant = questionData.compliant.includes(index);
    const isSelected = selectedScenarios.includes(index);
    
    if (isCompliant && isSelected) return 'correct';
    if (!isCompliant && !isSelected) return 'correct';
    if (isCompliant && !isSelected) return 'missed';
    if (!isCompliant && isSelected) return 'incorrect';
    
    return 'neutral';
  };

  const getComplianceLabel = (index: number) => {
    if (!showResult) return null;
    return questionData.compliant.includes(index) ? 'Compliant' : 'Non-Compliant';
  };

  const calculateScore = () => {
    if (!showResult) return { score: 0, total: 0 };
    
    let correct = 0;
    questionData.scenarios.forEach((_, index) => {
      const status = getScenarioStatus(index);
      if (status === 'correct') correct++;
    });
    
    return { score: correct, total: questionData.scenarios.length };
  };

  const scoreInfo = calculateScore();
  const isFullyCorrect = showResult && scoreInfo.score === scoreInfo.total;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg mb-2">Policy Application</h3>
        <p className="text-muted-foreground">
          Select which scenarios comply with the given policy
        </p>
      </div>

      {/* Policy Statement */}
      <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-amber-600" />
            <Badge variant="secondary" className="text-amber-700 bg-amber-100">
              Policy
            </Badge>
          </div>
          
          <div className="p-4 bg-white/70 rounded-lg border border-amber-200">
            <p className="text-sm font-medium text-gray-800 leading-relaxed">
              {questionData.policy}
            </p>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-amber-700">
            <AlertTriangle className="w-3 h-3" />
            <span>Evaluate each scenario against this policy</span>
          </div>
        </div>
      </Card>

      {/* Instructions */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Instructions:</strong> Select all scenarios that are compliant with the policy above. 
          You can select multiple scenarios.
        </p>
      </div>

      {/* Scenarios */}
      <div className="space-y-3">
        <h4 className="font-medium">Scenarios to Evaluate</h4>
        
        {questionData.scenarios.map((scenario, index) => {
          const status = getScenarioStatus(index);
          const isSelected = selectedScenarios.includes(index);
          const complianceLabel = getComplianceLabel(index);
          
          return (
            <Card
              key={index}
              className={`p-4 cursor-pointer transition-all duration-200 ${
                !showResult
                  ? isSelected
                    ? 'ring-2 ring-primary shadow-md bg-primary/5'
                    : 'hover:shadow-md hover:border-gray-300'
                  : status === 'correct'
                  ? 'ring-2 ring-green-500 bg-green-50 border-green-200'
                  : status === 'incorrect'
                  ? 'ring-2 ring-red-500 bg-red-50 border-red-200'
                  : status === 'missed'
                  ? 'ring-2 ring-yellow-500 bg-yellow-50 border-yellow-200'
                  : 'opacity-70'
              }`}
              onClick={() => toggleScenario(index)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {/* Selection Checkbox */}
                  <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                    !showResult
                      ? isSelected
                        ? 'border-primary bg-primary'
                        : 'border-gray-300'
                      : status === 'correct'
                      ? 'border-green-500 bg-green-500'
                      : status === 'incorrect'
                      ? 'border-red-500 bg-red-500'
                      : status === 'missed'
                      ? 'border-yellow-500 bg-yellow-500'
                      : 'border-gray-300'
                  }`}>
                    {(isSelected || (showResult && questionData.compliant.includes(index))) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        Scenario {index + 1}
                      </Badge>
                      {showResult && complianceLabel && (
                        <Badge 
                          variant={questionData.compliant.includes(index) ? 'default' : 'secondary'}
                          className={`text-xs ${
                            questionData.compliant.includes(index)
                              ? 'bg-green-100 text-green-800 border-green-300'
                              : 'bg-red-100 text-red-800 border-red-300'
                          }`}
                        >
                          {complianceLabel}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed text-gray-700">
                      {scenario}
                    </p>
                  </div>
                </div>
                
                {showResult && (
                  <div className="ml-3 flex-shrink-0">
                    {status === 'correct' && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {status === 'incorrect' && (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                    {status === 'missed' && (
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    )}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Result Summary */}
      {showResult && (
        <div className={`p-4 border rounded-lg ${
          isFullyCorrect 
            ? 'bg-green-50 border-green-200' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className={`font-medium ${
                isFullyCorrect ? 'text-green-900' : 'text-blue-900'
              }`}>
                {isFullyCorrect ? 'Perfect Score!' : 'Results'}
              </h4>
              <Badge variant={isFullyCorrect ? 'default' : 'secondary'}>
                {scoreInfo.score} / {scoreInfo.total}
              </Badge>
            </div>
            
            {questionData.explanation && (
              <p className={`text-sm ${
                isFullyCorrect ? 'text-green-800' : 'text-blue-800'
              }`}>
                {questionData.explanation}
              </p>
            )}
            
            <div className="text-xs space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-700">Correctly identified compliance</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-red-700">Incorrectly marked as compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-yellow-700">Missed compliant scenario</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!showResult && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {selectedScenarios.length} scenario{selectedScenarios.length !== 1 ? 's' : ''} selected
          </p>
          <Button 
            onClick={handleSubmit}
            disabled={selectedScenarios.length === 0}
          >
            Evaluate Compliance
          </Button>
        </div>
      )}
    </div>
  );
}