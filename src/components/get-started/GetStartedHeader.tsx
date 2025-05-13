"use client";

import { motion } from "framer-motion";

export function GetStartedHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-8"
    >
      <h1 className="text-3xl md:text-5xl font-bold mb-4">
        Join the {' '}
        <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
          BlueAgent
        </span>
        {' '}Waitlist
      </h1>
      
      <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
        Be among the first service businesses to transform your operations 
        with our AI-powered automation platform.
      </p>
    </motion.div>
  );
} 