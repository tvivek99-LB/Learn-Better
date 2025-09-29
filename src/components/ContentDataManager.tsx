import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export interface ContentItem {
  id: string;
  title: string;
  type: 'file' | 'url' | 'text';
  content?: string;
  url?: string;
  fileName?: string;
  fileSize?: string;
  dateAdded: string;
  tags?: string[];
  topics?: string[]; // Auto-extracted topics (3-4 words max)
  preview?: string;
  inRetentionPlan?: boolean;
}

export interface KeyConcept {
  id: string;
  concept: string;
  explanation: string;
  category: string;
  contentId?: string; // Link back to the content that generated this concept
  dateAdded: string;
  inRetentionPlan?: boolean; // Whether this concept is selected for retention practice
  // Enhanced fields for richer content
  keyContent?: string; // Key content from the source article
  examples?: string[]; // Array of examples
  actionableTip?: string; // Actionable tip for applying this concept
}

interface ContentContextType {
  contentItems: ContentItem[];
  concepts: KeyConcept[];
  allTopics: string[]; // All unique topics extracted from content
  selectedConcepts: Set<string>; // Currently selected concept IDs for batch operations
  conceptsInRetentionPlan: KeyConcept[]; // Concepts that are in the retention plan
  addContentItem: (item: Omit<ContentItem, 'id' | 'dateAdded'>) => string;
  addConcepts: (concepts: Omit<KeyConcept, 'id' | 'dateAdded'>[], contentId?: string) => void;
  updateContentItem: (id: string, updates: Partial<ContentItem>) => void;
  deleteContentItem: (id: string) => void;
  deleteConcept: (id: string) => void;
  toggleRetentionPlan: (id: string) => void;
  extractTopicsFromContent: (title: string, content?: string, url?: string) => string[];
  // Concept selection methods
  toggleConceptSelection: (conceptId: string) => void;
  selectAllConceptsFromContent: (contentId: string) => void;
  selectAllConceptsFromTopic: (topic: string) => void;
  addAllConceptsToRetentionPlanFromContent: (contentId: string) => void;
  addAllConceptsToRetentionPlanFromTopic: (topic: string) => void;
  removeAllConceptsFromRetentionPlanFromContent: (contentId: string) => void;
  removeAllConceptsFromRetentionPlanFromTopic: (topic: string) => void;
  areAllConceptsInRetentionPlanFromContent: (contentId: string) => boolean;
  areAllConceptsInRetentionPlanFromTopic: (topic: string) => boolean;
  clearConceptSelection: () => void;
  addSelectedConceptsToRetentionPlan: () => void;
  removeSelectedConceptsFromRetentionPlan: () => void;
  toggleConceptRetentionPlan: (conceptId: string) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

// Mock initial data
const initialContentItems: ContentItem[] = [
  {
    id: '13',
    title: 'Why Groups Struggle to Solve Problems Together',
    type: 'url',
    url: 'https://hbr.org/2019/11/why-groups-struggle-to-solve-problems-together',
    dateAdded: '2024-01-16',
    tags: ['Collaboration', 'Problem Solving', 'Team Dynamics'],
    topics: ['Team Management', 'Collaboration', 'Psychology'],
    preview: 'Teams often struggle with complex problem-solving due to cognitive biases, power dynamics, and information silos. Research shows that diverse groups can outperform individuals, but only when proper facilitation and structured processes are in place. Key barriers include groupthink, status differences that inhibit participation, and the tendency to seek confirming rather than disconfirming evidence...',
    inRetentionPlan: false
  },
  {
    id: '1',
    title: 'Design Systems at Scale',
    type: 'file',
    fileName: 'design-systems-scale.pdf',
    fileSize: '2.4 MB',
    dateAdded: '2024-01-15',
    tags: ['Design', 'Systems'],
    topics: ['Design Systems', 'UI Design', 'Product Design'],
    preview: 'Design systems enable consistency and efficiency across product teams through shared components, design tokens, and clear guidelines. This document covers governance models, component architecture, and strategies for adoption across large organizations. Key topics include token management, component API design, and measuring design system success through adoption metrics and developer experience improvements...',
    inRetentionPlan: true
  },
  {
    id: '2',
    title: 'Leadership Principles - Amazon',
    type: 'url',
    url: 'https://amazon.jobs/principles',
    dateAdded: '2024-01-14',
    tags: ['Leadership', 'Culture'],
    topics: ['Leadership', 'Management', 'Business Strategy'],
    preview: 'Amazon\'s 16 Leadership Principles guide hiring and decision-making at every level...',
    inRetentionPlan: true
  },
  {
    id: '3',
    title: 'Product Strategy Notes',
    type: 'text',
    dateAdded: '2024-01-13',
    tags: ['Strategy', 'Product'],
    preview: 'Personal notes on product strategy framework including market analysis, user research...',
    inRetentionPlan: false
  },
  {
    id: '4',
    title: 'React Hook Patterns',
    type: 'file',
    fileName: 'react-hooks-guide.md',
    fileSize: '890 KB',
    dateAdded: '2024-01-12',
    tags: ['React', 'JavaScript', 'Development'],
    preview: 'React Hooks revolutionized functional components by providing state management and lifecycle features. useState enables local state with const [state, setState] = useState(initialValue). useEffect handles side effects and replaces componentDidMount, componentDidUpdate, and componentWillUnmount. Custom Hooks extract logic into reusable functions that start with "use". Key patterns include dependency arrays, cleanup functions, and avoiding infinite loops...',
    inRetentionPlan: true
  },
  {
    id: '5',
    title: 'The Science of Learning',
    type: 'url',
    url: 'https://example.com/science-of-learning',
    dateAdded: '2024-01-11',
    tags: ['Learning', 'Science', 'Education'],
    preview: 'Effective learning requires active engagement rather than passive consumption. Retrieval practice - testing yourself regularly - is more effective than re-reading notes. Spaced repetition involves reviewing material at increasing intervals to combat the forgetting curve. Elaborative interrogation means asking "why" questions to create deeper connections. Interleaving different problem types during study improves discrimination and transfer...',
    inRetentionPlan: true
  },
  {
    id: '6',
    title: 'API Design Guidelines',
    type: 'text',
    dateAdded: '2024-01-10',
    tags: ['API', 'Design', 'Development'],
    preview: 'Best practices for designing RESTful APIs including naming conventions, error handling...',
    inRetentionPlan: false
  },
  {
    id: '7',
    title: 'User Research Methods',
    type: 'file',
    fileName: 'user-research-methods.pdf',
    fileSize: '1.2 MB',
    dateAdded: '2024-01-09',
    tags: ['UX', 'Research', 'Design'],
    preview: 'A comprehensive overview of quantitative and qualitative user research methodologies...',
    inRetentionPlan: true
  },
  {
    id: '8',
    title: 'Machine Learning Fundamentals',
    type: 'url',
    url: 'https://example.com/ml-fundamentals',
    dateAdded: '2024-01-08',
    tags: ['Machine Learning', 'AI', 'Data Science'],
    preview: 'Introduction to core machine learning concepts, algorithms, and applications...',
    inRetentionPlan: false
  },
  {
    id: '9',
    title: 'Project Management Best Practices',
    type: 'text',
    dateAdded: '2024-01-07',
    tags: ['Project Management', 'Leadership'],
    preview: 'Key principles and frameworks for successful project delivery and team coordination...',
    inRetentionPlan: true
  },
  {
    id: '10',
    title: 'CSS Grid Layout Guide',
    type: 'file',
    fileName: 'css-grid-complete-guide.pdf',
    fileSize: '1.8 MB',
    dateAdded: '2024-01-06',
    tags: ['CSS', 'Web Development', 'Layout'],
    preview: 'Complete reference for CSS Grid with practical examples and browser support details...',
    inRetentionPlan: false
  },
  {
    id: '11',
    title: 'Behavioral Economics in UX',
    type: 'url',
    url: 'https://example.com/behavioral-economics-ux',
    dateAdded: '2024-01-05',
    tags: ['UX', 'Psychology', 'Economics'],
    preview: 'How cognitive biases and behavioral patterns influence user interface design decisions...',
    inRetentionPlan: true
  },
  {
    id: '12',
    title: 'Team Communication Framework',
    type: 'text',
    dateAdded: '2024-01-04',
    tags: ['Communication', 'Team Management'],
    preview: 'Structured approach to improving team communication and reducing misunderstandings...',
    inRetentionPlan: false
  }
];

const initialConcepts: KeyConcept[] = [
  {
    id: 'concept-1',
    concept: 'Design Tokens',
    explanation: 'Named entities that store visual design attributes like colors, spacing, and typography',
    category: 'Design',
    contentId: '1',
    dateAdded: '2024-01-15',
    inRetentionPlan: true,
    keyContent: 'Design tokens are the foundation of scalable design systems. They ensure consistency across products and teams by centralizing design decisions into reusable, named variables.',
    examples: [
      'Color tokens: --color-primary-500, --color-neutral-100',
      'Spacing tokens: --space-xs (4px), --space-sm (8px), --space-md (16px)',
      'Typography tokens: --font-size-heading-lg, --font-weight-semibold'
    ],
    actionableTip: 'Start by documenting your existing colors and spacing values, then gradually convert them into tokens. Begin with the most frequently used values first.'
  },
  {
    id: 'concept-2',
    concept: 'Customer Obsession',
    explanation: 'Starting with customer needs and working backwards to develop solutions',
    category: 'Leadership',
    contentId: '2',
    dateAdded: '2024-01-14',
    inRetentionPlan: true,
    keyContent: 'Customer obsession is Amazon\'s foundational leadership principle. It means earning and keeping customer trust by consistently delivering what customers want, even when it\'s difficult or expensive.',
    examples: [
      'Amazon\'s customer service: Easy returns and refunds without questioning',
      'Product decisions: Adding features customers request most frequently',
      'Pricing: Passing cost savings directly to customers rather than increasing margins'
    ],
    actionableTip: 'Before making any decision, ask: "How does this directly benefit our customers?" If you can\'t clearly answer that, reconsider the decision.'
  },
  {
    id: 'concept-3',
    concept: 'useState Hook',
    explanation: 'React Hook that allows functional components to manage local state',
    category: 'Development',
    contentId: '4',
    dateAdded: '2024-01-12',
    inRetentionPlan: false,
    keyContent: 'useState is the most fundamental React Hook that enables functional components to maintain state between renders. It returns a state variable and a setter function.',
    examples: [
      'Counter: const [count, setCount] = useState(0)',
      'Form input: const [name, setName] = useState("")',
      'Toggle: const [isVisible, setIsVisible] = useState(false)'
    ],
    actionableTip: 'Always use the functional update pattern when new state depends on previous state: setCount(prev => prev + 1) instead of setCount(count + 1).'
  },
  {
    id: 'concept-4',
    concept: 'Spaced Repetition',
    explanation: 'Learning technique that incorporates increasing intervals between reviews',
    category: 'Learning',
    contentId: '5',
    dateAdded: '2024-01-11',
    inRetentionPlan: true,
    keyContent: 'Spaced repetition leverages the psychological spacing effect to improve long-term retention. By reviewing material at increasing intervals, we strengthen memory consolidation and combat the forgetting curve.',
    examples: [
      'Day 1: Learn new concept',
      'Day 3: First review (2 days later)',
      'Day 7: Second review (4 days later)',
      'Day 15: Third review (8 days later)'
    ],
    actionableTip: 'Use apps like Anki or create a simple calendar reminder system. Start with 1-day, then 3-day, then 7-day intervals for new concepts.'
  },
  {
    id: 'concept-5',
    concept: 'REST Principles',
    explanation: 'Architectural constraints for designing networked applications',
    category: 'Development',
    contentId: '6',
    dateAdded: '2024-01-10',
    inRetentionPlan: false,
    keyContent: 'REST (Representational State Transfer) defines six architectural constraints: client-server, stateless, cacheable, uniform interface, layered system, and code-on-demand (optional).',
    examples: [
      'GET /users/123 - Retrieve user with ID 123',
      'POST /users - Create a new user',
      'PUT /users/123 - Update user 123',
      'DELETE /users/123 - Delete user 123'
    ],
    actionableTip: 'Design your API endpoints as nouns (resources) not verbs (actions). Use HTTP methods to represent the action being performed on the resource.'
  },
  {
    id: 'concept-6',
    concept: 'Retrieval Practice',
    explanation: 'The strategy of recalling facts or concepts from memory to strengthen learning',
    category: 'Learning',
    contentId: '5',
    dateAdded: '2024-01-11',
    inRetentionPlan: true,
    keyContent: 'Retrieval practice is one of the most effective learning strategies. The act of recalling information from memory strengthens neural pathways and improves long-term retention more than passive review.',
    examples: [
      'Flashcards: Test yourself without looking at the answer first',
      'Practice tests: Take quizzes before studying the material',
      'Teach others: Explain concepts without referring to notes'
    ],
    actionableTip: 'Instead of re-reading notes, close your book and try to recall key points. Only check your notes after attempting to remember from memory.'
  }
];

export function ContentDataProvider({ children }: { children: React.ReactNode }) {
  const [contentItems, setContentItems] = useState<ContentItem[]>(initialContentItems);
  const [concepts, setConcepts] = useState<KeyConcept[]>(initialConcepts);
  const [selectedConcepts, setSelectedConcepts] = useState<Set<string>>(new Set());
  
  // Calculate all unique topics from content items
  const allTopics = useMemo(() => {
    const topicSet = new Set<string>();
    contentItems.forEach(item => {
      if (item.topics) {
        item.topics.forEach(topic => topicSet.add(topic));
      }
    });
    return Array.from(topicSet).sort();
  }, [contentItems]);

  // Calculate concepts in retention plan
  const conceptsInRetentionPlan = useMemo(() => {
    return concepts.filter(concept => concept.inRetentionPlan === true);
  }, [concepts]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedContent = localStorage.getItem('learningApp_contentItems');
    const savedConcepts = localStorage.getItem('learningApp_concepts');
    const savedSelectedConcepts = localStorage.getItem('learningApp_selectedConcepts');
    
    if (savedContent) {
      try {
        setContentItems(JSON.parse(savedContent));
      } catch (e) {
        console.error('Failed to load content items from localStorage:', e);
      }
    }
    
    if (savedConcepts) {
      try {
        setConcepts(JSON.parse(savedConcepts));
      } catch (e) {
        console.error('Failed to load concepts from localStorage:', e);
      }
    }

    if (savedSelectedConcepts) {
      try {
        const selectedArray = JSON.parse(savedSelectedConcepts);
        setSelectedConcepts(new Set(selectedArray));
      } catch (e) {
        console.error('Failed to load selected concepts from localStorage:', e);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('learningApp_contentItems', JSON.stringify(contentItems));
  }, [contentItems]);

  useEffect(() => {
    localStorage.setItem('learningApp_concepts', JSON.stringify(concepts));
  }, [concepts]);

  useEffect(() => {
    localStorage.setItem('learningApp_selectedConcepts', JSON.stringify(Array.from(selectedConcepts)));
  }, [selectedConcepts]);

  const addContentItem = (item: Omit<ContentItem, 'id' | 'dateAdded'>): string => {
    const newId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newItem: ContentItem = {
      ...item,
      id: newId,
      dateAdded: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      inRetentionPlan: false // Default to not in retention plan
    };
    
    setContentItems(prev => [newItem, ...prev]); // Add to beginning of list
    return newId;
  };

  const addConcepts = (newConcepts: Omit<KeyConcept, 'id' | 'dateAdded'>[], contentId?: string) => {
    const conceptsWithIds = newConcepts.map(concept => ({
      ...concept,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      dateAdded: new Date().toISOString().split('T')[0],
      contentId
    }));
    
    setConcepts(prev => [...conceptsWithIds, ...prev]); // Add to beginning of list
  };

  const updateContentItem = (id: string, updates: Partial<ContentItem>) => {
    setContentItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const deleteContentItem = (id: string) => {
    setContentItems(prev => prev.filter(item => item.id !== id));
    // Also remove associated concepts
    setConcepts(prev => prev.filter(concept => concept.contentId !== id));
  };

  const deleteConcept = (id: string) => {
    setConcepts(prev => prev.filter(concept => concept.id !== id));
  };

  const toggleRetentionPlan = (id: string) => {
    setContentItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, inRetentionPlan: !item.inRetentionPlan } : item
      )
    );
  };

