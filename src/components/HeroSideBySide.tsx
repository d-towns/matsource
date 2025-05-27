"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { BookDemoButton } from "./BookDemoButton";
// import Ticker from "./Ticker/Ticker";

export function HeroSideBySide() {
//   const features = [
//     "Smart Quotes",
//     "Instant Customer Feedback",
//     "Inbound Voice Calls",
//     "Outbound Voice Calls",
//     "Automated Parts Procurement",
//     "24/7 Customer Support",
//     "Detailed Analytics"
//   ];

  return (
    <section className="relative min-h-screen flex items-center">
      {/* Content */}
      <div className="relative z-20 w-full">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-left relative z-30"
            >
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-4 md:mb-6">
                <span className="font-sans font-medium">
                  Convert <br />
                  <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                    Every Ring
                  </span>
                  <br />
                  Into Revenue.
                </span>
              </h1>
              
              <p className="text-base md:text-lg mb-6 max-w-xl">
                <span className="font-semibold">
                  24/7 AI voice agents that book jobs, follow up, and never miss a lead—trained on your scripts, running on your existing number.
                </span>
              </p>
              
              <div className="mb-8">
                <Link 
                  href="https://www.contractormag.com/technology/article/21278738/three-ways-ai-is-powering-contracting-businesses" 
                  className="text-sm md:text-base font-medium text-primary group relative inline-block px-2 py-1"
                >
                  <span className="relative z-10">
                    ContractorMag: How Skilled Trades businesses are using AI to save time and money.
                  </span>
                  
                  {/* Animated underline */}
                  <span className="absolute bottom-0 left-0 h-0.5 bg-primary/30 w-0 group-hover:w-full transition-all duration-300" />
                  
                  {/* Animated arrow */}
                  <motion.span 
                    className="inline-flex relative top-1 items-center ml-2"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </Link>
              </div>
              
              <div className="mb-8">
                <BookDemoButton />
              </div>
              
              {/* <div className="w-full max-w-2xl relative z-40">
                <Ticker items={features} />
              </div> */}
            </motion.div>

            {/* Right side - Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative z-10"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="relative"
              >
                <Image
                  src="/blueagent-hero-splash.png"
                  alt="MatBot AI Voice Agent Dashboard"
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-lg shadow-2xl"
                  priority
                />
                
                {/* Floating animation effect */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 -z-10"
                >
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur-xl opacity-50" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 