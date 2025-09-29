import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface MatrixGridQuestionProps {
  questionData: {
    rows: string[];
    columns: string[];
    cells: Record<string, string>;
    explanation: string;
  };
  onAnswer: (answer: Record<string, string>) => void;
  currentAnswer?: Record<string, string>;
}

export function MatrixGridQuestion({ questionData, onAnswer, currentAnswer }: MatrixGridQuestionProps) {
  const [answers, setAnswers] = useState<Record<string, string>>(currentAnswer || {});
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (currentAnswer) {
      setAnswers(currentAnswer);
    }
  }, [currentAnswer]);

  // Get all possible values from the correct answers
  const getAllPossibleValues = () => {
    const values = new Set(Object.values(questionData.cells));
    return Array.from(values).sort();
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string | undefined) => {
    const cellKey = `${questionData.rows[rowIndex]}-${questionData.columns[colIndex]}`;
    const newAnswers = { ...answers };
    
    if (!value || value === '') {
      delete newAnswers[cellKey];
    } else {
      newAnswers[cellKey] = value;
    }
    
    setAnswers(newAnswers);
    onAnswer(newAnswers);
  };

  const getCellValue = (rowIndex: number, colIndex: number) => {
    const cellKey = `${questionData.rows[rowIndex]}-${questionData.columns[colIndex]}`;
    return answers[cellKey] || '';
  };

  const getCorrectValue = (rowIndex: number, colIndex: number) => {
    const cellKey = `${questionData.rows[rowIndex]}-${questionData.columns[colIndex]}`;
    return questionData.cells[cellKey];
  };

  const isCellCorrect = (rowIndex: number, colIndex: number) => {
    const cellKey = `${questionData.rows[rowIndex]}-${questionData.columns[colIndex]}`;
    return answers[cellKey] === questionData.cells[cellKey];
  };

  const checkAnswer = () => {
    setShowFeedback(true);
  };

  const possibleValues = getAllPossibleValues();

  return (
    <div className="space-y-6">
      <div className="text-lg">
        Complete the matrix by selecting the appropriate value for each cell.
      </div>

      {/* Matrix Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Matrix Grid</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-border p-3 bg-muted font-medium text-left">
                    {/* Empty top-left cell */}
                  </th>
                  {questionData.columns.map((column, index) => (
                    <th key={index} className="border border-border p-3 bg-muted font-medium text-center min-w-[120px]">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {questionData.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="border border-border p-3 bg-muted font-medium">
                      {row}
                    </td>
                    {questionData.columns.map((column, colIndex) => (
                      <td key={colIndex} className="border border-border p-2">
                        <Select
                          value={getCellValue(rowIndex, colIndex) || undefined}
                          onValueChange={(value) => handleCellChange(rowIndex, colIndex, value)}
                        >
                          <SelectTrigger 
                            className={`w-full ${
                              showFeedback
                                ? isCellCorrect(rowIndex, colIndex)
                                  ? 'border-green-500 bg-green-50'
                                  : getCellValue(rowIndex, colIndex)
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-yellow-500 bg-yellow-50'
                                : ''
                            }`}
                          >
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {possibleValues.map((value) => (
                              <SelectItem key={value} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Possible Values Reference */}
      <div className="bg-muted rounded-lg p-4">
        <h4 className="font-medium mb-2">Available Options:</h4>
        <div className="flex flex-wrap gap-2">
          {possibleValues.map((value) => (
            <span key={value} className="px-2 py-1 bg-background rounded border text-sm">
              {value}
            </span>
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
          <h4 className="font-medium mb-3">Correct Matrix:</h4>
          
          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-blue-300 p-2 bg-blue-100 font-medium text-left">
                    {/* Empty top-left cell */}
                  </th>
                  {questionData.columns.map((column, index) => (
                    <th key={index} className="border border-blue-300 p-2 bg-blue-100 font-medium text-center">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {questionData.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="border border-blue-300 p-2 bg-blue-100 font-medium">
                      {row}
                    </td>
                    {questionData.columns.map((column, colIndex) => (
                      <td key={colIndex} className="border border-blue-300 p-2 text-center bg-white">
                        <span className="font-medium">
                          {getCorrectValue(rowIndex, colIndex)}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <p className="text-sm text-muted-foreground">{questionData.explanation}</p>
        </div>
      )}
    </div>
  );
}