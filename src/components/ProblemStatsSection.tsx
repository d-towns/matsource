'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { PhoneOff, TrendingDown, DollarSign } from 'lucide-react';

// Custom hook for counting animation
function useCountUp(end: number, duration: number = 2000, shouldStart: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(end * easeOutQuart));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, shouldStart]);

  return count;
}

const StatCard = ({ 
  icon: Icon, 
  value, 
  suffix, 
  label, 
  description, 
  delay = 0,
  isInView 
}: {
  icon: any;
  value: number;
  suffix: string;
  label: string;
  description: string;
  delay?: number;
  isInView: boolean;
}) => {
  const animatedValue = useCountUp(value, 2000, isInView);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
      transition={{ 
        duration: 0.8, 
        delay: delay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      className="relative group"
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
      
      <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        {/* Icon with pulse animation */}
        <motion.div
          animate={isInView ? { 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          } : {}}
          transition={{ 
            duration: 2, 
            delay: delay + 0.5,
            repeat: Infinity,
            repeatDelay: 3
          }}
          className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg"
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.div>

        {/* Animated number */}
        <div className="mb-4">
          <motion.span 
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            animate={isInView ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.5, delay: delay + 1 }}
          >
            {animatedValue}
          </motion.span>
          <span className="text-3xl md:text-4xl font-bold text-primary">{suffix}</span>
        </div>

        {/* Label */}
        <motion.h3 
          className="text-xl md:text-2xl font-bold text-gray-800 mb-3"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: delay + 1.2 }}
        >
          {label}
        </motion.h3>

        {/* Description */}
        <motion.p 
          className="text-gray-600 text-sm md:text-base leading-relaxed"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: delay + 1.4 }}
        >
          {description}
        </motion.p>

        {/* Animated border */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-transparent opacity-0 group-hover:opacity-100"
          style={{ 
            background: 'linear-gradient(white, white) padding-box, linear-gradient(45deg, #1264ed, #ED9B12) border-box',
            border: '2px solid transparent'
          }}
          animate={isInView ? { 
            background: [
              'linear-gradient(white, white) padding-box, linear-gradient(45deg, #1264ed, #ED9B12) border-box',
              'linear-gradient(white, white) padding-box, linear-gradient(90deg, #ED9B12, #1264ed) border-box',
              'linear-gradient(white, white) padding-box, linear-gradient(135deg, #1264ed, #ED9B12) border-box'
            ]
          } : {}}
          transition={{ duration: 3, repeat: Infinity, delay: delay + 2 }}
        />
      </div>
    </motion.div>
  );
};

export default function ProblemStatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    {
      icon: PhoneOff,
      value: 62,
      suffix: "%",
      label: "Calls Unanswered",
      description: "Almost two-thirds of calls to contractors ring out or hit voicemail"
    },
    {
      icon: TrendingDown,
      value: 85,
      suffix: "%",
      label: "Gone Forever",
      description: "When you miss a call, 8 out of 10 prospects move on to a competitor"
    },
    {
      icon: DollarSign,
      value: 120,
      suffix: "k",
      label: "Lost per Truck/Year",
      description: "Just two missed jobs a day can drain $10k a month from a single team"
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
            className="inline-block mb-6"
          >
            <div className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wider shadow-lg">
              The Problem
            </div>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Your Business is{' '}
            <motion.span
              className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              animate={isInView ? { 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              } : {}}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Bleeding Money
            </motion.span>
          </h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Every missed call is a lost opportunity. Here&apos;s the harsh reality of what&apos;s happening to your business right now.
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              {...stat}
              delay={index * 0.2}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-center mt-16"
        >
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Stop the Bleeding with 24/7 AI Answering
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              Never miss another call. Never lose another customer. Our AI agents answer every call, every time.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <button className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started Today
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 