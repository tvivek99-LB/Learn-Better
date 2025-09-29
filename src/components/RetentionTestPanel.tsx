import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { useTopicData } from './TopicDataManager';

export function RetentionTestPanel() {
  const { topics, calculateTopicRetention, recordReviewSession } = useTopicData();

  const handleReviewSession = (topicId: string, success: boolean) => {
    recordReviewSession(topicId, success);
  };

  const formatOptimalReviewDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else {
      return `Due in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    }
  };

  const getRetentionColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (topic: any) => {
    const retention = calculateTopicRetention(topic.id);
    if (retention >= 85) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (retention <= 70) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <div className="h-4 w-4" />; // Empty space for stable
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Retention Score Testing Panel</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Test the spaced repetition retention calculation by recording review sessions
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topics.map(topic => {
            const retentionScore = calculateTopicRetention(topic.id);
            const masteryPercentage = Math.round((topic.conceptsMastered / topic.totalConcepts) * 100);
            
            return (
              <div 
                key={topic.id} 
                className="p-4 border rounded-lg bg-white"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-medium">{topic.name}</h3>
                    {getTrendIcon(topic)}
                    <Badge variant="outline">Level {topic.spacedRepetitionLevel}</Badge>
                    <Badge variant={topic.lastReviewSuccess ? "default" : "secondary"}>
                      {topic.consecutiveSuccessfulReviews} streak
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${getRetentionColor(retentionScore)}`}>
                      {retentionScore}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      retention score
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-sm font-medium">{masteryPercentage}%</div>
                    <div className="text-xs text-muted-foreground">mastery</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">{topic.conceptsMastered}/{topic.totalConcepts}</div>
                    <div className="text-xs text-muted-foreground">concepts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">
                      {Math.ceil((Date.now() - topic.lastVisited.getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-xs text-muted-foreground">days ago</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-blue-600">
                      {formatOptimalReviewDate(topic.optimalNextReview)}
                    </div>
                    <div className="text-xs text-muted-foreground">next review</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Last review: {topic.lastReviewSuccess ? 'Success' : 'Failed'} • 
                    {topic.reviewHistory.length} total reviews
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReviewSession(topic.id, false)}
                      className="flex items-center space-x-1"
                    >
                      <XCircle className="h-3 w-3" />
                      <span>Failed Review</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleReviewSession(topic.id, true)}
                      className="flex items-center space-x-1"
                    >
                      <CheckCircle className="h-3 w-3" />
                      <span>Successful Review</span>
                    </Button>
                  </div>
                </div>

                {/* Review History Preview */}
                {topic.reviewHistory.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-xs text-muted-foreground mb-2">Recent Review History:</div>
                    <div className="flex space-x-1">
                      {topic.reviewHistory.slice(0, 10).map((review, index) => (
                        <div
                          key={index}
                          className={`w-3 h-3 rounded-full ${
                            review.success ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          title={`${review.success ? 'Success' : 'Failed'} - ${review.date.toLocaleDateString()}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}