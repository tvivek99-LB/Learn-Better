import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Brain, Clock, Target, ChevronRight, Check, Plus, BookOpen } from 'lucide-react';
import elephantIcon from 'figma:asset/6a6cf3248f5534ec8cbd485aa8e2c9106eadc475.png';

interface TodaysPracticeSessionProps {
  onStartPractice: () => void;
  hasCompletedToday?: boolean;
  hasQuestions?: boolean;
  quizProgress?: number; // Progress percentage (0-100)
  onNavigateToLibrary?: () => void;
  practiceTopics?: string[]; // Topics covered in the practice session
}

export function TodaysPracticeSession({ 
  onStartPractice, 
  hasCompletedToday = false, 
  hasQuestions = true,
  quizProgress = 0,
  onNavigateToLibrary,
  practiceTopics = ['Machine Learning', 'React Development', 'Data Structures']
}: TodaysPracticeSessionProps) {
  
  // First-time user state - no questions available
  if (!hasQuestions) {
    return (
      <div className="bg-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 relative overflow-hidden border border-border h-full flex flex-col justify-center">
        {/* Gentle floating elements */}
        <div className="absolute top-6 right-8 w-24 h-24 bg-gradient-to-br from-primary/20 to-blue-300/20 rounded-full opacity-60 blur-lg"></div>
        <div className="absolute bottom-12 left-8 w-16 h-16 bg-gradient-to-tr from-indigo-200/25 to-purple-200/25 rounded-full opacity-40 blur-xl"></div>
        <div className="absolute top-16 right-20 w-1 h-1 bg-primary/30 rounded-full"></div>
        <div className="absolute top-20 right-16 w-0.5 h-0.5 bg-primary/40 rounded-full"></div>
        
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl text-foreground mb-4">Welcome to Learn Better!</h2>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            Get started on your knowledge retention journey with Learn Better. Our platform provides all the tools and features you need to design, customize, and share your learning exercises effortlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button 
              onClick={onNavigateToLibrary}
              className="rounded-xl px-8 py-4"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Article
            </Button>
            <Button 
              variant="outline"
              onClick={onNavigateToLibrary}
              className="rounded-xl px-8 py-4"
            >
              Open Library
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="bg-muted/30 rounded-xl p-6 max-w-lg">
            <p className="text-sm text-muted-foreground">
              Transform the way you retain knowledge with Learn Better. Our intuitive interface and powerful features empower you to create diverse and challenging learning experiences for enhanced retention.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasCompletedToday) {
    // Check if quiz is in progress
    if (quizProgress > 0) {
      // In-progress state with progress bar
      const questionsAnswered = Math.floor((quizProgress / 100) * 25); // Assuming 25 total questions
      const timeSpent = Math.floor((quizProgress / 100) * 10); // Assuming 10 minutes total
      
      return (
        <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 border border-slate-200/60 h-full flex flex-col justify-between">
          {/* Simplified Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FAF5D7' }}>
                <img src={elephantIcon} alt="Learn Better" className="w-6 h-6" style={{ filter: 'brightness(0) saturate(100%) invert(13%) sepia(64%) saturate(2026%) hue-rotate(202deg) brightness(94%) contrast(97%)' }} />
              </div>
              <div>
                <h2 style={{ color: '#232323' }}>Practice In Progress</h2>
              </div>
            </div>
            
            {/* Combined progress and time */}
            <div className="text-center rounded-xl px-4 py-2" style={{ backgroundColor: '#FAF5D7' }}>
              <div style={{ color: '#2852E9', fontWeight: '700' }} className="text-lg">{quizProgress}% Complete - {timeSpent} min left</div>
            </div>
          </div>

          {/* Session Progress bar */}
          <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: '#FAF5D7' }}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ color: '#232323' }}>Session Progress</span>
              <span style={{ color: '#6B7280' }} className="text-sm">{25 - questionsAnswered} questions remaining</span>
            </div>
            <div className="w-full bg-white rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${quizProgress}%`,
                  backgroundColor: '#2852E9'
                }}
              ></div>
            </div>
          </div>

          {/* Condensed Topics covered section */}
          <div className="mb-6">
            <div className="mb-3">
              <span style={{ color: '#6B7280' }} className="text-sm">Topics Covered</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {practiceTopics.map((topic, index) => (
                <span
                  key={index}
                  className="text-xs px-3 py-1 rounded-full"
                  style={{ 
                    backgroundColor: '#FAF5D7',
                    color: '#232323'
                  }}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Simple motivational text */}
          <div className="mb-6">
            <p style={{ color: '#6B7280' }} className="text-sm text-center">
              Great progress! Keep going to strengthen retention.
            </p>
          </div>

          {/* Resume button */}
          <div className="text-center">
            <Button 
              onClick={onStartPractice}
              className="rounded-xl px-8 py-3 text-white transition-all duration-200"
              style={{ backgroundColor: '#2852E9' }}
            >
              Resume Practice Session
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      );
    }

    // Simple start interface - no progress yet
    return (
      <div className="bg-white rounded-xl p-6 sm:p-8 lg:p-12 border border-slate-200/60 h-full flex flex-col justify-center">
        <div className="max-w-2xl">
          <h2 style={{ color: '#232323' }} className="text-3xl mb-4">Ready for Today's Practice?</h2>
          <p style={{ color: '#8E8E93' }} className="text-lg mb-6 leading-relaxed">
            Join our platform to strengthen your knowledge through spaced repetition. Take 10 minutes to sharpen your understanding and boost long-term retention of key concepts.
          </p>
          
          {/* Topics for today's session */}
          <div className="rounded-lg p-4 mb-8" style={{ backgroundColor: '#FAF5D7' }}>
            <div className="mb-3">
              <span style={{ color: '#8E8E93' }} className="text-sm">Today's Session Topics</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {practiceTopics.map((topic, index) => (
                <span
                  key={index}
                  className="text-xs px-3 py-1 rounded-full"
                  style={{ 
                    backgroundColor: '#FAF5D7',
                    color: '#232323'
                  }}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
          
          <Button 
            onClick={onStartPractice}
            className="rounded-xl px-8 py-4 text-white"
            style={{ backgroundColor: '#2852E9' }}
          >
            Start Creating
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // Completion state with metrics
  const timeSpentToday = 10; // minutes spent on quiz
  const score = 85; // percentage score

  return (
    <div className="bg-white rounded-xl p-8 border border-slate-200/60 h-full flex flex-col justify-between">
      {/* Simplified Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FAF5D7' }}>
            <Check className="w-6 h-6" style={{ color: '#2852E9' }} />
          </div>
          <div>
            <h2 style={{ color: '#232323' }}>Practice Complete! 🎉</h2>
          </div>
        </div>
        
        <div className="text-center rounded-lg px-4 py-2" style={{ backgroundColor: '#FAF5D7' }}>
          <div style={{ color: '#2852E9' }} className="text-lg">{score}% - {timeSpentToday} min</div>
          <div style={{ color: '#8E8E93' }} className="text-sm">Retention Score</div>
        </div>
      </div>

      {/* Topics mastered section */}
      <div className="mb-6">
        <div className="mb-3">
          <span style={{ color: '#8E8E93' }} className="text-sm">Topics Mastered Today</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {practiceTopics.map((topic, index) => (
            <span
              key={index}
              className="text-xs px-3 py-1 rounded-full"
              style={{ 
                backgroundColor: '#FAF5D7',
                color: '#232323'
              }}
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Simple completion message */}
      <div>
        <p style={{ color: '#8E8E93' }} className="text-sm text-center">
          Great job! Your knowledge has been strengthened. Come back tomorrow for your next session!
        </p>
      </div>
    </div>
  );
}