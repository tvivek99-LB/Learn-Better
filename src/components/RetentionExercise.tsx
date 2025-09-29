import React, { useState } from 'react';
import { ArrowLeft, X, ChevronRight, ChevronLeft, RotateCcw, List, Check, Circle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ScrollArea } from './ui/scroll-area';
import { QuestionNavigationGrid, QuestionData as GridQuestionData } from './QuestionNavigationGrid';

import elephantIcon from 'figma:asset/6a6cf3248f5534ec8cbd485aa8e2c9106eadc475.png';

// Import all question type components
import { FillInBlankQuestion } from './questions/FillInBlankQuestion';
import { ClozeWordBankQuestion } from './questions/ClozeWordBankQuestion';
import { DropdownClozeQuestion } from './questions/DropdownClozeQuestion';
import { MCQQuestion } from './questions/MCQQuestion';
import { MultiSelectQuestion } from './questions/MultiSelectQuestion';
import { TrueFalseQuestion } from './questions/TrueFalseQuestion';
import { ExtendedMatchingQuestion } from './questions/ExtendedMatchingQuestion';
import { AssertionReasonQuestion } from './questions/AssertionReasonQuestion';
import { MatrixGridQuestion } from './questions/MatrixGridQuestion';
import { ConfidenceWeightedMCQQuestion } from './questions/ConfidenceWeightedMCQQuestion';
import { TermDefinitionMatchingQuestion } from './questions/TermDefinitionMatchingQuestion';
import { ExampleConceptMatchingQuestion } from './questions/ExampleConceptMatchingQuestion';
import { CategoryBucketingQuestion } from './questions/CategoryBucketingQuestion';
import { VennClassificationQuestion } from './questions/VennClassificationQuestion';
import { OddOneOutQuestion } from './questions/OddOneOutQuestion';
import { ReorderingStepsQuestion } from './questions/ReorderingStepsQuestion';
import { TimelinePlacementQuestion } from './questions/TimelinePlacementQuestion';
import { RankingQuestion } from './questions/RankingQuestion';
import { CauseEffectChainQuestion } from './questions/CauseEffectChainQuestion';
import { ChartReadingQuestion } from './questions/ChartReadingQuestion';
import { ScenarioMCQQuestion } from './questions/ScenarioMCQQuestion';
import { MiniSimulationQuestion } from './questions/MiniSimulationQuestion';
import { PolicyApplicationQuestion } from './questions/PolicyApplicationQuestion';
import { TradeoffSliderQuestion } from './questions/TradeoffSliderQuestion';
import { DataInterpretationQuestion } from './questions/DataInterpretationQuestion';

export interface QuestionData {
  id: string;
  type: string;
  title: string;
  data: any;
}

