import React, { createContext, useContext, useState, ReactNode } from 'react';

// Data structures following our discussion
export interface Concept {
  id: string;
  name: string;
  mastered: boolean;
  lastReviewed: Date | null;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  sourceContentId: string;
  spacedRepetitionLevel: number;
  consecutiveSuccessfulReviews: number;
  lastReviewSuccess: boolean;
}

export interface Content {
  id: string;
  title: string;
  category: string;           // Single primary category
  primaryTopic: string;       // Single primary topic for retention tracking
  concepts: string[];         // Array of concept IDs
  secondaryTopics?: string[]; // Optional related topics
  tags?: string[];           // Optional tags for search
  uploadDate: Date;
  lastAccessed: Date;
  contentType: 'article' | 'video' | 'pdf' | 'notes' | 'quiz';
  url?: string;
}

export interface ReviewHistoryEntry {
  date: Date;
  success: boolean;
  interval: number;
}

export interface Topic {
  id: string;
  name: string;
  category: string;
  description?: string;
  // Retention tracking fields
  conceptsMastered: number;
  totalConcepts: number;
  lastVisited: Date;
  // Spaced repetition fields
  spacedRepetitionLevel: number; // 0-6+ (tracks how many successful spaced reviews)
  lastReviewSuccess: boolean; // Was the last review successful?
  consecutiveSuccessfulReviews: number; // Consecutive successful reviews
  optimalNextReview: Date; // When should they ideally review next?
  reviewHistory: ReviewHistoryEntry[]; // History of review sessions
  practiceSessionsLast30Days: number;
  // Plant visualization
  plantType: 'seedling' | 'bush' | 'tree' | 'flower';
  health: 'thriving' | 'healthy' | 'wilting' | 'dying' | 'dead';
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

// Context for managing all data
interface TopicDataContextType {
  categories: Category[];
  topics: Topic[];
  content: Content[];
  concepts: Concept[];
  
  // Actions
  addContent: (content: Omit<Content, 'id' | 'uploadDate'>) => void;
  updateTopicRetention: (topicId: string, retentionScore: number) => void;
  markConceptMastered: (conceptId: string, mastered: boolean) => void;
  updateLastAccessed: (topicId: string) => void;
  recordReviewSession: (topicId: string, success: boolean) => void;
  
