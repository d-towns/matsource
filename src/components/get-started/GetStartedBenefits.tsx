"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface GetStartedBenefitsProps {
  benefits: string[];
}

export function GetStartedBenefits({ benefits }: GetStartedBenefitsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="backdrop-blur-sm rounded-xl border border-gray-800 p-6"
    >
      <h2 className="text-xl font-semibold mb-4">
        Waitlist Member Benefits
      </h2>
      
      <ul className="space-y-3">
        {benefits.map((benefit, index) => (
          <motion.li 
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
            className="flex items-start"
          >
            <CheckCircle className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
            <span>{benefit}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
} 