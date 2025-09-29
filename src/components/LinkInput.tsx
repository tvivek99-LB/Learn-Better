import React, { useState } from 'react';
import { Link, Check, AlertCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';

interface LinkInputProps {
  onLinkAdd: (url: string) => void;
}

export function LinkInput({ onLinkAdd }: LinkInputProps) {
  const [url, setUrl] = useState('');
  const [addedLinks, setAddedLinks] = useState<string[]>([]);
  const [error, setError] = useState('');

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }
    
    if (!isValidUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    setAddedLinks(prev => [...prev, url]);
    onLinkAdd(url);
    setUrl('');
    setError('');
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    if (isValidUrl(pastedText)) {
      setError('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url-input">Paste or enter a URL</Label>
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="flex-1 relative">
            <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="url-input"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError('');
              }}
              onPaste={handlePaste}
              className="pl-10"
            />
          </div>
          <Button type="submit">Add Link</Button>
        </form>
        {error && (
          <div className="flex items-center space-x-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      <div className="text-muted-foreground">
        <p>Supported link types:</p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>Web pages and articles</li>
          <li>Images and media files</li>
          <li>Documents and PDFs</li>
          <li>Video and audio content</li>
        </ul>
      </div>

      {addedLinks.length > 0 && (
        <div className="space-y-2">
          <h4>Added Links</h4>
          {addedLinks.map((link, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <Check className="h-5 w-5 text-green-600" />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{link}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}