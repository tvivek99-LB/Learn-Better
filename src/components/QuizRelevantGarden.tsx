import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sprout, Leaf, Droplets, Sun, Clock, Target, Eye } from 'lucide-react';

interface PlantData {
  id: string;
  topic: string;
  conceptsMastered: number;
  totalConcepts: number;
  contentUploaded: number;
  lastVisited: Date;
  plantType: 'seedling' | 'bush' | 'tree' | 'flower';
  health: 'thriving' | 'healthy' | 'wilting' | 'dying' | 'dead';
  isQuizRelevant: boolean;
}

interface QuizRelevantGardenProps {
  onViewFullGarden: () => void;
  currentQuizTopics?: string[];
}

// Mock data for the complete learning garden - all plants shown on home page
const mockPlantData: PlantData[] = [
  {
    id: '1',
    topic: 'Machine Learning',
    conceptsMastered: 8,
    totalConcepts: 12,
    contentUploaded: 15,
    lastVisited: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    plantType: 'tree',
    health: 'healthy',
    isQuizRelevant: true
  },
  {
    id: '2',
    topic: 'React Development',
    conceptsMastered: 12,
    totalConcepts: 15,
    contentUploaded: 23,
    lastVisited: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    plantType: 'tree',
    health: 'thriving',
    isQuizRelevant: true
  },
  {
    id: '3',
    topic: 'Data Structures',
    conceptsMastered: 4,
    totalConcepts: 10,
    contentUploaded: 7,
    lastVisited: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    plantType: 'bush',
    health: 'wilting',
    isQuizRelevant: true
  },
  {
    id: '4',
    topic: 'System Design',
    conceptsMastered: 2,
    totalConcepts: 8,
    contentUploaded: 3,
    lastVisited: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    plantType: 'seedling',
    health: 'healthy',
    isQuizRelevant: false
  },
  {
    id: '5',
    topic: 'UI/UX Design',
    conceptsMastered: 6,
    totalConcepts: 8,
    contentUploaded: 12,
    lastVisited: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    plantType: 'flower',
    health: 'thriving',
    isQuizRelevant: false
  },
  {
    id: '6',
    topic: 'Database Theory',
    conceptsMastered: 1,
    totalConcepts: 6,
    contentUploaded: 2,
    lastVisited: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    plantType: 'seedling',
    health: 'dying',
    isQuizRelevant: false
  }
];

