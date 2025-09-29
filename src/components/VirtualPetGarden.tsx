import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AnimatedPlant } from './AnimatedPlant';
import { Heart, Zap, Clock, Target, Eye, Leaf, Star, AlertTriangle } from 'lucide-react';

interface PlantData {
  id: string;
  topic: string;
  conceptsMastered: number;
  totalConcepts: number;
  contentUploaded: number;
  lastVisited: Date;
  plantType: 'plant'; // Always plant, different states
  mood: 'thriving' | 'healthy' | 'wilting' | 'dying' | 'needs-attention';
  isQuizRelevant: boolean;
}

interface VirtualPlantGardenProps {
  currentQuizTopics?: string[];
}

// Mock data for the virtual plant collection
const mockPlantData: PlantData[] = [
  {
    id: '1',
    topic: 'Machine Learning',
    conceptsMastered: 12,
    totalConcepts: 15,
    contentUploaded: 23,
    lastVisited: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    plantType: 'plant',
    mood: 'thriving',
    isQuizRelevant: true
  },
  {
    id: '2',
    topic: 'React Development',
    conceptsMastered: 8,
    totalConcepts: 12,
    contentUploaded: 15,
    lastVisited: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    plantType: 'plant',
    mood: 'healthy',
    isQuizRelevant: true
  },
  {
    id: '3',
    topic: 'Data Structures',
    conceptsMastered: 5,
    totalConcepts: 10,
    contentUploaded: 8,
    lastVisited: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    plantType: 'plant',
    mood: 'healthy',
    isQuizRelevant: true
  },
  {
    id: '4',
    topic: 'Python Programming',
    conceptsMastered: 3,
    totalConcepts: 8,
    contentUploaded: 5,
    lastVisited: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    plantType: 'plant',
    mood: 'wilting',
    isQuizRelevant: false
  },
  {
    id: '5',
    topic: 'Database Design',
    conceptsMastered: 1,
    totalConcepts: 6,
    contentUploaded: 2,
    lastVisited: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    plantType: 'plant',
    mood: 'wilting',
    isQuizRelevant: false
  },
  {
    id: '6',
    topic: 'Web Security',
    conceptsMastered: 0,
    totalConcepts: 4,
    contentUploaded: 1,
    lastVisited: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 3 weeks ago
    plantType: 'plant',
    mood: 'dying',
    isQuizRelevant: false
  }
];