const sampleQuestions: QuestionData[] = [
  {
    id: '1',
    type: 'fill-in-blank',
    title: 'Product Management Fundamentals',
    data: {
      text: 'A _______ is a strategic document that outlines the vision, direction, priorities, and progress of a product over time. It serves as a shared source of truth that outlines the vision, direction, priorities, and progress of a _______ over time.',
      blanks: ['product roadmap', 'product'],
      explanation: 'A product roadmap is essential for aligning stakeholders and communicating product strategy.'
    }
  },
  {
    id: '2',
    type: 'cloze-word-bank',
    title: 'Learning Psychology',
    data: {
      text: 'The _______ effect occurs when information is better recalled when it is _______ throughout learning sessions rather than massed together. This technique, known as _______, significantly improves long-term retention.',
      wordBank: ['spacing', 'distributed', 'spaced repetition', 'cramming', 'massed practice'],
      blanks: ['spacing', 'distributed', 'spaced repetition'],
      explanation: 'Spaced repetition leverages the spacing effect to optimize memory consolidation.'
    }
  },
  {
    id: '3',
    type: 'dropdown-cloze',
    title: 'Cognitive Load Theory',
    data: {
      text: 'According to Cognitive Load Theory, working memory can hold approximately _______ items simultaneously. When this capacity is exceeded, learning becomes _______ and performance _______.',
      dropdowns: [
        { options: ['3-5', '7±2', '9-12', '15-20'] },
        { options: ['enhanced', 'impaired', 'accelerated', 'unchanged'] },
        { options: ['improves', 'deteriorates', 'stabilizes', 'fluctuates'] }
      ],
      correctAnswers: ['7±2', 'impaired', 'deteriorates'],
      explanation: 'Working memory limitations are crucial for designing effective learning experiences.'
    }
  },
  {
    id: '4',
    type: 'mcq',
    title: 'Design Thinking Process',
    data: {
      question: 'Which of the following best describes the correct sequence of the Design Thinking process?',
      options: [
        'Ideate → Empathize → Define → Prototype → Test',
        'Empathize → Define → Ideate → Prototype → Test',
        'Define → Empathize → Prototype → Ideate → Test',
        'Prototype → Test → Empathize → Define → Ideate'
      ],
      correctAnswer: 1,
      explanation: 'The Design Thinking process starts with empathy to understand users, then defines problems, generates ideas, builds prototypes, and tests solutions.'
    }
  },
  {
    id: '5',
    type: 'multi-select',
    title: 'Effective Study Strategies',
    data: {
      question: 'Which of the following are evidence-based learning strategies that improve retention? (Select all that apply)',
      options: [
        'Highlighting and re-reading text',
        'Testing yourself with flashcards',
        'Teaching concepts to others',
        'Cramming before exams',
        'Interleaving different topics',
        'Taking detailed notes while reading'
      ],
      correctAnswers: [1, 2, 4],
      explanation: 'Active recall (testing), elaboration (teaching), and interleaving are proven effective. Passive strategies like highlighting and cramming are less effective.'
    }
  },
  {
    id: '6',
    type: 'true-false',
    title: 'Leadership Psychology',
    data: {
      statements: [
        { statement: 'Effective leaders should always maintain emotional distance from their team.', correct: false },
        { statement: 'Micromanagement typically leads to higher team productivity.', correct: false },
        { statement: 'Regular feedback is essential for team development and performance.', correct: true },
        { statement: 'Vulnerability in leadership is a sign of weakness.', correct: false }
      ],
      explanation: 'Modern leadership emphasizes emotional intelligence, trust, regular feedback, and authentic vulnerability.'
    }
  },
  {
    id: '7',
    type: 'extended-matching',
    title: 'Memory Systems',
    data: {
      categories: [
        { id: 'sensory', label: 'Sensory Memory' },
        { id: 'working', label: 'Working Memory' },
        { id: 'longterm', label: 'Long-term Memory' }
      ],
      items: [
        { id: 'item1', text: 'Holds information for 0.5-3 seconds' },
        { id: 'item2', text: 'Limited capacity of 7±2 items' },
        { id: 'item3', text: 'Unlimited storage capacity' }
      ],
      matches: {
        'item1': 'sensory',
        'item2': 'working',
        'item3': 'longterm'
      },
      explanation: 'Understanding memory systems helps optimize learning strategies.'
    }
  },
  {
    id: '8',
    type: 'assertion-reason',
    title: 'Spaced Repetition',
    data: {
      assertion: 'Spaced repetition is more effective than massed practice for long-term retention.',
      reason: 'The forgetting curve shows that memory strength decreases exponentially over time without reinforcement.',
      options: [
        'Both assertion and reason are true, and the reason correctly explains the assertion',
        'Both assertion and reason are true, but the reason does not explain the assertion',
        'The assertion is true, but the reason is false',
        'The assertion is false, but the reason is true'
      ],
      correctAnswer: 0,
      explanation: 'The forgetting curve directly explains why spaced repetition works.'
    }
  },
  {
    id: '9',
    type: 'matrix-grid',
    title: 'Learning Strategies Effectiveness',
    data: {
      rows: ['Highlighting', 'Summarization', 'Testing', 'Spaced Practice'],
      columns: ['Ease of Use', 'Time Investment', 'Effectiveness'],
      cells: {
        'Testing-Effectiveness': 'High',
        'Spaced Practice-Effectiveness': 'High',
        'Highlighting-Effectiveness': 'Low'
      },
      explanation: 'Effective strategies often require more effort but yield better results.'
    }
  },
  {
    id: '10',
    type: 'confidence-weighted-mcq',
    title: 'Cognitive Biases',
    data: {
      question: 'What is the "Dunning-Kruger effect"?',
      options: [
        'Experts underestimate their competence',
        'Novices overestimate their competence',
        'People remember positive events better',
        'Individuals prefer confirming information'
      ],
      correctAnswer: 1,
      explanation: 'The Dunning-Kruger effect describes how people with limited knowledge overestimate their competence.'
    }
  },
  {
    id: '11',
    type: 'term-definition-matching',
    title: 'UX Design Terminology',
    data: {
      pairs: [
        { term: 'Wireframe', definition: 'Low-fidelity structural blueprint of a page layout' },
        { term: 'Persona', definition: 'Fictional character representing a user segment' },
        { term: 'User Journey', definition: 'Path taken by a user to complete a task' }
      ],
      explanation: 'Understanding UX terminology is essential for effective design communication.'
    }
  },
  {
    id: '12',
    type: 'mcq',
    title: 'Project Management',
    data: {
      question: 'What is the primary purpose of a sprint retrospective?',
      options: [
        'Plan the next sprint',
        'Review completed work',
        'Identify improvements for future sprints',
        'Assign tasks to team members'
      ],
      correctAnswer: 2,
      explanation: 'Sprint retrospectives focus on continuous improvement and team learning.'
    }
  },
  {
    id: '13',
    type: 'multi-select',
    title: 'Agile Principles',
    data: {
      question: 'Which are core Agile principles? (Select all that apply)',
      options: [
        'Individuals over processes',
        'Working software over documentation',
        'Contract negotiation over collaboration',
        'Responding to change over following a plan'
      ],
      correctAnswers: [0, 1, 3],
      explanation: 'Agile values people, working solutions, and adaptability.'
    }
  },
  {
    id: '14',
    type: 'fill-in-blank',
    title: 'Data Analysis',
    data: {
      text: 'A _______ is used to show the relationship between two variables, while a _______ chart displays data over time.',
      blanks: ['scatter plot', 'line'],
      explanation: 'Different chart types serve specific analytical purposes.'
    }
  },
  {
    id: '15',
    type: 'mcq',
    title: 'Machine Learning',
    data: {
      question: 'What type of learning uses labeled training data?',
      options: [
        'Unsupervised learning',
        'Supervised learning',
        'Reinforcement learning',
        'Deep learning'
      ],
      correctAnswer: 1,
      explanation: 'Supervised learning requires labeled examples to train models.'
    }
  },
  {
    id: '16',
    type: 'true-false',
    title: 'Statistics Concepts',
    data: {
      statements: [
        { statement: 'Correlation implies causation.', correct: false },
        { statement: 'A larger sample size generally increases statistical power.', correct: true },
        { statement: 'P-hacking is an ethical research practice.', correct: false }
      ],
      explanation: 'Understanding statistical concepts prevents common analytical errors.'
    }
  },
  {
    id: '17',
    type: 'mcq',
    title: 'Software Architecture',
    data: {
      question: 'What is the main benefit of microservices architecture?',
      options: [
        'Simpler deployment',
        'Better scalability and maintainability',
        'Reduced network complexity',
        'Lower development costs'
      ],
      correctAnswer: 1,
      explanation: 'Microservices enable independent scaling and development of different system components.'
    }
  },
  {
    id: '18',
    type: 'multi-select',
    title: 'Database Design',
    data: {
      question: 'Which are benefits of database normalization? (Select all that apply)',
      options: [
        'Reduces data redundancy',
        'Improves data integrity',
        'Increases query performance',
        'Simplifies data updates'
      ],
      correctAnswers: [0, 1, 3],
      explanation: 'Normalization optimizes data storage and maintains consistency.'
    }
  },
  {
    id: '19',
    type: 'fill-in-blank',
    title: 'Web Development',
    data: {
      text: 'The _______ protocol is used for secure web communication, while _______ handles the styling of web pages.',
      blanks: ['HTTPS', 'CSS'],
      explanation: 'Web technologies work together to create secure, styled applications.'
    }
  },
  {
    id: '20',
    type: 'mcq',
    title: 'Cloud Computing',
    data: {
      question: 'What does "Infrastructure as a Service" (IaaS) provide?',
      options: [
        'Complete applications',
        'Development platforms',
        'Virtual computing resources',
        'Software licenses'
      ],
      correctAnswer: 2,
      explanation: 'IaaS provides virtualized computing infrastructure over the internet.'
    }
  },
  {
    id: '21',
    type: 'true-false',
    title: 'Cybersecurity',
    data: {
      statements: [
        { statement: 'Two-factor authentication significantly improves security.', correct: true },
        { statement: 'Longer passwords are always more secure than shorter ones.', correct: false },
        { statement: 'Social engineering attacks target technical vulnerabilities.', correct: false }
      ],
      explanation: 'Security involves both technical measures and human awareness.'
    }
  },
  {
    id: '22',
    type: 'mcq',
    title: 'API Design',
    data: {
      question: 'What HTTP status code indicates a successful resource creation?',
      options: [
        '200 OK',
        '201 Created',
        '204 No Content',
        '400 Bad Request'
      ],
      correctAnswer: 1,
      explanation: 'HTTP status codes communicate the result of API operations.'
    }
  },
  {
    id: '23',
    type: 'multi-select',
    title: 'Version Control',
    data: {
      question: 'Which are Git best practices? (Select all that apply)',
      options: [
        'Write descriptive commit messages',
        'Commit large changes all at once',
        'Use branching for features',
        'Never rewrite commit history'
      ],
      correctAnswers: [0, 2],
      explanation: 'Good Git practices improve collaboration and code history.'
    }
  },
  {
    id: '24',
    type: 'fill-in-blank',
    title: 'Testing',
    data: {
      text: '_______ testing verifies individual components work correctly, while _______ testing ensures the entire system functions as expected.',
      blanks: ['Unit', 'integration'],
      explanation: 'Different testing levels catch different types of bugs.'
    }
  },
  {
    id: '25',
    type: 'mcq',
    title: 'Performance Optimization',
    data: {
      question: 'What is the primary goal of code profiling?',
      options: [
        'Find syntax errors',
        'Identify performance bottlenecks',
        'Check code style',
        'Generate documentation'
      ],
      correctAnswer: 1,
      explanation: 'Profiling helps identify where applications spend the most time and resources.'
    }
  }
];