  // Getters
  getTopicsByCategory: (categoryId: string) => Topic[];
  getContentByTopic: (topicId: string) => Content[];
  getConceptsByContent: (contentId: string) => Concept[];
  getTopicRetentionData: () => Array<{topic: string; score: number; trend: 'up' | 'down' | 'stable'; lastStudied: string}>;
  calculateTopicRetention: (topicId: string) => number;
}

// Retention calculation function based on scientific spaced repetition principles
function calculateRetentionScore(topic: Topic): number {
  // Base factors
  const conceptsMastered = topic.conceptsMastered;
  const totalConcepts = topic.totalConcepts;
  const daysSinceLastVisit = Math.ceil((Date.now() - topic.lastVisited.getTime()) / (1000 * 60 * 60 * 24));
  const masteryScore = (conceptsMastered / totalConcepts) * 100;
  
  // High mastery protection
  const isHighMastery = masteryScore >= 85;
  const isMediumMastery = masteryScore >= 70;
  
  // 1. Spaced Repetition System
  const spacedRepetitionLevel = topic.spacedRepetitionLevel || 0; // 0-5+ levels
  const lastReviewSuccess = topic.lastReviewSuccess || false;
  const consecutiveSuccessfulReviews = topic.consecutiveSuccessfulReviews || 0;
  
  // Calculate optimal review interval based on spaced repetition
  const baseIntervals = [1, 3, 7, 14, 30, 60]; // Days between reviews
  const optimalInterval = baseIntervals[Math.min(spacedRepetitionLevel, baseIntervals.length - 1)];
  const isWithinOptimalWindow = daysSinceLastVisit <= optimalInterval;
  const isOverdue = daysSinceLastVisit > optimalInterval * 1.5;
  
  // 2. Enhanced Memory Strength (boosted by spaced repetition)
  const baseMemoryStrength = Math.max(1, conceptsMastered * 2);
  const spacedRepetitionBonus = consecutiveSuccessfulReviews * 0.5; // Each successful review adds strength
  const memoryStrength = baseMemoryStrength + spacedRepetitionBonus;
  
  // 3. High Mastery Forgetting Curve (much slower decay)
  let forgettingDecay;
  if (isHighMastery) {
    // Ultra-slow decay for high mastery users
    forgettingDecay = Math.exp(-daysSinceLastVisit / (memoryStrength * 3)); // 3x slower decay
  } else if (isMediumMastery) {
    // Moderate decay for medium mastery
    forgettingDecay = Math.exp(-daysSinceLastVisit / (memoryStrength * 1.5)); // 1.5x slower decay
  } else {
    // Standard decay for low mastery
    forgettingDecay = Math.exp(-daysSinceLastVisit / memoryStrength);
  }
  
  // 4. Spaced Repetition Bonus (replaces simple frequency bonus)
  let spacedRepetitionMultiplier = 1.0;
  if (isWithinOptimalWindow) {
    spacedRepetitionMultiplier = 1.1; // 10% bonus for being within optimal review window
  } else if (!isOverdue && spacedRepetitionLevel > 0) {
    spacedRepetitionMultiplier = 1.05; // 5% bonus for following spaced repetition
  }
  
  // Add bonus for high spaced repetition levels
  const levelBonus = Math.min(0.2, spacedRepetitionLevel * 0.05); // Up to 20% bonus
  spacedRepetitionMultiplier += levelBonus;
  
  // 5. Interval-Based Recency Weight (not daily penalties)
  let recencyWeight = 1.0;
  if (isOverdue) {
    // Only penalize if significantly overdue from optimal interval
    const overdueMultiplier = daysSinceLastVisit / optimalInterval;
    if (isHighMastery) {
      recencyWeight = Math.max(0.7, 1 / Math.pow(overdueMultiplier, 0.3)); // Gentle penalty for high mastery
    } else {
      recencyWeight = Math.max(0.4, 1 / Math.pow(overdueMultiplier, 0.5)); // Standard penalty
    }
  }
  
  // 6. Calculate base retention score
  let retentionScore = masteryScore * forgettingDecay * spacedRepetitionMultiplier * recencyWeight;
  
  // 7. Dynamic Floor Based on Mastery Level
  let floor;
  if (isHighMastery) {
    floor = 50; // High mastery users never go below 50%
  } else if (isMediumMastery) {
    floor = 25; // Medium mastery users never go below 25%
  } else {
    floor = 5; // Low mastery users minimum 5%
  }
  
  // 8. Apply floor and ceiling
  retentionScore = Math.max(floor, Math.min(100, retentionScore));
  
  return Math.round(retentionScore);
}

const TopicDataContext = createContext<TopicDataContextType | undefined>(undefined);

// Mock data following our new structure
const mockCategories: Category[] = [
  { id: 'tech', name: 'Technology', description: 'Programming, software, and technical topics', color: '#2852E9' },
  { id: 'business', name: 'Business', description: 'Management, strategy, and business topics', color: '#10B981' },
  { id: 'design', name: 'Design', description: 'UI/UX, graphic design, and creative topics', color: '#F59E0B' },
  { id: 'science', name: 'Science', description: 'Research, data science, and scientific topics', color: '#EF4444' }
];

const mockTopics: Topic[] = [
  {
    id: 'ml',
    name: 'Machine Learning',
    category: 'tech',
    description: 'AI, neural networks, and ML algorithms',
    conceptsMastered: 0, // New user hasn't mastered any concepts yet
    totalConcepts: 12,
    lastVisited: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago - just uploaded content
    spacedRepetitionLevel: 0, // No spaced repetition yet
    consecutiveSuccessfulReviews: 0,
    lastReviewSuccess: false,
    optimalNextReview: new Date(), // Should start learning today
    reviewHistory: [], // No review history yet
    practiceSessionsLast30Days: 0,
    plantType: 'seedling',
    health: 'healthy'
  },
  {
    id: 'react',
    name: 'React Development',
    category: 'tech',
    description: 'React hooks, components, and ecosystem',
    conceptsMastered: 1, // Maybe learned one basic concept
    totalConcepts: 15,
    lastVisited: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    spacedRepetitionLevel: 0, // Beginner level
    consecutiveSuccessfulReviews: 0,
    lastReviewSuccess: false,
    optimalNextReview: new Date(), // Should practice today
    reviewHistory: [],
    practiceSessionsLast30Days: 0,
    plantType: 'seedling',
    health: 'healthy'
  },
  {
    id: 'data-structures',
    name: 'Data Structures',
    category: 'tech',
    description: 'Arrays, trees, graphs, and algorithms',
    conceptsMastered: 0,
    totalConcepts: 10,
    lastVisited: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago - needs attention
    spacedRepetitionLevel: 0,
    consecutiveSuccessfulReviews: 0,
    lastReviewSuccess: false,
    optimalNextReview: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // Very overdue
    reviewHistory: [],
    practiceSessionsLast30Days: 0,
    plantType: 'seedling',
    health: 'wilting' // Wilting because it's been neglected
  },
  {
    id: 'system-design',
    name: 'System Design',
    category: 'tech',
    description: 'Scalability, architecture, and distributed systems',
    conceptsMastered: 0,
    totalConcepts: 8,
    lastVisited: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    spacedRepetitionLevel: 0,
    consecutiveSuccessfulReviews: 0,
    lastReviewSuccess: false,
    optimalNextReview: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000), // Very overdue
    reviewHistory: [],
    practiceSessionsLast30Days: 0,
    plantType: 'seedling',
    health: 'dying' // Dying because severely neglected
  },
  {
    id: 'ui-ux',
    name: 'UI/UX Design',
    category: 'design',
    description: 'User interface and experience design principles',
    conceptsMastered: 2, // Maybe learned a couple concepts
    totalConcepts: 8,
    lastVisited: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday - recent activity
    spacedRepetitionLevel: 1, // Just started spaced repetition
    consecutiveSuccessfulReviews: 1,
    lastReviewSuccess: true,
    optimalNextReview: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Due in 2 days
    reviewHistory: [
      { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), success: true, interval: 1 }
    ],
    practiceSessionsLast30Days: 1,
    plantType: 'bush', // Growing because of some progress
    health: 'healthy'
  },
  {
    id: 'product-mgmt',
    name: 'Product Management',
    category: 'business',
    description: 'Product strategy, roadmaps, and user research',
    conceptsMastered: 0,
    totalConcepts: 12,
    lastVisited: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    spacedRepetitionLevel: 0,
    consecutiveSuccessfulReviews: 0,
    lastReviewSuccess: false,
    optimalNextReview: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // Overdue
    reviewHistory: [],
    practiceSessionsLast30Days: 0,
    plantType: 'seedling',
    health: 'wilting'
  }
];