  const extractTopicsFromContent = (title: string, content?: string, url?: string): string[] => {
    // Step 1: Extract headings and primary content structure
    const headings = extractHeadingsFromContent(content || '');
    const primaryTopic = extractPrimaryTopicFromTitle(title);
    
    const foundTopics: string[] = [];
    
    // Priority 1: Primary topic from title analysis
    if (primaryTopic) {
      foundTopics.push(primaryTopic);
    }
    
    // Priority 2: Only add a second topic if it's clearly distinct and important
    const secondaryTopic = extractSecondaryTopicFromHeadings(headings, title, content || '');
    if (secondaryTopic && 
        !foundTopics.some(topic => topic.toLowerCase().includes(secondaryTopic.toLowerCase()) || 
                                   secondaryTopic.toLowerCase().includes(topic.toLowerCase()))) {
      foundTopics.push(secondaryTopic);
    }
    
    // If no topics found, fall back to content analysis
    if (foundTopics.length === 0) {
      const fallbackTopic = extractFallbackTopic(title, content || '');
      if (fallbackTopic) {
        foundTopics.push(fallbackTopic);
      }
    }
    
    // Strict limit: maximum 2 topics, prefer 1
    return foundTopics.slice(0, 2);
  };

  // Extract headings from content (looking for common heading patterns)
  const extractHeadingsFromContent = (content: string): string[] => {
    const headings: string[] = [];
    
    // Look for markdown-style headings
    const markdownHeadings = content.match(/^#{1,6}\s+(.+)$/gm);
    if (markdownHeadings) {
      headings.push(...markdownHeadings.map(h => h.replace(/^#+\s+/, '').trim()));
    }
    
    // Look for sentences that might be headings (short, capitalized, followed by detailed content)
    const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    lines.forEach((line, index) => {
      // Potential heading: short line (3-8 words), title case, followed by longer content
      const words = line.split(' ');
      if (words.length >= 2 && words.length <= 8 && 
          line.charAt(0) === line.charAt(0).toUpperCase() &&
          !line.endsWith('.') && !line.endsWith(',') &&
          index < lines.length - 1 && lines[index + 1].length > line.length * 1.5) {
        headings.push(line);
      }
    });
    
    return headings.slice(0, 5); // Limit to top 5 headings
  };

  // Extract secondary topic from headings and content structure
  const extractSecondaryTopicFromHeadings = (headings: string[], title: string, content: string): string | null => {
    // Core topic categories (refined list focused on main subjects)
    const coreTopics = [
      'Learning Science', 'Memory Techniques', 'Study Methods',
      'React Development', 'JavaScript', 'Web Development', 'Software Engineering',
      'Design Systems', 'UX Design', 'Product Design',
      'Machine Learning', 'Data Science', 'Artificial Intelligence',
      'Leadership', 'Team Management', 'Business Strategy',
      'Project Management', 'Product Management',
      'User Research', 'Data Analysis', 'Psychology'
    ];
    
    const allText = (title + ' ' + headings.join(' ') + ' ' + content.substring(0, 500)).toLowerCase();
    
    // Find the most prominent secondary topic
    for (const topic of coreTopics) {
      const topicWords = topic.toLowerCase().split(' ');
      const matchScore = topicWords.filter(word => allText.includes(word)).length;
      
      // Require strong evidence (most topic words present)
      if (matchScore >= Math.ceil(topicWords.length * 0.7)) {
        return topic;
      }
    }
    
    return null;
  };

  // Fallback topic extraction when primary methods fail
  const extractFallbackTopic = (title: string, content: string): string | null => {
    const text = (title + ' ' + content.substring(0, 300)).toLowerCase();
    
    // Simple keyword-to-topic mapping for common cases
    const keywordMap = {
      'react': 'React Development',
      'javascript': 'JavaScript',
      'design': 'Design',
      'leadership': 'Leadership', 
      'learning': 'Learning Science',
      'memory': 'Memory Techniques',
      'management': 'Management',
      'strategy': 'Strategy',
      'research': 'Research Methods',
      'psychology': 'Psychology',
      'data': 'Data Analysis',
      'machine learning': 'Machine Learning',
      'ai': 'Artificial Intelligence'
    };
    
    for (const [keyword, topic] of Object.entries(keywordMap)) {
      if (text.includes(keyword)) {
        return topic;
      }
    }
    
    return 'General Knowledge';
  };
  
  // Helper function to extract primary topic from title
  const extractPrimaryTopicFromTitle = (title: string): string | null => {
    const lowerTitle = title.toLowerCase();
    
    // Specific title patterns
    const titlePatterns = {
      'make it stick': 'Learning Techniques',
      'atomic habits': 'Habit Formation',
      'deep work': 'Productivity',
      'thinking fast and slow': 'Cognitive Psychology',
      'the lean startup': 'Entrepreneurship',
      'clean code': 'Software Engineering',
      'design of everyday things': 'UX Design',
      'hooked': 'Product Design',
      'zero to one': 'Innovation',
      'good to great': 'Business Strategy',
      'the hard thing about hard things': 'Leadership',
      'crossing the chasm': 'Technology Adoption',
      'blue ocean strategy': 'Business Strategy',
      'the innovator\'s dilemma': 'Innovation Theory',
      'thinking in systems': 'Systems Thinking',
      'the art of possibility': 'Creative Thinking',
      'mindset': 'Growth Mindset',
      'grit': 'Psychology',
      'flow': 'Performance Psychology',
      'peak': 'Deliberate Practice'
    };
    
    // Check for exact matches first
    for (const [pattern, topic] of Object.entries(titlePatterns)) {
      if (lowerTitle.includes(pattern)) {
        return topic;
      }
    }
    
    // If no specific pattern, try to extract meaningful topic from title structure
    // Remove common stop words and extract the main subject
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'how', 'why', 'what', 'when', 'where', 'guide', 'introduction', 'basics', 'fundamentals', 'complete', 'ultimate', 'best', 'top', 'effective'];
    const words = title.split(/\s+/).filter(word => 
      word.length > 3 && 
      !stopWords.includes(word.toLowerCase()) &&
      !/^\d+$/.test(word) // Remove pure numbers
    );
    
    if (words.length > 0) {
      // Take the first 2-3 meaningful words
      const meaningfulWords = words.slice(0, Math.min(3, words.length));
      const topic = meaningfulWords.map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
      
      return topic;
    }
    
    return null;
  };

  // Concept selection methods
  const toggleConceptSelection = (conceptId: string) => {
    setSelectedConcepts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(conceptId)) {
        newSet.delete(conceptId);
      } else {
        newSet.add(conceptId);
      }
      return newSet;
    });
  };

