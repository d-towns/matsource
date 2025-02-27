"use client";

import { motion } from "framer-motion";

export function GetStartedFooter() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="text-center"
    >
      <p className="text-gray-400">
        Have questions? Contact us at <span className="text-matsource-400">support@matsource.io</span>
      </p>
    </motion.div>
  );
} 