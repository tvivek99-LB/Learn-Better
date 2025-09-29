import React from 'react';
import { motion } from 'motion/react';

interface DogFaceProps {
  size: number;
  isHovered: boolean;
}

// THRIVING DOG FACE - Very playful with tongue out and wagging motion
export function ThrivingDogFace({ size, isHovered }: DogFaceProps) {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: size * 1.4, height: size * 1.2 }}
      animate={{
        rotate: isHovered ? [0, 5, -5, 0] : [0, 2, -2, 0],
        scale: isHovered ? [1, 1.1, 1] : [0.98, 1.02, 0.98]
      }}
      transition={{
        rotate: { duration: 0.8, repeat: Infinity },
        scale: { duration: 1.2, repeat: Infinity }
      }}
    >
      {/* Dog Face Oval - Much Larger */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: size * 1.4,
          height: size * 1.2,
          backgroundColor: '#d2691e', // Sandy brown
          border: `${size * 0.04}px solid #8b4513`,
          borderRadius: '60% 60% 50% 50%' // More oval, less circular
        }}
      >
        {/* Ears - Bouncing */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size * 0.25,
            height: size * 0.35,
            backgroundColor: '#8b4513',
            top: `-${size * 0.05}px`,
            left: `${size * 0.15}px`
          }}
          animate={{
            rotate: [0, -8, 8, 0],
            scaleY: [1, 1.1, 0.9, 1]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size * 0.25,
            height: size * 0.35,
            backgroundColor: '#8b4513',
            top: `-${size * 0.05}px`,
            right: `${size * 0.15}px`
          }}
          animate={{
            rotate: [0, 8, -8, 0],
            scaleY: [1, 1.1, 0.9, 1]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.1
          }}
        />

        {/* Eyes - Bright and happy - DOUBLED SIZE */}
        <div
          className="absolute rounded-full bg-black"
          style={{
            width: size * 0.24,
            height: size * 0.24,
            top: `${size * 0.28}px`,
            left: `${size * 0.22}px`
          }}
        />
        <div
          className="absolute rounded-full bg-black"
          style={{
            width: size * 0.24,
            height: size * 0.24,
            top: `${size * 0.28}px`,
            right: `${size * 0.22}px`
          }}
        />

        {/* Eye sparkles - DOUBLED SIZE */}
        <motion.div
          className="absolute rounded-full bg-white"
          style={{
            width: size * 0.08,
            height: size * 0.08,
            top: `${size * 0.3}px`,
            left: `${size * 0.26}px`
          }}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div
          className="absolute rounded-full bg-white"
          style={{
            width: size * 0.08,
            height: size * 0.08,
            top: `${size * 0.3}px`,
            right: `${size * 0.26}px`
          }}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
        />

        {/* Nose - Bouncing */}
        <motion.div
          className="absolute rounded-full bg-black"
          style={{
            width: size * 0.08,
            height: size * 0.06,
            top: `${size * 0.52}px`,
            left: '50%',
            transform: 'translateX(-50%)'
          }}
          animate={{
            scale: [1, 1.2, 1],
            scaleY: [1, 1.3, 1]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity
          }}
        />

        {/* Happy mouth - curved up */}
        <motion.div
          className="absolute border-black"
          style={{
            width: size * 0.15,
            height: size * 0.1,
            borderWidth: `${size * 0.02}px`,
            borderStyle: 'solid',
            borderTopColor: 'transparent',
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderRadius: '0 0 50px 50px',
            top: `${size * 0.6}px`,
            left: '50%',
            transform: 'translateX(-50%)'
          }}
          animate={{
            scaleX: [1, 1.1, 1],
            y: [0, -1, 0]
          }}
          transition={{
            duration: 0.7,
            repeat: Infinity
          }}
        />

        {/* Tongue - hanging out and wiggling */}
        <motion.div
          className="absolute rounded-full bg-pink-400"
          style={{
            width: size * 0.06,
            height: size * 0.12,
            borderRadius: '50% 50% 50% 50%',
            top: `${size * 0.7}px`,
            left: '50%',
            transform: 'translateX(-50%)'
          }}
          animate={{
            scaleY: [1, 1.15, 1],
            x: [-1, 1, -1],
            rotate: [0, 3, -3, 0]
          }}
          transition={{
            scaleY: { duration: 0.4, repeat: Infinity },
            x: { duration: 0.8, repeat: Infinity },
            rotate: { duration: 0.6, repeat: Infinity }
          }}
        />
      </div>

      {/* Animated tail wagging */}
      <motion.div
        className="absolute bg-orange-600 rounded-full"
        style={{
          width: size * 0.12,
          height: size * 0.4,
          top: `${size * 0.15}px`,
          right: `-${size * 0.15}px`,
          transformOrigin: 'top center',
          borderRadius: '50% 50% 80% 20%'
        }}
        animate={{
          rotate: [15, -15, 15],
          scaleY: [1, 1.1, 1]
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Excitement sparkles */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-yellow-400"
          style={{
            width: size * 0.04,
            height: size * 0.04,
            top: `${size * (0.1 + i * 0.15)}px`,
            left: `${size * (0.8 + i * 0.1)}px`
          }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.4
          }}
        />
      ))}
    </motion.div>
  );
}

