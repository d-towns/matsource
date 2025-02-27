"use client";

import { motion } from "framer-motion";
import { WaitlistWidget } from "@/components/WaitlistWidget";

export function GetStartedWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6"
    >
      <WaitlistWidget />
      
      <p className="text-sm text-gray-500 mt-4">
        We&apos;re launching in phases to ensure the best experience. 
        Your spot in line determines when you&apos;ll get access.
      </p>
    </motion.div>
  );
} 