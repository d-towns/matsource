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
      
      {/* Add a subtle fade at the top */}
      <div className="absolute inset-x-0 top-0 h-32 " />
      
      {/* Add a stronger fade at the bottom */}
      <div className="absolute inset-x-0 bottom-0 h-64  to-transparent" />
      
      {/* Content */}
      <div className="relative pt-12 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold mb-6">
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
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Boost revenue and save countless hours with AI-powered call automation and automated parts sourcing.
          </p>
          <div>
          <>
<Script id="css-loader" type="" dangerouslySetInnerHTML={{__html: cssLoader}}></Script>

<Script id="js-loader" src="https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.js"></Script>
<h3>We are currently in beta. Sign up for the waitlist to get early access.</h3>
<div id="getWaitlistContainer" className="w-full justify-center"  data-waitlist_id="25576" data-widget_type="WIDGET_2"></div>
</>
          </div>
        </div>
      </div>
    </section>
  );
} 