import React, { useState } from 'react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Brain, TrendingUp, Target, Clock, Grid3X3, List, ChevronDown, Filter, X, CheckSquare, ArrowLeft } from 'lucide-react';
import { useTopicData } from './TopicDataManager';
import { CompactRetentionGraph } from './CompactRetentionGraph';

interface RetentionOverviewPageProps {
  onBack: () => void;
  onTopicClick?: (topic: string) => void;
}

export function RetentionOverviewPage({ onBack, onTopicClick }: RetentionOverviewPageProps) {
  const { getTopicRetentionData } = useTopicData();
  const allRetentionData = getTopicRetentionData();
  
  // Filter states
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'score-high' | 'score-low' | 'alphabetical'>('newest');
  const [topicFilters, setTopicFilters] = useState<string[]>([]);
  const [showLowRetention, setShowLowRetention] = useState(false);

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
    
    return filtered;
  };

  const filteredRetentionData = getFilteredAndSortedData();

  const clearAllFilters = () => {
    setTopicFilters([]);
    setShowLowRetention(false);
    setSelectedTopics([]);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (topicFilters.length > 0) count += topicFilters.length;
    if (showLowRetention) count += 1;
    if (selectedTopics.length > 0) count += 1;
    return count;
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelected = checked ? filteredRetentionData.map(item => item.topic) : [];
    setSelectedTopics(newSelected);
  };

  const isAllSelected = selectedTopics.length === filteredRetentionData.length && filteredRetentionData.length > 0;
  const isPartiallySelected = selectedTopics.length > 0 && selectedTopics.length < filteredRetentionData.length;
  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="flex items-center space-x-2"
          style={{ color: '#6B7280' }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Button>
        <div>
          <h1 className="text-2xl" style={{ color: '#232323' }}>Retention Overview</h1>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Filter and manage your {allRetentionData.length} learning topics
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center justify-between p-4 rounded-lg border" style={{ backgroundColor: '#FAF5D7', borderColor: '#F3E7B9' }}>
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
            <label htmlFor="select-all-filters" className="text-sm font-medium" style={{ color: '#232323' }}>
              Select all
            </label>
          </div>

          {/* View Mode Toggle */}
          <div className="flex rounded-lg border border-gray-300 bg-white">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('grid')}
              className={`rounded-l-lg px-3 py-2 h-8 ${viewMode === 'grid' ? 'bg-blue-100' : ''}`}
              style={{ color: viewMode === 'grid' ? '#2852E9' : '#6B7280' }}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('list')}
              className={`rounded-r-lg px-3 py-2 h-8 ${viewMode === 'list' ? 'bg-blue-100' : ''}`}
              style={{ color: viewMode === 'list' ? '#2852E9' : '#6B7280' }}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center space-x-2 h-8">
                <span className="text-sm">
                  {sortOrder === 'newest' ? 'Newest F' :
                   sortOrder === 'oldest' ? 'Oldest F' :
                   sortOrder === 'score-high' ? 'High Score' :
                   sortOrder === 'score-low' ? 'Low Score' :
                   'A-Z'}
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
                className="text-red-600 hover:text-red-700 h-6 px-2"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
          )}
          <div className="text-sm font-medium" style={{ color: '#6B7280' }}>
            {filteredRetentionData.length} of {allRetentionData.length} topics
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

      {/* Retention Overview Component */}
      <CompactRetentionGraph 
        showAllTopics={true}
        enableMultiSelect={false}
        onTopicClick={onTopicClick}
      />
    </div>
  );
}