  const selectAllConceptsFromContent = (contentId: string) => {
    const contentConcepts = concepts.filter(concept => concept.contentId === contentId);
    setSelectedConcepts(prev => {
      const newSet = new Set(prev);
      contentConcepts.forEach(concept => newSet.add(concept.id));
      return newSet;
    });
  };

  const selectAllConceptsFromTopic = (topic: string) => {
    // Find all content items that have this topic
    const contentWithTopic = contentItems.filter(item => 
      item.topics && item.topics.includes(topic)
    );
    // Find all concepts from these content items
    const topicConcepts = concepts.filter(concept => 
      contentWithTopic.some(content => content.id === concept.contentId)
    );
    
    setSelectedConcepts(prev => {
      const newSet = new Set(prev);
      topicConcepts.forEach(concept => newSet.add(concept.id));
      return newSet;
    });
  };

  const addAllConceptsToRetentionPlanFromContent = (contentId: string) => {
    const contentConcepts = concepts.filter(concept => concept.contentId === contentId);
    setConcepts(prev => 
      prev.map(concept => 
        contentConcepts.some(c => c.id === concept.id)
          ? { ...concept, inRetentionPlan: true }
          : concept
      )
    );
  };

  const addAllConceptsToRetentionPlanFromTopic = (topic: string) => {
    let topicConcepts: any[] = [];
    
    if (topic === 'No Topic') {
      // For "No Topic", find concepts from content items with no topics or empty topics
      const contentWithoutTopics = contentItems.filter(item => 
        !item.topics || item.topics.length === 0
      );
      topicConcepts = concepts.filter(concept => 
        contentWithoutTopics.some(content => content.id === concept.contentId)
      );
    } else {
      // Find all content items that have this topic
      const contentWithTopic = contentItems.filter(item => 
        item.topics && item.topics.includes(topic)
      );
      // Find all concepts from these content items
      topicConcepts = concepts.filter(concept => 
        contentWithTopic.some(content => content.id === concept.contentId)
      );
    }
    
    setConcepts(prev => 
      prev.map(concept => 
        topicConcepts.some(c => c.id === concept.id)
          ? { ...concept, inRetentionPlan: true }
          : concept
      )
    );
  };

