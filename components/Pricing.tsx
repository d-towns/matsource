"use client";

import { Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { BookDemoButton } from "./BookDemoButton";

export function Pricing() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const featureItem = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <section className="py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="text-black dark:text-white">Our</span>
            <span className="text-primary ml-4">Pricing</span>
          </h2>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Inbound Voice Agents Card */}
          <motion.div 
            variants={item}
            className="bg-white rounded-3xl shadow-lg overflow-hidden"
          >
            <div className="p-8 md:p-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Inbound Voice Agents</h3>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full">Receive Calls</span>
              </div>
              
              <h4 className="text-3xl font-bold mb-2 text-gray-900">Your automated digital receptionist. Available 24/7.</h4>
              
              <div className="mt-10 mb-10">
                <div className="flex items-baseline">
                  <h3 className="text-3xl font-bold text-black">Starting From $4,000</h3>
                  <span className="ml-2 text-gray-500">setup fee</span>
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
                  "Advanced Automations",
                  "Weekly Development Calls",
                  "Human Like Quality",
                  "Rigorous Testing",
                  "24/7 Priority Support",
                  "Latest AI Models"
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

          {/* Outbound Voice Agents Card */}
          <motion.div 
            variants={item}
            className="bg-gray-900 rounded-3xl shadow-lg overflow-hidden"
          >
            <div className="p-8 md:p-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Outbound Voice Agents</h3>
                <span className="bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-full">Send Calls</span>
              </div>
              
              <h4 className="text-3xl font-bold mb-2 text-white">
                <span className="text-gray-400">Fully automate</span> reminders, follow-ups & more.
              </h4>
              
              <div className="mt-10 mb-10">
                <div className="flex items-baseline">
                  <h3 className="text-3xl font-bold text-white">Starting From $4,000</h3>
                  <span className="ml-2 text-gray-400">setup fee</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center bg-white text-black rounded-full px-8 py-4 font-medium"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Get Started
              </motion.button>

              <motion.ul className="mt-10 space-y-4">
                {[
                  "Advanced Automations",
                  "Weekly Development Calls",
                  "Human Like Quality",
                  "Rigorous Testing",
                  "24/7 Priority Support",
                  "Latest AI Models"
                ].map((feature, index) => (
                  <motion.li 
                    key={feature}
                    variants={featureItem}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center text-gray-400"
                  >
                    <span className="w-2 h-2 bg-gray-500 rounded-full mr-4"></span>
                    {feature}
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>
        </motion.div>

        {/* Discovery Call CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 rounded-3xl border shadow-md p-8 flex flex-col md:flex-row justify-between items-center"
        >
          <h3 className="text-2xl font-bold mb-4 md:mb-0">Book Your AI Voice Agent Discovery Call Today.</h3>
          <BookDemoButton />
        </motion.div>
      </div>
    </section>
  );
} 