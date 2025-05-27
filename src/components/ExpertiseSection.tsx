'use client';

import { motion, MotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { Phone, Calendar, TrendingUp, Zap, DollarSign, FileText } from 'lucide-react';
import { useRef } from 'react';

interface FeatureItem {
  title: string;
  description: string;
  flairType: 'phone' | 'calendar' | 'chart' | 'integration' | 'pricing' | 'form';
  metrics?: string;
}

const features: FeatureItem[] = [
  {
    title: "24/7 Instant Pick-Up",
    description: "Stop leaking leads—the AI answers on the first ring, day or night, so every caller talks to \"someone\" instead of voicemail.",
    flairType: "phone"
  },
  {
    title: "Booked Jobs, Not Just Leads",
    description: "Our agent asks the qualifying questions and drops the appointment straight into your calendar. No back-and-forth, no double-entry.",
    flairType: "calendar"
  },
  {
    title: "Proven ROI in 30 Days",
    description: "Clients recover $3–$6K a month in jobs they used to miss. One new water-heater install usually covers the subscription.",
    flairType: "chart",
    metrics: "$3-6K"
  },
  {
    title: "Plays Nicely With Your Stack",
    description: "Native, one-click sync with ServiceTitan, Jobber, QuickBooks, and Google Calendar—no Zapier hoops or CSV uploads.",
    flairType: "integration"
  },
  {
    title: "Minutes-Based Plans, No Surprise Bills",
    description: "Transparent bundles, 60% cheaper than human answering services, and overage alerts before you ever hit the cap.",
    flairType: "pricing"
  },
  {
    title: "Plug & Play Contact Forms",
    description: "Drop our smart forms into your existing 'Contact Us' page. When leads express interest, we instantly call them back and book the appointment—no waiting, no missed opportunities.",
    flairType: "form"
  }
];

function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

// Enhanced Animated Flair Components (larger and more elaborate)
const PhoneFlair = ({ parallaxY }: { parallaxY: MotionValue<number> }) => (
  <motion.div className="relative w-32 h-32" style={{ y: parallaxY }}>
    <motion.div
      animate={{ 
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl"
    >
      <Phone className="w-16 h-16 text-white" />
    </motion.div>
    <motion.div
      animate={{ 
        scale: [1, 1.5, 1],
        opacity: [0.7, 0, 0.7]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute inset-0 w-32 h-32 bg-green-400 rounded-2xl"
    />
    {/* Additional decorative elements */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      className="absolute -top-4 -right-4 w-8 h-8 border-4 border-green-300 rounded-full"
    />
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-200 rounded-full"
    />
  </motion.div>
);

const CalendarFlair = ({ parallaxY }: { parallaxY: MotionValue<number> }) => (
  <motion.div className="relative w-32 h-32" style={{ y: parallaxY }}>
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl"
    >
      <Calendar className="w-16 h-16 text-white" />
    </motion.div>
    <motion.div
      animate={{ 
        x: [0, 8, 0],
        y: [0, -4, 0]
      }}
      transition={{ 
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute -top-2 -right-2 w-8 h-8 bg-orange-400 rounded-full shadow-lg"
    />
    <motion.div
      animate={{ 
        rotate: [0, 180, 360]
      }}
      transition={{ 
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }}
      className="absolute -bottom-4 -left-4 w-6 h-6 border-2 border-blue-300 rounded-full"
    />
  </motion.div>
);

const ChartFlair = ({ parallaxY, metrics }: { parallaxY: MotionValue<number>; metrics?: string }) => (
  <motion.div className="relative w-32 h-32" style={{ y: parallaxY }}>
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl"
    >
      <TrendingUp className="w-16 h-16 text-white" />
    </motion.div>
    {metrics && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="absolute -top-4 -right-4 bg-green-500 text-white text-lg font-bold px-3 py-2 rounded-xl shadow-lg"
      >
        {metrics}
      </motion.div>
    )}
    <motion.div
      animate={{ 
        y: [0, -10, 0],
        opacity: [0.5, 1, 0.5]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-8 bg-emerald-300 rounded-full"
    />
  </motion.div>
);

const IntegrationFlair = ({ parallaxY }: { parallaxY: MotionValue<number> }) => (
  <motion.div className="relative w-32 h-32" style={{ y: parallaxY }}>
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl"
    >
      <Zap className="w-16 h-16 text-white" />
    </motion.div>
    <motion.div
      animate={{ 
        rotate: 360
      }}
      transition={{ 
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }}
      className="absolute inset-0 w-32 h-32"
    >
      <div className="absolute top-0 left-1/2 w-3 h-3 bg-purple-300 rounded-full transform -translate-x-1/2" />
      <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-purple-300 rounded-full transform -translate-x-1/2" />
      <div className="absolute left-0 top-1/2 w-3 h-3 bg-purple-300 rounded-full transform -translate-y-1/2" />
      <div className="absolute right-0 top-1/2 w-3 h-3 bg-purple-300 rounded-full transform -translate-y-1/2" />
    </motion.div>
    <motion.div
      animate={{ 
        scale: [1, 1.3, 1],
        rotate: [0, 90, 180, 270, 360]
      }}
      transition={{ 
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute -top-6 -right-6 w-4 h-4 bg-yellow-400 rounded-sm"
    />
  </motion.div>
);

const PricingFlair = ({ parallaxY }: { parallaxY: MotionValue<number> }) => (
  <motion.div className="relative w-32 h-32" style={{ y: parallaxY }}>
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="w-32 h-32 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl"
    >
      <DollarSign className="w-16 h-16 text-white" />
    </motion.div>
    <motion.div
      animate={{ 
        scale: [1, 1.2, 1]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute -top-2 -right-2 w-10 h-10 bg-green-400 rounded-full flex items-center justify-center shadow-lg"
    >
      <span className="text-white text-lg font-bold">%</span>
    </motion.div>
    <motion.div
      animate={{ 
        x: [0, 10, 0],
        rotate: [0, 15, -15, 0]
      }}
      transition={{ 
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute -bottom-4 -left-4 w-8 h-8 bg-amber-200 rounded-lg"
    />
  </motion.div>
);

const FormFlair = ({ parallaxY }: { parallaxY: MotionValue<number> }) => (
  <motion.div className="relative w-32 h-32" style={{ y: parallaxY }}>
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="w-32 h-32 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl"
    >
      <FileText className="w-16 h-16 text-white" />
    </motion.div>
    <motion.div
      animate={{ 
        y: [0, -8, 0],
        opacity: [0.5, 1, 0.5]
      }}
      transition={{ 
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full shadow-lg"
    />
    <motion.div
      animate={{ 
        scale: [1, 1.3, 1],
        opacity: [0.3, 0.8, 0.3]
      }}
      transition={{ 
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1
      }}
      className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-300 rounded-full"
    />
    <motion.div
      animate={{ 
        rotate: [0, 360]
      }}
      transition={{ 
        duration: 6,
        repeat: Infinity,
        ease: "linear"
      }}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-indigo-200 rounded-full opacity-30"
    />
  </motion.div>
);

const FlairComponent = ({ type, metrics, parallaxY }: { type: string; metrics?: string; parallaxY: MotionValue<number> }) => {
  switch (type) {
    case 'phone':
      return <PhoneFlair parallaxY={parallaxY} />;
    case 'calendar':
      return <CalendarFlair parallaxY={parallaxY} />;
    case 'chart':
      return <ChartFlair parallaxY={parallaxY} metrics={metrics} />;
    case 'integration':
      return <IntegrationFlair parallaxY={parallaxY} />;
    case 'pricing':
      return <PricingFlair parallaxY={parallaxY} />;
    case 'form':
      return <FormFlair parallaxY={parallaxY} />;
    default:
      return <PhoneFlair parallaxY={parallaxY} />;
  }
};

function FeatureSection({ feature, index }: { feature: FeatureItem; index: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useParallax(scrollYProgress, 50); // Smooth parallax with 50px movement

  return (
    <section 
      ref={ref}
      className="img-container min-h-screen flex items-center justify-center px-4 md:px-8 lg:px-16"
    >
      <div className="max-w-7xl mx-auto w-full h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
          {/* Flair Side */}
          <motion.div 
            className="flex justify-center lg:justify-end order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.8 }}
          >
            <FlairComponent type={feature.flairType} metrics={feature.metrics} parallaxY={y} />
          </motion.div>

          {/* Content Side */}
          <motion.div 
            className="order-1 lg:order-2 text-center lg:text-left"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
          >
            <motion.h3 
              className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-gray-900 mb-6 leading-tight"
              whileHover={{ color: "#3B82F6" }}
              transition={{ duration: 0.2 }}
            >
              {feature.title}
            </motion.h3>
            <p className="text-lg md:text-xl text-gray-600 font-sans leading-relaxed mb-8 max-w-2xl">
              {feature.description}
            </p>
            {/* <div className="flex justify-center lg:justify-start">
              <BookDemoButton />
            </div> */}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function ExpertiseSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      <style jsx global>{`
        .expertise-scroll-container {
          height: 100vh;
          overflow-y: scroll;
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
        }
        
        .expertise-scroll-container .img-container {
          scroll-snap-align: start;
          scroll-snap-stop: always;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Hide scrollbar but keep functionality */
        .expertise-scroll-container::-webkit-scrollbar {
          display: none;
        }
        .expertise-scroll-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      <div 
        ref={containerRef}
        className="expertise-scroll-container"
      >
        {/* Header Section */}
        <section className="img-container px-4 md:px-6 lg:px-8 mb-44">
          <div className="max-w-7xl mx-auto text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold font-sans mb-4"
            >
              Why Choose Us?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Discover the features that make our AI voice agents the perfect solution for your business
            </motion.p>
          </div>
        </section>

        {/* Feature Sections */}
        {features.map((feature, index) => (
          <FeatureSection key={index} feature={feature} index={index} />
        ))}

        {/* Progress Bar */}
        <motion.div 
          className="progress fixed left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary bottom-8 mx-4 rounded-full z-50"
          style={{ scaleX, transformOrigin: "0%" }}
        />
      </div>
    </>
  );
} 