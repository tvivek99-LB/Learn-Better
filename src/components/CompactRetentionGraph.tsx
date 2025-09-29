import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Brain, TrendingUp, Target, Clock } from 'lucide-react';
import { useTopicData } from './TopicDataManager';

interface RetentionData {
  topic: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  lastStudied: string;
}

interface CompactRetentionGraphProps {
  onTopicClick?: (topic: string) => void;
  showAllTopics?: boolean; // If true, show all topics (for library); if false, show max 4 (for homepage)
}

export function CompactRetentionGraph({ onTopicClick, showAllTopics = false }: CompactRetentionGraphProps) {
  const { getTopicRetentionData } = useTopicData();
  const allRetentionData = getTopicRetentionData();
  
  // For homepage: show only up to 4 topics (quiz topics prioritized)
  // For library: show all topics
  const retentionData = showAllTopics ? allRetentionData : allRetentionData.slice(0, 4);
  
  const averageScore = Math.round(allRetentionData.reduce((acc, item) => acc + item.score, 0) / allRetentionData.length);
  const improvingTopics = allRetentionData.filter(item => item.trend === 'up').length;

  return (
    <div className="h-full rounded-xl border border-slate-200/60" style={{ backgroundColor: '#FAF5D7' }}>
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between">
          <h3 style={{ color: '#232323' }} className="text-lg flex items-center">
            <Brain className="w-5 h-5 mr-2" style={{ color: '#2852E9' }} />
            Retention Overview
          </h3>
          <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'white', color: '#2852E9', borderColor: '#FAF5D7' }}>
            <span style={{ fontSize: '1.125rem', fontWeight: '700' }}>{averageScore}% Average</span>
          </div>
        </div>
      </div>
      
      <div className="px-4 space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-white rounded-lg border border-slate-200/40">
            <div className="text-xl" style={{ color: '#232323' }}>{improvingTopics}</div>
            <div className="text-xs flex items-center justify-center" style={{ color: '#6B7280' }}>
              <TrendingUp className="w-3 h-3 mr-1" />
              Improving
            </div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border border-slate-200/40">
            <div className="text-xl" style={{ color: '#232323' }}>{allRetentionData.length}</div>
            <div className="text-xs flex items-center justify-center" style={{ color: '#6B7280' }}>
              <Target className="w-3 h-3 mr-1" />
              Topics
            </div>
          </div>
        </div>

        {/* Retention Bars */}
        <div className="space-y-3">
          {retentionData.map((item, index) => (
            <motion.div
              key={item.topic}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div 
                className={`flex items-center justify-between text-sm ${
                  onTopicClick ? 'cursor-pointer hover:bg-white/50 -mx-2 px-2 py-1 rounded-md transition-colors' : ''
                }`}
                onClick={() => onTopicClick?.(item.topic)}
              >
                <span 
                  className={`truncate ${onTopicClick ? 'hover:opacity-80' : ''}`}
                  style={{ color: '#232323' }}
                >
                  {item.topic}
                </span>
                <div className="flex items-center space-x-2">
                  {item.trend === 'up' && <div className="w-0 h-0 border-l-2 border-r-2 border-b-3 border-transparent" style={{ borderBottomColor: '#2852E9' }}></div>}
                  {item.trend === 'down' && <div className="w-0 h-0 border-l-2 border-r-2 border-t-3 border-transparent border-t-red-500"></div>}
                  {item.trend === 'stable' && <div className="w-3 h-0.5 bg-slate-400"></div>}
                  <span style={{ color: '#6B7280' }} className="font-medium">{item.score}%</span>
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${item.score}%`,
                    backgroundColor: '#2852E9'
                  }}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="pt-2 border-t border-white/60 pb-4">
          <div className="flex items-center justify-between text-xs" style={{ color: '#6B7280' }}>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              Last updated: 2 hours ago
            </div>
            {!showAllTopics && allRetentionData.length > 4 && (
              <div>Showing 4 of {allRetentionData.length}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}