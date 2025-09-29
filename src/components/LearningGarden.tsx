import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Sprout, Leaf, Droplets, Sun, Clock } from 'lucide-react';
import { useTopicData } from './TopicDataManager';

interface PlantData {
  id: string;
  topic: string;
  conceptsMastered: number;
  totalConcepts: number;
  contentUploaded: number;
  lastVisited: Date;
  plantType: 'seedling' | 'bush' | 'tree' | 'flower';
  health: 'thriving' | 'healthy' | 'wilting' | 'dying' | 'dead';
  retentionScore: number;
}

interface LearningGardenProps {
  onBack: () => void;
}

// Mock data for the learning garden
const mockPlantData: PlantData[] = [
  {
    id: '1',
    topic: 'Machine Learning',
    conceptsMastered: 8,
    totalConcepts: 12,
    contentUploaded: 15,
    lastVisited: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    plantType: 'tree',
    health: 'healthy'
  },
  {
    id: '2',
    topic: 'React Development',
    conceptsMastered: 12,
    totalConcepts: 15,
    contentUploaded: 23,
    lastVisited: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    plantType: 'tree',
    health: 'thriving'
  },
  {
    id: '3',
    topic: 'Data Structures',
    conceptsMastered: 4,
    totalConcepts: 10,
    contentUploaded: 7,
    lastVisited: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    plantType: 'bush',
    health: 'wilting'
  },
  {
    id: '4',
    topic: 'System Design',
    conceptsMastered: 2,
    totalConcepts: 8,
    contentUploaded: 3,
    lastVisited: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    plantType: 'seedling',
    health: 'healthy'
  },
  {
    id: '5',
    topic: 'UI/UX Design',
    conceptsMastered: 6,
    totalConcepts: 8,
    contentUploaded: 12,
    lastVisited: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    plantType: 'flower',
    health: 'thriving'
  },
  {
    id: '6',
    topic: 'Database Theory',
    conceptsMastered: 1,
    totalConcepts: 6,
    contentUploaded: 2,
    lastVisited: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    plantType: 'seedling',
    health: 'dying'
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
        {isHealthy && Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute"
            style={{
              width: '2px',
              height: '2px',
              backgroundColor: '#d97706',
              borderRadius: '50%',
              left: `${-25 + Math.random() * 50}px`,
              bottom: `${height + 10 + Math.random() * 25}px`,
            }}
            animate={{
              y: [-3, -20, -3],
              x: [0, Math.random() * 8 - 4, 0],
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
        {plant.health === 'thriving' && Array.from({ length: 2 }).map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute"
            style={{
              width: '2px',
              height: '2px',
              backgroundColor: '#fbbf24',
              borderRadius: '50%',
              left: `${-15 + Math.random() * 30}px`,
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
      {/* Rich soil plot with terracotta pot style */}
      <div className="relative w-36 h-12 mb-0">
        {/* Main pot/soil container with gradient and depth */}
        <div 
          className="w-full h-full rounded-t-full relative overflow-hidden"
          style={{ 
            background: 'linear-gradient(135deg, #a0522d 0%, #8b4513 25%, #654321 50%, #4a2c17 75%, #3d1a00 100%)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          {/* Soil texture overlay */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              background: `
                radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.8) 1px, transparent 1px),
                radial-gradient(circle at 60% 70%, rgba(160, 82, 45, 0.6) 1px, transparent 1px),
                radial-gradient(circle at 80% 20%, rgba(101, 67, 33, 0.7) 1px, transparent 1px),
                radial-gradient(circle at 30% 80%, rgba(74, 44, 23, 0.5) 1px, transparent 1px)
              `,
              backgroundSize: '8px 8px, 12px 12px, 6px 6px, 10px 10px'
            }}
          />
          
          {/* Rich topsoil layer */}
          <div 
            className="absolute top-0 w-full h-3 rounded-t-full"
            style={{
              background: 'linear-gradient(180deg, #6b4423 0%, #5d3a1f 50%, #4f2f1a 100%)',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)'
            }}
          />
          
          {/* Small organic matter particles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute w-1 h-1 rounded-full opacity-60"
              style={{
                backgroundColor: i % 3 === 0 ? '#2d5016' : i % 3 === 1 ? '#8b4513' : '#654321',
                top: `${20 + Math.random() * 60}%`,
                left: `${10 + Math.random() * 80}%`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}
        </div>
        
        {/* Pot rim highlight */}
        <div 
          className="absolute top-0 w-full h-1 rounded-t-full opacity-60"
          style={{
            background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.3) 100%)'
          }}
        />
      </div>
      
      {/* Plant */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
        {renderPlant()}
      </div>
      
      {/* Plant info tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute -top-32 left-1/2 transform -translate-x-1/2 z-20"
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
                    <Badge 
                      variant={plant.health === 'thriving' ? 'default' : 
                              plant.health === 'healthy' ? 'secondary' : 
                              plant.health === 'wilting' ? 'outline' : 'destructive'}
                      className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: plant.health === 'thriving' ? '#3B82F6' : 
                                       plant.health === 'healthy' ? '#10B981' : 
                                       plant.health === 'wilting' ? '#F59E0B' : '#EF4444',
                        color: 'white'
                      }}
                    >
                      {plant.health}
                    </Badge>
                  </div>

                  {/* Progress section */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs text-blue-400">Progress</span>
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

                  {/* Retention Score */}
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full border border-yellow-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                    </div>
                    <span className="text-xs text-yellow-600">Retention</span>
                    <span className={`text-xs ml-auto font-medium ${
                      plant.retentionScore >= 85 ? 'text-green-600' : 
                      plant.retentionScore >= 70 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {plant.retentionScore}%
                    </span>
                  </div>
                </div>


              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};



export const LearningGarden: React.FC<LearningGardenProps> = ({ onBack }) => {
  const { topics, calculateTopicRetention } = useTopicData();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'thriving' | 'needs-attention'>('all');
  
  // Convert topics to PlantData format for compatibility
  const plantData: PlantData[] = topics.map(topic => ({
    id: topic.id,
    topic: topic.name,
    conceptsMastered: topic.conceptsMastered,
    totalConcepts: topic.totalConcepts,
    contentUploaded: 15, // Mock value for now
    lastVisited: topic.lastVisited,
    plantType: topic.plantType,
    health: topic.health,
    retentionScore: calculateTopicRetention(topic.id)
  }));
  
  const filteredPlants = plantData.filter(plant => {
    if (selectedFilter === 'thriving') {
      return plant.health === 'thriving' || plant.health === 'healthy';
    }
    if (selectedFilter === 'needs-attention') {
      return plant.health === 'wilting' || plant.health === 'dying';
    }
    return true;
  });

  const getGardenStats = () => {
    const total = plantData.length;
    const thriving = plantData.filter(p => p.health === 'thriving' || p.health === 'healthy').length;
    const needsAttention = plantData.filter(p => p.health === 'wilting' || p.health === 'dying').length;
    const totalConcepts = plantData.reduce((sum, p) => sum + p.conceptsMastered, 0);
    
    return { total, thriving, needsAttention, totalConcepts };
  };

  const stats = getGardenStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl">Learning Garden</h1>
            <p className="text-muted-foreground">
              Watch your knowledge grow with every concept you master
            </p>
          </div>
        </div>
      </div>

      {/* Garden Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Sprout className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Plants</p>
              <p className="text-2xl">{stats.total}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Sun className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">Thriving</p>
              <p className="text-2xl">{stats.thriving}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Need Care</p>
              <p className="text-2xl">{stats.needsAttention}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Leaf className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Concepts</p>
              <p className="text-2xl">{stats.totalConcepts}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-2">
        <Button
          variant={selectedFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('all')}
        >
          All Plants
        </Button>
        <Button
          variant={selectedFilter === 'thriving' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('thriving')}
        >
          Thriving
        </Button>
        <Button
          variant={selectedFilter === 'needs-attention' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('needs-attention')}
        >
          Needs Attention
        </Button>
      </div>

      {/* Garden Preview */}
      <div className="bg-gradient-to-br from-white to-gold-pale border border-border rounded-xl p-8">
        <div className="relative h-72">
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
            {filteredPlants.map((plant, index) => (
              <motion.div
                key={plant.id}
                className="relative"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
              >
                <PlantComponent plant={plant} index={index} />
              </motion.div>
            ))}
          </div>

          {filteredPlants.length === 0 && (
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
              <Sprout className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No plants match your current filter</p>
            </div>
          )}
        </div>

        {/* Garden Stats */}
        <div className="flex justify-end mt-6 pt-6 border-t border-border">
          <div className="text-sm text-gray-secondary">
            {filteredPlants.length} {filteredPlants.length === 1 ? 'plant' : 'plants'} • {stats.totalConcepts} total concepts
          </div>
        </div>
      </div>

      {/* Garden Tips */}
      <Card className="p-6">
        <h3 className="mb-4">Garden Care Tips</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full" />
              <span><strong>Thriving:</strong> Keep practicing! Your plant is flourishing.</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span><strong>Healthy:</strong> Regular engagement keeps your plant strong.</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span><strong>Wilting:</strong> Review concepts to revive your plant.</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full" />
              <span><strong>Dying:</strong> Immediate attention needed - practice now!</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};