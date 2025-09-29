import React from 'react';
import { Card, CardContent } from './ui/card';
import { Sparkles, Brain, Target, Clock } from 'lucide-react';
import elephantIcon from 'figma:asset/6a6cf3248f5534ec8cbd485aa8e2c9106eadc475.png';

interface QuizWelcomeMessageProps {
  totalQuestions: number;
  onDismiss?: () => void;
}

export function QuizWelcomeMessage({ totalQuestions, onDismiss }: QuizWelcomeMessageProps) {
  return (
    <Card className="mb-8 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 border-2 border-blue-200/60 shadow-lg relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-4 right-6 w-8 h-8 bg-yellow-400 rounded-full opacity-60"></div>
      <div className="absolute bottom-6 left-8 w-6 h-6 bg-pink-500 rounded-full opacity-50"></div>
      <div className="absolute top-8 left-12 w-4 h-4 bg-green-500 rotate-45 opacity-60"></div>
      <div className="absolute bottom-4 right-12 w-5 h-5 bg-purple-500 rounded-full opacity-55"></div>
      
      <CardContent className="p-8 relative z-10">
        <div className="flex items-start space-x-6">
          {/* Elephant Icon */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <img 
                src={elephantIcon} 
                alt="Learn Better Elephant" 
                className="w-10 h-10"
              />
            </div>
          </div>
          
          {/* Welcome Content */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h2 className="text-blue-800">Welcome to Your Retention Practice Session!</h2>
            </div>
            
            <p className="text-gray-700 mb-4 leading-relaxed">
              Ready to strengthen your memory and boost your learning? This personalized session will test your knowledge through various question formats designed to enhance long-term retention.
            </p>
            
            {/* Session Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-blue-100">
                <Target className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="text-xs text-gray-600">Total Questions</div>
                  <div className="text-blue-800">{totalQuestions}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-purple-100">
                <Brain className="w-4 h-4 text-purple-600" />
                <div>
                  <div className="text-xs text-gray-600">Question Types</div>
                  <div className="text-purple-800">25 Varieties</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-green-100">
                <Clock className="w-4 h-4 text-green-600" />
                <div>
                  <div className="text-xs text-gray-600">Est. Time</div>
                  <div className="text-green-800">15-20 min</div>
                </div>
              </div>
            </div>
            
            {/* Encouragement */}
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg border border-blue-200/60">
              <p className="text-sm text-blue-800">
                <strong>🎯 Remember:</strong> Take your time and think carefully. Each question is designed to help you learn and remember better!
              </p>
            </div>

            {/* Dismiss Button */}
            {onDismiss && (
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={onDismiss}
                  className="text-xs text-blue-600 hover:text-blue-800 underline transition-colors"
                >
                  Got it, let's continue →
                </button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}