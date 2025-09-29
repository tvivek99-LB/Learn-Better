import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { CheckCircle, Brain, ArrowRight, Sparkles } from 'lucide-react';

interface ContentImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToLibrary: () => void;
  importedContentCount: number;
  onDontRemindAgain?: () => void;
}

export function ContentImportModal({ 
  isOpen, 
  onClose, 
  onNavigateToLibrary,
  importedContentCount,
  onDontRemindAgain 
}: ContentImportModalProps) {
  
  const [dontRemindAgain, setDontRemindAgain] = useState(false);
  
  const handleNavigateToLibrary = () => {
    if (dontRemindAgain && onDontRemindAgain) {
      onDontRemindAgain();
    }
    onNavigateToLibrary();
    onClose();
  };

  const handleClose = () => {
    if (dontRemindAgain && onDontRemindAgain) {
      onDontRemindAgain();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-blue-50 via-white to-purple-50 border border-blue-200/60 shadow-2xl">
        {/* Decorative shapes */}
        <div className="absolute top-4 right-4 w-6 h-6 bg-yellow-400 rounded-full opacity-80"></div>
        <div className="absolute bottom-4 left-4 w-4 h-4 bg-green-500 rounded-full opacity-70"></div>
        <div className="absolute top-8 left-6 w-3 h-3 bg-pink-500 rotate-45 opacity-75"></div>
        
        <DialogHeader className="text-center space-y-4 relative z-10">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          
          <DialogTitle className="text-xl text-gray-800">
            Content Successfully Imported! 🎉
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {importedContentCount} {importedContentCount === 1 ? 'article has' : 'articles have'} been successfully imported to your library and retention plan.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 relative z-10">
          {/* Import Summary */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-blue-200/60 shadow-sm">
            <div className="flex items-start space-x-3 mb-4">
              <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-blue-800 mb-2">Import Summary</h3>
                <div className="flex items-baseline space-x-2">
                  <div className="text-3xl text-blue-700 leading-none">{importedContentCount}</div>
                  <div className="text-gray-700">
                    {importedContentCount === 1 ? 'article has' : 'articles have'} been imported
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  All content will be added to your personalized Retention Plan
                </p>
              </div>
            </div>
          </div>

          {/* Retention Plan Info */}
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-4 border border-purple-200/60">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-purple-800 mb-1">Smart Retention Planning</h4>
                <p className="text-sm text-purple-700">
                  Our AI will analyze your content and create personalized spaced repetition exercises to maximize your learning retention.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleNavigateToLibrary}
              className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Brain className="w-4 h-4 mr-2" />
              Manage Retention Plan
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              Continue to Homepage
            </Button>
          </div>

          {/* Don't remind me again option */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <Checkbox 
                id="dont-remind"
                checked={dontRemindAgain}
                onCheckedChange={(checked) => setDontRemindAgain(checked as boolean)}
                className="border-gray-400"
              />
              <label 
                htmlFor="dont-remind" 
                className="text-sm text-gray-700 cursor-pointer select-none"
              >
                Don't remind me about content imports again
              </label>
            </div>
          </div>

          {/* Tip */}
          <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-200">
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">💡</span>
              </div>
              <p className="text-xs text-yellow-800">
                <strong>Pro tip:</strong> Visit your Library regularly to review concepts and track your learning progress across all imported materials.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}