const mockContent: Content[] = [
  {
    id: 'content-1',
    title: 'Building Neural Networks with TensorFlow',
    category: 'tech',
    primaryTopic: 'Machine Learning',
    concepts: ['neural-arch', 'tensorflow-basics', 'training-loops', 'model-eval', 'overfitting'],
    secondaryTopics: ['Data Structures'],
    tags: ['tensorflow', 'neural-networks', 'python', 'tutorial'],
    uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    lastAccessed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Not accessed since upload
    contentType: 'article',
    url: 'https://example.com/neural-networks'
  },
  {
    id: 'content-2',
    title: 'React Hooks Deep Dive',
    category: 'tech',
    primaryTopic: 'React Development',
    concepts: ['use-state', 'use-effect', 'custom-hooks', 'use-context', 'use-reducer'],
    secondaryTopics: [],
    tags: ['react', 'hooks', 'javascript', 'frontend'],
    uploadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    lastAccessed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Accessed recently
    contentType: 'video'
  },
  {
    id: 'content-3',
    title: 'Design Systems Fundamentals',
    category: 'design',
    primaryTopic: 'UI/UX Design',
    concepts: ['design-tokens', 'component-library', 'accessibility', 'responsive-design'],
    secondaryTopics: ['React Development'],
    tags: ['design-systems', 'ui', 'accessibility'],
    uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Recent activity
    contentType: 'pdf'
  }
];

