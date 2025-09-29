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
      <DialogContent className="max-w-md mx-auto bg-white border border-gray-200 shadow-2xl">
        
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
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-start space-x-3 mb-4">
              <Sparkles className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#2852E9' }} />
              <div className="flex-1">
                <h3 className="mb-2" style={{ color: '#2852E9' }}>Import Summary</h3>
                <div className="flex items-baseline space-x-2">
                  <div className="text-3xl leading-none" style={{ color: '#2852E9' }}>{importedContentCount}</div>
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
          <div className="rounded-xl p-4 border border-gray-200" style={{ backgroundColor: '#FAF5D7' }}>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#2852E9' }}>
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="mb-1" style={{ color: '#2852E9' }}>Smart Retention Planning</h4>
                <p className="text-sm text-gray-700">
                  Our AI will analyze your content and create personalized spaced repetition exercises to maximize your learning retention.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleNavigateToLibrary}
              className="flex-1 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-200"
              style={{ backgroundColor: '#2852E9' }}
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
          <div className="rounded-xl p-3 border" style={{ backgroundColor: '#FFFBE6', borderColor: '#F3E7B9' }}>
            <p className="text-xs" style={{ color: '#B45309' }}>
              <strong>Pro tip:</strong> Visit your Library regularly to review concepts and track your learning progress across all imported materials.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}