  const removeAllConceptsFromRetentionPlanFromContent = (contentId: string) => {
    const contentConcepts = concepts.filter(concept => concept.contentId === contentId);
    setConcepts(prev => 
      prev.map(concept => 
        contentConcepts.some(c => c.id === concept.id)
          ? { ...concept, inRetentionPlan: false }
          : concept
      )
    );
  };

  const removeAllConceptsFromRetentionPlanFromTopic = (topic: string) => {
    let topicConcepts: any[] = [];
    
    if (topic === 'No Topic') {
      // For "No Topic", find concepts from content items with no topics or empty topics
      const contentWithoutTopics = contentItems.filter(item => 
        !item.topics || item.topics.length === 0
      );
      topicConcepts = concepts.filter(concept => 
        contentWithoutTopics.some(content => content.id === concept.contentId)
      );
    } else {
      // Find all content items that have this topic
      const contentWithTopic = contentItems.filter(item => 
        item.topics && item.topics.includes(topic)
      );
      // Find all concepts from these content items
      topicConcepts = concepts.filter(concept => 
        contentWithTopic.some(content => content.id === concept.contentId)
      );
    }
    
    setConcepts(prev => 
      prev.map(concept => 
        topicConcepts.some(c => c.id === concept.id)
          ? { ...concept, inRetentionPlan: false }
          : concept
      )
    );
  };