// HEALTHY DOG FACE - Happy with a smile
export function HealthyDogFace({ size, isHovered }: DogFaceProps) {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: size * 1.4, height: size * 1.2 }}
      animate={{
        scale: isHovered ? [1, 1.05, 1] : [0.99, 1.01, 0.99],
        rotate: isHovered ? [0, 2, -2, 0] : 0
      }}
      transition={{
        scale: { duration: 2.5, repeat: Infinity },
        rotate: { duration: 3, repeat: isHovered ? Infinity : 0 }
      }}
    >
      {/* Dog Face Oval - Much Larger */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: size * 1.4,
          height: size * 1.2,
          backgroundColor: '#daa520', // Golden rod
          border: `${size * 0.04}px solid #b8860b`,
          borderRadius: '60% 60% 50% 50%' // More oval, less circular
        }}
      >
        {/* Ears - Gentle movement */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size * 0.22,
            height: size * 0.32,
            backgroundColor: '#b8860b',
            top: `-${size * 0.02}px`,
            left: `${size * 0.18}px`
          }}
          animate={{
            rotate: [0, -3, 3, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size * 0.22,
            height: size * 0.32,
            backgroundColor: '#b8860b',
            top: `-${size * 0.02}px`,
            right: `${size * 0.18}px`
          }}
          animate={{
            rotate: [0, 3, -3, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />

        {/* Eyes - Blinking occasionally - DOUBLED SIZE */}
        <motion.div
          className="absolute rounded-full bg-black"
          style={{
            width: size * 0.2,
            height: size * 0.2,
            top: `${size * 0.3}px`,
            left: `${size * 0.25}px`
          }}
          animate={{
            scaleY: [1, 0.1, 1]
          }}
          transition={{
            duration: 0.15,
            repeat: Infinity,
            repeatDelay: 3
          }}
        />
        <motion.div
          className="absolute rounded-full bg-black"
          style={{
            width: size * 0.2,
            height: size * 0.2,
            top: `${size * 0.3}px`,
            right: `${size * 0.25}px`
          }}
          animate={{
            scaleY: [1, 0.1, 1]
          }}
          transition={{
            duration: 0.15,
            repeat: Infinity,
            repeatDelay: 3
          }}
        />

        {/* Eye shine - DOUBLED SIZE */}
        <div
          className="absolute rounded-full bg-white"
          style={{
            width: size * 0.06,
            height: size * 0.06,
            top: `${size * 0.32}px`,
            left: `${size * 0.28}px`
          }}
        />
        <div
          className="absolute rounded-full bg-white"
          style={{
            width: size * 0.06,
            height: size * 0.06,
            top: `${size * 0.32}px`,
            right: `${size * 0.28}px`
          }}
        />

        {/* Nose */}
        <div
          className="absolute rounded-full bg-black"
          style={{
            width: size * 0.07,
            height: size * 0.05,
            top: `${size * 0.52}px`,
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        />

        {/* Happy smile */}
        <motion.div
          className="absolute border-black"
          style={{
            width: size * 0.18,
            height: size * 0.12,
            borderWidth: `${size * 0.015}px`,
            borderStyle: 'solid',
            borderTopColor: 'transparent',
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderRadius: '0 0 60px 60px',
            top: `${size * 0.6}px`,
            left: '50%',
            transform: 'translateX(-50%)'
          }}
          animate={{
            scaleX: [1, 1.05, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        />
      </div>

      {/* Gentle tail movement - just visible */}
      <motion.div
        className="absolute bg-yellow-700 rounded-full"
        style={{
          width: size * 0.08,
          height: size * 0.3,
          top: `${size * 0.2}px`,
          right: `-${size * 0.1}px`,
          transformOrigin: 'top center',
          borderRadius: '50% 50% 70% 30%'
        }}
        animate={{
          rotate: [5, -5, 5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
}

// WILTING DOG FACE - Sleepy with ZZZ animation
export function WiltingDogFace({ size, isHovered }: DogFaceProps) {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: size * 1.4, height: size * 1.2 }}
      animate={{
        y: [0, 2, 0],
        rotate: [0, 1, -1, 0],
        scale: [0.96, 1, 0.94, 1]
      }}
      transition={{
        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 6, repeat: Infinity },
        scale: { duration: 5, repeat: Infinity }
      }}
    >
      {/* Dog Face Oval - Much Larger */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: size * 1.4,
          height: size * 1.2,
          backgroundColor: '#cd853f', // Peru
          border: `${size * 0.04}px solid #a0522d`,
          borderRadius: '60% 60% 50% 50%' // More oval, less circular
        }}
      >
        {/* Droopy Ears */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size * 0.2,
            height: size * 0.4,
            backgroundColor: '#a0522d',
            top: `${size * 0.05}px`,
            left: `${size * 0.15}px`,
            transform: 'rotate(-20deg)'
          }}
          animate={{
            rotate: [-20, -25, -20]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size * 0.2,
            height: size * 0.4,
            backgroundColor: '#a0522d',
            top: `${size * 0.05}px`,
            right: `${size * 0.15}px`,
            transform: 'rotate(20deg)'
          }}
          animate={{
            rotate: [20, 25, 20]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />

        {/* Sleepy Eyes - Half closed - DOUBLED SIZE */}
        <motion.div
          className="absolute bg-black"
          style={{
            width: size * 0.2,
            height: size * 0.1,
            borderRadius: '50px',
            top: `${size * 0.33}px`,
            left: `${size * 0.25}px`
          }}
          animate={{
            scaleY: [0.5, 0.3, 0.5],
            y: [0, 1, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity
          }}
        />
        <motion.div
          className="absolute bg-black"
          style={{
            width: size * 0.2,
            height: size * 0.1,
            borderRadius: '50px',
            top: `${size * 0.33}px`,
            right: `${size * 0.25}px`
          }}
          animate={{
            scaleY: [0.5, 0.3, 0.5],
            y: [0, 1, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity
          }}
        />

        {/* Nose */}
        <div
          className="absolute rounded-full bg-gray-700"
          style={{
            width: size * 0.06,
            height: size * 0.04,
            top: `${size * 0.54}px`,
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        />

        {/* Neutral tired mouth */}
        <motion.div
          className="absolute bg-gray-600"
          style={{
            width: size * 0.12,
            height: size * 0.01,
            borderRadius: '2px',
            top: `${size * 0.64}px`,
            left: '50%',
            transform: 'translateX(-50%)'
          }}
          animate={{
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 3,
            repeat: Infinity
          }}
        />
      </div>

      {/* Animated ZZZ floating up - TRIPLED SIZE */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-gray-600 font-bold select-none"
          style={{
            fontSize: `${size * 0.3}px`, // TRIPLED from 0.1 to 0.3
            top: `${size * (0.1 + i * 0.1)}px`,
            right: `-${size * 0.5}px`,
            fontWeight: '900',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}
          animate={{
            y: [0, -size * 0.4],
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1.5, 1.5, 0.8],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeOut"
          }}
        >
          Z
        </motion.div>
      ))}

      {/* Droopy tail */}
      <div
        className="absolute bg-gray-600 rounded-full"
        style={{
          width: size * 0.06,
          height: size * 0.25,
          top: `${size * 0.35}px`,
          right: `-${size * 0.08}px`,
          borderRadius: '50% 50% 50% 80%',
          transform: 'rotate(30deg)'
        }}
      />
    </motion.div>
  );
}

// DYING DOG FACE - Sad with tears
export function DyingDogFace({ size, isHovered }: DyingDogProps) {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: size * 1.4, height: size * 1.2 }}
      animate={{
        opacity: [0.6, 0.8, 0.6],
        scale: [0.94, 1, 0.94],
        y: [0, 1, 0]
      }}
      transition={{
        opacity: { duration: 3, repeat: Infinity },
        scale: { duration: 4, repeat: Infinity },
        y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      {/* Emergency glow */}
      <motion.div
        className="absolute border-2 border-red-400"
        style={{
          width: size * 1.6,
          height: size * 1.4,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '60% 60% 50% 50%'
        }}
        animate={{
          scale: [0.9, 1.1, 0.9],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity
        }}
      />

      {/* Dog Face Oval - Much Larger */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: size * 1.4,
          height: size * 1.2,
          backgroundColor: '#8fbc8f', // Dark sea green (sickly)
          border: `${size * 0.04}px solid #696969`,
          borderRadius: '60% 60% 50% 50%' // More oval, less circular
        }}
      >
        {/* Flat ears */}
        <div
          className="absolute rounded-full"
          style={{
            width: size * 0.18,
            height: size * 0.35,
            backgroundColor: '#696969',
            top: `${size * 0.1}px`,
            left: `${size * 0.15}px`,
            transform: 'rotate(-35deg)'
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: size * 0.18,
            height: size * 0.35,
            backgroundColor: '#696969',
            top: `${size * 0.1}px`,
            right: `${size * 0.15}px`,
            transform: 'rotate(35deg)'
          }}
        />

        {/* Open sad eyes - OPEN INSTEAD OF CLOSED */}
        <motion.div
          className="absolute rounded-full bg-black"
          style={{
            width: size * 0.2,
            height: size * 0.2,
            top: `${size * 0.28}px`,
            left: `${size * 0.35}px`
          }}
          animate={{
            scaleY: [1, 0.8, 1],
            y: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        />
        <motion.div
          className="absolute rounded-full bg-black"
          style={{
            width: size * 0.2,
            height: size * 0.2,
            top: `${size * 0.28}px`,
            right: `${size * 0.35}px`
          }}
          animate={{
            scaleY: [1, 0.8, 1],
            y: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        />

        {/* Eye shine for open eyes */}
        <div
          className="absolute rounded-full bg-white"
          style={{
            width: size * 0.06,
            height: size * 0.06,
            top: `${size * 0.3}px`,
            left: `${size * 0.38}px`
          }}
        />
        <div
          className="absolute rounded-full bg-white"
          style={{
            width: size * 0.06,
            height: size * 0.06,
            top: `${size * 0.3}px`,
            right: `${size * 0.38}px`
          }}
        />

        {/* Animated tear drops - TRIPLED SIZE AND THICK */}
        <motion.div
          className="absolute bg-blue-400"
          style={{
            width: size * 0.12, // TRIPLED from 0.04
            height: size * 0.18, // TRIPLED from 0.06
            borderRadius: '50% 50% 50% 80%',
            top: `${size * 0.45}px`,
            left: `${size * 0.3}px`,
            border: `${size * 0.02}px solid #2563eb`, // THICK border
            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)' // Shadow for thickness
          }}
          animate={{
            scaleY: [0, 1, 1, 0],
            y: [0, size * 0.15, size * 0.3, size * 0.45],
            opacity: [0, 1, 1, 0],
            scaleX: [0.8, 1, 1, 1.2]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
        <motion.div
          className="absolute bg-blue-400"
          style={{
            width: size * 0.12, // TRIPLED from 0.04
            height: size * 0.18, // TRIPLED from 0.06
            borderRadius: '50% 50% 50% 80%',
            top: `${size * 0.45}px`,
            right: `${size * 0.3}px`,
            border: `${size * 0.02}px solid #2563eb`, // THICK border
            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)' // Shadow for thickness
          }}
          animate={{
            scaleY: [0, 1, 1, 0],
            y: [0, size * 0.15, size * 0.3, size * 0.45],
            opacity: [0, 1, 1, 0],
            scaleX: [0.8, 1, 1, 1.2]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: 1,
            ease: "easeOut"
          }}
        />

        {/* Additional thick tear streams for extra drama */}
        <motion.div
          className="absolute bg-blue-300"
          style={{
            width: size * 0.06,
            height: size * 0.4,
            borderRadius: '50%',
            top: `${size * 0.48}px`,
            left: `${size * 0.33}px`,
            opacity: 0.6
          }}
          animate={{
            scaleY: [0, 1, 1],
            opacity: [0, 0.6, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
        <motion.div
          className="absolute bg-blue-300"
          style={{
            width: size * 0.06,
            height: size * 0.4,
            borderRadius: '50%',
            top: `${size * 0.48}px`,
            right: `${size * 0.33}px`,
            opacity: 0.6
          }}
          animate={{
            scaleY: [0, 1, 1],
            opacity: [0, 0.6, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: 1.2,
            ease: "easeOut"
          }}
        />

        {/* Nose */}
        <div
          className="absolute rounded-full bg-gray-500"
          style={{
            width: size * 0.05,
            height: size * 0.04,
            top: `${size * 0.54}px`,
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        />

        {/* Very sad downturned mouth */}
        <motion.div
          className="absolute border-gray-600"
          style={{
            width: size * 0.15,
            height: size * 0.1,
            borderWidth: `${size * 0.012}px`,
            borderStyle: 'solid',
            borderBottomColor: 'transparent',
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderRadius: '60px 60px 0 0',
            top: `${size * 0.68}px`,
            left: '50%',
            transform: 'translateX(-50%) rotate(180deg)'
          }}
          animate={{
            scaleX: [1, 1.1, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity
          }}
        />
      </div>

      {/* Tail completely down */}
      <div
        className="absolute bg-gray-500 rounded-full"
        style={{
          width: size * 0.05,
          height: size * 0.2,
          top: `${size * 0.6}px`,
          right: `-${size * 0.05}px`,
          borderRadius: '50% 50% 50% 80%',
          transform: 'rotate(90deg)'
        }}
      />

      {/* SOS/Help indicators */}
      <motion.div
        className="absolute text-red-500 font-bold select-none"
        style={{
          fontSize: `${size * 0.08}px`,
          top: `-${size * 0.15}px`,
          left: '50%',
          transform: 'translateX(-50%)'
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
          scale: [0.8, 1.2, 0.8],
          y: [-2, 2, -2]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity
        }}
      >
        💔
      </motion.div>
    </motion.div>
  );
}

// Fix missing interface
interface DyingDogProps {
  size: number;
  isHovered: boolean;
}