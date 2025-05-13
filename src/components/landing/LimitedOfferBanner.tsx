"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface LimitedOfferBannerProps {
  message: string;
  expiryDate: Date;
}

export default function LimitedOfferBanner({ message, expiryDate }: LimitedOfferBannerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +expiryDate - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [expiryDate]);
  
  return (
    <motion.div
      className="bg-matsource-900/80 border-t border-b border-matsource-800 py-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-6 text-center">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-matsource-400" />
            <span className="text-matsource-100 font-medium">{message}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-center">
              <span className="bg-gray-800 text-white text-sm px-2 py-1 rounded">
                {timeLeft.days.toString().padStart(2, '0')}
              </span>
              <span className="text-xs block mt-1">Days</span>
            </div>
            <div className="text-white">:</div>
            <div className="text-center">
              <span className="bg-gray-800 text-white text-sm px-2 py-1 rounded">
                {timeLeft.hours.toString().padStart(2, '0')}
              </span>
              <span className="text-xs block mt-1">Hours</span>
            </div>
            <div className="text-white">:</div>
            <div className="text-center">
              <span className="bg-gray-800 text-white text-sm px-2 py-1 rounded">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </span>
              <span className="text-xs block mt-1">Mins</span>
            </div>
            <div className="text-white">:</div>
            <div className="text-center">
              <span className="bg-gray-800 text-white text-sm px-2 py-1 rounded">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </span>
              <span className="text-xs block mt-1">Secs</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 