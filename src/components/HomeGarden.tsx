import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Eye, BookOpen, BarChart3, Target } from 'lucide-react';

interface TopicData {
  id: string;
  name: string;
  retentionScore: number;
  conceptCount: number;
  lastStudied: string;
  trend: 'up' | 'down' | 'stable';
  plantEmoji: string;
  color: string;
}

interface HomeGardenProps {
  onViewGarden: () => void;
  onViewConcepts: (topicId: string) => void;
  onViewSummary: (topicId: string) => void;
  quizProgress: number;
}

const mockTopics: TopicData[] = [
  {
    id: 'machine-learning',
    name: 'Machine Learning',
    retentionScore: 87,
    conceptCount: 12,
    lastStudied: '2 days ago',
    trend: 'up',
    plantEmoji: '🌳',
    color: 'from-indigo-500 to-blue-600'
  },
  {
    id: 'react-development',
    name: 'React Development',
    retentionScore: 92,
    conceptCount: 15,
    lastStudied: '1 day ago',
    trend: 'up',
    plantEmoji: '🌸',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'data-structures',
    name: 'Data Structures',
    retentionScore: 73,
    conceptCount: 10,
    lastStudied: '5 days ago',
    trend: 'down',
    plantEmoji: '🌿',
    color: 'from-slate-500 to-slate-600'
  },
  {
    id: 'system-design',
    name: 'System Design',
    retentionScore: 65,
    conceptCount: 8,
    lastStudied: '3 days ago',
    trend: 'stable',
    plantEmoji: '🌱',
    color: 'from-amber-600 to-amber-700'
  }
];

const getScoreColor = (score: number) => {
  if (score >= 85) return 'text-indigo-600 bg-indigo-50 border-indigo-200';
  if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
  if (score >= 60) return 'text-slate-600 bg-slate-50 border-slate-200';
  return 'text-amber-700 bg-amber-50 border-amber-200';
};

const getScoreLabel = (score: number) => {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Needs Work';
};

export function HomeGarden({ onViewGarden, onViewConcepts, onViewSummary, quizProgress }: HomeGardenProps) {
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);

  const overallCompletion = Math.round(mockTopics.reduce((acc, topic) => acc + topic.retentionScore, 0) / mockTopics.length);

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-slate-800">Learning Garden</h2>
            <p className="text-slate-600">Your knowledge ecosystem at a glance</p>
          </div>
          <Button 
            variant="outline" 
            onClick={onViewGarden}
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            <Target className="w-4 h-4 mr-2" />
            View Full Garden
          </Button>
        </div>

        {/* Overall Progress Bar */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-slate-800">Overall Knowledge Retention</CardTitle>
              <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
                {overallCompletion}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress 
              value={overallCompletion} 
              className="h-3 bg-slate-100"
              style={{
                background: 'rgb(241, 245, 249)'
              }}
            />
            <div className="flex justify-between text-sm text-slate-600 mt-2">
              <span>Knowledge Retention</span>
              <span>{overallCompletion}% Complete</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockTopics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onMouseEnter={() => setHoveredTopic(topic.id)}
            onMouseLeave={() => setHoveredTopic(null)}
          >
            <Card className="border-slate-200 hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{topic.plantEmoji}</div>
                    <div>
                      <CardTitle className="text-lg text-slate-800">{topic.name}</CardTitle>
                      <p className="text-sm text-slate-600">{topic.conceptCount} concepts • {topic.lastStudied}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {topic.trend === 'up' && <div className="w-0 h-0 border-l-2 border-r-2 border-b-3 border-transparent border-b-green-500"></div>}
                    {topic.trend === 'down' && <div className="w-0 h-0 border-l-2 border-r-2 border-t-3 border-transparent border-t-red-500"></div>}
                    {topic.trend === 'stable' && <div className="w-3 h-0.5 bg-slate-400"></div>}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Retention Score */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Retention Score</span>
                  <Badge className={`${getScoreColor(topic.retentionScore)} font-medium`}>
                    {topic.retentionScore}% • {getScoreLabel(topic.retentionScore)}
                  </Badge>
                </div>

                {/* Progress Bar */}
                <Progress 
                  value={topic.retentionScore} 
                  className="h-2 bg-slate-100"
                  style={{
                    background: 'rgb(241, 245, 249)'
                  }}
                />

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewSummary(topic.id)}
                    className="flex-1 text-xs border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Summary
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewConcepts(topic.id)}
                    className="flex-1 text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                  >
                    <BookOpen className="w-3 h-3 mr-1" />
                    Concepts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-slate-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-800">Ready to grow your garden?</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Practice with spaced repetition to strengthen weak topics
                </p>
              </div>
              <Button 
                onClick={onViewGarden}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                Explore Garden
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}