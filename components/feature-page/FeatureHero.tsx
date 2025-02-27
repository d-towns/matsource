"use client";

import { motion } from "framer-motion";

interface FeatureHeroProps {
  title: string;
  subtitle: string;
  description: string;
}

export function FeatureHero({ title, subtitle, description }: FeatureHeroProps) {
  return (
    <div className="pt-20 pb-12 md:pt-24 md:pb-16">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-white">
              {title}
            </span>
          </h1>
          
          <h2 className="text-xl md:text-2xl font-medium mb-6 bg-clip-text text-secondary-foreground">
            {subtitle}
          </h2>
          
          <p className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto">
            {description}
          </p>
        </motion.div>
      </div>
    </div>
  );
} 