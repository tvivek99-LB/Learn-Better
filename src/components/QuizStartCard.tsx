import React from 'react';
import { Play, Clock, BookOpen, Brain, Target, Layers } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface QuizStartCardProps {
  onStartQuiz: () => void;
}

export function QuizStartCard({ onStartQuiz }: QuizStartCardProps) {
  return (
    <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Brain className="h-7 w-7 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Today's Practice Session</CardTitle>
              <p className="text-muted-foreground mt-2">Strengthen your knowledge through active recall</p>
            </div>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20 rounded-xl px-3 py-1">
            Ready
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Exercise Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-slate-50/80 rounded-xl border border-slate-100">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="text-lg">15-20 min</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-slate-50/80 rounded-xl border border-slate-100">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Questions</p>
              <p className="text-lg">25 types</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-slate-50/80 rounded-xl border border-slate-100">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">HLV Concepts</p>
              <p className="text-lg">12 covered</p>
            </div>
          </div>
        </div>

        {/* Retention Strategies */}
        <div className="bg-slate-50/80 rounded-xl border border-slate-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Layers className="h-5 w-5 text-primary" />
            </div>
            <h4 className="text-lg">Today's Focus Areas</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-sm">Spaced Repetition</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Active Recall</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm">Interleaving</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm">Elaboration</span>
            </div>
          </div>
        </div>

        {/* Recent Articles to Review */}
        <div className="bg-slate-50/80 rounded-xl border border-slate-100 p-6">
          <h4 className="text-lg mb-4">Concepts from Recent Articles</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Learning Psychology & Memory</span>
              <Badge variant="outline" className="text-xs rounded-lg">5 concepts</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Design Thinking & UX Principles</span>
              <Badge variant="outline" className="text-xs rounded-lg">4 concepts</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Data Science & Analysis</span>
              <Badge variant="outline" className="text-xs rounded-lg">3 concepts</Badge>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <Button 
          onClick={onStartQuiz}
          size="lg"
          className="w-full rounded-xl py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Play className="h-5 w-5 mr-2" />
          Start Today's Practice
        </Button>
        
        <p className="text-center text-sm text-muted-foreground">
          Press <kbd className="px-2 py-1 bg-slate-100 rounded text-xs">Ctrl/Cmd + R</kbd> to start quickly
        </p>
      </CardContent>
    </Card>
  );
}