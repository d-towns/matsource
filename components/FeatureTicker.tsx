"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Separator } from "./ui/separator";

interface FeatureTickerProps {
  features: string[];
  speed?: number; // pixels per second
}

export function FeatureTicker({ features, speed = 70 }: FeatureTickerProps) {
  const [contentWidth, setContentWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Measure container and content width
  useEffect(() => {
    if (containerRef.current && contentRef.current) {
      setContentWidth(contentRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (containerRef.current && contentRef.current) {
        setContentWidth(contentRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [features]);

  // Create a duplicate set of features for seamless loop
  const duplicatedFeatures = [...features, ...features];

  // Calculate animation duration based on content width and speed
  const duration = contentWidth / speed;

  return (
    <div className="relative overflow-hidden" ref={containerRef}>
      <motion.div
        ref={contentRef}
        className="flex whitespace-nowrap py-3"
        animate={{
          x: [-contentWidth / 2, -contentWidth],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration,
            ease: "linear",
          },
        }}
      >
        {duplicatedFeatures.map((feature, index) => (
          <>
          <div
            key={`${feature}-${index}`}
            className="inline-flex items-center mx-6 text-xs md:text-base text-gray-400"
          >
            {feature}
          </div>
          <Separator orientation="vertical" className="h-8 hidden md:block" />
          </>
        ))}
      </motion.div>
    </div>
  );
} 