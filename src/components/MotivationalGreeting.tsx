import React, { useState, useEffect } from 'react';

const motivationalQuotes = [
  "Knowledge is power. Information is liberating. Education is the premise of progress.",
  "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
  "Learning never exhausts the mind. Every expert was once a beginner.",
  "The beautiful thing about learning is that nobody can take it away from you.",
  "Live as if you were to die tomorrow. Learn as if you were to live forever.",
  "An investment in knowledge pays the best interest.",
  "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
  "Education is the most powerful weapon which you can use to change the world.",
  "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice.",
  "The expert in anything was once a beginner who refused to give up."
];

interface MotivationalGreetingProps {
  userName?: string;
}

export function MotivationalGreeting({ userName = "Alex" }: MotivationalGreetingProps) {
  const [currentQuote, setCurrentQuote] = useState('');

  useEffect(() => {
    // Generate a quote based on the current session
    const sessionId = Date.now().toString().slice(-6);
    const quoteIndex = parseInt(sessionId) % motivationalQuotes.length;
    setCurrentQuote(motivationalQuotes[quoteIndex]);
  }, []);

  return (
    <div className="py-4 sm:py-6">      
      <div className="max-w-4xl space-y-3 sm:space-y-4">
        <h1 style={{ 
          color: '#2050B3',
          fontFamily: '"Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
          fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', // Responsive: 28px to 36px
          fontWeight: '800',
          lineHeight: '1.1',
          letterSpacing: '-0.025em'
        }}>Hello, {userName}! <span style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>👋</span></h1>
        <p style={{ 
          color: '#8E8E93', 
          fontSize: '0.875rem', 
          fontStyle: 'italic',
          fontFamily: '"Rubik", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
          fontWeight: '300',
          lineHeight: '1.6',
          letterSpacing: '0.01em'
        }} className="leading-relaxed">
          "{currentQuote}"
        </p>
      </div>
    </div>
  );
}