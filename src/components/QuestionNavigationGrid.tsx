import React from 'react';
import { Check, Circle, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
export interface QuestionData {
  id: string;
  type: string;
  title: string;
  data: any;
}

interface QuestionNavigationGridProps {
  questions: QuestionData[];
  currentQuestionIndex: number;
  answers: Record<string, any>;
  onSelectQuestion: (index: number) => void;
  onClose: () => void;
}

export function QuestionNavigationGrid({
  questions,
  currentQuestionIndex,
  answers,
  onSelectQuestion,
  onClose
}: QuestionNavigationGridProps) {
  const answeredCount = Object.keys(answers).length;

  const getQuestionStatus = (questionId: string) => {
    return answers[questionId] !== undefined;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={onClose} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Quiz</span>
        </Button>
        
        <div className="text-center">
          <h2 className="text-xl">Question Navigation</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {answeredCount} of {questions.length} questions answered
          </p>
        </div>

        <div className="w-20" /> {/* Spacer for balance */}
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {questions.map((question, index) => {
          const isAnswered = getQuestionStatus(question.id);
          const isCurrent = index === currentQuestionIndex;
          
          return (
            <Card 
              key={question.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isCurrent ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onSelectQuestion(index)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      Q{index + 1}
                    </Badge>
                    {isCurrent && (
                      <Badge variant="default" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {isAnswered ? (
                      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 dark:bg-green-900">
                        <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                      </div>
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
                <CardTitle className="text-sm leading-tight">
                  {question.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Badge variant="secondary" className="text-xs">
                  {question.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-medium text-green-600">{answeredCount}</div>
            <div className="text-sm text-muted-foreground">Answered</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-medium text-orange-600">{questions.length - answeredCount}</div>
            <div className="text-sm text-muted-foreground">Remaining</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-medium text-blue-600">{Math.round((answeredCount / questions.length) * 100)}%</div>
            <div className="text-sm text-muted-foreground">Complete</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}