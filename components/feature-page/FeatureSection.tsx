"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface FeatureSectionProps {
  title: string;
  description: string;
  image: string;
  alt: string;
  index: number;
  bulletPoints?: string[];
}

export function FeatureSection({ 
  title, 
  description, 
  image, 
  alt, 
  index,
  bulletPoints = []
}: FeatureSectionProps) {
  // Alternate layout based on index (even/odd)
  const isEven = index % 2 === 0;
  
  return (
    <div className="py-16 md:py-24">
      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center",
      )}>
        {/* Image column */}
        <div className={cn(
          "order-1", 
          isEven ? "md:order-1" : "md:order-2"
        )}>
          <motion.div 
            className="relative h-64 md:h-96 rounded-xl overflow-hidden border border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Image
              src={image}
              alt={alt}
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
        
        {/* Content column */}
        <div className={cn(
          "order-2",
          isEven ? "md:order-2" : "md:order-1"
        )}>
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h3 className="text-2xl md:text-3xl font-bold">{title}</h3>
            <p className="text-gray-800">{description}</p>
            
            {bulletPoints.length > 0 && (
              <ul className="mt-6 space-y-2">
                {bulletPoints.map((point, i) => (
                  <li key={i} className="flex items-start">
                    <span className="flex-shrink-0 w-1.5 h-1.5 mt-2 bg-matsource-500 rounded-full mr-2"></span>
                    <span className="text-gray-800">{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
} 