  const areAllConceptsInRetentionPlanFromContent = (contentId: string) => {
    const contentConcepts = concepts.filter(concept => concept.contentId === contentId);
    if (contentConcepts.length === 0) return false;
    return contentConcepts.every(concept => concept.inRetentionPlan);
  };

  const areAllConceptsInRetentionPlanFromTopic = (topic: string) => {
    let topicConcepts: any[] = [];
    
    if (topic === 'No Topic') {
      // For "No Topic", find concepts from content items with no topics or empty topics
      const contentWithoutTopics = contentItems.filter(item => 
        !item.topics || item.topics.length === 0
      );
      topicConcepts = concepts.filter(concept => 
        contentWithoutTopics.some(content => content.id === concept.contentId)
      );
    } else {
      // Find all content items that have this topic
      const contentWithTopic = contentItems.filter(item => 
        item.topics && item.topics.includes(topic)
      );
      // Find all concepts from these content items
      topicConcepts = concepts.filter(concept => 
        contentWithTopic.some(content => content.id === concept.contentId)
      );
    }
    
    if (topicConcepts.length === 0) return false;
    return topicConcepts.every(concept => concept.inRetentionPlan);
  };

  const clearConceptSelection = () => {
    setSelectedConcepts(new Set());
  };

  const addSelectedConceptsToRetentionPlan = () => {
    setConcepts(prev => 
      prev.map(concept => 
        selectedConcepts.has(concept.id) 
          ? { ...concept, inRetentionPlan: true }
          : concept
      )
    );
    setSelectedConcepts(new Set()); // Clear selection after adding
  };

  const removeSelectedConceptsFromRetentionPlan = () => {
    setConcepts(prev => 
      prev.map(concept => 
        selectedConcepts.has(concept.id) 
          ? { ...concept, inRetentionPlan: false }
          : concept
      )
    );
    setSelectedConcepts(new Set()); // Clear selection after removing
  };

  const toggleConceptRetentionPlan = (conceptId: string) => {
    setConcepts(prev => 
      prev.map(concept => 
        concept.id === conceptId 
          ? { ...concept, inRetentionPlan: !concept.inRetentionPlan }
          : concept
      )
    );
  };

  const value: ContentContextType = {
    contentItems,
    concepts,
    allTopics,
    selectedConcepts,
    conceptsInRetentionPlan,
    addContentItem,
    addConcepts,
    updateContentItem,
    deleteContentItem,
    deleteConcept,
    toggleRetentionPlan,
    extractTopicsFromContent,
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
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContentData() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContentData must be used within a ContentDataProvider');
  }
  return context;
}