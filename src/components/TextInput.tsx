import React, { useState } from 'react';
import { Type, Copy, Check } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';

interface TextInputProps {
  onTextAdd: (text: string) => void;
}

export function TextInput({ onTextAdd }: TextInputProps) {
  const [text, setText] = useState('');
  const [savedTexts, setSavedTexts] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    setSavedTexts(prev => [...prev, text]);
    onTextAdd(text);
    setText('');
  };

  const copyToClipboard = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
  };

  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  const charCount = text.length;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="text-input">Paste or type your text</Label>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Textarea
              id="text-input"
              placeholder="Paste or type your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[120px] resize-y"
            />
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background px-2 py-1 rounded">
              {charCount} chars, {wordCount} words
            </div>
          </div>
          <Button type="submit" disabled={!text.trim()}>
            <Type className="h-4 w-4 mr-2" />
            Save Text
          </Button>
        </form>
      </div>

      <div className="text-muted-foreground">
        <p>Text formatting options:</p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>Plain text and rich text content</li>
          <li>Copy and paste from documents</li>
          <li>Automatic word and character counting</li>
          <li>Support for special characters and symbols</li>
        </ul>
      </div>

      {savedTexts.length > 0 && (
        <div className="space-y-2">
          <h4>Saved Text Entries</h4>
          {savedTexts.map((savedText, index) => (
            <div key={index} className="p-3 bg-muted rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm line-clamp-3 mb-2">{savedText}</p>
                  <div className="text-xs text-muted-foreground">
                    {savedText.split(/\s+/).filter(word => word.length > 0).length} words, {savedText.length} characters
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(savedText)}
                  className="ml-2 shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}