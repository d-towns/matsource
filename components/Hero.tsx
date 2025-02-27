"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Script from 'next/script';

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
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % industries.length);
      }, 500); // Wait for exit animation
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
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
              className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
            >
              AI Automation Tools for{'  '} <br />
            </span>
            <AnimatePresence mode="wait">
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
            </AnimatePresence>
          </h1>
          <p className="text-base md:text-xl mb-8 md:mb-12 max-w-2xl mx-auto px-4">
            Boost revenue and save countless hours with AI-powered call automation and automated parts sourcing.
          </p>
          <div>
            <>
              <Script id="css-loader" type="" dangerouslySetInnerHTML={{ __html: cssLoader }}></Script>

              <Script id="js-loader" src="https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.js"></Script>
              <h3>We are currently in beta. Sign up for the waitlist to get early access.</h3>
              <div id="getWaitlistContainer" className="w-full justify-center" data-waitlist_id="25576" data-widget_type="WIDGET_2"></div>
            </>
          </div>
        </div>
        <div style={{position: "relative", paddingBottom: "31.25000000000001%", height: "0", width:'60%', marginTop:'76px'}}>
          <iframe src="https://www.loom.com/embed/c4f3f49fc91243f7b5a56732ec16b6f8?sid=675426df-d8a9-47b0-81e5-26aad5636ae2" frameBorder="0" allowFullScreen style={{position: "absolute", top: "0", left: "0", width: "100%", height: "100%"}}></iframe>
        </div>
      </div>
    </section>
  );
} 