const PlantComponent: React.FC<{ plant: PlantData; index: number }> = ({ plant, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getPlantHeight = () => {
    const progress = plant.conceptsMastered / plant.totalConcepts;
    switch (plant.plantType) {
      case 'seedling': return Math.max(60, progress * 100); // Doubled from 30, 50
      case 'bush': return Math.max(80, progress * 140); // Doubled from 40, 70
      case 'tree': return Math.max(100, progress * 180); // Doubled from 50, 90
      case 'flower': return Math.max(70, progress * 120); // Doubled from 35, 60
      default: return 80; // Doubled from 40
    }
  };

  const getHealthColors = () => {
    switch (plant.health) {
      case 'thriving': 
        return { 
          leaves: '#22c55e', 
          stem: '#15803d',
          accent: '#16a34a'
        };
      case 'healthy': 
        return { 
          leaves: '#16a34a', 
          stem: '#166534',
          accent: '#15803d'
        };
      case 'wilting': 
        return { 
          leaves: '#ca8a04', 
          stem: '#a16207',
          accent: '#eab308'
        };
      case 'dying': 
        return { 
          leaves: '#dc2626', 
          stem: '#991b1b',
          accent: '#b91c1c'
        };
      case 'dead': 
        return { 
          leaves: '#6b7280', 
          stem: '#4b5563',
          accent: '#9ca3af'
        };
      default: 
        return { 
          leaves: '#16a34a', 
          stem: '#166534',
          accent: '#15803d'
        };
    }
  };

  const getDaysSinceLastVisit = () => {
    const diffTime = Math.abs(new Date().getTime() - plant.lastVisited.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const renderPlant = () => {
    const height = getPlantHeight();
    const colors = getHealthColors();
    const isHealthy = plant.health === 'thriving' || plant.health === 'healthy';
    
    // Calculate number of leaf pairs based on plant type
    const leafPairs = plant.plantType === 'tree' ? 4 : plant.plantType === 'bush' ? 3 : 2;
    
    return (
      <motion.div 
        className="relative flex flex-col items-center"
        animate={{ 
          scale: isHovered ? 1.05 : 1,
          y: isHovered ? -2 : 0 
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Main stem */}
        <motion.div
          className="relative"
          style={{ height: `${height}px` }}
          animate={{ 
            scaleY: plant.health === 'dying' ? 0.9 : 1,
            opacity: plant.health === 'dead' ? 0.6 : 1
          }}
          transition={{ duration: 0.8 }}
        >
          {/* Stem */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2"
            style={{
              width: plant.plantType === 'tree' ? '12px' : '8px',
              height: '100%',
              backgroundColor: colors.stem,
              borderRadius: '2px',
            }}
          />
          
          {/* Leaves clustered at the top of stem */}
          {Array.from({ length: leafPairs }).map((_, pairIndex) => {
            const leafSize = plant.plantType === 'tree' ? 28 : plant.plantType === 'bush' ? 22 : 16; // Doubled sizes
            const topClusterHeight = 15; // Height of the leaf cluster area at top
            const leafOffset = (pairIndex * topClusterHeight / Math.max(1, leafPairs - 1)) - (topClusterHeight / 2); // Cluster around top
            const stemPosition = leafOffset; // Position relative to top of stem
            
            return (
              <div key={pairIndex}>
                {/* Left leaf */}
                <motion.div
                  className="absolute"
                  style={{
                    width: `${leafSize}px`,
                    height: `${leafSize * 1.2}px`,
                    backgroundColor: colors.leaves,
                    borderRadius: '15% 85% 25% 75%',
                    transformOrigin: 'right center',
                    top: `${stemPosition}px`,
                    left: `${-leafSize - 2}px`, // Position to the left of stem
                    transform: `rotate(-15deg)`,
                    border: `1px solid ${colors.accent}`,
                    opacity: plant.health === 'dead' ? 0.5 : 0.9
                  }}
                  animate={isHealthy ? {
                    rotate: ['-15deg', '-8deg', '-22deg', '-15deg'],
                    scale: [1, 1.05, 0.95, 1]
                  } : {}}
                  transition={{
                    duration: 1.5 + Math.random() * 1,
                    repeat: Infinity,
                    delay: pairIndex * 0.2
                  }}
                />
                
                {/* Right leaf */}
                <motion.div
                  className="absolute"
                  style={{
                    width: `${leafSize}px`,
                    height: `${leafSize * 1.2}px`,
                    backgroundColor: colors.leaves,
                    borderRadius: '15% 85% 25% 75%',
                    transformOrigin: 'left center',
                    top: `${stemPosition}px`,
                    left: `${2}px`, // Position to the right of stem
                    transform: `rotate(15deg)`,
                    border: `1px solid ${colors.accent}`,
                    opacity: plant.health === 'dead' ? 0.5 : 0.9
                  }}
                  animate={isHealthy ? {
                    rotate: ['15deg', '8deg', '22deg', '15deg'],
                    scale: [1, 1.05, 0.95, 1]
                  } : {}}
                  transition={{
                    duration: 1.5 + Math.random() * 1,
                    repeat: Infinity,
                    delay: pairIndex * 0.2 + 0.1
                  }}
                />
              </div>
            );
          })}
          
          {/* Additional stem leaves for thriving plants */}
          {plant.health === 'thriving' && Array.from({ length: plant.plantType === 'tree' ? 3 : 2 }).map((_, stemLeafIndex) => {
            const leafSize = plant.plantType === 'tree' ? 18 : 14;
            const stemPosition = (height * 0.4) + (stemLeafIndex * 25); // Position below the top cluster
            const isLeft = stemLeafIndex % 2 === 0;
            
            return (
              <motion.div
                key={`stem-leaf-${stemLeafIndex}`}
                className="absolute"
                style={{
                  top: `${stemPosition}px`,
                  left: isLeft ? `${-leafSize - 1}px` : `${1}px`,
                  transformOrigin: isLeft ? 'bottom right' : 'bottom left',
                  transform: `rotate(${isLeft ? '-20deg' : '20deg'})`
                }}
                animate={{
                  rotate: [
                    `${isLeft ? '-20deg' : '20deg'}`, 
                    `${isLeft ? '-10deg' : '10deg'}`, 
                    `${isLeft ? '-30deg' : '30deg'}`, 
                    `${isLeft ? '-20deg' : '20deg'}`
                  ],
                  scale: [1, 1.06, 0.94, 1]
                }}
                transition={{
                  duration: 1.8 + Math.random() * 0.8,
                  repeat: Infinity,
                  delay: stemLeafIndex * 0.25 + 0.8
                }}
              >
                {/* Cartoon-style leaf */}
                <div
                  style={{
                    width: `${leafSize}px`,
                    height: `${leafSize * 1.3}px`,
                    backgroundColor: colors.leaves,
                    borderRadius: '50% 15% 50% 85%', // Cartoon leaf shape - rounded with pointed tip
                    border: `1.5px solid ${colors.accent}`,
                    opacity: 0.9,
                    position: 'relative',
                    clipPath: 'polygon(50% 0%, 85% 25%, 95% 50%, 85% 75%, 70% 90%, 50% 95%, 30% 90%, 15% 75%, 5% 50%, 15% 25%)'
                  }}
                >
                  {/* Central vein - prominent midrib */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '3%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '2.5px',
                      height: '90%',
                      backgroundColor: colors.accent,
                      opacity: 0.9,
                      borderRadius: '2px',
                      boxShadow: `0 0 2px ${colors.accent}50`
                    }}
                  />
                  
                  {/* Primary side veins - main branching */}
                  {[...Array(5)].map((_, veinIndex) => (
                    <div
                      key={`left-primary-${veinIndex}`}
                      style={{
                        position: 'absolute',
                        top: `${12 + veinIndex * 16}%`,
                        left: '50%',
                        width: `${40 - veinIndex * 4}%`,
                        height: '1.5px',
                        backgroundColor: colors.accent,
                        opacity: 0.75,
                        transform: 'rotate(-35deg)',
                        transformOrigin: 'left center',
                        borderRadius: '1px'
                      }}
                    />
                  ))}
                  
                  {[...Array(5)].map((_, veinIndex) => (
                    <div
                      key={`right-primary-${veinIndex}`}
                      style={{
                        position: 'absolute',
                        top: `${12 + veinIndex * 16}%`,
                        right: '50%',
                        width: `${40 - veinIndex * 4}%`,
                        height: '1.5px',
                        backgroundColor: colors.accent,
                        opacity: 0.75,
                        transform: 'rotate(35deg)',
                        transformOrigin: 'right center',
                        borderRadius: '1px'
                      }}
                    />
                  ))}
                  
                  {/* Secondary veins - smaller branching for detail */}
                  {[...Array(3)].map((_, veinIndex) => (
                    <div
                      key={`left-secondary-${veinIndex}`}
                      style={{
                        position: 'absolute',
                        top: `${20 + veinIndex * 20}%`,
                        left: '60%',
                        width: `${20 - veinIndex * 3}%`,
                        height: '1px',
                        backgroundColor: colors.accent,
                        opacity: 0.5,
                        transform: 'rotate(-45deg)',
                        transformOrigin: 'left center',
                        borderRadius: '0.5px'
                      }}
                    />
                  ))}
                  
                  {[...Array(3)].map((_, veinIndex) => (
                    <div
                      key={`right-secondary-${veinIndex}`}
                      style={{
                        position: 'absolute',
                        top: `${20 + veinIndex * 20}%`,
                        right: '60%',
                        width: `${20 - veinIndex * 3}%`,
                        height: '1px',
                        backgroundColor: colors.accent,
                        opacity: 0.5,
                        transform: 'rotate(45deg)',
                        transformOrigin: 'right center',
                        borderRadius: '0.5px'
                      }}
                    />
                  ))}
                  
                  {/* Tertiary veins - fine network for realism */}
                  {[...Array(6)].map((_, veinIndex) => (
                    <div
                      key={`tertiary-${veinIndex}`}
                      style={{
                        position: 'absolute',
                        top: `${15 + veinIndex * 12}%`,
                        left: `${30 + (veinIndex % 2) * 40}%`,
                        width: `${8 + Math.random() * 4}%`,
                        height: '0.5px',
                        backgroundColor: colors.accent,
                        opacity: 0.3,
                        transform: `rotate(${-20 + Math.random() * 40}deg)`,
                        transformOrigin: 'center',
                        borderRadius: '0.5px'
                      }}
                    />
                  ))}
                </div>
                
                {/* Cartoon-style petiole (leaf stem) */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-3px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '3px',
                    height: '8px',
                    backgroundColor: colors.stem,
                    borderRadius: '2px',
                    opacity: 0.9
                  }}
                />
              </motion.div>
            );
          })}
          
          {/* Top center leaf/crown for trees and bushes */}
          {plant.plantType !== 'seedling' && (
            <motion.div
              className="absolute left-1/2 transform -translate-x-1/2"
              style={{
                top: '-5px',
                width: `${plant.plantType === 'tree' ? '18px' : '14px'}`, // Reduced by half
                height: `${plant.plantType === 'tree' ? '22px' : '18px'}`, // Reduced by half
                backgroundColor: colors.leaves,
                borderRadius: '50% 50% 50% 50%',
                border: `1px solid ${colors.accent}`,
                opacity: plant.health === 'dead' ? 0.5 : 0.9
              }}
              animate={isHealthy ? {
                scale: [1, 1.08, 0.92, 1],
                rotate: [0, 3, -3, 0]
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.3
              }}
            />
          )}
          
          {/* Additional leaves around the center crown */}
          {plant.plantType !== 'seedling' && Array.from({ length: plant.plantType === 'tree' ? 6 : 4 }).map((_, i) => {
            const angle = (360 / (plant.plantType === 'tree' ? 6 : 4)) * i;
            const radius = plant.plantType === 'tree' ? 16 : 12;
            const leafSize = plant.plantType === 'tree' ? 14 : 11;
            
            return (
              <motion.div
                key={`crown-${i}`}
                className="absolute"
                style={{
                  width: `${leafSize}px`,
                  height: `${leafSize * 1.3}px`,
                  backgroundColor: colors.leaves,
                  borderRadius: '50% 10% 50% 10%',
                  transformOrigin: 'center bottom',
                  left: `${Math.cos(angle * Math.PI / 180) * radius}px`,
                  top: `${Math.sin(angle * Math.PI / 180) * radius - 8}px`,
                  transform: `rotate(${angle + 45}deg)`,
                  border: `1px solid ${colors.accent}`,
                  opacity: plant.health === 'dead' ? 0.4 : 0.8
                }}
                animate={isHealthy ? {
                  rotate: [`${angle + 45}deg`, `${angle + 52}deg`, `${angle + 38}deg`, `${angle + 45}deg`],
                  scale: [1, 1.04, 0.96, 1]
                } : {}}
                transition={{
                  duration: 2 + Math.random() * 1,
                  repeat: Infinity,
                  delay: i * 0.15 + 0.5
                }}
              />
            );
          })}
        </motion.div>

        {/* Floating particles for healthy plants */}
        {isHealthy && Array.from({ length: 2 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute"
            style={{
              width: '2px',
              height: '2px',
              backgroundColor: '#d97706',
              borderRadius: '50%',
              left: `${-20 + Math.random() * 40}px`,
              bottom: `${height + 8 + Math.random() * 20}px`,
            }}
            animate={{
              y: [-3, -18, -3],
              x: [0, Math.random() * 6 - 3, 0],
              opacity: [0, 1, 0],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 1
            }}
          />
        ))}

        {/* Growth sparkles for thriving plants */}
        {plant.health === 'thriving' && Array.from({ length: 1 }).map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute"
            style={{
              width: '2px',
              height: '2px',
              backgroundColor: '#fbbf24',
              borderRadius: '50%',
              left: `${-10 + Math.random() * 20}px`,
              bottom: `${height * 0.6 + Math.random() * height * 0.4}px`,
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 1.2
            }}
          />
        ))}

        {/* Ground cover leaves for thriving plants */}
        {plant.health === 'thriving' && Array.from({ length: 5 }).map((_, leafIndex) => {
          const leafPositions = [
            { x: -50, y: 8 },   // Far left
            { x: -25, y: 12 },  // Left  
            { x: 0, y: 15 },    // Center
            { x: 25, y: 11 },   // Right
            { x: 45, y: 7 }     // Far right
          ];
          const pos = leafPositions[leafIndex];
          
          return (
            <motion.div
              key={`ground-leaf-${leafIndex}`}
              className="absolute"
              style={{
                left: `${pos.x}px`,
                bottom: `${pos.y}px`, // Position in soil surface area
              }}
              initial={{ scale: 0, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.2 + leafIndex * 0.15,
                ease: "easeOut"
              }}
            >
              {/* Realistic ground leaf */}
              <motion.div
                className="relative"
                style={{
                  width: `${12 + Math.random() * 4}px`,
                  height: `${16 + Math.random() * 4}px`,
                  backgroundColor: colors.leaves,
                  borderRadius: '60% 40% 60% 40%',
                  border: `1px solid ${colors.accent}`,
                  opacity: 0.85,
                  transform: `rotate(${-20 + Math.random() * 40}deg)`,
                  transformOrigin: 'bottom center'
                }}
                animate={{
                  rotate: [`${-20 + Math.random() * 40}deg`, `${-15 + Math.random() * 30}deg`, `${-20 + Math.random() * 40}deg`],
                  scale: [1, 1.03, 0.97, 1]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: leafIndex * 0.4
                }}
              >
                {/* Leaf vein detail */}
                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: '1px',
                    height: '70%',
                    backgroundColor: colors.accent,
                    opacity: 0.6
                  }}
                />
                
                {/* Small leaf stem connecting to soil */}
                <div
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                  style={{
                    width: '2px',
                    height: '4px',
                    backgroundColor: colors.stem,
                    borderRadius: '0 0 50% 50%',
                    opacity: 0.8
                  }}
                />
              </motion.div>
            </motion.div>
          );
        })}

        {/* Spikey bushes for thriving plants */}
        {plant.health === 'thriving' && Array.from({ length: 4 }).map((_, spikeyIndex) => {
          const spikeyPositions = [
            { x: -60, y: 5, rotation: -15 },   // Far left
            { x: -30, y: 8, rotation: 10 },   // Left  
            { x: 35, y: 6, rotation: -5 },    // Right
            { x: 55, y: 4, rotation: 20 }     // Far right
          ];
          const pos = spikeyPositions[spikeyIndex];
          
          return (
            <motion.div
              key={`spikey-bush-${spikeyIndex}`}
              className="absolute"
              style={{
                left: `${pos.x}px`,
                bottom: `${pos.y}px`,
                transform: `rotate(${pos.rotation}deg)`
              }}
              initial={{ scale: 0, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ 
                duration: 1.2, 
                delay: 0.4 + spikeyIndex * 0.2,
                ease: "easeOut"
              }}
            >
              {/* Spikey bush main body */}
              <motion.div
                className="relative"
                style={{
                  width: '18px',
                  height: '14px',
                  backgroundColor: colors.leaves,
                  borderRadius: '40% 40% 80% 80%',
                  border: `1px solid ${colors.accent}`,
                  opacity: 0.9
                }}
                animate={{
                  scale: [1, 1.04, 0.96, 1],
                  rotate: [`${pos.rotation}deg`, `${pos.rotation + 3}deg`, `${pos.rotation - 3}deg`, `${pos.rotation}deg`]
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: spikeyIndex * 0.5
                }}
              >
                {/* Spikes around the bush */}
                {Array.from({ length: 6 }).map((_, spikeIndex) => {
                  const spikeAngle = (spikeIndex * 60) + (Math.random() * 20 - 10); // Random variation
                  const spikeLength = 4 + Math.random() * 3;
                  
                  return (
                    <motion.div
                      key={`spike-${spikeIndex}`}
                      className="absolute"
                      style={{
                        width: '1.5px',
                        height: `${spikeLength}px`,
                        backgroundColor: colors.accent,
                        borderRadius: '50% 50% 0 0',
                        transformOrigin: 'bottom center',
                        left: '50%',
                        top: '50%',
                        transform: `translate(-50%, -50%) rotate(${spikeAngle}deg) translateY(-${spikeLength/2 + 7}px)`,
                        opacity: 0.8
                      }}
                      animate={{
                        scale: [1, 1.1, 0.9, 1],
                        rotate: [`${spikeAngle}deg`, `${spikeAngle + 5}deg`, `${spikeAngle - 5}deg`, `${spikeAngle}deg`]
                      }}
                      transition={{
                        duration: 3 + Math.random() * 1.5,
                        repeat: Infinity,
                        delay: spikeIndex * 0.1 + spikeyIndex * 0.3
                      }}
                    />
                  );
                })}
                
                {/* Small thorns inside the bush */}
                {Array.from({ length: 3 }).map((_, thornIndex) => (
                  <div
                    key={`thorn-${thornIndex}`}
                    className="absolute"
                    style={{
                      width: '2px',
                      height: '6px',
                      backgroundColor: colors.stem,
                      borderRadius: '50% 50% 0 0',
                      top: `${20 + thornIndex * 25}%`,
                      left: `${15 + thornIndex * 30}%`,
                      transform: `rotate(${-20 + thornIndex * 20}deg)`,
                      opacity: 0.7
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          );
        })}

        {/* Colorful diversity elements for thriving plants */}
        {plant.health === 'thriving' && Array.from({ length: 6 }).map((_, colorIndex) => {
          const colorElements = [
            { x: -45, y: 20, color: '#ef4444', type: 'berry' },     // Red berry
            { x: -20, y: 25, color: '#3b82f6', type: 'flower' },   // Blue flower
            { x: 15, y: 22, color: '#eab308', type: 'berry' },     // Yellow berry
            { x: 40, y: 18, color: '#dc2626', type: 'flower' },    // Red flower
            { x: -35, y: 35, color: '#2563eb', type: 'berry' },    // Blue berry
            { x: 25, y: 30, color: '#f59e0b', type: 'flower' }     // Yellow flower
          ];
          const element = colorElements[colorIndex];
          
          return (
            <motion.div
              key={`color-element-${colorIndex}`}
              className="absolute"
              style={{
                left: `${element.x}px`,
                bottom: `${element.y}px`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 1, 
                delay: 0.6 + colorIndex * 0.15,
                ease: "easeOut"
              }}
            >
              {element.type === 'berry' ? (
                /* Berry - Double size for maximum impact */
                <motion.div
                  className="relative"
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: element.color,
                    borderRadius: '50%',
                    border: `1.5px solid ${element.color}`,
                    boxShadow: `0 0 12px ${element.color}40`,
                    opacity: 0.9
                  }}
                  animate={{
                    scale: [1, 1.2, 0.8, 1],
                    opacity: [0.9, 1, 0.8, 0.9]
                  }}
                  transition={{
                    duration: 2.5 + Math.random() * 1,
                    repeat: Infinity,
                    delay: colorIndex * 0.4
                  }}
                >
                  {/* Berry shine */}
                  <div
                    className="absolute top-2 left-2 w-4 h-4 bg-white rounded-full opacity-60"
                    style={{ transform: 'translate(-25%, -25%)' }}
                  />
                  
                  {/* Berry stem */}
                  <div
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      width: '3px',
                      height: '6px',
                      backgroundColor: colors.stem,
                      borderRadius: '50% 50% 0 0',
                      opacity: 0.8
                    }}
                  />
                </motion.div>
              ) : (
                /* Flower - Double size for maximum impact */
                <motion.div
                  className="relative"
                  style={{
                    width: '28px',
                    height: '28px',
                  }}
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 0.9, 1]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 1,
                    repeat: Infinity,
                    delay: colorIndex * 0.3
                  }}
                >
                  {/* Flower petals - Much larger petals */}
                  {Array.from({ length: 5 }).map((_, petalIndex) => {
                    const petalAngle = (petalIndex * 72);
                    return (
                      <div
                        key={`petal-${petalIndex}`}
                        className="absolute"
                        style={{
                          width: '12px',
                          height: '8px',
                          backgroundColor: element.color,
                          borderRadius: '50% 20% 50% 20%',
                          transformOrigin: 'center',
                          left: '50%',
                          top: '50%',
                          transform: `translate(-50%, -50%) rotate(${petalAngle}deg) translateY(-8px)`,
                          opacity: 0.9,
                          border: `1px solid ${element.color}D0`
                        }}
                      />
                    );
                  })}
                  
                  {/* Flower center - Much larger center */}
                  <div
                    className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      width: '6px',
                      height: '6px',
                      backgroundColor: '#fbbf24',
                      borderRadius: '50%',
                      opacity: 0.9,
                      border: '1px solid #f59e0b'
                    }}
                  />
                  
                  {/* Flower stem */}
                  <div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"
                    style={{
                      width: '3px',
                      height: '8px',
                      backgroundColor: colors.stem,
                      borderRadius: '0 0 50% 50%',
                      opacity: 0.8
                    }}
                  />
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {/* Dead fallen leaves for wilting plants */}
        {plant.health === 'wilting' && Array.from({ length: 7 }).map((_, deadLeafIndex) => {
          const deadLeafPositions = [
            { x: -45, y: 3, rotation: 45 },    // Far left
            { x: -25, y: 5, rotation: -20 },   // Left  
            { x: -5, y: 2, rotation: 60 },     // Center left
            { x: 15, y: 4, rotation: -45 },    // Center right
            { x: 35, y: 1, rotation: 30 },     // Right
            { x: 50, y: 6, rotation: -60 },    // Far right
            { x: 0, y: 7, rotation: 15 }       // Center ground
          ];
          const pos = deadLeafPositions[deadLeafIndex];
          
          return (
            <div
              key={`dead-leaf-${deadLeafIndex}`}
              className="absolute"
              style={{
                left: `${pos.x}px`,
                bottom: `${pos.y}px`,
                transform: `rotate(${pos.rotation}deg)`
              }}
            >
              {/* Dead fallen leaf - static, no animation */}
              <div
                className="relative"
                style={{
                  width: `${10 + Math.random() * 6}px`,
                  height: `${14 + Math.random() * 6}px`,
                  backgroundColor: '#8B4513', // Brown color for dead petals
                  borderRadius: '60% 40% 60% 40%',
                  border: '1px solid #654321',
                  opacity: 0.7,
                  transformOrigin: 'bottom center'
                }}
              >
                {/* Dead leaf vein - darker brown */}
                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: '1px',
                    height: '70%',
                    backgroundColor: '#654321',
                    opacity: 0.8
                  }}
                />
                
                {/* Cracking detail on dead leaf */}
                <div
                  className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: '0.5px',
                    height: '40%',
                    backgroundColor: '#654321',
                    opacity: 0.6,
                    transform: 'rotate(30deg)'
                  }}
                />
              </div>
            </div>
          );
        })}
      </motion.div>
    );
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={(e) => {
        // Only hide if not moving to the tooltip
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (!relatedTarget?.closest('[data-tooltip]')) {
          setIsHovered(false);
        }
      }}
    >
      {/* Realistic 3D ceramic plant pot - pinned to bottom */}
      <div className="absolute bottom-0 w-36 h-16">
        {/* Pot container with proper pot shape */}
        <div className="relative w-full h-full">
          {/* Main pot body with ceramic styling - narrow base, wide top */}
          <div 
            className="absolute bottom-0 h-14 relative"
            style={{ 
              width: '100%',
              backgroundColor: '#e2e8f0', // Consistent solid ceramic color
              clipPath: 'polygon(25% 100%, 75% 100%, 85% 0%, 15% 0%)', // Narrow base, wide top
              border: '1px solid #cbd5e1'
            }}
          >
            {/* Pot rim - distinctive top edge */}
            <div 
              className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-full h-4"
              style={{ 
                backgroundColor: '#f1f5f9', // Consistent light ceramic rim color
                borderRadius: '50% / 60%',
                border: '1px solid #e2e8f0'
              }}
            />
            
            {/* Soil inside pot - matching pot shape but inset */}
            <div 
              className="absolute top-1 left-1/2 transform -translate-x-1/2 h-12"
              style={{ 
                width: 'calc(100% - 2px)', // 1px inset on each side
                background: '#654321', // Consistent brown soil color
                clipPath: 'polygon(27% 100%, 73% 100%, 83% 0%, 17% 0%)', // Matches pot shape but slightly inset
                boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.4)'
              }}
            >
              {/* Soil texture with organic specks */}
              <div 
                className="absolute inset-0 opacity-40"
                style={{
                  background: `
                    radial-gradient(circle at 30% 25%, rgba(139, 69, 19, 0.8) 1px, transparent 2px),
                    radial-gradient(circle at 70% 60%, rgba(160, 82, 45, 0.6) 1px, transparent 2px),
                    radial-gradient(circle at 20% 75%, rgba(101, 67, 33, 0.7) 1px, transparent 2px)
                  `,
                  backgroundSize: '8px 8px, 10px 10px, 6px 6px',
                  clipPath: 'inherit'
                }}
              />
              
              {/* Small pebbles and soil details */}
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-yellow-800 opacity-30"
                  style={{
                    width: '1px',
                    height: '1px',
                    left: `${20 + (i * 15)}%`,
                    top: `${30 + (i * 10)}%`,
                    boxShadow: '0 0.5px 1px rgba(0, 0, 0, 0.3)'
                  }}
                />
              ))}
            </div>
            
            {/* Pot drainage hole */}
            <div 
              className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-1 rounded-full"
              style={{
                backgroundColor: '#94a3b8'
              }}
            />
          </div>
        </div>
        
        {/* Plant positioned above soil */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 pb-0">
          {renderPlant()}
        </div>
      </div>

      {/* Plant info on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute -top-32 left-1/2 transform -translate-x-1/2 z-20"
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            data-tooltip
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="bg-white border border-gray-200 rounded-xl p-2.5 shadow-xl min-w-48 relative overflow-hidden">
              {/* Header with "CARDS" text */}
              <div className="flex items-center mb-2">
                <div className="flex items-center space-x-0.5">
                  <span className="text-xs font-bold text-black">C</span>
                  <span className="text-xs font-bold text-black">A</span>
                  <span className="text-xs font-bold text-black">R</span>
                  <span className="text-xs font-bold text-black">D</span>
                  <span className="text-xs font-bold text-black">S</span>
                </div>
              </div>

              <div className="flex items-start justify-between">
                {/* Left side - content */}
                <div className="flex-1">
                  {/* Topic name and status */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <h4 className="text-sm text-gray-800">{plant.topic}</h4>
                    <div 
                      className="text-xs px-1.5 py-0.5 rounded-full text-white"
                      style={{
                        backgroundColor: plant.health === 'thriving' ? '#3B82F6' : 
                                       plant.health === 'healthy' ? '#10B981' : 
                                       plant.health === 'wilting' ? '#F59E0B' : '#EF4444'
                      }}
                    >
                      {plant.health}
                    </div>
                  </div>

                  {/* Progress section */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs text-blue-primary">Progress</span>
                      <span className="text-xs text-gray-800">{plant.conceptsMastered}/{plant.totalConcepts} concepts</span>
                    </div>
                    {/* Brand-colored progress bar */}
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{
                          width: `${(plant.conceptsMastered / plant.totalConcepts) * 100}%`,
                          background: 'linear-gradient(90deg, #2050B3 0%, #2852E9 50%, #F3E7B9 100%)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Last visit */}
                  <div className="flex items-center gap-1 mb-1.5">
                    <div className="w-3 h-3 rounded-full border border-blue-primary flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-primary" />
                    </div>
                    <span className="text-xs text-blue-primary">Last visit</span>
                    <span className="text-xs text-gray-800 ml-auto">{getDaysSinceLastVisit()} days ago</span>
                  </div>

                  {/* Content */}
                  <div className="flex items-center gap-1 mb-1.5">
                    <div className="w-3 h-3 rounded-full border border-blue-primary flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-primary" />
                    </div>
                    <span className="text-xs text-blue-primary">Content</span>
                    <span className="text-xs text-gray-800 ml-auto">{plant.contentUploaded} articles</span>
                  </div>

                  {/* Quiz relevance indicator */}
                  {plant.isQuizRelevant && (
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3 text-blue-accent" />
                      <span className="text-xs text-blue-accent font-medium">Quiz Topic</span>
                    </div>
                  )}
                </div>


              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};



export const QuizRelevantGarden: React.FC<QuizRelevantGardenProps> = ({ 
  onViewFullGarden,
  currentQuizTopics 
}) => {
  return (
    <div className="bg-gradient-to-br from-white to-gold-pale border border-border rounded-xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl">
            <Sprout className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-charcoal">Learning Garden</h2>
            <p className="text-sm text-gray-secondary">Your complete knowledge ecosystem</p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onViewFullGarden}
          className="text-blue-accent hover:text-blue-primary hover:bg-blue-primary/5 font-medium"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Full Garden
        </Button>
      </div>

      {/* Garden Preview */}
      <div className="relative h-48">
        {/* Base ground - pinned to bottom */}
        <div 
          className="absolute bottom-0 h-16 w-full rounded-lg"
          style={{ 
            background: 'linear-gradient(135deg, #92400e 0%, #78350f 25%, #451a03 50%, #292524 75%, #1c1917 100%)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
          }}
        />
        
        {/* Plants positioned on the ground */}
        <div className="absolute inset-0 flex items-end justify-around px-4 pb-0">
          {mockPlantData.map((plant, index) => (
            <motion.div
              key={plant.id}
              className="relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <PlantComponent plant={plant} index={index} />
              
              {/* Plant info tooltip on hover */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 hover:opacity-100 transition-opacity z-10">
                <div className="bg-white border border-border rounded-lg p-3 shadow-lg min-w-[160px]">
                  <h4 className="font-medium text-charcoal text-sm">{plant.topic}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-xs text-gray-secondary">
                      {plant.conceptsMastered}/{plant.totalConcepts} concepts
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      plant.health === 'thriving' ? 'bg-blue-500' :
                      plant.health === 'healthy' ? 'bg-emerald-500' :
                      plant.health === 'wilting' ? 'bg-amber-500' :
                      plant.health === 'dying' ? 'bg-red-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  {plant.isQuizRelevant && (
                    <div className="flex items-center gap-1 mt-1">
                      <Target className="w-3 h-3 text-blue-accent" />
                      <span className="text-xs text-blue-accent font-medium">Quiz Topic</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Garden Stats */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-sm text-gray-secondary">Thriving</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <span className="text-sm text-gray-secondary">Healthy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full" />
            <span className="text-sm text-gray-secondary">Wilting</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-sm text-gray-secondary">Dying</span>
          </div>
        </div>
        
        <div className="text-sm text-gray-secondary">
          {mockPlantData.filter(p => p.isQuizRelevant).length} quiz topics • {mockPlantData.length} total topics
        </div>
      </div>
    </div>
  );
};