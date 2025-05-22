'use client';

import { motion } from 'framer-motion';
import { Phone, Calendar, TrendingUp, Zap, DollarSign } from 'lucide-react';
import { BookDemoButton } from './BookDemoButton';
import { Card, CardContent, CardHeader } from './ui/card';

interface FeatureItem {
  title: string;
  description: string;
  flairType: 'phone' | 'calendar' | 'chart' | 'integration' | 'pricing';
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
  }
];

// Animated Flair Components
const PhoneFlair = () => (
  <motion.div className="relative">
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
      className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center"
    >
      <Phone className="w-6 h-6 text-white" />
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
      className="absolute inset-0 w-12 h-12 bg-green-400 rounded-full"
    />
  </motion.div>
);

const CalendarFlair = () => (
  <motion.div className="relative w-12 h-12">
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center"
    >
      <Calendar className="w-6 h-6 text-white" />
    </motion.div>
    <motion.div
      animate={{ 
        x: [0, 2, 0],
        y: [0, -1, 0]
      }}
      transition={{ 
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full"
    />
  </motion.div>
);

const ChartFlair = ({ metrics }: { metrics?: string }) => (
  <motion.div className="relative w-12 h-12">
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center"
    >
      <TrendingUp className="w-6 h-6 text-white" />
    </motion.div>
    {metrics && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full"
      >
        {metrics}
      </motion.div>
    )}
  </motion.div>
);

const IntegrationFlair = () => (
  <motion.div className="relative w-12 h-12">
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center"
    >
      <Zap className="w-6 h-6 text-white" />
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
      className="absolute inset-0 w-12 h-12"
    >
      <div className="absolute top-0 left-1/2 w-1 h-1 bg-purple-300 rounded-full transform -translate-x-1/2" />
      <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-purple-300 rounded-full transform -translate-x-1/2" />
      <div className="absolute left-0 top-1/2 w-1 h-1 bg-purple-300 rounded-full transform -translate-y-1/2" />
      <div className="absolute right-0 top-1/2 w-1 h-1 bg-purple-300 rounded-full transform -translate-y-1/2" />
    </motion.div>
  </motion.div>
);

const PricingFlair = () => (
  <motion.div className="relative w-12 h-12">
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center"
    >
      <DollarSign className="w-6 h-6 text-white" />
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
      className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center"
    >
      <span className="text-white text-xs font-bold">%</span>
    </motion.div>
  </motion.div>
);

const FlairComponent = ({ type, metrics }: { type: string; metrics?: string }) => {
  switch (type) {
    case 'phone':
      return <PhoneFlair />;
    case 'calendar':
      return <CalendarFlair />;
    case 'chart':
      return <ChartFlair metrics={metrics} />;
    case 'integration':
      return <IntegrationFlair />;
    case 'pricing':
      return <PricingFlair />;
    default:
      return <PhoneFlair />;
  }
};

export default function ExpertiseSection() {
  return (
    <section className="py-12 md:py-24 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex w-full items-center justify-between mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl font-bold font-sans text-left"
          >
            Why Choose Us?
          </motion.h2>
          <BookDemoButton />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -5,
                transition: { type: "spring", stiffness: 300 }
              }}
              className="h-full"
            >
              <Card className="h-full hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
                <CardHeader className="pb-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="mb-4"
                  >
                    <FlairComponent type={feature.flairType} metrics={feature.metrics} />
                  </motion.div>
                  <motion.h3 
                    className="text-lg md:text-xl font-bold font-sans text-gray-900 leading-tight"
                    whileHover={{ color: "#3B82F6" }}
                    transition={{ duration: 0.2 }}
                  >
                    {feature.title}
                  </motion.h3>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 font-sans leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 