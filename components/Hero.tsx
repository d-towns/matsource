"use client";

import { useEffect, useState } from "react";
import { WaitlistWidget } from "@/components/WaitlistWidget";
import Link from "next/link";
import { ArrowRight} from "lucide-react";
import { motion } from "framer-motion";
import { FeatureTicker } from "@/components/FeatureTicker";

const industries = [
  "Home Services",
  "Auto Service",
  "Contractors",
  "Electrical"
];

const cssLoader = `
let head = document.getElementsByTagName('HEAD')[0];
let link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.css';
head.appendChild(link);
`

export function Hero() {
  // const [currentIndex, setCurrentIndex] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTimeout(() => {
  //       setCurrentIndex((prev) => (prev + 1) % industries.length);
  //     }, 500); // Wait for exit animation
  //   }, 3000); // Change every 3 seconds

  //   return () => clearInterval(interval);
  // }, []);

  const features = [
    "Inbound & outbound AI voice calls",
    "Automated Parts Procurement",
    "Job Management",
    "Smart Quotes",
    "Instant Customer Feedback",
    "Service Notifications",
    "Automated Invoicing",
    "Detailed Analytics"
  ];

  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <section className="relative">
      {/* Gradient background with fade to black */}
      <div className="absolute inset-0 
       
       
       
        from-purple-900/90 via-blue-900/50 to-transparent"
      />

      {/* Content */}
      <div className="relative flex flex-col items-center pt-8 md:pt-12 pb-16 md:pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6">
            <span
              className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-white"
            >
              Reclaim Your Time.<br />
              Reclaim Your Profits.<br />
            </span>
            {/* <AnimatePresence mode="wait">
              <motion.span
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: "spring", stiffness: 200, damping: 20
                  }
                }}
                exit={{ opacity: 0, y: -20 }}
                className="inline-block bg-clip-text"
              >
                {industries[currentIndex]}
              </motion.span>
            </AnimatePresence> */}
          </h1>
          <p className="text-base md:text-xl mb-4 max-w-3xl mx-auto px-4">
          AI-Powered Efficiency for Service Businesses: Dispatch Smarter, Serve Faster, Profit More.
          </p>
          
          <div className="flex justify-center mb-8">
            <Link 
              href="https://www.contractormag.com/technology/article/21278738/three-ways-ai-is-powering-contracting-businesses" 
              className="text-sm md:text-base font-medium text-matsource-400 group relative px-2 py-1"
            >
              <span className="relative z-10">
                How Skilled Trades businesses are using AI to save time and money.
              </span>
              
              {/* Animated underline */}
              <span className="absolute bottom-0 left-0 h-0.5 bg-matsource-400/30 w-0 group-hover:w-full transition-all duration-300" />
              
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
            {/* <div className="md:hidden mt-8">
          <Link
            href="https://www.loom.com/share/c4f3f49fc91243f7b5a56732ec16b6f8"
            className="inline-flex items-center text-matsource-400 hover:text-matsource-300 transition-colors"
          >
            <motion.span
              className="flex items-center gap-2"
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <PlayCircle className="w-5 h-5" />
              <span>Watch our demo video</span>
            </motion.span>
          </Link>
        </div> */}
          </div>
          
          <WaitlistWidget />
          
          <div className="mt-6 md:mt-10 w-full max-w-6xl mx-auto bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800">
            <FeatureTicker features={features} />
          </div>
        </div>
        {/* <Link
            href="https://www.loom.com/share/c4f3f49fc91243f7b5a56732ec16b6f8"
            className="inline-flex items-center text-matsource-400 hover:text-matsource-300 transition-colors"
          >
            <motion.span
              className="flex items-center gap-2"
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <PlayCircle className="w-5 h-5" />
              <span>Watch our demo video</span>
            </motion.span>
          </Link> */}
          <>
        <div style={{position: "relative", paddingBottom: "31.25000000000001%", height: "0", width:'60%', marginTop:'76px'}}>
          <iframe src="https://www.loom.com/embed/c4f3f49fc91243f7b5a56732ec16b6f8?sid=675426df-d8a9-47b0-81e5-26aad5636ae2" frameBorder="0" allowFullScreen style={{position: "absolute", top: "0", left: "0", width: "100%", height: "100%"}}></iframe>
        </div>
        </>
      </div>
    </section>
    </motion.div>
  );
} 