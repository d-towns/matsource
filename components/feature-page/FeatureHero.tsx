"use client";

import { motion } from "framer-motion";
import { BookDemoButton } from "../BookDemoButton";
import Ticker from "../Ticker/Ticker";


const businessUseCases = [
  "Plumbers",
  "Electricians",
  "Carpenters",
  "Painters",
  "Real Estate",
  "Insurance",
  "Financial Services",
  "Restaurants",
  "Hospitality",
  "Legal",
  "Healthcare"
]

interface FeatureHeroProps {
  title: string;
  subtitle: string;
  description: string;
}

export function FeatureHero({ title, description }: FeatureHeroProps) {
  return (
    <div className="pt-20 pb-12 md:pt-24 md:pb-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="">
              {title}
            </span>
          </h1>
        
          
          <p className="text-base md:text-lg max-w-3xl mx-auto">
            {description}
          </p>
          <div className="mt-8">
            <BookDemoButton />
          </div>
          <div className="mt-8">
            <Ticker items={businessUseCases} />
          </div>
        </motion.div>
      </div>
    </div>
  );
} 