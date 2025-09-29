import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Brain, TrendingUp, Target, Clock, Grid3X3, List, ChevronDown, Filter, X, CheckSquare } from 'lucide-react';
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
  enableMultiSelect?: boolean; // If true, show checkboxes for multi-selection
  onSelectedTopicsChange?: (selectedTopics: string[]) => void; // Callback for when selection changes
  showFilters?: boolean; // If true, show filter controls
  isFullPage?: boolean; // If true, render as full page component with filters
  selectedTopicsFromParent?: string[]; // Topics that are currently selected in parent component
}

export function CompactRetentionGraph({ 
  onTopicClick, 
  showAllTopics = false, 
  enableMultiSelect = false, // Default to false to maintain original behavior
  onSelectedTopicsChange,
  showFilters = false,
  isFullPage = false,
  selectedTopicsFromParent = []
}: CompactRetentionGraphProps) {
  const { getTopicRetentionData } = useTopicData();
  const allRetentionData = getTopicRetentionData();
  
  // Multi-select state
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  
  // Filter states
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'score-high' | 'score-low' | 'alphabetical'>('newest');
  const [topicFilters, setTopicFilters] = useState<string[]>([]);
  const [showLowRetention, setShowLowRetention] = useState(false);
  
  const averageScore = Math.round(allRetentionData.reduce((acc, item) => acc + item.score, 0) / allRetentionData.length);
  const improvingTopics = allRetentionData.filter(item => item.trend === 'up').length;

  // Filter handlers
  const handleTopicFilter = (topic: string, checked: boolean) => {
    setTopicFilters(prev => 
      checked ? [...prev, topic] : prev.filter(t => t !== topic)
    );
  };

  const clearAllFilters = () => {
    setTopicFilters([]);
    setShowLowRetention(false);
    setSelectedTopics([]);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (topicFilters.length > 0) count += topicFilters.length;
    if (showLowRetention) count += 1;
    if (selectedTopics.length > 0) count += 1; // Selection as a filter
    return count;
  };

  // Apply filters and sorting
  const getFilteredAndSortedData = () => {
    let filtered = [...allRetentionData];
    
    // Apply topic filters
    if (topicFilters.length > 0) {
      filtered = filtered.filter(item => topicFilters.includes(item.topic));
    }
    
    // Apply low retention filter
    if (showLowRetention) {
      filtered = filtered.filter(item => item.score < 50);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'score-high':
          return b.score - a.score;
        case 'score-low':
          return a.score - b.score;
        case 'alphabetical':
          return a.topic.localeCompare(b.topic);
        case 'oldest':
          return new Date(a.lastStudied).getTime() - new Date(b.lastStudied).getTime();
        case 'newest':
        default:
          return new Date(b.lastStudied).getTime() - new Date(a.lastStudied).getTime();
      }
    });
    
    return showAllTopics ? filtered : filtered.slice(0, 4);
  };

  const filteredRetentionData = getFilteredAndSortedData();
  const activeFilterCount = getActiveFilterCount();
  const retentionData = filteredRetentionData;

  // Multi-select handlers
  const handleTopicSelect = (topic: string, checked: boolean) => {
    const newSelected = checked 
      ? [...selectedTopics, topic]
      : selectedTopics.filter(t => t !== topic);
    
    setSelectedTopics(newSelected);
    onSelectedTopicsChange?.(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelected = checked ? retentionData.map(item => item.topic) : [];
    setSelectedTopics(newSelected);
    onSelectedTopicsChange?.(newSelected);
  };

  const isAllSelected = selectedTopics.length === retentionData.length && retentionData.length > 0;
  const isPartiallySelected = selectedTopics.length > 0 && selectedTopics.length < retentionData.length;

  // If this is a full page view, render with filters
  if (isFullPage) {
    return (
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center space-x-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#232323' }}>Retention Overview</h1>
            <p className="text-sm" style={{ color: '#6B7280' }}>Filter and manage your learning topics</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Select All */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all-filters"
                checked={isAllSelected}
                indeterminate={isPartiallySelected}
                onCheckedChange={handleSelectAll}
                className="border-gray-400"
              />
              <label htmlFor="select-all-filters" className="text-sm" style={{ color: '#6B7280' }}>
                Select all
              </label>
            </div>

            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-gray-300">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`rounded-l-lg px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-100' : ''}`}
                style={{ color: viewMode === 'grid' ? '#2852E9' : '#6B7280' }}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
                className={`rounded-r-lg px-3 py-2 ${viewMode === 'list' ? 'bg-blue-100' : ''}`}
                style={{ color: viewMode === 'list' ? '#2852E9' : '#6B7280' }}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <span className="text-sm">
                    {sortOrder === 'newest' ? 'Newest First' :
                     sortOrder === 'oldest' ? 'Oldest First' :
                     sortOrder === 'score-high' ? 'Highest Score' :
                     sortOrder === 'score-low' ? 'Lowest Score' :
                     'Alphabetical'}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortOrder('newest')}>
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder('oldest')}>
                  Oldest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder('score-high')}>
                  Highest Score
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder('score-low')}>
                  Lowest Score
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder('alphabetical')}>
                  Alphabetical
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Active Filters Indicator */}
          <div className="flex items-center space-x-3">
            {activeFilterCount > 0 && (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Filter className="w-3 h-3" />
                  <span>{activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''}</span>
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              </div>
            )}
            <div className="text-sm" style={{ color: '#6B7280' }}>
              {retentionData.length} of {allRetentionData.length} topics
            </div>
          </div>
        </div>

        {/* Selected Topics Indicator */}
        {selectedTopics.length > 0 && (
          <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: '#E6F3FF' }}>
            <CheckSquare className="w-4 h-4" style={{ color: '#2852E9' }} />
            <span className="text-sm font-medium" style={{ color: '#2852E9' }}>
              {selectedTopics.length} topic{selectedTopics.length !== 1 ? 's' : ''} selected
            </span>
            <Badge 
              variant="outline" 
              className="ml-2"
              style={{ backgroundColor: '#2852E9', color: 'white', borderColor: '#2852E9' }}
            >
              Filter Applied
            </Badge>
          </div>
        )}

        {/* Retention Overview Card */}
        <div className="rounded-xl border border-slate-200/60" style={{ backgroundColor: '#FAF5D7' }}>
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
                      onTopicClick && !enableMultiSelect ? 'cursor-pointer hover:bg-white/50 -mx-2 px-2 py-1 rounded-md transition-colors' : ''
                    }`}
                    onClick={() => !enableMultiSelect && onTopicClick?.(item.topic)}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      {enableMultiSelect && (
                        <Checkbox
                          id={`topic-${item.topic}`}
                          checked={selectedTopics.includes(item.topic)}
                          onCheckedChange={(checked) => handleTopicSelect(item.topic, checked as boolean)}
                          className="border-gray-400"
                        />
                      )}
                      <span 
                        className={`truncate ${onTopicClick && !enableMultiSelect ? 'hover:opacity-80' : ''} ${
                          selectedTopics.includes(item.topic) ? 'font-semibold' : ''
                        }`}
                        style={{ 
                          color: selectedTopics.includes(item.topic) ? '#2852E9' : '#232323'
                        }}
                      >
                        {item.topic}
                      </span>
                      {selectedTopics.includes(item.topic) && (
                        <Badge variant="outline" className="text-xs" style={{ backgroundColor: '#2852E9', color: 'white', borderColor: '#2852E9' }}>
                          Selected
                        </Badge>
                      )}
                    </div>
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
                        backgroundColor: selectedTopics.includes(item.topic) ? '#2852E9' : '#2852E9'
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
                {!showAllTopics && allRetentionData.length > retentionData.length && (
                  <div>Showing {retentionData.length} of {allRetentionData.length}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original compact view for homepage
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
        
        {/* Multi-select controls - only show when enabled */}
        {enableMultiSelect && (
          <div className="flex items-center space-x-2 mt-3">
            <Checkbox
              id="select-all-topics"
              checked={isAllSelected}
              indeterminate={isPartiallySelected}
              onCheckedChange={handleSelectAll}
              className="border-gray-400"
            />
            <label 
              htmlFor="select-all-topics"
              className="text-sm cursor-pointer select-none"
              style={{ color: '#6B7280' }}
            >
              Select All ({selectedTopics.length} selected)
            </label>
          </div>
        )}
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

        {/* Active Topic Filters - Show when topics are selected from parent */}
        {showAllTopics && selectedTopicsFromParent.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4" style={{ color: '#2852E9' }} />
                <span className="text-sm" style={{ color: '#232323' }}>
                  Active Filters
                </span>
              </div>
              <Badge variant="outline" style={{ backgroundColor: '#2852E9', color: 'white', borderColor: '#2852E9' }}>
                {selectedTopicsFromParent.length} selected
              </Badge>
            </div>
            
            {/* Filter tags */}
            <div className="flex flex-wrap gap-1.5">
              {selectedTopicsFromParent.map((topicName) => (
                <div
                  key={topicName}
                  className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs border"
                  style={{ 
                    backgroundColor: '#E6F3FF', 
                    borderColor: '#2852E9',
                    color: '#2852E9'
                  }}
                >
                  <span>{topicName}</span>
                  <button
                    onClick={() => {
                      // Find the topic and trigger click to remove filter
                      if (onTopicClick) {
                        onTopicClick(topicName);
                      }
                    }}
                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
                  onTopicClick && !enableMultiSelect ? 'cursor-pointer hover:bg-white/50 -mx-2 px-2 py-1 rounded-md transition-colors' : ''
                }`}
                onClick={() => !enableMultiSelect && onTopicClick?.(item.topic)}
              >
                <div className="flex items-center space-x-3 flex-1">
                  {enableMultiSelect && (
                    <Checkbox
                      id={`topic-${item.topic}`}
                      checked={selectedTopics.includes(item.topic)}
                      onCheckedChange={(checked) => handleTopicSelect(item.topic, checked as boolean)}
                      className="border-gray-400"
                    />
                  )}
                  <span 
                    className={`truncate ${onTopicClick && !enableMultiSelect ? 'hover:opacity-80' : ''}`}
                    style={{ color: '#232323' }}
                  >
                    {item.topic}
                  </span>
                </div>
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