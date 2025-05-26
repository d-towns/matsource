'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface DotMatrixProps {
  rows?: number;
  cols?: number;
  dotSize?: number;
  spacing?: number;
  opacity?: number;
  animationDelay?: number;
  animated?: boolean;
  className?: string;
}

export function DotMatrix({
  rows = 20,
  cols = 30,
  dotSize = 2,
  spacing = 40,
  opacity = 0.3,
  animationDelay = 0.1,
  animated = true,
  className = ''
}: DotMatrixProps) {
  const dots = useMemo(() => {
    const dotArray = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        dotArray.push({
          id: `${row}-${col}`,
          x: col * spacing,
          y: row * spacing,
          delay: animated ? (row + col) * animationDelay : 0
        });
      }
    }
    return dotArray;
  }, [rows, cols, spacing, animationDelay, animated]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0"
        style={{ 
          minWidth: cols * spacing, 
          minHeight: rows * spacing 
        }}
      >
        {dots.map((dot) => {
          if (animated) {
            return (
              <motion.circle
                key={dot.id}
                cx={dot.x}
                cy={dot.y}
                r={dotSize}
                fill="currentColor"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, opacity, opacity * 0.3, opacity, 0]
                }}
                transition={{
                  duration: 4,
                  delay: dot.delay,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: "easeInOut"
                }}
              />
            );
          } else {
            return (
              <circle
                key={dot.id}
                cx={dot.x}
                cy={dot.y}
                r={dotSize}
                fill="currentColor"
                opacity={opacity}
              />
            );
          }
        })}
      </svg>
    </div>
  );
} 