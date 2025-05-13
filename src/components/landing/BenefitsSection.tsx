"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, CheckCircle, DollarSign, LucideIcon } from "lucide-react";

interface Benefit {
  title: string;
  description: string;
  icon: string;
}

interface BenefitsSectionProps {
  benefits: Benefit[];
}

export default function BenefitsSection({ benefits }: BenefitsSectionProps) {
  // Map icon names to components
  const iconMap: Record<string, LucideIcon> = {
    Calendar,
    Clock,
    CheckCircle,
    DollarSign
  };
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          How Our AI Appointments System Works
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => {
            // Get the icon component or default to Calendar
            const Icon = iconMap[benefit.icon] || Calendar;
            
            return (
              <motion.div
                key={benefit.title}
                className="flex bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="mr-4 mt-1">
                  <div className="w-12 h-12 rounded-full bg-matsource-500/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-matsource-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button 
            onClick={() => {
              // Find the modal trigger button and click it
              const heroButton = document.querySelector("[data-modal-trigger]");
              if (heroButton instanceof HTMLElement) {
                heroButton.click();
              }
            }}
            className="bg-matsource-500 hover:bg-matsource-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Get Started Today
          </button>
        </motion.div>
      </div>
    </section>
  );
} 