'use client';

import { motion } from 'framer-motion';
import { Phone, Calendar, TrendingUp, Zap, DollarSign, FileText } from 'lucide-react';

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
    description: "Customers see ROI within the first month by recovering lost revenue from missed calls. Never lose another potential customer to voicemail again.",
    flairType: "chart",
    metrics: "ROI"
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

// Simplified Flair Components for Grid Layout
const PhoneFlair = () => (
  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
    <Phone className="w-8 h-8 text-white" />
  </div>
);

const CalendarFlair = () => (
  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
    <Calendar className="w-8 h-8 text-white" />
  </div>
);

const ChartFlair = ({ metrics }: { metrics?: string }) => (
  <div className="relative w-16 h-16">
    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
      <TrendingUp className="w-8 h-8 text-white" />
    </div>
    {metrics && (
      <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
        {metrics}
      </div>
    )}
  </div>
);

const IntegrationFlair = () => (
  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
    <Zap className="w-8 h-8 text-white" />
  </div>
);

const PricingFlair = () => (
  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
    <DollarSign className="w-8 h-8 text-white" />
  </div>
);

const FormFlair = () => (
  <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
    <FileText className="w-8 h-8 text-white" />
  </div>
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
    case 'form':
      return <FormFlair />;
    default:
      return <PhoneFlair />;
  }
};

function FeatureCard({ feature, index, className }: { feature: FeatureItem; index: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}
    >
      <div className="flex items-start gap-4 mb-4">
        <FlairComponent type={feature.flairType} metrics={feature.metrics} />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
            {feature.title}
          </h3>
        </div>
      </div>
      <p className="text-gray-600 leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  );
}

export default function ExpertiseGrid() {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-sans mb-4">
            Why Choose Us?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the features that make our AI voice agents the perfect solution for your business
          </p>
        </motion.div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              feature={feature} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
} 