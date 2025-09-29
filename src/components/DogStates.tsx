import React from 'react';
import { motion } from 'motion/react';

interface DogStateProps {
  size: number;
  isHovered: boolean;
}

// THRIVING DOG - Super energetic, bouncing, playful
export function ThrivingDog({ size, isHovered }: DogStateProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      animate={{
        y: [-3, 3, -3],
        rotate: isHovered ? [0, 8, -8, 0] : [0, 3, -3, 0],
        scale: isHovered ? 1.1 : [0.98, 1.02, 0.98]
      }}
      transition={{
        y: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 0.6, repeat: Infinity },
        scale: { duration: 1.2, repeat: Infinity }
      }}
    >
      {/* Background Energy Circle */}
      <motion.circle
        cx="60"
        cy="60"
        r="50"
        fill="none"
        stroke="#22c55e"
        strokeWidth="2"
        strokeDasharray="5,5"
        opacity="0.3"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Dog Body - Energetic Stance */}
      <motion.ellipse
        cx="60"
        cy="80"
        rx="28"
        ry="22"
        fill="#8B4513"
        animate={{ 
          scaleY: [1, 1.1, 1],
          rotate: [0, 2, 0]
        }}
        transition={{ 
          scaleY: { duration: 0.4, repeat: Infinity },
          rotate: { duration: 0.8, repeat: Infinity }
        }}
      />
      
      {/* Dog Head - Alert and Happy */}
      <motion.circle
        cx="60"
        cy="45"
        r="22"
        fill="#8B4513"
        animate={{ 
          scale: [1, 1.05, 1],
          y: [-1, 1, -1]
        }}
        transition={{ 
          scale: { duration: 0.6, repeat: Infinity },
          y: { duration: 0.5, repeat: Infinity }
        }}
      />
      
      {/* Ears - Perky and Moving */}
      <motion.ellipse
        cx="45"
        cy="30"
        rx="8"
        ry="15"
        fill="#654321"
        animate={{ 
          rotate: [-15, -25, -15],
          scaleY: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 0.7, 
          repeat: Infinity,
          delay: 0.1
        }}
        style={{ transformOrigin: "45px 45px" }}
      />
      <motion.ellipse
        cx="75"
        cy="30"
        rx="8"
        ry="15"
        fill="#654321"
        animate={{ 
          rotate: [15, 25, 15],
          scaleY: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 0.7, 
          repeat: Infinity,
          delay: 0.2
        }}
        style={{ transformOrigin: "75px 45px" }}
      />
      
      {/* Eyes - Bright and Excited */}
      <motion.circle
        cx="52"
        cy="40"
        r="4"
        fill="#000000"
        animate={{ 
          scaleY: [1, 0.2, 1],
          y: [0, 2, 0]
        }}
        transition={{ 
          duration: 2.5, 
          repeat: Infinity,
          delay: 0.5
        }}
      />
      <motion.circle
        cx="68"
        cy="40"
        r="4"
        fill="#000000"
        animate={{ 
          scaleY: [1, 0.2, 1],
          y: [0, 2, 0]
        }}
        transition={{ 
          duration: 2.5, 
          repeat: Infinity,
          delay: 0.5
        }}
      />
      
      {/* Eye Sparkles */}
      <circle cx="54" cy="38" r="1.5" fill="white" opacity="0.9" />
      <circle cx="70" cy="38" r="1.5" fill="white" opacity="0.9" />
      
      {/* Nose - Active */}
      <motion.ellipse
        cx="60"
        cy="50"
        rx="3"
        ry="2"
        fill="#FF69B4"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />
      
      {/* Mouth - Big Happy Smile */}
      <motion.path
        d="M 50 55 Q 60 65 70 55"
        stroke="#000000"
        strokeWidth="2"
        fill="none"
        animate={{ 
          d: [
            "M 50 55 Q 60 65 70 55",
            "M 50 55 Q 60 68 70 55",
            "M 50 55 Q 60 65 70 55"
          ]
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      
      {/* Tongue - Hanging Out with Joy */}
      <motion.ellipse
        cx="60"
        cy="63"
        rx="4"
        ry="8"
        fill="#FF6B6B"
        animate={{ 
          scaleY: [1, 1.3, 1],
          y: [0, 2, 0]
        }}
        transition={{ duration: 0.4, repeat: Infinity }}
      />
      
      {/* Tail - Wagging Frantically */}
      <motion.path
        d="M 88 75 Q 100 60 95 45"
        stroke="#8B4513"
        strokeWidth="6"
        fill="none"
        animate={{ 
          d: [
            "M 88 75 Q 100 60 95 45",
            "M 88 75 Q 110 65 105 50",
            "M 88 75 Q 95 85 100 70",
            "M 88 75 Q 100 60 95 45"
          ]
        }}
        transition={{ duration: 0.25, repeat: Infinity }}
      />
      
      {/* Legs - Bouncy */}
      <motion.rect 
        x="40" y="98" width="5" height="15" 
        fill="#654321" rx="2.5"
        animate={{ scaleY: [1, 0.8, 1] }}
        transition={{ duration: 0.4, repeat: Infinity, delay: 0.1 }}
      />
      <motion.rect 
        x="52" y="98" width="5" height="15" 
        fill="#654321" rx="2.5"
        animate={{ scaleY: [1, 0.8, 1] }}
        transition={{ duration: 0.4, repeat: Infinity, delay: 0.2 }}
      />
      <motion.rect 
        x="68" y="98" width="5" height="15" 
        fill="#654321" rx="2.5"
        animate={{ scaleY: [1, 0.8, 1] }}
        transition={{ duration: 0.4, repeat: Infinity, delay: 0.3 }}
      />
      <motion.rect 
        x="80" y="98" width="5" height="15" 
        fill="#654321" rx="2.5"
        animate={{ scaleY: [1, 0.8, 1] }}
        transition={{ duration: 0.4, repeat: Infinity, delay: 0.4 }}
      />
      
      {/* Energy Particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.circle
          key={i}
          cx={40 + i * 15}
          cy={30 + (i % 2) * 20}
          r="2"
          fill="#22c55e"
          opacity="0.6"
          animate={{
            y: [-15, -30],
            opacity: [0.6, 0],
            scale: [0.5, 1.2, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeOut"
          }}
        />
      ))}
    </motion.svg>
  );
}

// HEALTHY DOG - Content and alert, sitting nicely
export function HealthyDog({ size, isHovered }: DogStateProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      animate={{
        scale: isHovered ? 1.05 : [0.99, 1.01, 0.99],
        rotate: isHovered ? [0, 2, -2, 0] : 0
      }}
      transition={{
        scale: { duration: 2.5, repeat: Infinity },
        rotate: { duration: 1.2, repeat: isHovered ? Infinity : 0 }
      }}
    >
      {/* Dog Body - Sitting Position */}
      <ellipse cx="60" cy="85" rx="26" ry="20" fill="#D2691E" />
      
      {/* Dog Head - Alert and Content */}
      <circle cx="60" cy="50" r="20" fill="#D2691E" />
      
      {/* Ears - Perky but Relaxed */}
      <motion.ellipse
        cx="45"
        cy="35"
        rx="7"
        ry="14"
        fill="#A0522D"
        animate={{ rotate: [-8, -2, -8] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{ transformOrigin: "45px 49px" }}
      />
      <motion.ellipse
        cx="75"
        cy="35"
        rx="7"
        ry="14"
        fill="#A0522D"
        animate={{ rotate: [8, 2, 8] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{ transformOrigin: "75px 49px" }}
      />
      
      {/* Eyes - Alert and Happy */}
      <motion.circle
        cx="53"
        cy="45"
        r="3.5"
        fill="#000000"
        animate={{ scaleY: [1, 0.1, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.circle
        cx="67"
        cy="45"
        r="3.5"
        fill="#000000"
        animate={{ scaleY: [1, 0.1, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* Eye Shine */}
      <circle cx="54.5" cy="43.5" r="1" fill="white" opacity="0.8" />
      <circle cx="68.5" cy="43.5" r="1" fill="white" opacity="0.8" />
      
      {/* Nose */}
      <ellipse cx="60" cy="55" rx="2.5" ry="2" fill="#000000" />
      
      {/* Mouth - Content Smile */}
      <path
        d="M 54 60 Q 60 64 66 60"
        stroke="#000000"
        strokeWidth="2"
        fill="none"
      />
      
      {/* Tail - Gentle Wag */}
      <motion.path
        d="M 86 80 Q 95 65 90 50"
        stroke="#D2691E"
        strokeWidth="5"
        fill="none"
        animate={{ 
          d: [
            "M 86 80 Q 95 65 90 50",
            "M 86 80 Q 100 70 95 55",
            "M 86 80 Q 95 65 90 50"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Front Legs - Sitting */}
      <rect x="48" y="95" width="4" height="18" fill="#A0522D" rx="2" />
      <rect x="68" y="95" width="4" height="18" fill="#A0522D" rx="2" />
      
      {/* Back Legs - Tucked */}
      <ellipse cx="45" cy="100" rx="6" ry="8" fill="#A0522D" />
      <ellipse cx="75" cy="100" rx="6" ry="8" fill="#A0522D" />
      
      {/* Content Breathing */}
      <motion.ellipse
        cx="60"
        cy="85"
        rx="20"
        ry="15"
        fill="none"
        stroke="#A0522D"
        strokeWidth="1"
        opacity="0.3"
        animate={{ 
          scaleX: [0.9, 1.1, 0.9],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.svg>
  );
}

// WILTING DOG - Getting tired, lying down but still aware
export function WiltingDog({ size, isHovered }: WiltingDogProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      animate={{
        y: [0, 2, 0],
        scale: [0.97, 1, 0.97]
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Dog Body - Lying Down */}
      <motion.ellipse
        cx="60"
        cy="90"
        rx="30"
        ry="16"
        fill="#BC9A6A"
        animate={{ scaleY: [0.9, 1.1, 0.9] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      {/* Dog Head - Resting on Paws */}
      <motion.ellipse
        cx="60"
        cy="55"
        rx="18"
        ry="20"
        fill="#BC9A6A"
        animate={{ 
          rotate: [-3, 3, -3],
          y: [0, 1, 0]
        }}
        transition={{ 
          rotate: { duration: 6, repeat: Infinity },
          y: { duration: 3, repeat: Infinity }
        }}
        style={{ transformOrigin: "60px 55px" }}
      />
      
      {/* Ears - Drooping */}
      <ellipse
        cx="48"
        cy="45"
        rx="6"
        ry="12"
        fill="#8B7355"
        transform="rotate(-25 48 45)"
      />
      <ellipse
        cx="72"
        cy="45"
        rx="6"
        ry="12"
        fill="#8B7355"
        transform="rotate(25 72 45)"
      />
      
      {/* Eyes - Half Closed/Sleepy */}
      <motion.ellipse
        cx="54"
        cy="50"
        rx="3"
        ry="1.5"
        fill="#4A4A4A"
        animate={{ scaleY: [0.4, 0.2, 0.4] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.ellipse
        cx="66"
        cy="50"
        rx="3"
        ry="1.5"
        fill="#4A4A4A"
        animate={{ scaleY: [0.4, 0.2, 0.4] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      {/* Nose */}
      <ellipse cx="60" cy="58" rx="2" ry="1.5" fill="#666666" />
      
      {/* Mouth - Tired Expression */}
      <line
        x1="57"
        y1="63"
        x2="63"
        y2="63"
        stroke="#4A4A4A"
        strokeWidth="1.5"
      />
      
      {/* Tail - Hanging Low */}
      <motion.path
        d="M 90 90 Q 100 100 95 110"
        stroke="#BC9A6A"
        strokeWidth="4"
        fill="none"
        animate={{ 
          d: [
            "M 90 90 Q 100 100 95 110",
            "M 90 90 Q 105 105 100 115",
            "M 90 90 Q 100 100 95 110"
          ]
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      
      {/* Legs - Tucked Under */}
      <ellipse cx="40" cy="105" rx="4" ry="6" fill="#8B7355" />
      <ellipse cx="52" cy="105" rx="4" ry="6" fill="#8B7355" />
      <ellipse cx="68" cy="105" rx="4" ry="6" fill="#8B7355" />
      <ellipse cx="80" cy="105" rx="4" ry="6" fill="#8B7355" />
      
      {/* Sleepy Indicators */}
      <motion.circle
        cx="75"
        cy="30"
        r="1.5"
        fill="#DDA0A0"
        opacity="0.6"
        animate={{ 
          scale: [0, 1.5, 0],
          opacity: [0, 0.6, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          delay: 1
        }}
      />
      <motion.circle
        cx="80"
        cy="25"
        r="1"
        fill="#DDA0A0"
        opacity="0.4"
        animate={{ 
          scale: [0, 1.2, 0],
          opacity: [0, 0.4, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          delay: 2
        }}
      />
      
      {/* Slow Breathing */}
      <motion.ellipse
        cx="60"
        cy="90"
        rx="25"
        ry="12"
        fill="none"
        stroke="#8B7355"
        strokeWidth="1"
        opacity="0.3"
        animate={{ 
          scaleX: [0.8, 1.2, 0.8],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.svg>
  );
}

// DYING DOG - Very sad, needs urgent care
export function DyingDog({ size, isHovered }: DogStateProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      animate={{
        opacity: [0.6, 0.8, 0.6],
        scale: [0.94, 1, 0.94]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Emergency Alert Circle */}
      <motion.circle
        cx="60"
        cy="60"
        r="55"
        fill="none"
        stroke="#ef4444"
        strokeWidth="1"
        strokeDasharray="3,3"
        opacity="0.3"
        animate={{ 
          scale: [0.9, 1.1, 0.9],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Dog Body - Completely Lying Down */}
      <ellipse cx="60" cy="95" rx="32" ry="12" fill="#A0A0A0" opacity="0.9" />
      
      {/* Dog Head - Resting on Ground */}
      <motion.ellipse
        cx="60"
        cy="65"
        rx="16"
        ry="18"
        fill="#A0A0A0"
        animate={{ 
          y: [0, 0.5, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Ears - Completely Flat */}
      <ellipse
        cx="48"
        cy="55"
        rx="5"
        ry="8"
        fill="#7A7A7A"
        transform="rotate(-40 48 55)"
        opacity="0.8"
      />
      <ellipse
        cx="72"
        cy="55"
        rx="5"
        ry="8"
        fill="#7A7A7A"
        transform="rotate(40 72 55)"
        opacity="0.8"
      />
      
      {/* Eyes - Closed/Very Tired */}
      <line
        x1="52"
        y1="62"
        x2="56"
        y2="62"
        stroke="#2A2A2A"
        strokeWidth="2"
        opacity="0.7"
      />
      <line
        x1="64"
        y1="62"
        x2="68"
        y2="62"
        stroke="#2A2A2A"
        strokeWidth="2"
        opacity="0.7"
      />
      
      {/* Nose */}
      <ellipse cx="60" cy="70" rx="1.5" ry="1" fill="#555555" opacity="0.8" />
      
      {/* Mouth - Very Sad */}
      <path
        d="M 56 75 Q 60 72 64 75"
        stroke="#2A2A2A"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      
      {/* Tail - Completely Down */}
      <path
        d="M 92 95 Q 100 105 105 115"
        stroke="#A0A0A0"
        strokeWidth="3"
        fill="none"
        opacity="0.7"
      />
      
      {/* Legs - Tucked and Weak */}
      <ellipse cx="40" cy="110" rx="3" ry="4" fill="#7A7A7A" opacity="0.7" />
      <ellipse cx="50" cy="110" rx="3" ry="4" fill="#7A7A7A" opacity="0.7" />
      <ellipse cx="70" cy="110" rx="3" ry="4" fill="#7A7A7A" opacity="0.7" />
      <ellipse cx="80" cy="110" rx="3" ry="4" fill="#7A7A7A" opacity="0.7" />
      
      {/* Very Slow Breathing */}
      <motion.ellipse
        cx="60"
        cy="95"
        rx="20"
        ry="8"
        fill="none"
        stroke="#7A7A7A"
        strokeWidth="1"
        opacity="0.3"
        animate={{ 
          scaleX: [0.7, 1.3, 0.7],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Concern/SOS Indicators */}
      <motion.text
        x="60"
        y="25"
        textAnchor="middle"
        fontSize="8"
        fill="#ef4444"
        opacity="0.6"
        animate={{ 
          opacity: [0.4, 0.8, 0.4],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity
        }}
      >
        💔
      </motion.text>
      
      {/* Help Indicators */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.circle
          key={i}
          cx={30 + i * 30}
          cy={25 + i * 5}
          r="1.5"
          fill="#ef4444"
          opacity="0.4"
          animate={{ 
            opacity: [0.2, 0.6, 0.2],
            y: [-2, 2, -2],
            scale: [0.6, 1.4, 0.6]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut"
          }}
        />
      ))}
    </motion.svg>
  );
}

// Fix missing interface
interface WiltingDogProps {
  size: number;
  isHovered: boolean;
}