const mockConcepts: Concept[] = [
  {
    id: 'neural-arch',
    name: 'Neural Network Architecture',
    mastered: false, // New user hasn't mastered this yet
    lastReviewed: null,
    difficultyLevel: 'intermediate',
    sourceContentId: 'content-1',
    spacedRepetitionLevel: 0,
    consecutiveSuccessfulReviews: 0,
    lastReviewSuccess: false
  },
  {
    id: 'tensorflow-basics',
    name: 'TensorFlow Basics',
    mastered: false,
    lastReviewed: null,
    difficultyLevel: 'beginner',
    sourceContentId: 'content-1',
    spacedRepetitionLevel: 0,
    consecutiveSuccessfulReviews: 0,
    lastReviewSuccess: false
  },
  {
    id: 'training-loops',
    name: 'Training Loops',
    mastered: false,
    lastReviewed: null,
    difficultyLevel: 'intermediate',
    sourceContentId: 'content-1',
    spacedRepetitionLevel: 0,
    consecutiveSuccessfulReviews: 0,
    lastReviewSuccess: false
  },
  {
    id: 'model-eval',
    name: 'Model Evaluation',
    mastered: false,
    lastReviewed: null,
    difficultyLevel: 'intermediate',
    sourceContentId: 'content-1',
    spacedRepetitionLevel: 0,
    consecutiveSuccessfulReviews: 0,
    lastReviewSuccess: false
  },
  {
    id: 'overfitting',
    name: 'Overfitting Prevention',
    mastered: false,
    lastReviewed: null,
    difficultyLevel: 'advanced',
    sourceContentId: 'content-1',
    spacedRepetitionLevel: 0,
    consecutiveSuccessfulReviews: 0,
    lastReviewSuccess: false
  },
  {
    id: 'use-state',
    name: 'useState Hook',
    mastered: true, // Maybe learned this one basic concept
    lastReviewed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    difficultyLevel: 'beginner',
    sourceContentId: 'content-2',
    spacedRepetitionLevel: 1,
    consecutiveSuccessfulReviews: 1,
    lastReviewSuccess: true
  },
  {
    id: 'use-effect',
    name: 'useEffect Hook',
    mastered: false,
    lastReviewed: null,
    difficultyLevel: 'intermediate',
    sourceContentId: 'content-2',
    spacedRepetitionLevel: 0,
    consecutiveSuccessfulReviews: 0,
    lastReviewSuccess: false
  },
  {
    id: 'custom-hooks',
    name: 'Custom Hooks',
    mastered: false,
    lastReviewed: null,
    difficultyLevel: 'intermediate',
    sourceContentId: 'content-2',
    spacedRepetitionLevel: 0,
    consecutiveSuccessfulReviews: 0,
    lastReviewSuccess: false
  },
  {
    id: 'use-context',
    name: 'useContext Hook',
    mastered: false,
    lastReviewed: null,
    difficultyLevel: 'intermediate',
    sourceContentId: 'content-2',
    spacedRepetitionLevel: 0,
    consecutiveSuccessfulReviews: 0,
    lastReviewSuccess: false
  },
  {
    id: 'use-reducer',
    name: 'useReducer Hook',
    mastered: false,
    lastReviewed: null,
    difficultyLevel: 'advanced',
    sourceContentId: 'content-2',
    spacedRepetitionLevel: 0,
    consecutiveSuccessfulReviews: 0,
    lastReviewSuccess: false
  },
  {
    id: 'design-tokens',
    name: 'Design Tokens',
    mastered: true, // One of the 2 mastered concepts in UI/UX
    lastReviewed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    difficultyLevel: 'beginner',
    sourceContentId: 'content-3',
    spacedRepetitionLevel: 1,
    consecutiveSuccessfulReviews: 1,
    lastReviewSuccess: true
  },
  {
    id: 'component-library',
    name: 'Component Library',
    mastered: true, // Second mastered concept in UI/UX
    lastReviewed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    difficultyLevel: 'intermediate',
    sourceContentId: 'content-3',
    spacedRepetitionLevel: 1,
    consecutiveSuccessfulReviews: 1,
    lastReviewSuccess: true
  },
  {
    id: 'accessibility',
    name: 'Accessibility',
    mastered: false,
    lastReviewed: null,
    difficultyLevel: 'intermediate',
    sourceContentId: 'content-3',
    spacedRepetitionLevel: 0,
    consecutiveSuccessfulReviews: 0,
    lastReviewSuccess: false
  },
  {
    id: 'responsive-design',
    name: 'Responsive Design',
    mastered: false,
    lastReviewed: null,
    difficultyLevel: 'intermediate',
    sourceContentId: 'content-3',
    spacedRepetitionLevel: 0,
    consecutiveSuccessfulReviews: 0,
    lastReviewSuccess: false
  }
];

