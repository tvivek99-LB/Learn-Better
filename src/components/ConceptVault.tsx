import React, { useState, useMemo } from 'react';
import { BookOpen, Lightbulb, Calendar, Tag, FileText, Brain, Target, ArrowLeft, File, Link, Type, Plus, Minus, CheckSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { useContentData } from './ContentDataManager';

interface ConceptVaultProps {
  onBackToHome?: () => void;
}

export function ConceptVault({ onBackToHome }: ConceptVaultProps) {
  const { 
    concepts, 
    contentItems, 
    selectedConcepts, 
    conceptsInRetentionPlan,
    toggleConceptSelection,
    selectAllConceptsFromContent,
    selectAllConceptsFromTopic,
    addAllConceptsToRetentionPlanFromContent,
    addAllConceptsToRetentionPlanFromTopic,
    removeAllConceptsFromRetentionPlanFromContent,
    removeAllConceptsFromRetentionPlanFromTopic,
    areAllConceptsInRetentionPlanFromContent,
    areAllConceptsInRetentionPlanFromTopic,
    clearConceptSelection,
    addSelectedConceptsToRetentionPlan,
    removeSelectedConceptsFromRetentionPlan,
    toggleConceptRetentionPlan
  } = useContentData();
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [expandedArticles, setExpandedArticles] = useState<Set<string>>(new Set());

  // Group concepts by content item
  const conceptsByContent = useMemo(() => {
    const grouped = new Map<string, { content: any; concepts: any[] }>();
    
    concepts.forEach(concept => {
      const contentId = concept.contentId || 'no-source';
      if (!grouped.has(contentId)) {
        const content = contentItems.find(item => item.id === contentId);
        grouped.set(contentId, {
          content: content || { 
            id: 'no-source', 
            title: 'Concepts without source', 
            type: 'text',
            dateAdded: new Date().toISOString().split('T')[0] 
          },
          concepts: []
        });
      }
      grouped.get(contentId)!.concepts.push(concept);
    });

    // Sort by date (newest first)
    return Array.from(grouped.values()).sort((a, b) => 
      new Date(b.content.dateAdded).getTime() - new Date(a.content.dateAdded).getTime()
    );
  }, [concepts, contentItems]);

  // Group concepts by topic
  const conceptsByTopic = useMemo(() => {
    const grouped = new Map<string, { topic: string; concepts: any[]; contentSources: Set<string> }>();
    
    concepts.forEach(concept => {
      const contentId = concept.contentId;
      const content = contentItems.find(item => item.id === contentId);
      
      if (content && content.topics && content.topics.length > 0) {
        // Add concept to each topic it belongs to
        content.topics.forEach(topic => {
          if (!grouped.has(topic)) {
            grouped.set(topic, {
              topic,
              concepts: [],
              contentSources: new Set()
            });
          }
          grouped.get(topic)!.concepts.push(concept);
          grouped.get(topic)!.contentSources.add(content.title);
        });
      } else {
        // Handle concepts without topics
        const noTopicKey = 'No Topic';
        if (!grouped.has(noTopicKey)) {
          grouped.set(noTopicKey, {
            topic: noTopicKey,
            concepts: [],
            contentSources: new Set()
          });
        }
        grouped.get(noTopicKey)!.concepts.push(concept);
        if (content) {
          grouped.get(noTopicKey)!.contentSources.add(content.title);
        }
      }
    });

    // Sort topics alphabetically, but put "No Topic" at the end
    return Array.from(grouped.values()).sort((a, b) => {
      if (a.topic === 'No Topic') return 1;
      if (b.topic === 'No Topic') return -1;
      return a.topic.localeCompare(b.topic);
    });
  }, [concepts, contentItems]);

  const toggleCardExpansion = (id: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleArticleExpansion = (id: string) => {
    setExpandedArticles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Get content item by ID to show source
  const getContentSource = (contentId?: string) => {
    if (!contentId) return null;
    return contentItems.find(item => item.id === contentId);
  };

  // Get type icon for content
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'file':
        return <File className="h-4 w-4" />;
      case 'url':
        return <Link className="h-4 w-4" />;
      case 'text':
        return <Type className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'file':
        return { backgroundColor: '#F3E7B9', color: '#2852E9' };
      case 'url':
        return { backgroundColor: '#FAF5D7', color: '#2852E9' };
      case 'text':
        return { backgroundColor: '#FFFBE6', color: '#2852E9' };
      default:
        return { backgroundColor: '#F3E7B9', color: '#2852E9' };
    }
  };

  // Render expanded concept content with new design
  const renderExpandedConcept = (concept: any) => (
    <div className="space-y-0 -mx-4 -mb-4">
      {/* Concept Header */}
      <div className="px-4 py-3 rounded-t-lg" style={{ backgroundColor: '#2852E9' }}>
        <h4 className="text-sm font-semibold" style={{ color: 'white' }}>
          {concept.concept}
        </h4>
      </div>

      {/* Content Sections */}
      <div className="p-4 space-y-4" style={{ backgroundColor: '#F8F9FA' }}>
        {/* Key Content */}
        {concept.keyContent && (
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-4 w-4" style={{ color: '#232323' }} />
              <h5 className="text-sm font-semibold" style={{ color: '#232323' }}>
                Key Content
              </h5>
            </div>
            <p className="text-sm mb-2" style={{ color: '#232323' }}>
              {concept.keyContent}
            </p>
          </div>
        )}

        {/* Examples */}
        {concept.examples && concept.examples.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="h-4 w-4" style={{ color: '#232323' }} />
              <h5 className="text-sm font-semibold" style={{ color: '#232323' }}>
                Examples
              </h5>
            </div>
            <div className="space-y-1">
              {concept.examples.map((example: string, index: number) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-sm mt-0.5" style={{ color: '#232323' }}>•</span>
                  <p className="text-sm" style={{ color: '#232323' }}>{example}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actionable Tip */}
        {concept.actionableTip && (
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-4 w-4" style={{ color: '#232323' }} />
              <h5 className="text-sm font-semibold" style={{ color: '#232323' }}>
                Actionable Tip
              </h5>
            </div>
            <p className="text-sm" style={{ color: '#232323' }}>
              {concept.actionableTip}
            </p>
          </div>
        )}

        {/* Source Article */}
        {(() => {
          const sourceContent = contentItems.find(item => item.id === concept.contentId);
          return sourceContent ? (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <BookOpen className="h-4 w-4" style={{ color: '#232323' }} />
                <h5 className="text-sm font-semibold" style={{ color: '#232323' }}>
                  Source Article
                </h5>
              </div>
              <p className="text-sm font-medium" style={{ color: '#232323' }}>
                {sourceContent.title}
              </p>
              <p className="text-xs mt-1" style={{ color: '#8E8E93' }}>
                {sourceContent.type === 'url' && sourceContent.url ? (
                  <span>
                    {new URL(sourceContent.url).hostname} • {new Date(sourceContent.dateAdded).toLocaleDateString()}
                  </span>
                ) : (
                  <span>
                    {sourceContent.type === 'file' ? 'File' : 'Text'} • {new Date(sourceContent.dateAdded).toLocaleDateString()}
                  </span>
                )}
              </p>
            </div>
          ) : null;
        })()}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBackToHome && (
            <Button 
              variant="ghost" 
              onClick={onBackToHome}
              className="flex items-center space-x-2 rounded-xl"
              style={{ color: '#8E8E93' }}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          )}
          <div>
            <h1 style={{ color: '#232323' }}>My Concept Vault</h1>
            <p className="mt-2" style={{ color: '#8E8E93' }}>
              {concepts.length} concepts from {contentItems.length} content items
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4" style={{ color: '#2852E9' }} />
            <span className="text-sm" style={{ color: '#232323' }}>
              {concepts.length} Total Concepts
            </span>
          </div>
        </div>
      </div>

      {/* Info Bar - Only items in retention plan will be used for quizzes */}
      {conceptsInRetentionPlan.length > 0 && (
        <div className="flex items-center space-x-2 p-3 rounded-lg" style={{ backgroundColor: '#FAF5D7' }}>
          <Brain className="h-4 w-4" style={{ color: '#2852E9' }} />
          <span className="text-sm" style={{ color: '#232323' }}>
            {conceptsInRetentionPlan.length} item{conceptsInRetentionPlan.length !== 1 ? 's' : ''} in retention plan
          </span>
          <span className="text-sm" style={{ color: '#8E8E93' }}>
            Only items in retention plan will be used for quizzes
          </span>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="by-article" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8" style={{ backgroundColor: '#FAF5D7' }}>
          <TabsTrigger 
            value="by-article" 
            className="data-[state=active]:bg-white data-[state=active]:text-blue-accent rounded-xl"
            style={{ color: '#232323' }}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            By Article
          </TabsTrigger>
          <TabsTrigger 
            value="by-topic" 
            className="data-[state=active]:bg-white data-[state=active]:text-blue-accent rounded-xl"
            style={{ color: '#232323' }}
          >
            <Target className="h-4 w-4 mr-2" />
            By Topic
          </TabsTrigger>
        </TabsList>

        {/* By Article Tab */}
        <TabsContent value="by-article" className="space-y-8">
          {/* Empty State */}
          {concepts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FAF5D7' }}>
                <BookOpen className="w-10 h-10" style={{ color: '#2852E9' }} />
              </div>
              <h3 style={{ color: '#232323' }}>No articles with concepts yet</h3>
              <p style={{ color: '#8E8E93' }}>
                Add content with key concepts to organize them by article
              </p>
            </div>
          )}

          {/* Articles with Concepts */}
          {conceptsByContent.length > 0 && (
            <div className="space-y-6">
              {conceptsByContent.map(({ content, concepts: articleConcepts }) => {
                const isArticleExpanded = expandedArticles.has(content.id);
                
                return (
                  <Card key={content.id} className="overflow-hidden">
                    <CardHeader 
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleArticleExpansion(content.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="p-3 rounded-lg" style={getTypeColor(content.type)}>
                            {getTypeIcon(content.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <CardTitle className="text-lg" style={{ color: '#232323' }}>
                                {content.title}
                              </CardTitle>
                              {/* Display Topics right next to the article name */}
                              {content.topics && content.topics.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {content.topics.slice(0, 2).map((topic: string, index: number) => (
                                    <span 
                                      key={index} 
                                      className="text-xs px-2 py-1 rounded-full whitespace-nowrap"
                                      style={{ backgroundColor: '#FAF5D7', color: '#2852E9' }}
                                    >
                                      {topic}
                                    </span>
                                  ))}
                                  {content.topics.length > 2 && (
                                    <span className="text-xs px-2 py-1 rounded-full whitespace-nowrap" style={{ backgroundColor: '#F3E7B9', color: '#8E8E93' }}>
                                      +{content.topics.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="text-sm flex items-center space-x-1" style={{ color: '#8E8E93' }}>
                                <Brain className="h-3 w-3" />
                                <span>
                                  {articleConcepts.length} concept{articleConcepts.length !== 1 ? 's' : ''}
                                  {(() => {
                                    const conceptsInPlan = articleConcepts.filter(concept => concept.inRetentionPlan).length;
                                    if (articleConcepts.length >= 4 && conceptsInPlan > 0) {
                                      return ` (${conceptsInPlan} in Plan)`;
                                    }
                                    return '';
                                  })()}
                                </span>
                              </span>
                              <span className="text-sm" style={{ color: '#8E8E93' }}>
                                Added {new Date(content.dateAdded).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {isArticleExpanded && (() => {
                            const allInPlan = areAllConceptsInRetentionPlanFromContent(content.id);
                            const selectedContentConcepts = articleConcepts.filter(concept => selectedConcepts.has(concept.id));
                            const hasSelectedConcepts = selectedContentConcepts.length > 0;
                            
                            return (
                              <div className="flex items-center space-x-2">
                                {/* Primary Action: Add/Remove All */}
                                <Button
                                  variant={allInPlan ? "outline" : "default"}
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (allInPlan) {
                                      removeAllConceptsFromRetentionPlanFromContent(content.id);
                                    } else {
                                      addAllConceptsToRetentionPlanFromContent(content.id);
                                    }
                                  }}
                                  className="rounded-lg text-sm font-semibold px-3 py-1.5 h-8"
                                  style={{ 
                                    backgroundColor: allInPlan ? 'transparent' : '#2852E9',
                                    color: allInPlan ? '#DC2626' : '#ffffff',
                                    borderColor: allInPlan ? '#DC2626' : 'transparent'
                                  }}
                                >
                                  {allInPlan ? 'Remove All' : 'Add All'}
                                </Button>

                                {/* Secondary Action: Selected Concepts */}
                                {hasSelectedConcepts && (() => {
                                  const selectedInPlan = selectedContentConcepts.filter(concept => concept.inRetentionPlan);
                                  const selectedNotInPlan = selectedContentConcepts.filter(concept => !concept.inRetentionPlan);
                                  const allSelectedInPlan = selectedInPlan.length === selectedContentConcepts.length;
                                  const noneSelectedInPlan = selectedInPlan.length === 0;
                                  
                                  return (
                                    <div className="flex items-center">
                                      <span className="text-sm font-medium mr-3" style={{ color: '#2852E9' }}>
                                        {selectedContentConcepts.length} selected:
                                      </span>
                                      <div className="flex space-x-2">
                                        {/* Show Add to Plan only if some/all are not in plan */}
                                        {!allSelectedInPlan && (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              addSelectedConceptsToRetentionPlan();
                                            }}
                                            className="rounded-lg text-sm font-semibold h-8 w-32"
                                            style={{ 
                                              backgroundColor: '#F3E7B9',
                                              color: '#2852E9',
                                              borderColor: '#F3E7B9'
                                            }}
                                            title={`Add ${selectedNotInPlan.length} selected concepts`}
                                          >
                                            Add to Plan
                                          </Button>
                                        )}
                                        {/* Show Remove from Plan only if some/all are in plan */}
                                        {!noneSelectedInPlan && (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              removeSelectedConceptsFromRetentionPlan();
                                            }}
                                            className="rounded-lg text-sm font-semibold h-8 w-36"
                                            style={{ 
                                              backgroundColor: '#F3E7B9',
                                              color: '#2852E9',
                                              borderColor: '#F3E7B9'
                                            }}
                                            title={`Remove ${selectedInPlan.length} selected concepts`}
                                          >
                                            Remove from Plan
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            );
                          })()}
                          
                          {/* Tertiary Action: Collapse */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-lg flex-shrink-0 text-xs px-2"
                            style={{ color: '#6B7280' }}
                          >
                            {isArticleExpanded ? 'Collapse' : 'Expand'}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {isArticleExpanded && (
                      <CardContent className="pt-0">
                        <div className="border-t border-slate-200/60 pt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {articleConcepts.map((concept: any) => {
                              const isConceptExpanded = expandedCards.has(concept.id);
                              
                              return (
                                <Card key={concept.id} className="bg-gray-50 hover:bg-gray-100 transition-colors">
                                  <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-start space-x-3 flex-1">
                                        <Checkbox
                                          checked={selectedConcepts.has(concept.id)}
                                          onCheckedChange={() => toggleConceptSelection(concept.id)}
                                          className="mt-1"
                                        />
                                        <div className="flex-1">
                                          <div className="flex items-center space-x-2 mb-2">
                                            <Lightbulb className="h-4 w-4" style={{ color: '#2852E9' }} />
                                            <CardTitle className="text-base" style={{ color: '#232323' }}>
                                              {concept.concept}
                                            </CardTitle>
                                            {concept.inRetentionPlan && (
                                              <Badge variant="outline" className="text-xs ml-2" style={{ backgroundColor: '#2852E9', color: 'white', borderColor: '#2852E9' }}>
                                                In Plan
                                              </Badge>
                                            )}
                                          </div>
                                          <Badge 
                                            variant="outline" 
                                            className="text-xs"
                                            style={{ backgroundColor: '#F3E7B9', color: '#232323', borderColor: '#F3E7B9' }}
                                          >
                                            {concept.category}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleConceptRetentionPlan(concept.id);
                                          }}
                                          className="flex-shrink-0 rounded-lg text-base h-12 w-12 p-0"
                                          style={{ color: concept.inRetentionPlan ? '#8E8E93' : '#2852E9' }}
                                        >
                                          {concept.inRetentionPlan ? '−' : '+'}
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => toggleCardExpansion(concept.id)}
                                          className="flex-shrink-0 rounded-lg text-xs"
                                          style={{ color: '#2852E9' }}
                                        >
                                          {isConceptExpanded ? 'Less' : 'More'}
                                        </Button>
                                      </div>
                                    </div>
                                  </CardHeader>

                                  <CardContent className="pt-0">
                                    <div className="p-3 rounded-lg mb-3" style={{ backgroundColor: '#FFFBE6' }}>
                                      <p className="text-sm" style={{ color: '#232323' }}>
                                        {concept.explanation}
                                      </p>
                                    </div>

                                    {isConceptExpanded && renderExpandedConcept(concept)}
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* By Topic Tab */}
        <TabsContent value="by-topic" className="space-y-8">
          {/* Empty State */}
          {concepts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FAF5D7' }}>
                <Target className="w-10 h-10" style={{ color: '#2852E9' }} />
              </div>
              <h3 style={{ color: '#232323' }}>No topics with concepts yet</h3>
              <p style={{ color: '#8E8E93' }}>
                Add content with topics to organize concepts by subject area
              </p>
            </div>
          )}

          {/* Topics with Concepts */}
          {conceptsByTopic.length > 0 && (
            <div className="space-y-6">
              {conceptsByTopic.map(({ topic, concepts: topicConcepts, contentSources }) => {
                const isTopicExpanded = expandedArticles.has(topic);
                
                return (
                  <Card key={topic} className="overflow-hidden">
                    <CardHeader 
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleArticleExpansion(topic)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="p-3 rounded-lg" style={{ backgroundColor: '#FAF5D7', color: '#2852E9' }}>
                            <Target className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <CardTitle className="text-lg" style={{ color: '#232323' }}>
                                {topic}
                              </CardTitle>
                              {/* Topic badge for visual consistency */}
                              <span 
                                className="text-xs px-2 py-1 rounded-full whitespace-nowrap"
                                style={{ backgroundColor: '#FFFBE6', color: '#2852E9' }}
                              >
                                Topic
                              </span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="text-sm flex items-center space-x-1" style={{ color: '#8E8E93' }}>
                                <Brain className="h-3 w-3" />
                                <span>
                                  {topicConcepts.length} concept{topicConcepts.length !== 1 ? 's' : ''}
                                  {(() => {
                                    const conceptsInPlan = topicConcepts.filter(concept => concept.inRetentionPlan).length;
                                    if (topicConcepts.length >= 4 && conceptsInPlan > 0) {
                                      return ` (${conceptsInPlan} in Plan)`;
                                    }
                                    return '';
                                  })()}
                                </span>
                              </span>
                              <span className="text-sm" style={{ color: '#8E8E93' }}>
                                From {contentSources.size} source{contentSources.size !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {isTopicExpanded && (() => {
                            const allInPlan = areAllConceptsInRetentionPlanFromTopic(topic);
                            const selectedTopicConcepts = topicConcepts.filter(concept => selectedConcepts.has(concept.id));
                            const hasSelectedConcepts = selectedTopicConcepts.length > 0;
                            
                            return (
                              <div className="flex items-center space-x-2">
                                {/* Primary Action: Add/Remove All */}
                                <Button
                                  variant={allInPlan ? "outline" : "default"}
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (allInPlan) {
                                      removeAllConceptsFromRetentionPlanFromTopic(topic);
                                    } else {
                                      addAllConceptsToRetentionPlanFromTopic(topic);
                                    }
                                  }}
                                  className="rounded-lg text-sm font-semibold px-3 py-1.5 h-8"
                                  style={{ 
                                    backgroundColor: allInPlan ? 'transparent' : '#2852E9',
                                    color: allInPlan ? '#DC2626' : '#ffffff',
                                    borderColor: allInPlan ? '#DC2626' : 'transparent'
                                  }}
                                >
                                  {allInPlan ? 'Remove All' : 'Add All'}
                                </Button>

                                {/* Secondary Action: Selected Concepts */}
                                {hasSelectedConcepts && (() => {
                                  const selectedInPlan = selectedTopicConcepts.filter(concept => concept.inRetentionPlan);
                                  const selectedNotInPlan = selectedTopicConcepts.filter(concept => !concept.inRetentionPlan);
                                  const allSelectedInPlan = selectedInPlan.length === selectedTopicConcepts.length;
                                  const noneSelectedInPlan = selectedInPlan.length === 0;
                                  
                                  return (
                                    <div className="flex items-center">
                                      <span className="text-sm font-medium mr-3" style={{ color: '#2852E9' }}>
                                        {selectedTopicConcepts.length} selected:
                                      </span>
                                      <div className="flex space-x-2">
                                        {/* Show Add to Plan only if some/all are not in plan */}
                                        {!allSelectedInPlan && (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              addSelectedConceptsToRetentionPlan();
                                            }}
                                            className="rounded-lg text-sm font-semibold h-8 w-32"
                                            style={{ 
                                              backgroundColor: '#F3E7B9',
                                              color: '#2852E9',
                                              borderColor: '#F3E7B9'
                                            }}
                                            title={`Add ${selectedNotInPlan.length} selected concepts`}
                                          >
                                            Add to Plan
                                          </Button>
                                        )}
                                        {/* Show Remove from Plan only if some/all are in plan */}
                                        {!noneSelectedInPlan && (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              removeSelectedConceptsFromRetentionPlan();
                                            }}
                                            className="rounded-lg text-sm font-semibold h-8 w-36"
                                            style={{ 
                                              backgroundColor: '#F3E7B9',
                                              color: '#2852E9',
                                              borderColor: '#F3E7B9'
                                            }}
                                            title={`Remove ${selectedInPlan.length} selected concepts`}
                                          >
                                            Remove from Plan
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            );
                          })()}
                          
                          {/* Tertiary Action: Collapse */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-lg flex-shrink-0 text-sm font-medium px-3 py-1.5 h-8"
                            style={{ color: '#6B7280' }}
                          >
                            {isTopicExpanded ? 'Collapse' : 'Expand'}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {isTopicExpanded && (
                      <CardContent className="pt-0">
                        <div className="border-t border-slate-200/60 pt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {topicConcepts.map((concept: any) => {
                              const isConceptExpanded = expandedCards.has(concept.id);
                              const sourceContent = getContentSource(concept.contentId);
                              
                              return (
                                <Card key={concept.id} className="bg-gray-50 hover:bg-gray-100 transition-colors">
                                  <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-start space-x-3 flex-1">
                                        <Checkbox
                                          checked={selectedConcepts.has(concept.id)}
                                          onCheckedChange={() => toggleConceptSelection(concept.id)}
                                          className="mt-1"
                                        />
                                        <div className="flex-1">
                                          <div className="flex items-center space-x-2 mb-2">
                                            <Lightbulb className="h-4 w-4" style={{ color: '#2852E9' }} />
                                            <CardTitle className="text-base" style={{ color: '#232323' }}>
                                              {concept.concept}
                                            </CardTitle>
                                            {concept.inRetentionPlan && (
                                              <Badge variant="outline" className="text-xs ml-2" style={{ backgroundColor: '#2852E9', color: 'white', borderColor: '#2852E9' }}>
                                                In Plan
                                              </Badge>
                                            )}
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Badge 
                                              variant="outline" 
                                              className="text-xs"
                                              style={{ backgroundColor: '#F3E7B9', color: '#232323', borderColor: '#F3E7B9' }}
                                            >
                                              {concept.category}
                                            </Badge>
                                            {sourceContent && (
                                              <span className="text-xs" style={{ color: '#8E8E93' }}>
                                                From: {sourceContent.title}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleConceptRetentionPlan(concept.id);
                                          }}
                                          className="flex-shrink-0 rounded-lg text-base h-12 w-12 p-0"
                                          style={{ color: concept.inRetentionPlan ? '#8E8E93' : '#2852E9' }}
                                        >
                                          {concept.inRetentionPlan ? '−' : '+'}
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => toggleCardExpansion(concept.id)}
                                          className="flex-shrink-0 rounded-lg text-xs"
                                          style={{ color: '#2852E9' }}
                                        >
                                          {isConceptExpanded ? 'Less' : 'More'}
                                        </Button>
                                      </div>
                                    </div>
                                  </CardHeader>

                                  <CardContent className="pt-0">
                                    <div className="p-3 rounded-lg mb-3" style={{ backgroundColor: '#FFFBE6' }}>
                                      <p className="text-sm" style={{ color: '#232323' }}>
                                        {concept.explanation}
                                      </p>
                                    </div>

                                    {isConceptExpanded && renderExpandedConcept(concept)}
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}