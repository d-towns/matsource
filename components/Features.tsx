"use client";

import { LucideIcon, PhoneCall, FileSearch, BarChart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type FeatureItem = {
  id: string;
  title: string;
  headline: string;
  description: string;
  icon: LucideIcon;
  benefits: string[];
  demoUrl: string;
};

const features: FeatureItem[] = [
  {
    id: "voice-automation",
    title: "Voice Automation",
    headline: "Automate customer communications",
    description: "Let AI handle your inbound and outbound calls. Our voice automation system can schedule appointments, send reminders, answer FAQs, and follow up with customers - all while maintaining a natural, conversational tone.",
    icon: PhoneCall,
    benefits: [
      "24/7 automated call handling",
      "Natural language processing",
      "Appointment scheduling & reminders",
      "Customer satisfaction surveys"
    ],
    demoUrl: "/features/voice-automation-demo.gif"
  },
  {
    id: "parts-search",
    title: "Parts Search Engine",
    headline: "Find the right parts instantly",
    description: "Our intelligent search engine helps you quickly locate parts and materials across multiple suppliers. Get detailed specifications, pricing, and availability in real-time with our semantic search technology.",
    icon: FileSearch,
    benefits: [
      "Cross-supplier catalog search",
      "Real-time inventory & pricing",
      "Detailed part specifications",
      "Order history tracking"
    ],
    demoUrl: "/features/parts-search-demo.gif"
  },
  {
    id: "service-commerce",
    title: "Service Commerce",
    headline: "Streamline service booking",
    description: "Enable customers to book services, request quotes, and make payments online. Our e-commerce platform includes customizable forms, automated quotes, and detailed analytics to optimize your service offerings.",
    icon: BarChart,
    benefits: [
      "Online booking & scheduling",
      "Custom quote generators",
      "Secure payment processing",
      "Service performance analytics"
    ],
    demoUrl: "/features/service-commerce-demo.gif"
  }
];

export function Features() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Powerful features to transform your business
          </h2>
          <p className="text-lg text-gray-400">
            Everything you need to streamline operations and boost efficiency
          </p>
        </div>

        <Tabs defaultValue={features[0].id} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 h-auto bg-transparent mb-16 border-b border-gray-800">
            {features.map((feature) => (
              <TabsTrigger
                key={feature.id}
                value={feature.id}
                className={cn(
                  "flex flex-col items-center gap-3 p-6 border-2 border-transparent",
                  "data-[state=active]:border-matsource-500 data-[state=active]:bg-transparent",
                  "data-[state=active]:text-matsource-500",
                  "transition-all duration-200"
                )}
              >
                <feature.icon className="w-6 h-6" />
                <span className="font-medium">{feature.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {features.map((feature) => (
            <TabsContent 
              key={feature.id} 
              value={feature.id}
              className="mt-8"
            >
              <div className="flex gap-16 items-start justify-between">
                <div className="flex-1 space-y-8 self-center">
                  <h3 className="text-4xl font-bold">
                    {feature.headline}
                  </h3>
                  <p className="text-xl text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>

                  <button className="mt-8 px-8 py-3 bg-matsource-500 text-white rounded-full hover:bg-matsource-400 transition-colors text-lg font-medium">
                    Learn more
                  </button>
                </div>
                <div className=" rounded-xl overflow-hidden self-center">
                <ul className="space-y-4">
                    {feature.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-3 text-gray-300">
                        <div className="w-2 h-2 rounded-full bg-matsource-500" />
                        <span className="text-lg">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
} 