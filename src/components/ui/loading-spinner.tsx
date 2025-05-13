"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullPage?: boolean;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

export function LoadingSpinner({
  className,
  size = 'md',
  text = 'Loading...',
  fullPage = false,
}: LoadingSpinnerProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const spinnerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 100 }
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    },
  };

  const content = (
    <motion.div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        fullPage ? "h-[70vh]" : "py-10",
        className
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="relative"
        variants={spinnerVariants}
      >
        <Loader2 
          className={cn(
            "animate-spin text-primary",
            sizeMap[size]
          )} 
        />
        <motion.div 
          className={cn(
            "absolute rounded-full -inset-1 bg-primary/10",
            "animate-pulse"
          )} 
        />
      </motion.div>
      
      {text && (
        <motion.p 
          className="text-sm text-muted-foreground"
          variants={textVariants}
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );

  return content;
}

// Also export a specialized version for use as a Suspense fallback
export function SuspenseFallback() {
  return (
    <LoadingSpinner 
      size="md" 
      text="Loading content..." 
      className="py-8"
    />
  );
} 