interface RetentionExerciseProps {
  onExit: () => void;
  onComplete?: () => void;
}

export function RetentionExercise({ onExit, onComplete }: RetentionExerciseProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(10); // Resume at question 11 (index 10) for demo
  const [answers, setAnswers] = useState<Record<string, any>>({
    // Simulate 11 answered questions for 45% progress
    '1': ['product roadmap', 'product'],
    '2': ['spacing', 'distributed', 'spaced repetition'],
    '3': ['7±2', 'impaired', 'deteriorates'],
    '4': 1,
    '5': [1, 2, 4],
    '6': { statements: [false, false, true, false] },
    '7': { matches: { 'item1': 'sensory', 'item2': 'working' } },
    '8': 0,
    '9': { cells: { 'Testing-Effectiveness': 'High' } },
    '10': { answer: 1, confidence: 'high' },
    '11': { pairs: [{ term: 'Wireframe', definition: 'Low-fidelity structural blueprint of a page layout' }] }
  });
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showQuestionNav, setShowQuestionNav] = useState(false);
  const [showNavigationGrid, setShowNavigationGrid] = useState(false);


  // Keyboard shortcuts for navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't handle shortcuts when typing in inputs
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleNext();
          break;
        case 'g':
          if (event.metaKey || event.ctrlKey) {
            event.preventDefault();
            setShowNavigationGrid(true);
          }
          break;
        case 'j':
          event.preventDefault();
          setShowQuestionNav(true);
          break;
        case 'Escape':
          event.preventDefault();
          if (showNavigationGrid) {
            setShowNavigationGrid(false);
          } else if (showQuestionNav) {
            setShowQuestionNav(false);
          } else {
            setShowExitDialog(true);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestionIndex, showNavigationGrid, showQuestionNav]);

  const currentQuestion = sampleQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / sampleQuestions.length) * 100;

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
      if (onComplete) onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsCompleted(false);
  };

  const jumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setShowQuestionNav(false);
  };

  const getQuestionStatus = (questionId: string) => {
    return answers[questionId] !== undefined;
  };

  const answeredCount = Object.keys(answers).length;

  const handleShowGrid = () => {
    setShowNavigationGrid(true);
    setShowQuestionNav(false);
  };

  const renderQuestion = () => {
    const commonProps = {
      questionData: currentQuestion.data,
      onAnswer: (answer: any) => handleAnswer(currentQuestion.id, answer),
      currentAnswer: answers[currentQuestion.id]
    };

    switch (currentQuestion.type) {
      case 'fill-in-blank':
        return <FillInBlankQuestion {...commonProps} />;
      case 'cloze-word-bank':
        return <ClozeWordBankQuestion {...commonProps} />;
      case 'dropdown-cloze':
        return <DropdownClozeQuestion {...commonProps} />;
      case 'mcq':
        return <MCQQuestion {...commonProps} />;
      case 'multi-select':
        return <MultiSelectQuestion {...commonProps} />;
      case 'true-false':
        return <TrueFalseQuestion {...commonProps} />;
      case 'extended-matching':
        return <ExtendedMatchingQuestion {...commonProps} />;
      case 'assertion-reason':
        return <AssertionReasonQuestion {...commonProps} />;
      case 'matrix-grid':
        return <MatrixGridQuestion {...commonProps} />;
      case 'confidence-weighted-mcq':
        return <ConfidenceWeightedMCQQuestion {...commonProps} />;
      case 'term-definition-matching':
        return <TermDefinitionMatchingQuestion {...commonProps} />;
      case 'example-concept-matching':
        return <ExampleConceptMatchingQuestion {...commonProps} />;
      case 'category-bucketing':
        return <CategoryBucketingQuestion {...commonProps} />;
      case 'venn-classification':
        return <VennClassificationQuestion {...commonProps} />;
      case 'odd-one-out':
        return <OddOneOutQuestion {...commonProps} />;
      case 'reordering-steps':
        return <ReorderingStepsQuestion {...commonProps} />;
      case 'timeline-placement':
        return <TimelinePlacementQuestion {...commonProps} />;
      case 'ranking':
        return <RankingQuestion {...commonProps} />;
      case 'cause-effect-chain':
        return <CauseEffectChainQuestion {...commonProps} />;
      case 'chart-reading':
        return <ChartReadingQuestion {...commonProps} />;
      case 'scenario-mcq':
        return <ScenarioMCQQuestion {...commonProps} />;
      case 'mini-simulation':
        return <MiniSimulationQuestion {...commonProps} />;
      case 'policy-application':
        return <PolicyApplicationQuestion {...commonProps} />;
      case 'tradeoff-slider':
        return <TradeoffSliderQuestion {...commonProps} />;
      case 'data-interpretation':
        return <DataInterpretationQuestion {...commonProps} />;
      default:
        return <div>Question type not implemented yet</div>;
    }
  };

  // Show question navigation grid
  if (showNavigationGrid) {
    return (
      <QuestionNavigationGrid
        questions={sampleQuestions}
        currentQuestionIndex={currentQuestionIndex}
        answers={answers}
        onSelectQuestion={jumpToQuestion}
        onClose={() => setShowNavigationGrid(false)}
      />
    );
  }

  if (isCompleted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onExit} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
        </div>

        <Card className="text-center">
          <CardContent className="p-12">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl mb-4">Exercise Completed!</h2>
            <p className="text-gray-600 mb-6">
              Great job! You've successfully completed your retention practice session.
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={handleRestart} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Restart Exercise
              </Button>
              <Button onClick={onExit}>
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main quiz interface
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={() => setShowExitDialog(true)} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Exit Quiz</span>
        </Button>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="px-3 py-1">
            {answeredCount} of {sampleQuestions.length} answered
          </Badge>
          <Popover open={showQuestionNav} onOpenChange={setShowQuestionNav}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <List className="h-4 w-4" />
                <span>Navigation</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Question Navigation</h4>
                <Button onClick={handleShowGrid} size="sm" variant="outline">
                  Grid View
                </Button>
              </div>
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {sampleQuestions.map((question, index) => (
                    <div
                      key={question.id}
                      onClick={() => jumpToQuestion(index)}
                      className={`
                        p-2 rounded cursor-pointer text-sm transition-colors
                        ${index === currentQuestionIndex 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                          : 'hover:bg-gray-100'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span>Question {index + 1}</span>
                        {getQuestionStatus(question.id) && (
                          <Check className="h-3 w-3 text-green-600" />
                        )}
                      </div>
                      <div className="text-xs text-gray-500 truncate mt-1">
                        {question.title}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
      </div>



      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Content */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Question {currentQuestionIndex + 1} of {sampleQuestions.length}
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {currentQuestion.type.replace('-', ' ')}
            </Badge>
          </div>
          <p className="text-gray-600">{currentQuestion.title}</p>
        </CardHeader>
        <CardContent>
          {renderQuestion()}
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {currentQuestionIndex + 1} / {sampleQuestions.length}
          </span>
          {Array.from({ length: Math.min(5, sampleQuestions.length) }).map((_, i) => {
            const questionIndex = Math.floor(currentQuestionIndex / 5) * 5 + i;
            if (questionIndex >= sampleQuestions.length) return null;
            
            return (
              <Circle
                key={questionIndex}
                className={`h-2 w-2 ${
                  questionIndex === currentQuestionIndex
                    ? 'fill-blue-600 text-blue-600'
                    : answers[sampleQuestions[questionIndex].id]
                    ? 'fill-green-600 text-green-600'
                    : 'fill-gray-300 text-gray-300'
                }`}
              />
            );
          })}
        </div>

        <Button
          onClick={handleNext}
          className="flex items-center space-x-2"
        >
          <span>{currentQuestionIndex === sampleQuestions.length - 1 ? 'Complete' : 'Next'}</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to exit? Your progress will be saved and you can return to continue later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Quiz</AlertDialogCancel>
            <AlertDialogAction onClick={onExit}>
              Exit Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}