"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import LeadCaptureModal from "./LeadCaptureModal";

interface LandingHeroProps {
  headline: string;
  subheadline: string;
  ctaText: string;
}

export default function LandingHero({ headline, subheadline, ctaText }: LandingHeroProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="relative pt-20 pb-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-600 rounded-full filter blur-3xl" />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {headline}
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {subheadline}
          </motion.p>
          
          <motion.button
            className="bg-matsource-500 hover:bg-matsource-600 text-white font-bold py-4 px-8 rounded-lg text-lg md:text-xl transition-all transform hover:scale-105 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onClick={() => setIsModalOpen(true)}
          >
            {ctaText}
          </motion.button>
        </div>
      </div>
      
      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
} 