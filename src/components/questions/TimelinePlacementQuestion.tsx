import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Check, X, Calendar } from 'lucide-react';

interface TimelineEvent {
  id: string;
  text: string;
  year: number;
}

interface TimelinePlacementQuestionData {
  events: TimelineEvent[];
  explanation?: string;
}

interface TimelinePlacementQuestionProps {
  questionData: TimelinePlacementQuestionData;
  onAnswer: (answer: { placements: { [eventId: string]: number }; isCorrect: boolean }) => void;
}

export function TimelinePlacementQuestion({ questionData, onAnswer }: TimelinePlacementQuestionProps) {
  const [placements, setPlacements] = useState<{ [eventId: string]: number }>({});
  const [showResult, setShowResult] = useState(false);

  // Calculate timeline range from the events
  const years = questionData.events.map(e => e.year);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const yearRange = maxYear - minYear;
  const timelineStart = minYear - Math.floor(yearRange * 0.1); // Add 10% padding
  const timelineEnd = maxYear + Math.floor(yearRange * 0.1);
  const fullRange = timelineEnd - timelineStart;
  const tolerance = 5; // Allow 5 years tolerance for correct answers

  const handleEventPlacement = (eventId: string, year: number) => {
    if (showResult) return;
    setPlacements(prev => ({ ...prev, [eventId]: year }));
  };

  const handleSubmit = () => {
    const isCorrect = questionData.events.every(event => {
      const placedYear = placements[event.id];
      if (!placedYear) return false;
      return Math.abs(placedYear - event.year) <= tolerance;
    });

    setShowResult(true);
    onAnswer({ placements, isCorrect });
  };

  const getEventStatus = (event: TimelineEvent) => {
    if (!showResult) return 'neutral';
    const placedYear = placements[event.id];
    if (!placedYear) return 'missing';
    
    const isCorrect = Math.abs(placedYear - event.year) <= tolerance;
    return isCorrect ? 'correct' : 'incorrect';
  };

  const unplacedEvents = questionData.events.filter(event => !placements[event.id]);
  const placedEvents = questionData.events.filter(event => placements[event.id]);

  // Generate marker years
  const markers = [];
  const step = Math.ceil(fullRange / 8); // About 8 markers
  for (let year = timelineStart; year <= timelineEnd; year += step) {
    markers.push(year);
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg mb-2">Place Events on Timeline</h3>
        <p className="text-muted-foreground">
          Place each historical event at the correct position on the timeline
        </p>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        <div className="relative bg-gray-50 rounded-lg p-6 overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Timeline line */}
            <div className="relative h-2 bg-gray-300 rounded-full mb-6">
              {/* Year markers */}
              {markers.map((year) => {
                const position = ((year - timelineStart) / fullRange) * 100;
                return (
                  <div
                    key={year}
                    className="absolute transform -translate-x-1/2"
                    style={{ left: `${position}%`, top: '-10px' }}
                  >
                    <div className="w-4 h-4 bg-primary rounded-full"></div>
                    <div className="text-xs text-center mt-2 whitespace-nowrap">
                      <div className="font-medium">{year}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Placed events */}
            <div className="relative mt-12">
              {placedEvents.map((event) => {
                const year = placements[event.id];
                const position = ((year - timelineStart) / fullRange) * 100;
                const status = getEventStatus(event);
                
                return (
                  <div
                    key={event.id}
                    className="absolute transform -translate-x-1/2"
                    style={{ left: `${position}%`, top: '0px' }}
                  >
                    <Card className={`p-3 max-w-48 text-center cursor-pointer transition-all ${
                      showResult
                        ? status === 'correct'
                          ? 'bg-green-50 border-green-300'
                          : 'bg-red-50 border-red-300'
                        : 'hover:shadow-md'
                    }`}>
                      <div className="flex items-center justify-center space-x-2 mb-1">
                        <Calendar className="w-3 h-3" />
                        <span className="text-xs font-medium">{year}</span>
                        {showResult && (
                          status === 'correct' ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <X className="w-3 h-3 text-red-600" />
                          )
                        )}
                      </div>
                      <p className="text-xs">{event.text}</p>
                      {showResult && status === 'incorrect' && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          Should be {event.year}
                        </Badge>
                      )}
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick year selector for mobile/easier placement */}
        {!showResult && unplacedEvents.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-3">Place Events</h4>
            <div className="space-y-3">
              {unplacedEvents.map((event) => (
                <div key={event.id} className="flex items-center space-x-3">
                  <span className="text-sm flex-1">{event.text}</span>
                  <select
                    className="px-3 py-1 border rounded text-sm"
                    onChange={(e) => handleEventPlacement(event.id, parseInt(e.target.value))}
                    value={placements[event.id] || ''}
                  >
                    <option value="">Select year</option>
                    {markers.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Unplaced events */}
      {!showResult && unplacedEvents.length > 0 && (
        <div>
          <h4 className="font-medium mb-3">Events to Place</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {unplacedEvents.map((event) => (
              <Card key={event.id} className="p-3">
                <p className="text-sm">{event.text}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {showResult && questionData.explanation && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Explanation</h4>
          <p className="text-blue-800 text-sm">{questionData.explanation}</p>
        </div>
      )}

      {!showResult && (
        <Button 
          onClick={handleSubmit}
          disabled={Object.keys(placements).length !== questionData.events.length}
          className="w-full sm:w-auto"
        >
          Submit Timeline
        </Button>
      )}
    </div>
  );
}