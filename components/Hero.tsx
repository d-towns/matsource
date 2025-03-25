"use client";

import { WaitlistWidget } from "@/components/WaitlistWidget";
import Link from "next/link";
import { ArrowRight, PhoneCallIcon } from "lucide-react";
import { motion } from "framer-motion";
import { FeatureTicker } from "@/components/FeatureTicker";
import { Button } from "@/components/ui/button";
// const industries = [
//   "Home Services",
//   "Auto Service",
//   "Contractors",
//   "Electrical"
// ];

// const cssLoader = `
// let head = document.getElementsByTagName('HEAD')[0];
// let link = document.createElement('link');
// link.rel = 'stylesheet';
// link.type = 'text/css';
// link.href = 'https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.css';
// head.appendChild(link);
// `

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
    "Smart Quotes",
    "Instant Customer Feedback",
    "Inbound Voice Calls",
    "Outbound Voice Calls",
    "Automated Parts Procurement",
    "24/7 Customer Support",
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
        <div className="container mx-auto px-4 text-center mt-8">
          <h1 className="text-4xl md:text-8xl font-bold mb-4 md:mb-6">
            <span
              className="font-sans font-medium"
            >
              Handle <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Real Calls</span><br />
              With Voice AI Agents.<br />
            </span>
          </h1>
          <p className="text-base md:text-xl mb-4 max-w-3xl mx-auto px-4">
          Qualify More Leads. Book More Appointments. Close More Deals
          </p>
          
          <div className="flex justify-center mb-8">
            <Link 
              href="https://www.contractormag.com/technology/article/21278738/three-ways-ai-is-powering-contracting-businesses" 
              className="text-sm md:text-base font-medium text-primary group relative px-2 py-1"
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
          <div className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Button 
                className="bg-gradient-to-r from-primary to-secondary text-white rounded-full px-8 py-6 relative overflow-hidden group"
                style={{
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  initial={false}
                  whileHover={{ opacity: 0.2 }}
                />
                <span className="text-white text-xl font-medium tracking-wide flex items-center ">
                  Book a Demo 
                  <motion.span
                    className="ml-3"
                    whileHover={{ rotate: 15 }}
                  >
                    <PhoneCallIcon className="w-5 h-5" />
                  </motion.span>
                </span>
              </Button>
            </motion.div>
          </div>
          
          {/* <WaitlistWidget /> */}
          
          <div className="mt-6 md:mt-10 w-full max-w-6xl mx-auto">
            <FeatureTicker features={features} />
          </div>
        </div>
          <>
        <div style={{position: "relative", paddingBottom: "31.25000000000001%", height: "0", width:'60%', marginTop:'76px'}}>
          <iframe src="https://www.loom.com/embed/5324cc3e6ca34aac95766faafddc52fc?sid=f535e952-aed5-45d3-8743-37bcb76a59d0" frameBorder="0" allowFullScreen style={{position: "absolute", top: "0", left: "0", width: "100%", height: "100%"}}></iframe>
        </div>
        </>
      </div>
    </section>
    </motion.div>
  );
}