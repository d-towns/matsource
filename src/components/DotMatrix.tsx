'use client';

interface DotMatrixProps {
  dotSize?: number;
  spacing?: number;
  opacity?: number;
  className?: string;
}

export function DotMatrix({
  dotSize = 1,
  spacing = 40,
  opacity = 0.5,
  className = ''
}: DotMatrixProps) {
  return (
    <div 
      className={`absolute inset-0 ${className}`}
      style={{
        backgroundImage: `radial-gradient(currentColor ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: `${spacing}px ${spacing}px`,
        opacity: opacity
      }}
    />
  );
} 