"use client";

import { motion } from "framer-motion";
import { Rocket } from "lucide-react";

const featureItem = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 }
};

export function SupportMaintenanceCard() {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1 }
      }}
      initial="hidden"
      animate="show"
      className="bg-white rounded-3xl shadow-lg overflow-hidden"
    >
      <div className="p-8 md:p-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Support & Maintenance</h3>
          <span className="bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full">Not Required</span>
        </div>
        
        <h4 className="text-3xl font-bold mb-2 text-gray-900">Flexible packages to support your agent.</h4>
        
        <div className="mt-10 mb-10">
          <div className="flex items-baseline">
            <span className="text-lg text-gray-700 mr-2">Ranging from</span>
            <h3 className="text-3xl font-bold text-black">$1,000 - $2,500</h3>
            <span className="ml-2 text-gray-500">/m</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center bg-black text-white rounded-full px-8 py-4 font-medium"
        >
          <Rocket className="w-5 h-5 mr-2" />
          Get Started
        </motion.button>

        <motion.ul className="mt-10 space-y-4">
          {[
            "24/7 Monitoring",
            "24/7 Priority Support",
            "Monthly Update Calls",
            "Latest AI Upgrades",
            "Data Analysis",
            "Custom Dashboard"
          ].map((feature, index) => (
            <motion.li 
              key={feature}
              variants={featureItem}
              transition={{ delay: 0.1 * index }}
              className="flex items-center text-gray-700"
            >
              <span className="w-2 h-2 bg-gray-400 rounded-full mr-4"></span>
              {feature}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.div>
  );
} 