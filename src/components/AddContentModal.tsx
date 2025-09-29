import React, { useState } from 'react';
import { Upload, Link, Type, Plus, X, ArrowRight, Check, FileText, Brain, Eye, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { useContentData } from './ContentDataManager';

interface UploadedFile {
  file: File;
  id: string;
}

interface ContentData {
  title: string;
  type: 'file' | 'url' | 'text';
  content: string;
  preview: string;
  fileName?: string;
  url?: string;
}

interface KeyConcept {
  id: string;
  concept: string;
  explanation: string;
  category: string;
  selected: boolean;
}

type Step = 'upload' | 'confirm' | 'success';

export function AddContentModal() {
  const { addContentItem, addConcepts, extractTopicsFromContent } = useContentData();
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [activeTab, setActiveTab] = useState('files');
  
  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Link input state
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  
  // Text input state
  const [textContent, setTextContent] = useState('');
  const [textTitle, setTextTitle] = useState('');
  
  // Content processing state
  const [contentData, setContentData] = useState<ContentData | null>(null);
  const [extractedTopic, setExtractedTopic] = useState<string>(''); // Single topic instead of array
  const [extractedConcepts, setExtractedConcepts] = useState<KeyConcept[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newConcept, setNewConcept] = useState('');
  const [newConceptExplanation, setNewConceptExplanation] = useState('');

  const resetModal = () => {
    setCurrentStep('upload');
    setActiveTab('files');
    setUploadedFiles([]);
    setLinkUrl('');
    setLinkTitle('');
    setTextContent('');
    setTextTitle('');
    setContentData(null);
    setExtractedTopic('');
    setExtractedConcepts([]);
    setIsProcessing(false);
    setNewConcept('');
    setNewConceptExplanation('');
  };

  const handleModalClose = () => {
    setOpen(false);
    resetModal();
  };

  // File Upload Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const newFiles = files.map(file => ({
      file,
      id: Date.now().toString() + Math.random().toString()
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const newFiles = files.map(file => ({
      file,
      id: Date.now().toString() + Math.random().toString()
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Content Processing - now automatically extracts topics
  const confirmFileContent = async () => {
    if (uploadedFiles.length === 0) return;
    
    setIsProcessing(true);
    const file = uploadedFiles[0].file;
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      let content = e.target?.result as string;
      let actualContent = '';
      let preview = '';

      // Try to extract meaningful content from the file
      if (content && content.trim()) {
        // Clean up the content - remove excessive whitespace and control characters
        actualContent = content.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
        
        // If we got actual content, use it; otherwise generate realistic content based on filename
        if (actualContent.length > 50) {
          preview = actualContent.length > 300 ? actualContent.substring(0, 300) + '...' : actualContent;
        } else {
          // Generate realistic content based on filename
          actualContent = generateRealisticContent(file.name, 'file');
          preview = actualContent.length > 300 ? actualContent.substring(0, 300) + '...' : actualContent;
        }
      } else {
        // For non-text files (PDFs, images, etc.) or if reading failed
        actualContent = generateRealisticContent(file.name, 'file');
        preview = actualContent.length > 300 ? actualContent.substring(0, 300) + '...' : actualContent;
      }
      
      const data: ContentData = {
        title: file.name.replace(/\.[^/.]+$/, ""),
        type: 'file',
        content: actualContent,
        preview: preview,
        fileName: file.name
      };
      
      setContentData(data);
      
      // Auto-extract topic and concepts after processing content
      await extractTopicAndConceptsFromContentData(data);
    };
    
    // For text files, try to read them; for others, we'll generate content based on filename
    if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.readAsText(file);
    } else {
      // For non-text files, generate realistic content immediately
      const actualContent = generateRealisticContent(file.name, 'file');
      const preview = actualContent.length > 300 ? actualContent.substring(0, 300) + '...' : actualContent;
      
      const data: ContentData = {
        title: file.name.replace(/\.[^/.]+$/, ""),
        type: 'file',
        content: actualContent,
        preview: preview,
        fileName: file.name
      };
      
      setContentData(data);
      
      // Auto-extract topic and concepts after processing content
      await extractTopicAndConceptsFromContentData(data);
    }
  };

  const confirmLinkContent = async () => {
    if (!linkUrl) return;
    
    setIsProcessing(true);
    const title = linkTitle || 'Article from ' + new URL(linkUrl).hostname;
    const actualContent = generateRealisticContent(title, 'url', linkUrl);
    const preview = actualContent.length > 300 ? actualContent.substring(0, 300) + '...' : actualContent;
    
    const data: ContentData = {
      title: title,
      type: 'url',
      content: actualContent,
      preview: preview,
      url: linkUrl
    };
    
    setContentData(data);
    
    // Auto-extract topic and concepts after processing content
    await extractTopicAndConceptsFromContentData(data);
  };

  const confirmTextContent = async () => {
    if (!textContent) return;
    
    setIsProcessing(true);
    const data: ContentData = {
      title: textTitle || 'Custom Text Content',
      type: 'text',
      content: textContent,
      preview: textContent.length > 300 ? textContent.substring(0, 300) + '...' : textContent
    };
    
    setContentData(data);
    
    // Auto-extract topic and concepts after processing content
    await extractTopicAndConceptsFromContentData(data);
  };

  // New function to extract topic and concepts from content data and navigate to confirm step
  const extractTopicAndConceptsFromContentData = async (data: ContentData) => {
    // Extract topics using the content manager - take only the first one
    const topics = extractTopicsFromContent(
      data.title,
      data.content,
      data.url
    );
    
    // Take only the first topic
    const primaryTopic = topics.length > 0 ? topics[0] : 'General';
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setExtractedTopic(primaryTopic);
    
    // Extract concepts as well
    await extractConceptsForTopic(data, primaryTopic);
  };

  const extractConceptsForTopic = async (data: ContentData, topic: string) => {
    // Simulate AI processing delay for concepts
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Extract concepts from headings, key terms, and content structure
    const concepts: KeyConcept[] = [];
    const content = data.content.toLowerCase();
    const title = data.title.toLowerCase();
    
    // Extract key concepts based on content analysis (focusing on specific learnable elements)
    if (title.includes('react') || content.includes('react') || title.includes('javascript')) {
      concepts.push(
        { id: '1', concept: 'useState Hook', explanation: 'Hook for managing local state in functional components', category: topic, selected: true },
        { id: '2', concept: 'useEffect Hook', explanation: 'Hook for handling side effects and lifecycle events', category: topic, selected: true },
        { id: '3', concept: 'Custom Hooks', explanation: 'Reusable functions that encapsulate stateful logic', category: topic, selected: true },
        { id: '4', concept: 'Component Props', explanation: 'Data passed from parent to child components', category: topic, selected: true }
      );
    } else if (title.includes('design') || content.includes('design') || title.includes('ui') || title.includes('ux')) {
      concepts.push(
        { id: '1', concept: 'Design Tokens', explanation: 'Named entities that store visual design attributes', category: topic, selected: true },
        { id: '2', concept: 'Component Library', explanation: 'Collection of reusable UI components with consistent styling', category: topic, selected: true },
        { id: '3', concept: 'User Journey Mapping', explanation: 'Visual representation of user interactions with a product', category: topic, selected: true },
        { id: '4', concept: 'Accessibility Standards', explanation: 'Guidelines ensuring products are usable by people with disabilities', category: topic, selected: true }
      );
    } else if (title.includes('machine learning') || title.includes('ai') || content.includes('neural') || content.includes('algorithm')) {
      concepts.push(
        { id: '1', concept: 'Training Dataset', explanation: 'Collection of labeled examples used to teach machine learning models', category: topic, selected: true },
        { id: '2', concept: 'Model Validation', explanation: 'Process of evaluating model performance on unseen data', category: topic, selected: true },
        { id: '3', concept: 'Overfitting', explanation: 'When a model learns training data too well but fails on new examples', category: topic, selected: true },
        { id: '4', concept: 'Feature Selection', explanation: 'Process of choosing relevant variables for model training', category: topic, selected: true }
      );
    } else if (title.includes('learning') || content.includes('memory') || content.includes('retention') || title.includes('study')) {
      concepts.push(
        { id: '1', concept: 'Active Recall', explanation: 'Testing yourself to retrieve information from memory', category: topic, selected: true },
        { id: '2', concept: 'Spaced Intervals', explanation: 'Gradually increasing time between review sessions', category: topic, selected: true },
        { id: '3', concept: 'Elaborative Questioning', explanation: 'Asking "why" and "how" to deepen understanding', category: topic, selected: true },
        { id: '4', concept: 'Interleaved Practice', explanation: 'Mixing different problem types during study sessions', category: topic, selected: true }
      );
    } else if (title.includes('leadership') || content.includes('management') || content.includes('team')) {
      concepts.push(
        { id: '1', concept: 'Growth Mindset', explanation: 'Belief that abilities can be developed through effort and learning', category: topic, selected: true },
        { id: '2', concept: 'Psychological Safety', explanation: 'Team environment where members feel safe to take risks and make mistakes', category: topic, selected: true },
        { id: '3', concept: 'Delegation Framework', explanation: 'Structured approach to assigning tasks and responsibilities', category: topic, selected: true },
        { id: '4', concept: 'Feedback Loops', explanation: 'Regular cycles of giving and receiving constructive feedback', category: topic, selected: true }
      );
    } else if (title.includes('api') || content.includes('rest') || content.includes('endpoint')) {
      concepts.push(
        { id: '1', concept: 'HTTP Status Codes', explanation: 'Standardized codes indicating the result of HTTP requests', category: topic, selected: true },
        { id: '2', concept: 'Request/Response Cycle', explanation: 'The flow of data between client and server', category: topic, selected: true },
        { id: '3', concept: 'Authentication Methods', explanation: 'Techniques for verifying user identity in API calls', category: topic, selected: true },
        { id: '4', concept: 'Rate Limiting', explanation: 'Controlling the frequency of API requests from users', category: topic, selected: true }
      );
    } else {
      // Extract concepts from headings and key terms in content
      const extractedConcepts = extractConceptsFromContent(data.content, data.title);
      if (extractedConcepts.length > 0) {
        concepts.push(...extractedConcepts.map(c => ({ ...c, category: topic })));
      } else {
        // Fallback to generic but specific concepts
        concepts.push(
          { id: '1', concept: 'Core Framework', explanation: `The main structural approach presented in ${data.title}`, category: topic, selected: true },
          { id: '2', concept: 'Implementation Strategy', explanation: 'Step-by-step method for applying the concepts', category: topic, selected: true },
          { id: '3', concept: 'Success Metrics', explanation: 'Measurable indicators of effective application', category: topic, selected: true }
        );
      }
    }
    
    setExtractedConcepts(concepts);
    setIsProcessing(false);
    setCurrentStep('confirm');
  };



  // Extract specific learnable concepts from content structure
  const extractConceptsFromContent = (content: string, title: string): KeyConcept[] => {
    const concepts: KeyConcept[] = [];
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    
    // Look for definition patterns (X is Y, X: Y, X - Y)
    const definitionPatterns = [
      /^(.+?)\s+is\s+(.+)$/i,
      /^(.+?):\s+(.+)$/,
      /^(.+?)\s+-\s+(.+)$/,
      /^(.+?)\s+means\s+(.+)$/i
    ];
    
    let conceptId = 1;
    lines.forEach(line => {
      if (concepts.length >= 4) return; // Limit to 4 concepts
      
      for (const pattern of definitionPatterns) {
        const match = line.match(pattern);
        if (match && match[1].trim().length < 50 && match[2].trim().length > 10) {
          const concept = match[1].trim();
          const explanation = match[2].trim();
          
          // Skip if too generic or already exists
          if (!concept.toLowerCase().includes('the ') && 
              !concepts.some(c => c.concept.toLowerCase() === concept.toLowerCase())) {
            
            const category = extractedTopic || 'General';
            concepts.push({
              id: conceptId.toString(),
              concept: concept.charAt(0).toUpperCase() + concept.slice(1),
              explanation: explanation.charAt(0).toUpperCase() + explanation.slice(1),
              category,
              selected: true
            });
            conceptId++;
            break;
          }
        }
      }
    });
    
    return concepts;
  };

  const toggleConcept = (id: string) => {
    setExtractedConcepts(prev => 
      prev.map(concept => 
        concept.id === id ? { ...concept, selected: !concept.selected } : concept
      )
    );
  };

  const removeConcept = (id: string) => {
    setExtractedConcepts(prev => prev.filter(concept => concept.id !== id));
  };



  const addCustomConcept = () => {
    if (!newConcept.trim()) return;
    
    const concept: KeyConcept = {
      id: Date.now().toString(),
      concept: newConcept.trim(),
      explanation: newConceptExplanation.trim() || 'Custom concept added by user',
      category: extractedTopic || 'General',
      selected: true
    };
    
    setExtractedConcepts(prev => [...prev, concept]);
    setNewConcept('');
    setNewConceptExplanation('');
  };

  // Helper function to generate realistic content previews based on title and type
  const generateRealisticContent = (title: string, type: 'file' | 'url' | 'text', url?: string): string => {
    const lowerTitle = title.toLowerCase();
    
    // Learning and Memory related content
    if (lowerTitle.includes('make it stick') || lowerTitle.includes('learning') || lowerTitle.includes('memory')) {
      return `Learning is not about passive absorption but active engagement. The most effective learning strategies include retrieval practice, spaced repetition, and elaborative interrogation. 

Research shows that testing yourself regularly is more effective than simply re-reading material. This is because retrieval practice strengthens memory consolidation and reveals gaps in understanding. 

Spaced repetition involves reviewing material at increasing intervals - first after one day, then three days, then a week, and so on. This approach leverages the psychological spacing effect to combat the forgetting curve.

Another powerful technique is elaborative interrogation, where you ask yourself "why" questions about the material. This creates deeper connections and makes information more memorable. Interleaving different types of problems during practice also improves learning by forcing your brain to work harder to distinguish between concepts.

The key insight is that learning feels harder when you're doing it right. Difficulty and frustration are often signs that you're building stronger, more durable knowledge.`;
    }

    // React and JavaScript related content
    if (lowerTitle.includes('react') || lowerTitle.includes('javascript') || lowerTitle.includes('js') || lowerTitle.includes('hooks')) {
      return `React has revolutionized frontend development with its component-based architecture and declarative programming model. The introduction of Hooks in React 16.8 eliminated the need for class components in most cases.

useState is the most fundamental Hook, allowing functional components to manage local state. The basic syntax is: const [state, setState] = useState(initialValue). Always use the functional update pattern when new state depends on previous state.

useEffect handles side effects and replaces lifecycle methods from class components. It runs after every render by default, but you can control when it runs using the dependency array as the second argument.

Custom Hooks allow you to extract component logic into reusable functions. They're just JavaScript functions that call other Hooks and follow the naming convention of starting with "use".

Key principles include keeping components pure, avoiding direct DOM manipulation, and thinking in terms of data flow from parent to child components through props. The virtual DOM enables efficient updates by diffing against the previous state.`;
    }

    // Design and UX related content
    if (lowerTitle.includes('design') || lowerTitle.includes('ux') || lowerTitle.includes('ui') || lowerTitle.includes('system')) {
      return `Design systems have become essential for maintaining consistency across digital products. They consist of reusable components, design tokens, and guidelines that ensure cohesive user experiences.

Design tokens are the foundation of scalable design systems. They store visual design attributes like colors, spacing, typography, and shadows as named entities. This centralization ensures consistency and makes updates efficient across all products.

User experience design goes beyond visual aesthetics to encompass the entire user journey. It involves understanding user needs through research, creating user personas, and designing intuitive information architecture.

Accessibility should be considered from the beginning, not as an afterthought. This includes proper color contrast, keyboard navigation, screen reader compatibility, and inclusive design practices.

The atomic design methodology breaks interfaces down into atoms, molecules, organisms, templates, and pages. This hierarchical structure helps teams think systematically about component composition and reusability.`;
    }

    // Machine Learning and AI content
    if (lowerTitle.includes('machine learning') || lowerTitle.includes('ai') || lowerTitle.includes('ml') || lowerTitle.includes('neural')) {
      return `Machine learning represents a paradigm shift from traditional programming, where instead of writing explicit instructions, we train algorithms to learn patterns from data.

Supervised learning uses labeled training data to learn a mapping between inputs and outputs. Common algorithms include linear regression, decision trees, random forests, and neural networks. The goal is to minimize prediction error on unseen data.

Feature engineering is crucial for model performance. It involves selecting, transforming, and creating variables that help the algorithm learn effectively. This includes handling missing values, encoding categorical variables, and scaling numerical features.

Neural networks, inspired by biological neurons, consist of layers of interconnected nodes. Deep learning uses networks with many hidden layers to automatically learn hierarchical representations of data.

Model evaluation requires careful consideration of metrics like accuracy, precision, recall, and F1-score. Cross-validation helps assess how well a model generalizes to independent data. Overfitting occurs when a model learns the training data too well but fails on new examples.`;
    }

    // Leadership and Management content
    if (lowerTitle.includes('leadership') || lowerTitle.includes('management') || lowerTitle.includes('amazon') || lowerTitle.includes('principles')) {
      return `Leadership principles serve as the foundation for decision-making and behavior in high-performing organizations. Amazon's 16 Leadership Principles have been particularly influential in shaping modern tech culture.

Customer obsession means starting with the customer and working backwards. Leaders earn and keep customer trust by consistently delivering value, even when it's difficult or expensive. This principle drives product decisions and prioritizes long-term customer satisfaction over short-term profits.

Ownership thinking encourages leaders to act on behalf of the entire company, not just their team. They think long-term and don't sacrifice long-term value for short-term results. This includes being willing to respectfully challenge decisions when they disagree.

Bias for action values calculated risk-taking and speed. Many decisions are reversible and don't need extensive study. Leaders should act quickly while gathering information, rather than waiting for perfect data that may never come.

Effective leaders hire and develop the best talent, raising the performance bar with every hire. They recognize exceptional talent and help them grow throughout the organization, creating a culture of continuous learning and improvement.`;
    }

    // API and Development content
    if (lowerTitle.includes('api') || lowerTitle.includes('rest') || lowerTitle.includes('development') || lowerTitle.includes('programming')) {
      return `RESTful API design follows specific architectural constraints that make web services scalable, maintainable, and intuitive. REST stands for Representational State Transfer and emphasizes stateless communication between client and server.

Resource-based URLs should use nouns, not verbs. For example, GET /users/123 retrieves user 123, while DELETE /users/123 removes that user. HTTP methods (GET, POST, PUT, DELETE) define the action being performed.

Status codes communicate the outcome of requests. 2xx codes indicate success, 4xx indicate client errors, and 5xx indicate server errors. Proper error handling includes meaningful error messages and appropriate status codes.

API versioning ensures backward compatibility as services evolve. Common approaches include URL versioning (/v1/users), header versioning, or parameter versioning. Each has trade-offs between simplicity and flexibility.

Authentication and authorization protect resources from unauthorized access. OAuth 2.0 has become the standard for modern APIs, providing secure delegation of access rights without sharing credentials.`;
    }

    // Generic content based on type
    const hostname = url ? new URL(url).hostname : '';
    
    if (type === 'url') {
      return `This article from ${hostname || 'the web'} provides comprehensive insights into ${title}. The content covers fundamental concepts, practical applications, and real-world examples that help readers understand and implement the key ideas.

The author presents evidence-based approaches and industry best practices, drawing from extensive research and professional experience. Key themes include strategic thinking, implementation challenges, and lessons learned from successful case studies.

The material is particularly valuable for professionals looking to deepen their understanding and apply these concepts in their work. It bridges the gap between theoretical knowledge and practical application, providing actionable insights that can drive meaningful results.

Throughout the content, emphasis is placed on understanding core principles rather than memorizing specific techniques. This approach ensures that readers can adapt the concepts to various situations and contexts they may encounter in their professional journey.`;
    }

    if (type === 'file') {
      const extension = title.split('.').pop()?.toLowerCase();
      if (extension === 'pdf') {
        return `This PDF document provides detailed coverage of ${title.replace(/\.[^/.]+$/, "")}. The content is structured to guide readers through complex concepts with clear explanations and supporting examples.

Key sections include foundational principles, detailed methodologies, and practical implementation strategies. The document serves as both a learning resource and a reference guide for professionals in the field.

Charts, diagrams, and case studies throughout the document illustrate important concepts and provide visual learning aids. The comprehensive approach ensures readers gain both theoretical understanding and practical knowledge.

The material has been carefully organized to build knowledge progressively, with each section building upon previous concepts. This structure makes it suitable for both newcomers to the topic and experienced practitioners seeking to deepen their expertise.`;
      }
    }

    // Default fallback content
    return `This content explores ${title} through a comprehensive examination of key concepts, practical applications, and industry insights. The material provides valuable perspectives that can enhance understanding and inform decision-making.

Core topics include fundamental principles, implementation strategies, and best practices derived from extensive research and real-world experience. The content is designed to bridge theoretical knowledge with practical application.

Key insights focus on actionable approaches that professionals can immediately apply in their work. Case studies and examples throughout the material demonstrate successful implementation and common challenges to avoid.

The comprehensive coverage ensures readers gain both foundational knowledge and advanced understanding, making this a valuable resource for continued learning and professional development in this important area.`;
  };

  // Helper functions to generate enhanced content for concepts
  const generateKeyContent = (concept: KeyConcept, contentData: ContentData): string => {
    // Generate contextual key content based on the concept and source material
    return `${concept.explanation} This concept is derived from "${contentData.title}" and represents a fundamental principle that can be applied in practical scenarios for better understanding and implementation.`;
  };

  const generateExamples = (concept: KeyConcept, contentData: ContentData): string[] => {
    const examples: string[] = [];
    
    // Generate examples based on concept category and content type
    switch (concept.category.toLowerCase()) {
      case 'development':
        examples.push(
          `Code implementation: Apply ${concept.concept} in your development workflow`,
          `Project structure: Organize your codebase using ${concept.concept} principles`,
          `Team practice: Share ${concept.concept} knowledge during code reviews`
        );
        break;
      case 'design':
        examples.push(
          `Design system: Incorporate ${concept.concept} into your component library`,
          `User interface: Apply ${concept.concept} to improve user experience`,
          `Design process: Use ${concept.concept} during ideation and iteration phases`
        );
        break;
      case 'learning':
        examples.push(
          `Study routine: Implement ${concept.concept} in daily learning sessions`,
          `Knowledge retention: Use ${concept.concept} to remember information longer`,
          `Skill development: Apply ${concept.concept} when learning new subjects`
        );
        break;
      case 'leadership':
      case 'management':
        examples.push(
          `Team meetings: Demonstrate ${concept.concept} in leadership decisions`,
          `Project management: Apply ${concept.concept} to improve team performance`,
          `Strategic planning: Use ${concept.concept} for long-term organizational goals`
        );
        break;
      default:
        examples.push(
          `Daily application: Integrate ${concept.concept} into your regular workflow`,
          `Problem solving: Use ${concept.concept} to approach complex challenges`,
          `Professional growth: Apply ${concept.concept} for career development`
        );
    }
    
    return examples;
  };

  const generateActionableTip = (concept: KeyConcept, contentData: ContentData): string => {
    // Generate actionable tips based on concept category
    switch (concept.category.toLowerCase()) {
      case 'development':
        return `Start implementing ${concept.concept} in your next project. Create a simple example first, then gradually apply it to more complex scenarios. Document your learning process for future reference.`;
      case 'design':
        return `Begin by researching how leading companies implement ${concept.concept}. Create a mood board or case study, then apply these insights to a small design project.`;
      case 'learning':
        return `Practice ${concept.concept} for 10 minutes daily. Track your progress in a learning journal and adjust your approach based on what works best for your learning style.`;
      case 'leadership':
      case 'management':
        return `Identify one situation this week where you can apply ${concept.concept}. Observe the results and reflect on how this principle affected the outcome.`;
      default:
        return `Choose one specific area where you can apply ${concept.concept} immediately. Set a reminder to practice this concept regularly and measure your improvement over time.`;
    }
  };

  const saveContent = () => {
    if (!contentData) return;
    
    const selectedConcepts = extractedConcepts.filter(c => c.selected);
    
    // Calculate file size for files
    let fileSize: string | undefined;
    if (contentData.type === 'file' && uploadedFiles.length > 0) {
      const file = uploadedFiles[0].file;
      fileSize = formatFileSize(file.size);
    }
    
    // Save content to the data store
    const contentId = addContentItem({
      title: contentData.title,
      type: contentData.type,
      content: contentData.content,
      url: contentData.url,
      fileName: contentData.fileName,
      fileSize: fileSize,
      preview: contentData.preview,
      topics: extractedTopic ? [extractedTopic] : [],
      tags: [] // Could be enhanced to extract tags from content
    });
    
    // Save concepts to the concept vault
    if (selectedConcepts.length > 0) {
      const conceptsForSaving = selectedConcepts.map(concept => ({
        concept: concept.concept,
        explanation: concept.explanation,
        category: concept.category,
        // Generate enhanced content for better learning experience
        keyContent: generateKeyContent(concept, contentData),
        examples: generateExamples(concept, contentData),
        actionableTip: generateActionableTip(concept, contentData)
      }));
      addConcepts(conceptsForSaving, contentId);
    }
    
    // Show success state
    setCurrentStep('success');
    
    // Auto-close after 2 seconds
    setTimeout(() => {
      handleModalClose();
    }, 2000);
  };

  const canConfirmContent = () => {
    if (activeTab === 'files') return uploadedFiles.length > 0;
    if (activeTab === 'links') return linkUrl.trim() !== '';
    if (activeTab === 'text') return textContent.trim() !== '';
    return false;
  };

  const handleConfirmContent = async () => {
    if (activeTab === 'files') await confirmFileContent();
    if (activeTab === 'links') await confirmLinkContent();
    if (activeTab === 'text') await confirmTextContent();
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) handleModalClose();
      else setOpen(newOpen);
    }}>
      <DialogTrigger asChild>
        <Button 
          className="flex items-center space-x-2 rounded-xl text-blue-600 border-2 border-white/30 hover:border-white hover:bg-white/90 hover:text-blue-700 transition-all duration-200 shadow-sm"
          style={{ backgroundColor: '#ffffff', color: '#2852E9' }}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline font-semibold">Add Content</span>
          <span className="sm:hidden font-semibold">Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Content</DialogTitle>
          <DialogDescription>
            {currentStep === 'upload' && 'Upload files, paste links, or add text to expand your learning library'}
            {currentStep === 'confirm' && 'Confirm the topic and select key concepts you want to track and learn'}
            {currentStep === 'success' && 'Content successfully added to your library!'}
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        {currentStep !== 'success' && (
          <div className="flex items-center space-x-2 mb-6 overflow-x-auto">
            <div className={`flex items-center space-x-2 ${currentStep === 'upload' ? 'text-blue-600' : 'text-green-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'upload' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                {currentStep === 'upload' ? '1' : '✓'}
              </div>
              <span className="text-sm font-medium whitespace-nowrap">Upload</span>
            </div>
            <div className="w-8 h-px bg-gray-200"></div>
            <div className={`flex items-center space-x-2 ${currentStep === 'confirm' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'confirm' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                2
              </div>
              <span className="text-sm font-medium whitespace-nowrap">Confirm Topic & Key Concepts</span>
            </div>
          </div>
        )}

        {currentStep === 'upload' && (
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="files" className="flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload Files</span>
                </TabsTrigger>
                <TabsTrigger value="links" className="flex items-center space-x-2">
                  <Link className="h-4 w-4" />
                  <span>Paste Link</span>
                </TabsTrigger>
                <TabsTrigger value="text" className="flex items-center space-x-2">
                  <Type className="h-4 w-4" />
                  <span>Add Text</span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="files" className="space-y-4">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragOver 
                        ? 'border-blue-accent bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="mb-2 font-medium">Drop files here or click to upload</h3>
                    <p className="text-gray-500 mb-4">
                      Support for multiple files. Maximum file size: 10MB
                    </p>
                    <Button 
                      onClick={() => document.getElementById('file-input')?.click()}
                      variant="outline"
                    >
                      Choose Files
                    </Button>
                    <input
                      id="file-input"
                      type="file"
                      multiple
                      accept=".pdf,.txt,.docx,.md,.doc"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Uploaded Files</h4>
                      {uploadedFiles.map((uploadedFile) => (
                        <div key={uploadedFile.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium">{uploadedFile.file.name}</p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(uploadedFile.file.size)}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(uploadedFile.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="links" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">URL</label>
                      <Input 
                        placeholder="https://example.com/article"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Title (optional)</label>
                      <Input 
                        placeholder="Article title"
                        value={linkTitle}
                        onChange={(e) => setLinkTitle(e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="text" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <Input 
                        placeholder="Content title"
                        value={textTitle}
                        onChange={(e) => setTextTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Content</label>
                      <Textarea 
                        placeholder="Paste or type your content here..."
                        rows={8}
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            {/* Content Preview (shown after processing) */}
            {contentData && isProcessing && (
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="h-5 w-5 animate-pulse" />
                      <span>Processing Content...</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {contentData && !isProcessing && currentStep === 'upload' && (
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Eye className="h-5 w-5" />
                      <span>Content Preview</span>
                    </CardTitle>
                    <CardDescription>Content processed and topics are being extracted</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Title</label>
                      <p className="text-lg font-medium">{contentData.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Type</label>
                      <div className="mt-1">
                        <Badge variant="outline" className="text-xs">
                          {contentData.type === 'file' && <FileText className="h-3 w-3 mr-1" />}
                          {contentData.type === 'url' && <Link className="h-3 w-3 mr-1" />}
                          {contentData.type === 'text' && <Type className="h-3 w-3 mr-1" />}
                          {contentData.type.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Summary</label>
                      <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{contentData.preview}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Confirm Content Button */}
            {!contentData && (
              <div className="flex justify-end mt-6">
                <Button 
                  onClick={handleConfirmContent}
                  disabled={!canConfirmContent() || isProcessing}
                  className="text-white"
                  style={{ backgroundColor: '#2852E9' }}
                >
                  {isProcessing ? (
                    <>
                      <Brain className="h-4 w-4 mr-2 animate-pulse" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Process Content
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}





        {currentStep === 'confirm' && (
          <div className="space-y-6">
            {/* Topic Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">Confirm Topic</h3>
              <p className="text-sm text-gray-600 mb-4">
                This topic will organize your content and concepts.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-100 rounded-full px-3 py-1">
                    <span className="text-sm font-medium text-blue-800">{extractedTopic || 'General'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Concepts Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">Select Key Concepts</h3>
              <p className="text-sm text-gray-600 mb-6">
                These concepts will be added to your Concept Vault for learning and retention tracking.
              </p>

              <div className="space-y-4">
                {extractedConcepts.map((concept) => (
                  <Card key={concept.id} className={`transition-colors ${concept.selected ? 'ring-2 ring-blue-accent bg-blue-50' : 'hover:bg-gray-50'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox 
                          checked={concept.selected}
                          onCheckedChange={() => toggleConcept(concept.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium">{concept.concept}</h4>
                            <Badge variant="secondary" className="text-xs">{concept.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{concept.explanation}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeConcept(concept.id);
                          }}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Add Custom Concept */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Add Additional Concept</CardTitle>
                <CardDescription>Add any custom concepts that weren't automatically detected</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input 
                  placeholder="Concept name"
                  value={newConcept}
                  onChange={(e) => setNewConcept(e.target.value)}
                />
                <Textarea 
                  placeholder="Concept explanation (optional)"
                  rows={3}
                  value={newConceptExplanation}
                  onChange={(e) => setNewConceptExplanation(e.target.value)}
                />
                <Button 
                  onClick={addCustomConcept}
                  disabled={!newConcept.trim()}
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Concept
                </Button>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => {
                // Reset to upload step and clear processed data
                setCurrentStep('upload');
                setContentData(null);
                setExtractedTopic('');
                setExtractedConcepts([]);
              }}>
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                Back to Upload
              </Button>
              <Button 
                onClick={saveContent}
                className="flex-1 text-white"
                style={{ backgroundColor: '#2852E9' }}
                disabled={extractedConcepts.filter(c => c.selected).length === 0}
              >
                Save Content & Concepts
                <Check className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}



        {currentStep === 'success' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Content Added Successfully!</h3>
            <p className="text-gray-600 mb-4">
              Your content has been saved to My Content with topics and key concepts have been added to your Concept Vault.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span>✓ Content saved to library</span>
              <span>✓ Topics organized</span>
              <span>✓ Concepts added to vault</span>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Closing automatically...
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}