import React, { useState } from 'react';
import { TrendingUp, Clock, User, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Article {
  id: string;
  title: string;
  author: string;
  topic: string;
  readTime: string;
  image: string;
  trending: boolean;
  excerpt: string;
}

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'The Art of Product Roadmapping: A Strategic Guide',
    author: 'Sarah Chen',
    topic: 'Product Management',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1604246536841-800ce05d7665?w=400',
    trending: true,
    excerpt: 'Learn how to create product roadmaps that align stakeholders and drive meaningful outcomes.'
  },
  {
    id: '2',
    title: 'Leading Through Uncertainty: Lessons from Tech Leaders',
    author: 'Marcus Johnson',
    topic: 'Leadership',
    readTime: '12 min read',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400',
    trending: true,
    excerpt: 'How successful leaders navigate ambiguity and make decisions in rapidly changing environments.'
  },
  {
    id: '3',
    title: 'Data-Driven Decision Making in Modern Organizations',
    author: 'Emily Rodriguez',
    topic: 'Data Science',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    trending: false,
    excerpt: 'Practical frameworks for incorporating data insights into your decision-making process.'
  },
  {
    id: '4',
    title: 'Building High-Performance Teams in Remote Environments',
    author: 'David Kim',
    topic: 'Management',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
    trending: true,
    excerpt: 'Strategies for creating cohesive, productive teams across distributed workforces.'
  }
];

export function TrendingArticles() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Show only 2 articles at a time
  const displayedArticles = mockArticles.slice(currentSlide * 2, currentSlide * 2 + 2);
  const totalSlides = Math.ceil(mockArticles.length / 2);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="bg-white rounded-xl p-8 lg:p-10 border border-slate-200/60">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 style={{ color: '#232323' }}>What Others Are Reading</h2>
            <p style={{ color: '#8E8E93' }} className="text-lg">
              Discover trending articles from our learning community
            </p>
          </div>
          <Button 
            size="lg" 
            className="rounded-xl px-6 py-3 text-white"
            style={{ backgroundColor: '#2852E9' }}
          >
            View All Articles
          </Button>
        </div>

        {/* Carousel with navigation arrows positioned next to cards */}
        <div className="relative">
          {/* Navigation arrows positioned next to the cards */}
          <div className="flex items-center space-x-6">
            <Button 
              variant="outline"
              size="sm"
              onClick={prevSlide}
              disabled={totalSlides <= 1}
              className="h-12 w-12 rounded-full p-0 border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              style={{ backgroundColor: totalSlides <= 1 ? undefined : '#F3E7B9', borderColor: totalSlides <= 1 ? undefined : '#FAF5D7' }}
            >
              <ChevronLeft className="h-5 w-5" style={{ color: '#232323' }} />
            </Button>
            
            {/* Cards container */}
            <div className="flex-1 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {displayedArticles.map((article) => (
                  <Card 
                    key={article.id}
                    className="group transition-all duration-300 cursor-pointer bg-card border border-border rounded-2xl hover:shadow-lg hover:scale-[1.01] overflow-hidden h-full flex flex-col"
                  >
                    <div className="aspect-video overflow-hidden rounded-t-2xl relative">
                      <ImageWithFallback
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    <CardHeader className="pb-4 flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div 
                          className="text-xs rounded-lg px-3 py-1"
                          style={{ backgroundColor: '#FAF5D7', color: '#232323' }}
                        >
                          {article.topic}
                        </div>
                        {article.trending && (
                          <div className="text-xs flex items-center space-x-1 rounded-lg px-3 py-1" style={{ backgroundColor: '#F3E7B9', color: '#2852E9' }}>
                            <TrendingUp className="h-3 w-3" />
                            <span>Trending</span>
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-xl line-clamp-2 transition-colors leading-tight" style={{ color: '#232323' }}>
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="pt-0 mt-auto">
                      <p className="text-base line-clamp-2 mb-6 leading-relaxed" style={{ color: '#8E8E93' }}>
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm" style={{ color: '#8E8E93' }}>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>{article.author}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-10 w-10 rounded-full p-0"
                          style={{ backgroundColor: '#F3E7B9' }}
                        >
                          <ExternalLink className="h-4 w-4" style={{ color: '#2852E9' }} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <Button 
              variant="outline"
              size="sm"
              onClick={nextSlide}
              disabled={totalSlides <= 1}
              className="h-12 w-12 rounded-full p-0 border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              style={{ backgroundColor: totalSlides <= 1 ? undefined : '#F3E7B9', borderColor: totalSlides <= 1 ? undefined : '#FAF5D7' }}
            >
              <ChevronRight className="h-5 w-5" style={{ color: '#232323' }} />
            </Button>
          </div>

          {/* Dots indicator */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: index === currentSlide ? '#2852E9' : '#E2E8F0',
                    transform: index === currentSlide ? 'scale(1.25)' : 'scale(1)'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}