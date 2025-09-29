import React from 'react';
import { ArrowLeft, Trophy, Target, Clock, Brain, BookOpen, Star, Lock, CheckCircle, TrendingUp, Calendar, Zap, Award, Medal, Upload, Percent } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { RetentionTestPanel } from './RetentionTestPanel';
import elephantIcon from 'figma:asset/6a6cf3248f5534ec8cbd485aa8e2c9106eadc475.png';

interface StatsPageProps {
  onBack: () => void;
}

interface Skill {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  unlocked: boolean;
  progress: number;
  level: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  unlocked: boolean;
  unlockedDate?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const skills: Skill[] = [
  {
    id: 'memory',
    name: 'Memory Master',
    icon: Brain,
    description: 'Enhance your retention and recall abilities',
    unlocked: true,
    progress: 85,
    level: 3
  },
  {
    id: 'speed',
    name: 'Speed Reader',
    icon: Zap,
    description: 'Increase your reading comprehension speed',
    unlocked: true,
    progress: 65,
    level: 2
  },
  {
    id: 'focus',
    name: 'Focus Champion',
    icon: Target,
    description: 'Master sustained attention and concentration',
    unlocked: true,
    progress: 40,
    level: 1
  },
  {
    id: 'consistency',
    name: 'Consistency King',
    icon: Calendar,
    description: 'Build and maintain daily learning habits',
    unlocked: false,
    progress: 20,
    level: 0
  },
  {
    id: 'analysis',
    name: 'Critical Analyst',
    icon: BookOpen,
    description: 'Develop deep analytical thinking skills',
    unlocked: false,
    progress: 10,
    level: 0
  },
  {
    id: 'synthesis',
    name: 'Knowledge Synthesizer',
    icon: Star,
    description: 'Connect ideas across different domains',
    unlocked: false,
    progress: 5,
    level: 0
  }
];

const achievements: Achievement[] = [
  {
    id: 'first_session',
    name: 'First Steps',
    description: 'Complete your first practice session',
    icon: CheckCircle,
    unlocked: true,
    unlockedDate: '2024-01-15',
    rarity: 'common'
  },
  {
    id: 'week_streak',
    name: 'Week Warrior',
    description: 'Maintain a 7-day practice streak',
    icon: Trophy,
    unlocked: true,
    unlockedDate: '2024-01-22',
    rarity: 'rare'
  },
  {
    id: 'perfect_score',
    name: 'Perfectionist',
    description: 'Score 100% on a practice session',
    icon: Medal,
    unlocked: true,
    unlockedDate: '2024-01-18',
    rarity: 'epic'
  },
  {
    id: 'month_streak',
    name: 'Monthly Master',
    description: 'Maintain a 30-day practice streak',
    icon: Award,
    unlocked: false,
    rarity: 'legendary'
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete 25 questions in under 5 minutes',
    icon: Zap,
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'knowledge_vault',
    name: 'Knowledge Collector',
    description: 'Add 100 articles to your library',
    icon: BookOpen,
    unlocked: false,
    rarity: 'epic'
  }
];

const stats = {
  totalPracticeSessions: 47,
  totalTimeSpent: 312, // minutes
  learningMaterialsUploaded: 34,
  retentionScore: 82, // percentage
  questionsAnswered: 1247,
  articlesRead: 89,
  conceptsLearned: 156
};

export function StatsPage({ onBack }: StatsPageProps) {
  const getRarityStyle = (rarity: Achievement['rarity'], unlocked: boolean) => {
    if (!unlocked) {
      return {
        backgroundColor: '#F8F9FA',
        borderColor: '#E2E8F0',
        color: '#8E8E93'
      };
    }
    
    switch (rarity) {
      case 'common': 
        return {
          backgroundColor: '#F3E7B9',
          borderColor: '#FAF5D7',
          color: '#232323'
        };
      case 'rare':
      case 'epic':
      case 'legendary':
        return {
          backgroundColor: '#2852E9',
          borderColor: '#2050B3',
          color: 'white'
        };
      default: 
        return {
          backgroundColor: '#F3E7B9',
          borderColor: '#FAF5D7',
          color: '#232323'
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with elephant mascot */}
      <div className="rounded-xl p-8 relative overflow-hidden shadow-lg border border-slate-200/60" style={{ backgroundColor: '#F3E7B9' }}>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-6">
            <Button 
              onClick={onBack}
              variant="ghost" 
              size="sm"
              className="rounded-xl p-3"
              style={{ color: '#232323' }}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-200/60">
                <img src={elephantIcon} alt="Learn Better" className="w-10 h-10" style={{ filter: 'brightness(0) saturate(100%) invert(13%) sepia(64%) saturate(2026%) hue-rotate(202deg) brightness(94%) contrast(97%)' }} />
              </div>
              <div>
                <h1 className="mb-1" style={{ color: '#232323' }}>Your Learning Journey</h1>
                <p style={{ color: '#8E8E93' }}>Track your progress and unlock new achievements</p>
              </div>
            </div>
          </div>
          
          <div className="text-center bg-white rounded-2xl p-4 shadow-lg border border-slate-200/60">
            <div className="text-3xl" style={{ color: '#2852E9' }}>{stats.retentionScore}%</div>
            <div className="text-sm" style={{ color: '#8E8E93' }}>Retention Score</div>
          </div>
        </div>
      </div>

      {/* Key Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-lg p-6 text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#2852E9' }}>
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div className="text-2xl mb-1" style={{ color: '#232323' }}>{stats.totalPracticeSessions}</div>
          <div className="text-sm" style={{ color: '#8E8E93' }}>Practice Sessions</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/60 shadow-lg p-6 text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#2852E9' }}>
            <Clock className="h-6 w-6 text-white" />
          </div>
          <div className="text-2xl mb-1" style={{ color: '#232323' }}>{Math.floor(stats.totalTimeSpent / 60)}h {stats.totalTimeSpent % 60}m</div>
          <div className="text-sm" style={{ color: '#8E8E93' }}>Total Time</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/60 shadow-lg p-6 text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#2852E9' }}>
            <Upload className="h-6 w-6 text-white" />
          </div>
          <div className="text-2xl mb-1" style={{ color: '#232323' }}>{stats.learningMaterialsUploaded}</div>
          <div className="text-sm" style={{ color: '#8E8E93' }}>Materials Uploaded</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/60 shadow-lg p-6 text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#2852E9' }}>
            <Percent className="h-6 w-6 text-white" />
          </div>
          <div className="text-2xl mb-1" style={{ color: '#232323' }}>{stats.retentionScore}%</div>
          <div className="text-sm" style={{ color: '#8E8E93' }}>Retention Score</div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="rounded-xl p-8 relative overflow-hidden shadow-lg border border-slate-200/60" style={{ backgroundColor: '#FFFBE6' }}>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#2852E9' }}>
              <Target className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="mb-1" style={{ color: '#232323' }}>Learning Skills</h2>
              <p style={{ color: '#8E8E93' }}>Master different aspects of learning</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => {
              const IconComponent = skill.icon;
              return (
                <div 
                  key={skill.id} 
                  className={`relative overflow-hidden transition-all duration-300 rounded-xl border shadow-md ${
                    skill.unlocked 
                      ? 'bg-white border-slate-200/60 hover:shadow-lg cursor-pointer hover:scale-[1.02]' 
                      : 'bg-gray-100 border-gray-200/60'
                  }`}
                >
                  {/* Locked overlay */}
                  {!skill.unlocked && (
                    <div className="absolute inset-0 bg-gray-500/20 backdrop-blur-[1px] z-10 flex items-center justify-center">
                      <div className="bg-gray-600 rounded-full p-3">
                        <Lock className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        skill.unlocked 
                          ? ''
                          : 'bg-gray-400'
                      }`} style={skill.unlocked ? { backgroundColor: '#2852E9' } : {}}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      {skill.unlocked && (
                        <span className="text-xs px-3 py-1 rounded-full text-white" style={{ backgroundColor: '#2852E9' }}>
                          Level {skill.level}
                        </span>
                      )}
                    </div>
                    <h3 className={`text-lg mb-2 ${skill.unlocked ? '' : 'text-gray-500'}`} style={skill.unlocked ? { color: '#232323' } : {}}>
                      {skill.name}
                    </h3>
                    
                    <p className={`text-sm mb-4 ${skill.unlocked ? '' : 'text-gray-400'}`} style={skill.unlocked ? { color: '#8E8E93' } : {}}>
                      {skill.description}
                    </p>
                    {skill.unlocked && (
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span style={{ color: '#8E8E93' }}>Progress</span>
                          <span style={{ color: '#232323' }}>{skill.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${skill.progress}%`,
                              backgroundColor: '#2852E9'
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="rounded-xl p-8 relative overflow-hidden shadow-lg border border-slate-200/60" style={{ backgroundColor: '#F3E7B9' }}>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#2852E9' }}>
              <Trophy className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="mb-1" style={{ color: '#232323' }}>Achievements</h2>
              <p style={{ color: '#8E8E93' }}>Unlock badges as you progress</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {achievements.map((achievement) => {
              const IconComponent = achievement.icon;
              const rarityStyle = getRarityStyle(achievement.rarity, achievement.unlocked);
              
              return (
                <div 
                  key={achievement.id}
                  className="relative p-4 text-center transition-all duration-300 rounded-xl border-2 shadow-md hover:shadow-lg"
                  style={{
                    backgroundColor: rarityStyle.backgroundColor,
                    borderColor: rarityStyle.borderColor,
                    color: rarityStyle.color
                  }}
                >
                  {/* Locked overlay for unearned achievements */}
                  {!achievement.unlocked && (
                    <div className="absolute inset-0 bg-gray-500/40 backdrop-blur-[1px] rounded-lg flex items-center justify-center">
                      <Lock className="h-5 w-5 text-gray-600" />
                    </div>
                  )}
                  
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    achievement.unlocked ? 'bg-white/20' : 'bg-gray-400'
                  }`}>
                    <IconComponent className={`h-5 w-5 ${achievement.unlocked ? (achievement.rarity === 'common' ? 'text-gray-700' : 'text-white') : 'text-gray-600'}`} />
                  </div>
                  
                  <h3 className="text-xs mb-1">
                    {achievement.name}
                  </h3>
                  
                  <p className="text-xs opacity-80">
                    {achievement.description}
                  </p>
                  
                  {achievement.unlocked && achievement.unlockedDate && (
                    <p className="text-xs opacity-60 mt-1">
                      {new Date(achievement.unlockedDate).toLocaleDateString()}
                    </p>
                  )}
                  
                  {achievement.unlocked && (
                    <span className="mt-2 text-xs px-2 py-1 rounded-full inline-block bg-black/10">
                      {achievement.rarity}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Retention Test Panel */}
      <div className="space-y-4">
        <RetentionTestPanel />
      </div>

      {/* Progress Legend */}
      <div className="flex items-center justify-center space-x-8">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#2852E9' }}></div>
          <span className="text-sm" style={{ color: '#232323' }}>Primary Actions</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F3E7B9' }}></div>
          <span className="text-sm" style={{ color: '#232323' }}>Secondary Elements</span>
        </div>
      </div>
    </div>
  );
}