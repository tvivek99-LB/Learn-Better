import React from 'react';
import { Button } from '../ui/button';

export function TradeoffSliderQuestion({ questionData, onAnswer }: any) {
  return (
    <div className="space-y-6">
      <p className="text-lg">Trade-off Slider - Coming Soon!</p>
      <Button onClick={() => onAnswer({ placeholder: true })} variant="outline">Mark as Answered</Button>
    </div>
  );
}