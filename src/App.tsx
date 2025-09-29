import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MotivationalGreeting } from './components/MotivationalGreeting';
import { CompactRetentionGraph } from './components/CompactRetentionGraph';
import { TodaysPracticeSession } from './components/TodaysPracticeSession';

import { TrendingArticles } from './components/TrendingArticles';
import { Inventory } from './components/Inventory';
import { ConceptVault } from './components/ConceptVault';
import { QuizPage } from './components/QuizPage';

import { StatsPage } from './components/StatsPage';
import { ContentImportModal } from './components/ContentImportModal';
import { VirtualPlantGarden } from './components/VirtualPetGarden';
import { TopicDataProvider, useTopicData } from './components/TopicDataManager';
import { ContentDataProvider } from './components/ContentDataManager';
import { Button } from './components/ui/button';


type View = 'home' | 'my-content' | 'concept-vault' | 'retention' | 'stats';

function AppContent() {
  const { topics, getTopicRetentionData } = useTopicData();
  const [currentView, setCurrentView] = useState<View>('home');
  const [hasCompletedTodaysQuiz, setHasCompletedTodaysQuiz] = useState(false);
  const [hasQuestions, setHasQuestions] = useState(true); // Users have questions available
  const [quizProgress, setQuizProgress] = useState(45); // Progress percentage (0-100), set to 45% for demo
  
  // Content import modal state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importedContentCount, setImportedContentCount] = useState(7); // Demo: 7 articles imported
  const [dontRemindImports, setDontRemindImports] = useState(false);
  


  // Show import modal when user lands on homepage
  useEffect(() => {
    // Simulate content being imported - show modal after a brief delay
    const timer = setTimeout(() => {
      if (currentView === 'home' && importedContentCount > 0 && !dontRemindImports) {
        setShowImportModal(true);
      }
    }, 1000); // 1 second delay for better UX

    return () => clearTimeout(timer);
  }, [currentView, importedContentCount, dontRemindImports]);

  const navigateToLibrary = () => {
    // Library is now a dropdown, default to My Content
    setCurrentView('my-content');
    setShowImportModal(false); // Close modal when navigating
  };

  const navigateToMyContent = () => {
    setCurrentView('my-content');
    setShowImportModal(false); // Close modal when navigating
  };

  const navigateToConceptVault = () => {
    setCurrentView('concept-vault');
    setShowImportModal(false); // Close modal when navigating
  };

  const navigateToHome = () => {
    setCurrentView('home');
  };

  const startRetentionExercise = () => {
    setCurrentView('retention');
  };



  const navigateToStats = () => {
    setCurrentView('stats');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when Cmd/Ctrl is pressed
      if (!(event.metaKey || event.ctrlKey)) return;
      
      switch (event.key.toLowerCase()) {
        case 'h':
          event.preventDefault();
          navigateToHome();
          break;
        case 'l':
          event.preventDefault();
          if (event.shiftKey) {
            // Cmd/Ctrl + Shift + L for My Content (legacy)
            navigateToMyContent();
          } else {
            // Cmd/Ctrl + L for My Content (Library defaults to My Content)
            navigateToMyContent();
          }
          break;
        case 'r':
          event.preventDefault();
          if (event.shiftKey) {
            // Cmd/Ctrl + Shift + R for Concept Vault
            navigateToConceptVault();
          } else {
            // Cmd/Ctrl + R for Retention Exercise
            startRetentionExercise();
          }
          break;
        case 'p':
          event.preventDefault();
          console.log('Reading Progress shortcut triggered');
          break;

        case 's':
          event.preventDefault();
          navigateToStats();
          break;

      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Render quiz page as a completely separate view
  if (currentView === 'retention') {
    return (
      <>
        <QuizPage 
          onExit={() => {
            // When user exits quiz, save progress and go home
            setQuizProgress(Math.min(quizProgress + 10, 90)); // Simulate some progress
            navigateToHome();
          }} 
          onComplete={() => {
            setHasCompletedTodaysQuiz(true);
            setQuizProgress(0); // Reset progress when completed
            navigateToHome();
          }}
        />
      </>
    );
  }



  // Render stats page as a completely separate view
  if (currentView === 'stats') {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          currentView={currentView}
          onNavigateToHome={navigateToHome}
          onNavigateToLibrary={navigateToLibrary}
          onNavigateToMyContent={navigateToMyContent}
          onNavigateToConceptVault={navigateToConceptVault}
          onNavigateToStats={navigateToStats}
        />
        
        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <StatsPage onBack={navigateToHome} />
        </main>
      </div>
    );
  }

  // Render main application layout for home and library views
  return (
    <div className="min-h-screen bg-white">
      
      <Header 
        currentView={currentView}
        onNavigateToHome={navigateToHome}
        onNavigateToLibrary={navigateToLibrary}
        onNavigateToMyContent={navigateToMyContent}
        onNavigateToConceptVault={navigateToConceptVault}
        onNavigateToStats={navigateToStats}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-12 pb-2">
        {currentView === 'home' ? (
          <div className="space-y-8 sm:space-y-12 lg:space-y-16">
            {/* Motivational Greeting */}
            <MotivationalGreeting userName="Alex" />
            
            {/* Split Layout: Practice Session (Left) + Retention Overview (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 lg:items-stretch">
              {/* Left Three Quarters: Practice in Progress */}
              <div className="space-y-4 lg:col-span-3 flex flex-col">
                <div className="flex-1">
                  <TodaysPracticeSession 
                    onStartPractice={startRetentionExercise}
                    hasCompletedToday={hasCompletedTodaysQuiz}
                    hasQuestions={hasQuestions}
                    quizProgress={quizProgress}
                    onNavigateToLibrary={navigateToLibrary}
                    practiceTopics={topics.slice(0, 3).map(topic => topic.name)}
                  />
                </div>
              </div>
              
              {/* Right Quarter: Compact Retention Graph */}
              <div className="space-y-4 flex flex-col">
                <div className="flex-1">
                  <CompactRetentionGraph onTopicClick={navigateToConceptVault} />
                </div>
              </div>
            </div>
            
            {/* What Others are Reading */}
            <TrendingArticles />
            
            {/* Virtual Plant Garden - Growth metaphor for learning topics */}
            <VirtualPlantGarden 
              currentQuizTopics={topics.slice(0, 3).map(topic => topic.name)}
            />
          </div>
        ) : currentView === 'my-content' ? (
          <Inventory onBackToHome={navigateToHome} />
        ) : currentView === 'concept-vault' ? (
          <ConceptVault />
        ) : null}

        {/* Content Import Modal */}
        <ContentImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onNavigateToLibrary={navigateToLibrary}
          importedContentCount={importedContentCount}
          onDontRemindAgain={() => setDontRemindImports(true)}
        />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <TopicDataProvider>
      <ContentDataProvider>
        <AppContent />
      </ContentDataProvider>
    </TopicDataProvider>
  );
}