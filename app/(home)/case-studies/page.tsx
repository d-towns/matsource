"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight } from "lucide-react";

const industries = ["All", "Plumbing", "HVAC", "Electrical", "Automotive", "Construction"];

const caseStudies = [
  {
    title: "Johnson HVAC",
    industry: "HVAC",
    description: "35% increase in booked appointments and 25% reduction in scheduling errors with AI voice automation.",
    image: "/images/case-studies/hvac-case-study.jpg",
    stats: [
      { label: "Call Volume Handled", value: "100%" },
      { label: "Admin Hours Saved Weekly", value: "17+" },
      { label: "Revenue Increase", value: "28%" }
    ],
    logo: "/images/case-studies/johnson-logo.png",
    slug: "johnson-hvac"
  },
  {
    title: "Metro Electric",
    industry: "Electrical",
    description: "Automated 90% of parts procurement process, reducing ordering errors by 65% and saving over $3,800 monthly.",
    image: "/images/case-studies/electrical-case-study.jpg",
    stats: [
      { label: "Time Savings", value: "23 hrs/week" },
      { label: "Order Accuracy", value: "99.5%" },
      { label: "Cost Reduction", value: "$45,600/yr" }
    ],
    logo: "/images/case-studies/metro-logo.png",
    slug: "metro-electric"
  },
  {
    title: "Smith Plumbing",
    industry: "Plumbing",
    description: "Customer satisfaction increased 42% with proactive service updates and reduced service call times.",
    image: "/images/case-studies/plumbing-case-study.jpg",
    stats: [
      { label: "Customer Rating", value: "4.9/5" },
      { label: "Response Time", value: "-65%" },
      { label: "Repeat Business", value: "+37%" }
    ],
    logo: "/images/case-studies/smith-logo.png",
    slug: "smith-plumbing"
  },
  {
    title: "Quick Auto Repair",
    industry: "Automotive",
    description: "Reduced parts sourcing time by 85% and eliminated $37,000 in annual inventory waste with smart procurement.",
    image: "/images/case-studies/auto-case-study.jpg",
    stats: [
      { label: "Parts Ordered Daily", value: "120+" },
      { label: "Inventory Turnover", value: "+48%" },
      { label: "Profit Margin", value: "+12%" }
    ],
    logo: "/images/case-studies/quick-logo.png",
    slug: "quick-auto-repair"
  }
];

export default function CaseStudiesPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-white">
              Customer Success Stories
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            See how service businesses like yours are transforming operations and growing revenue with Matsource AI
          </p>
        </motion.div>
        
        <Tabs defaultValue="All" className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <TabsList className="bg-gray-900/50 backdrop-blur-sm border border-gray-800">
              {industries.map((industry) => (
                <TabsTrigger key={industry} value={industry}>
                  {industry}
                </TabsTrigger>
              ))}
            </TabsList>
          </motion.div>
          
          {industries.map((industry) => (
            <TabsContent key={industry} value={industry}>
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {caseStudies
                  .filter(study => industry === "All" || study.industry === industry)
                  .map((study) => (
                    <motion.div 
                      key={study.slug}
                      variants={item}
                      className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden hover:border-gray-600 transition-colors"
                    >
                      <div className="relative h-64">
                        <Image
                          src={study.image}
                          alt={study.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-4 left-4">
                          <Badge className="bg-primary text-white">
                            {study.industry}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-lg p-2 w-16 h-16 flex items-center justify-center">
                          <Image
                            src={study.logo}
                            alt={`${study.title} logo`}
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-2xl font-bold mb-2">{study.title}</h3>
                        <p className="text-gray-400 mb-4">{study.description}</p>
                        
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          {study.stats.map((stat, index) => (
                            <div key={index} className="text-center">
                              <div className="text-xl md:text-2xl font-bold text-primary">{stat.value}</div>
                              <div className="text-xs text-gray-500">{stat.label}</div>
                            </div>
                          ))}
                        </div>
                        
                        <Link 
                          href={`/case-studies/${study.slug}`}
                          className="inline-flex items-center text-matsource-400 hover:text-matsource-300 transition-colors group"
                        >
                          Read full case study
                          <motion.span 
                            className="ml-2"
                            initial={{ x: 0 }}
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </motion.span>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16 p-8 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to become our next success story?</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Join the growing list of service businesses transforming their operations with Matsource AI solutions.
          </p>
          <Link
            href="/get-started"
            className="bg-primary hover:bg-primary/90 px-6 py-3 rounded-lg text-white font-medium transition-colors inline-flex items-center"
          >
            Get Started
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 