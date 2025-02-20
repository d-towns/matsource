"use client";

import { LucideIcon, Phone, Search, BarChart } from "lucide-react";

type FeatureItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const features: FeatureItem[] = [
  {
    title: "Voice Automation",
    description: "Engage customers with integrated voice calling solutions designed to manage both incoming and outgoing calls efficiently.",
    icon: Phone
  },
  {
    title: "Semantic Search",
    description: "Utilize AI-driven semantic search to rapidly access crucial information from your technical resources.",
    icon: Search
  },
  {
    title: "Real-Time Analytics",
    description: "Monitor interactions in real-time and gain actionable insights to streamline your operations.",
    icon: BarChart
  }
];

export function Features() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Powerful features for service businesses
          </h2>
          <p className="text-lg text-gray-300">
            Everything you need to streamline your service operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="relative rounded-2xl backdrop-blur-sm border border-gray-800 bg-gray-900/40 p-8 hover:bg-gray-900/60 transition-colors group"
            >
              {/* Icon */}
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-matsource-500/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-matsource-500" />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-matsource-500 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </div>
              
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-matsource-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 