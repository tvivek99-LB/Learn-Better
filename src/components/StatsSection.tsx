import React from 'react';
import { BookOpen, TrendingUp, Target } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export function StatsSection() {
  const stats = [
    {
      label: 'Hours of content',
      value: '700+',
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      label: 'Active Users',
      value: '575k+',
      icon: <TrendingUp className="h-5 w-5" />
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            {stat.icon}
          </div>
          <div>
            <p className="text-3xl lg:text-4xl tracking-tight">{stat.value}</p>
            <p className="text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}