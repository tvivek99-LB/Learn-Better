import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Check, X, BarChart3 } from 'lucide-react';

interface ChartDataPoint {
  x: number;
  y: number;
}

interface ChartReadingQuestionData {
  chartType: string;
  title: string;
  xAxis: string;
  yAxis: string;
  data: ChartDataPoint[];
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface ChartReadingQuestionProps {
  questionData: ChartReadingQuestionData;
  onAnswer: (answer: { selectedAnswer: number; isCorrect: boolean }) => void;
}

export function ChartReadingQuestion({ questionData, onAnswer }: ChartReadingQuestionProps) {
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

  // Format data for Recharts
  const chartData = questionData.data.map(point => ({
    name: point.x.toString(),
    value: point.y,
    x: point.x,
    y: point.y
  }));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg mb-2">Chart Analysis</h3>
        <p className="text-muted-foreground">
          Study the chart and answer the question below
        </p>
      </div>

      {/* Chart Section */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h4 className="font-medium">{questionData.title}</h4>
            </div>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <span>X-Axis: {questionData.xAxis}</span>
              <span>Y-Axis: {questionData.yAxis}</span>
            </div>
          </div>
          
          {/* Chart Visualization */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b"
                  fontSize={12}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <p className="text-sm font-medium">{`${questionData.xAxis}: ${label}`}</p>
                          <p className="text-sm text-primary">{`${questionData.yAxis}: ${payload[0].value}`}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Data Table */}
          <div className="mt-4">
            <h5 className="text-sm font-medium mb-2">Data Points</h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {questionData.data.map((point, index) => (
                <Badge key={index} variant="secondary" className="justify-center">
                  ({point.x}, {point.y})
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Question */}
      <div>
        <h4 className="font-medium mb-4">{questionData.question}</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {questionData.options.map((option, index) => {
            const status = getOptionStatus(index);
            const isSelected = selectedAnswer === index;
            
            return (
              <Card
                key={index}
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  isSelected && !showResult
                    ? 'ring-2 ring-primary shadow-md'
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
                  <span className="text-sm">{option}</span>
                  
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

      {showResult && questionData.explanation && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Explanation</h4>
          <p className="text-blue-800 text-sm">{questionData.explanation}</p>
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