export function TopicDataProvider({ children }: { children: ReactNode }) {
  const [categories] = useState<Category[]>(mockCategories);
  const [topics, setTopics] = useState<Topic[]>(mockTopics);
  const [content, setContent] = useState<Content[]>(mockContent);
  const [concepts, setConcepts] = useState<Concept[]>(mockConcepts);

  const addContent = (newContent: Omit<Content, 'id' | 'uploadDate'>) => {
    const content: Content = {
      ...newContent,
      id: `content-${Date.now()}`,
      uploadDate: new Date(),
      lastAccessed: new Date()
    };
    setContent(prev => [...prev, content]);
  };

  const updateTopicRetention = (topicId: string, retentionScore: number) => {
    setTopics(prev => prev.map(topic => 
      topic.id === topicId 
        ? { ...topic, retentionScore, lastVisited: new Date() }
        : topic
    ));
  };

  const markConceptMastered = (conceptId: string, mastered: boolean) => {
    setConcepts(prev => prev.map(concept =>
      concept.id === conceptId
        ? { ...concept, mastered, lastReviewed: new Date() }
        : concept
    ));
    
    // Update topic concept counts
    const concept = concepts.find(c => c.id === conceptId);
    if (concept) {
      const contentItem = content.find(c => c.id === concept.sourceContentId);
      if (contentItem) {
        const topicId = topics.find(t => t.name === contentItem.primaryTopic)?.id;
        if (topicId) {
          setTopics(prev => prev.map(topic => {
            if (topic.id === topicId) {
              const newMastered = mastered 
                ? topic.conceptsMastered + 1 
                : Math.max(0, topic.conceptsMastered - 1);
              return { ...topic, conceptsMastered: newMastered };
            }
            return topic;
          }));
        }
      }
    }
  };

  const updateLastAccessed = (topicId: string) => {
    setTopics(prev => prev.map(topic =>
      topic.id === topicId
        ? { ...topic, lastVisited: new Date() }
        : topic
    ));
  };

  const recordReviewSession = (topicId: string, success: boolean) => {
    setTopics(prev => prev.map(topic => {
      if (topic.id !== topicId) return topic;
      
      const now = new Date();
      const daysSinceLastReview = topic.reviewHistory.length > 0 
        ? Math.ceil((now.getTime() - topic.reviewHistory[0].date.getTime()) / (1000 * 60 * 60 * 24))
        : 1;
      
      // Update spaced repetition based on success
      let newLevel = topic.spacedRepetitionLevel;
      let newConsecutiveReviews = topic.consecutiveSuccessfulReviews;
      
      if (success) {
        newLevel = Math.min(5, topic.spacedRepetitionLevel + 1);
        newConsecutiveReviews = topic.consecutiveSuccessfulReviews + 1;
      } else {
        newLevel = Math.max(0, topic.spacedRepetitionLevel - 1);
        newConsecutiveReviews = 0; // Reset streak on failure
      }
      
      // Calculate next optimal review date
      const baseIntervals = [1, 3, 7, 14, 30, 60];
      const nextInterval = baseIntervals[Math.min(newLevel, baseIntervals.length - 1)];
      const optimalNextReview = new Date(now.getTime() + nextInterval * 24 * 60 * 60 * 1000);
      
      // Add to review history (keep last 10 entries)
      const newReviewHistory = [
        { date: now, success, interval: daysSinceLastReview },
        ...topic.reviewHistory.slice(0, 9)
      ];
      
      return {
        ...topic,
        lastVisited: now,
        spacedRepetitionLevel: newLevel,
        consecutiveSuccessfulReviews: newConsecutiveReviews,
        lastReviewSuccess: success,
        optimalNextReview,
        reviewHistory: newReviewHistory
      };
    }));
  };

  const calculateTopicRetention = (topicId: string) => {
    const topic = topics.find(t => t.id === topicId);
    return topic ? calculateRetentionScore(topic) : 0;
  };

  const getTopicsByCategory = (categoryId: string) => {
    return topics.filter(topic => topic.category === categoryId);
  };

  const getContentByTopic = (topicId: string) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return [];
    return content.filter(c => c.primaryTopic === topic.name);
  };

  const getConceptsByContent = (contentId: string) => {
    return concepts.filter(c => c.sourceContentId === contentId);
  };

  const getTopicRetentionData = () => {
    return topics.map(topic => {
      const daysSinceLastVisit = Math.ceil((Date.now() - topic.lastVisited.getTime()) / (1000 * 60 * 60 * 24));
      const calculatedScore = calculateRetentionScore(topic);
      
      // Determine trend based on recent review history
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (topic.reviewHistory.length >= 2) {
        const recentSuccess = topic.reviewHistory.slice(0, 2).filter(r => r.success).length;
        if (recentSuccess === 2) trend = 'up';
        else if (recentSuccess === 0) trend = 'down';
      } else {
        // Fallback to score-based trend
        if (calculatedScore >= 85) trend = 'up';
        else if (calculatedScore <= 70) trend = 'down';
      }
      
      return {
        topic: topic.name,
        score: calculatedScore,
        trend,
        lastStudied: daysSinceLastVisit === 1 ? '1 day ago' : `${daysSinceLastVisit} days ago`
      };
    });
  };

  const value: TopicDataContextType = {
    categories,
    topics,
    content,
    concepts,
    addContent,
    updateTopicRetention,
    markConceptMastered,
    updateLastAccessed,
    recordReviewSession,
    getTopicsByCategory,
    getContentByTopic,
    getConceptsByContent,
    getTopicRetentionData,
    calculateTopicRetention
  };

  return (
    <TopicDataContext.Provider value={value}>
      {children}
    </TopicDataContext.Provider>
  );
}

export function useTopicData() {
  const context = useContext(TopicDataContext);
  if (context === undefined) {
    throw new Error('useTopicData must be used within a TopicDataProvider');
  }
  return context;
}