'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  image: string;
  slug: string;
  core?: boolean;
}

const features: Feature[] = [
  {
    title: "Inbound Voice Calls",
    description: "Human-like virtual receptionist to handle your incoming calls.",
    image: "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dttps://images.unsplash.com/photo-1521119989659-a83eee488004",
    slug: "/solutions/inbound-voice-agents",
    core: true
  },
  {
    title: "Outbound Voice Calls",
    description: "Fully automate reminders, follow-ups & more.",
    image: "https://images.unsplash.com/photo-1598257006458-087169a1f08d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    slug: "/solutions/outbound-voice-agents",
    core: true
  },
    {
    title: "24/7 Customer Support",
    description: "Regular updates, performace boosts & fixes to ensure your agents run smoothly.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    slug: "/solutions/customer-support"
  },
  {
    title: "Smart Quotes",
    description: "Give your customers accurate quotes based on their needs.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    slug: "/solutions/inbound-voice-agents"
  },
  {
    title: "Automated Procurement",
    description: "Streamline your supply chain with Automated, AI-driven procurement workflows.",
    image: "https://images.unsplash.com/photo-1699549196390-e31bfc88536d?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    slug: "/solutions/automated-procurement",
    core: true
  },
];

export default function FeaturesGrid() {
  return (
    <motion.section 
      id="services"
      className="py-16 px-4 md:px-6 lg:px-8"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="flex justify-between items-center mb-12"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold font-sans">
            Our Services
          </h2>
          <span className=" bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
            {features.length} services
          </span>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`${feature.core ? 'md:col-span-2' : 'max-md:hidden'}`}
            >
              <Link href={feature.slug}>
                <motion.div 
                  className="group relative h-[400px] rounded-2xl overflow-hidden bg-gray-900 shadow-xl"
                  whileHover={{ 
                    scale: 1.03,
                    y: -5,
                  }}
                  transition={{ 
                    duration: 0.3,
                    type: "spring",
                    stiffness: 300,
                  }}
                >
                  <div className="absolute inset-0">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      quality={90}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/20" />
                  </div>
                  
                  <div className="relative h-full flex flex-col justify-end p-8 text-white">
                    <motion.h3 
                      className="text-2xl font-bold mb-3 font-sans"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {feature.title}
                    </motion.h3>
                    <motion.p 
                      className="text-gray-200 text-gray-300  leading-relaxed font-sans"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {feature.description}
                    </motion.p>
                    <motion.div 
                      className="mt-6 flex items-center text-sm font-medium text-white transition-colors duration-300"
                      whileHover={{ x: 5 }}
                    >
                      Get Started
                    <ArrowUpRight className="ml-2 w-4 h-4" />
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
} 