// Individual Plant Card Component
function PlantCard({ plant }: { plant: PlantData }) {
  const [isHovered, setIsHovered] = useState(false);
  const progress = plant.totalConcepts > 0 ? (plant.conceptsMastered / plant.totalConcepts) : 0;

  const getPlantSize = () => {
    // All plants same size for visual consistency - adjusted size
    const baseSize = 70; // Base size for consistency
    return baseSize * 2.19; // Increased from 1.75 to 2.19 for another 25% larger (final size ~153px)
  };

  const getMoodColors = () => {
    switch (plant.mood) {
      case 'thriving': 
        return { 
          primary: '#22c55e', 
          secondary: '#15803d',
          accent: '#16a34a',
          bg: '#dcfce7'
        };
      case 'healthy': 
        return { 
          primary: '#3b82f6', 
          secondary: '#2563eb',
          accent: '#60a5fa',
          bg: '#dbeafe'
        };
      case 'wilting': 
        return { 
          primary: '#f59e0b', 
          secondary: '#d97706',
          accent: '#fbbf24',
          bg: '#fef3c7'
        };
      case 'dying': 
        return { 
          primary: '#ef4444', 
          secondary: '#dc2626',
          accent: '#f87171',
          bg: '#fee2e2'
        };
      case 'needs-attention':
        return { 
          primary: '#8b5cf6', 
          secondary: '#7c3aed',
          accent: '#a78bfa',
          bg: '#f3f4f6'
        };
      default: 
        return { 
          primary: '#3b82f6', 
          secondary: '#2563eb',
          accent: '#60a5fa',
          bg: '#dbeafe'
        };
    }
  };

  const getMoodIcon = () => {
    switch (plant.mood) {
      case 'thriving': return <Zap className="w-3 h-3" />;
      case 'healthy': return <Heart className="w-3 h-3" />;
      case 'wilting': return <Clock className="w-3 h-3" />;
      case 'dying': return <AlertTriangle className="w-3 h-3" />;
      case 'needs-attention': return <Star className="w-3 h-3" />;
      default: return <Heart className="w-3 h-3" />;
    }
  };

  const getDaysSinceLastVisit = () => {
    const diffTime = Math.abs(new Date().getTime() - plant.lastVisited.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const renderPlant = () => {
    const size = getPlantSize();
    const colors = getMoodColors();
    const isHealthy = plant.mood === 'thriving' || plant.mood === 'healthy';
    
    return (
      <motion.div 
        className="relative flex flex-col items-center"
        animate={{ 
          scale: isHovered ? 1.05 : 1,
          y: isHovered ? -2 : 0 
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Our Amazing Animated Plant! */}
        <AnimatedPlant 
          mood={plant.mood} 
          size={size}
          isHovered={isHovered}
        />
        
        {/* Mood indicator */}
        <motion.div
          className="absolute -top-1 -right-1 rounded-full p-1.5 border-2 border-white shadow-sm"
          style={{ backgroundColor: colors.primary, color: 'white' }}
          animate={{ 
            scale: plant.mood === 'thriving' ? [1, 1.2, 1] : plant.mood === 'dying' ? [1, 0.8, 1] : 1,
            rotate: plant.mood === 'healthy' ? [0, 360] : 0
          }}
          transition={{ 
            scale: { duration: 1.5, repeat: (plant.mood === 'thriving' || plant.mood === 'dying') ? Infinity : 0 },
            rotate: { duration: 4, repeat: plant.mood === 'healthy' ? Infinity : 0 }
          }}
        >
          {getMoodIcon()}
        </motion.div>

        {/* Growth sparkles for healthy plants */}
        {(isHealthy || plant.mood === 'needs-attention') && (
          <div className="absolute -top-2 -left-2">
            {Array.from({ length: plant.mood === 'thriving' ? 5 : 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: colors.accent }}
                animate={{
                  y: [-25, -45],
                  x: [0, Math.random() * 25 - 12.5],
                  opacity: [0.9, 0],
                  scale: [0.4, 1.2, 0]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}

        {/* Special effects for different moods */}
        {plant.mood === 'wilting' && (
          <div className="absolute -bottom-1">
            <motion.div
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: colors.primary }}
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [0.6, 1.4, 0.6]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        )}

        {plant.mood === 'dying' && (
          <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-red-300"
                style={{
                  top: `${15 + i * 25}%`,
                  left: `${25 + i * 15}%`
                }}
                animate={{
                  opacity: [0.2, 0.6, 0.2],
                  y: [-3, 3, -3],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )}

        {/* Special sparkle effects for needs-attention plants */}
        {plant.mood === 'needs-attention' && (
          <div className="absolute -top-1 -left-1">
            {Array.from({ length: 2 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-purple-400"
                animate={{
                  y: [-15, -25],
                  x: [0, Math.random() * 15 - 7.5],
                  opacity: [0.8, 0],
                  scale: [0.3, 0.8, 0]
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  const getMoodText = () => {
    switch (plant.mood) {
      case 'thriving': return 'Growing beautifully!';
      case 'healthy': return 'Healthy & strong';
      case 'wilting': return 'Needs more care...';
      case 'dying': return 'Requires attention!';
      case 'needs-attention': return 'Just sprouting!';
      default: return 'Doing okay';
    }
  };

  return (
    <motion.div
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 h-full bg-white border border-slate-200/60 hover:shadow-lg transition-all duration-300">
        {/* Plant Display */}
        <div className="flex flex-col items-center mb-4">
          {renderPlant()}
        </div>

        {/* Plant Info */}
        <div className="text-center space-y-2">
          <h4 style={{ color: '#232323' }} className="font-medium line-clamp-1">
            {plant.topic}
          </h4>
          
          {/* Mood indicator */}
          <div className="flex items-center justify-center space-x-2">
            <Badge 
              variant="secondary" 
              className="text-xs"
              style={{ 
                backgroundColor: getMoodColors().bg,
                color: getMoodColors().primary,
                borderColor: getMoodColors().primary
              }}
            >
              {getMoodText()}
            </Badge>
          </div>

          {/* Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs" style={{ color: '#6B7280' }}>
              <span>Progress</span>
              <span>{Math.round(progress * 100)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <motion.div 
                className="h-1.5 rounded-full transition-all duration-500"
                style={{ 
                  width: `${progress * 100}%`,
                  backgroundColor: getMoodColors().primary
                }}
              />
            </div>
            <div className="text-xs" style={{ color: '#8E8E93' }}>
              {plant.conceptsMastered} of {plant.totalConcepts} concepts
            </div>
          </div>

          {/* Last visit */}
          <div className="text-xs" style={{ color: '#8E8E93' }}>
            Last visit: {getDaysSinceLastVisit()} days ago
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function VirtualPlantGarden({ currentQuizTopics = [] }: VirtualPlantGardenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visiblePlants, setVisiblePlants] = useState(6);

  // Auto-scroll through plants
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(1, mockPlantData.length - visiblePlants + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [visiblePlants]);

  // Responsive visible plants count
  useEffect(() => {
    const updateVisiblePlants = () => {
      if (window.innerWidth >= 1280) setVisiblePlants(6); // xl
      else if (window.innerWidth >= 1024) setVisiblePlants(4); // lg
      else if (window.innerWidth >= 768) setVisiblePlants(3); // md
      else setVisiblePlants(2); // sm
    };

    updateVisiblePlants();
    window.addEventListener('resize', updateVisiblePlants);
    return () => window.removeEventListener('resize', updateVisiblePlants);
  }, []);

  const displayedPlants = mockPlantData.slice(currentIndex, currentIndex + visiblePlants);
  const healthyPlantsCount = mockPlantData.filter(plant => plant.mood === 'thriving' || plant.mood === 'healthy').length;
  const needsAttentionCount = mockPlantData.filter(plant => plant.mood === 'wilting' || plant.mood === 'dying' || plant.mood === 'needs-attention').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#FAF5D7' }}
            >
              <Leaf className="w-6 h-6" style={{ color: '#2852E9' }} />
            </div>
            <div>
              <h2 style={{ color: '#232323' }}>Virtual Plant Garden</h2>
              <p style={{ color: '#6B7280' }} className="text-sm">
                Your learning topics growing with care
              </p>
            </div>
          </div>
          
          {/* Quick stats */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" style={{ color: '#22c55e' }} />
              <span style={{ color: '#232323' }}>{healthyPlantsCount} healthy plants</span>
            </div>
            {needsAttentionCount > 0 && (
              <div className="flex items-center space-x-1">
                <AlertTriangle className="w-4 h-4" style={{ color: '#ef4444' }} />
                <span style={{ color: '#232323' }}>{needsAttentionCount} need care</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Plant Grid */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
          >
            {displayedPlants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation indicators */}
        {mockPlantData.length > visiblePlants && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: mockPlantData.length - visiblePlants + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'w-8' : ''
                }`}
                style={{ 
                  backgroundColor: index === currentIndex ? '#2852E9' : '#E5E7EB'
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Care tips */}
      <div 
        className="rounded-xl p-4"
        style={{ backgroundColor: '#FAF5D7' }}
      >
        <div className="flex items-center space-x-3 text-sm">
          <Heart className="w-5 h-5" style={{ color: '#2852E9' }} />
          <div>
            <span style={{ color: '#232323' }} className="font-medium">Plant Care Tip: </span>
            <span style={{ color: '#6B7280' }}>
              Regular practice sessions keep your learning plants healthy and thriving. Neglected topics will wilt and eventually need urgent care.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}