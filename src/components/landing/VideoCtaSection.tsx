"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";

interface VideoCtaSectionProps {
  headline: string;
  description: string;
  buttonText: string;
  calendarLink: string;
}

export default function VideoCtaSection({
  headline,
  description,
  buttonText,
  calendarLink
}: VideoCtaSectionProps) {
  // Track button click for analytics
  const handleButtonClick = () => {
    // You can add Google Analytics or FB Pixel tracking here
    window.open(calendarLink, "_blank");
  };
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center p-8 bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Calendar className="w-12 h-12 text-matsource-500 mx-auto mb-6" />
          
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {headline}
          </h2>
          
          <p className="text-gray-300 mb-8">
            {description}
          </p>
          
          <motion.button
            onClick={handleButtonClick}
            className="bg-matsource-500 hover:bg-matsource-600 text-white font-semibold py-4 px-8 rounded-lg flex items-center justify-center mx-auto transition-all transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {buttonText}
            <ArrowRight className="ml-2 w-5 h-5" />
          </motion.button>
          
          <p className="text-sm text-gray-500 mt-6">
            Limited availability. Book your call now to secure your spot.
          </p>
        </motion.div>
      </div>
    </section>
  );
} 