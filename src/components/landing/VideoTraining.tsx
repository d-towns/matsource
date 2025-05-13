"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

interface VideoTrainingProps {
  headline: string;
  highlightedText: string;
  videoId: string;
}

export default function VideoTraining({ headline, highlightedText, videoId }: VideoTrainingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState<string>("");
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if user came from form submission
    const leadSubmitted = localStorage.getItem("leadSubmitted") === "true";
    const paramName = searchParams?.get("name");
    const storedName = localStorage.getItem("leadName");
    
    // If we have a name parameter, use it and store it
    if (paramName) {
      setName(paramName);
      localStorage.setItem("leadName", paramName);
      setHasAccess(true);
    } 
    // If we have a stored name and lead submission flag, allow access
    else if (storedName && leadSubmitted) {
      setName(storedName);
      setHasAccess(true);
    } 
    // Otherwise redirect to landing page
    else {
      router.replace("/landing/ai-appointments");
    }
  }, [router, searchParams]);
  
  if (!hasAccess) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return (
    <div className="pt-12 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            {name && <span>Hi {name}! </span>}
            {headline}{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-matsource-400 to-blue-400">
              {highlightedText}
            </span>
          </h1>
          
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Watch the entire video to discover how service businesses like yours are automating customer acquisition.
          </p>
        </motion.div>
        
        <motion.div
          className="max-w-4xl mx-auto bg-gray-900 rounded-xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="aspect-w-16 aspect-h-9">
            {/* Replace with your video embed */}
            <iframe
              src={`https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0`}
              allow="autoplay; fullscreen; picture-in-picture"
              className="w-full h-full"
            ></iframe>
          </div>
          
          <div className="p-4 bg-gray-800 text-center">
            <p className="text-sm text-gray-300">
              <span className="text-red-400 font-semibold">IMPORTANT:</span> Watch the full video for access to our limited-time offer.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 