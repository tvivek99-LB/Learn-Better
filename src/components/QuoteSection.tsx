import React from 'react';

export function QuoteSection() {
  const quotes = [
    {
      text: "The beautiful thing about learning is that no one can take it away from you.",
      author: "B.B. King"
    },
    {
      text: "Learning never exhausts the mind. The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
      author: "Leonardo da Vinci"
    },
    {
      text: "The only thing you absolutely have to know is the location of the library. Everything else you can learn when you need it.",
      author: "Albert Einstein"
    },
    {
      text: "Spaced repetition is the key to moving information from short-term to long-term memory. What we review consistently, we remember permanently.",
      author: "Hermann Ebbinghaus"
    },
    {
      text: "The art of remembering is the art of thinking. When we wish to fix a new thing in either our own mind or a pupil's, our conscious effort should not be so much to impress and retain it as to connect it with something else already there.",
      author: "William James"
    }
  ];

  // Select a random quote for variety
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="bg-green-100 rounded-3xl p-12 relative overflow-hidden">
      {/* Elegant floating elements */}
      <div className="absolute top-8 right-12 w-28 h-28 bg-gradient-to-br from-emerald-200/40 to-green-200/40 rounded-full opacity-50 blur-xl"></div>
      <div className="absolute bottom-16 left-12 w-16 h-16 bg-gradient-to-tr from-teal-200/30 to-cyan-200/30 rounded-full opacity-40 blur-lg"></div>
      <div className="absolute top-20 right-28 w-1 h-1 bg-green-500/50 rounded-full"></div>
      <div className="absolute top-28 right-20 w-0.5 h-0.5 bg-green-400/40 rounded-full"></div>
      <div className="absolute bottom-28 left-20 w-1.5 h-0.5 bg-teal-400/30 rounded-full"></div>
      
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <blockquote className="text-foreground text-2xl leading-relaxed mb-8 max-w-4xl mx-auto">
          "{randomQuote.text}"
        </blockquote>
        <cite className="text-muted-foreground text-lg">
          — {randomQuote.author}
        </cite>
      </div>
    </div>
  );
}