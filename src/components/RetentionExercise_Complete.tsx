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

      {/* Welcome Message - Show only on first question */}
      {currentQuestionIndex === 0 && (
        <QuizWelcomeMessage totalQuestions={sampleQuestions.length} />
      )}

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