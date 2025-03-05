"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building, Mail, MapPin, Phone } from "lucide-react";

const team = [
  {
    name: "Dr. Jason Miller",
    role: "Founder & CEO",
    bio: "Former MIT researcher specializing in AI applications for small businesses. Founded Matsource to bridge the technology gap for service industries.",
    image: "/images/team/jason-miller.jpg"
  },
  {
    name: "Sarah Chen",
    role: "CTO",
    bio: "Previously led AI development at Google. Expert in natural language processing and conversational AI systems.",
    image: "/images/team/sarah-chen.jpg"
  },
  {
    name: "Michael Rodriguez",
    role: "Head of Product",
    bio: "Former service business owner who understands the challenges firsthand. Focused on creating intuitive solutions that solve real problems.",
    image: "/images/team/michael-rodriguez.jpg"
  },
  {
    name: "Jennifer Park",
    role: "Customer Success Director",
    bio: "Passionate about helping service businesses transform through technology. Expert in change management and implementation.",
    image: "/images/team/jennifer-park.jpg"
  }
];

const values = [
  {
    title: "Practical Innovation",
    description: "We develop AI that solves real-world problems for service businesses, not technology for technology&apos;s sake."
  },
  {
    title: "Customer-First Approach",
    description: "Every feature we build starts with understanding the needs of service professionals and their customers."
  },
  {
    title: "Measurable Results",
    description: "We&apos;re obsessed with creating solutions that deliver clear ROI and measurable business improvements."
  },
  {
    title: "Continuous Improvement",
    description: "Our AI gets smarter with every interaction, adapting to each business&apos;s unique needs and challenges."
  }
];

const milestones = [
  {
    year: "2020",
    title: "The Idea",
    description: "After experiencing the inefficiencies in service businesses firsthand, our founder envisioned an AI solution tailored specifically for these industries."
  },
  {
    year: "2021",
    title: "Research & Development",
    description: "Our team spent a year researching service business workflows and developing specialized AI models for voice processing and service automation."
  },
  {
    year: "2022",
    title: "First Beta Customers",
    description: "We launched our beta with 5 local service businesses, refining our solution based on real-world feedback and data."
  },
  {
    year: "2023",
    title: "Major Platform Launch",
    description: "Matsource platform officially launched with voice, customer service, and parts procurement solutions for service businesses nationwide."
  },
  {
    year: "2024",
    title: "Expanding Our Impact",
    description: "Growing our team and capabilities to serve more businesses across diverse service industries and geographical regions."
  }
];

// export async function generateMetadata() {
//   return {
//     title: "About Matsource",
//     description: "Learn about our mission to transform service businesses with AI that works as hard as you do.",
//     openGraph: {
//       title: "About Matsource | Our Mission & Team",
//       description: "Learn about our mission to transform service businesses with AI that works as hard as you do.",
//       url: "https://matsource.io/about",
//       images: [
//         {
//           url: "/about-og-image.jpg",
//           width: 1200,
//           height: 630,
//           alt: "About Matsource Team",
//         },
//       ],
//     },
//     twitter: {
//       title: "About Matsource | Our Mission & Team",
//       description: "Learn about our mission to transform service businesses with AI that works as hard as you do.",
//       images: ["/about-twitter-image.jpg"],
//     },
//   };
// }

export default function AboutPage() {
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
              About Matsource
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We&apos;re on a mission to transform service businesses with AI that works as hard as you do
          </p>
        </motion.div>
        
        {/* Our Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Matsource was born from a simple observation: service businesses are the backbone of our communities, yet they&apos;re often the last to benefit from cutting-edge technology.
              </p>
              <p>
                Our founder, Dr. Jason Miller, witnessed this firsthand when his family&apos;s HVAC business struggled with inefficient systems that weren&apos;t designed for their unique needs. Despite advances in AI and automation, these powerful tools remained inaccessible to most service businesses.
              </p>
              <p>
                We set out to change that by building AI solutions specifically for service businesses - tools that understand your workflows, speak your industry language, and solve your unique challenges.
              </p>
              <p>
                Today, Matsource is helping service businesses across the country save time, reduce costs, and deliver exceptional customer experiences through accessible, powerful AI.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative h-80 md:h-96 rounded-xl overflow-hidden border border-gray-800"
          >
            <Image
              src="/images/about/company-story.jpg"
              alt="Matsource story"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </motion.div>
        </div>
        
        {/* Our Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, idx) => (
              <div key={`values-${idx}`} className="p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800">
                <h3 className="text-xl font-bold mb-3 text-matsource-400">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Our Team</h2>
          
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {team.map((member) => (
              <motion.div 
                key={member.name}
                variants={item}
                className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-all"
              >
                <div className="relative h-64">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-matsource-400 mb-3">{member.role}</p>
                  <p className="text-gray-400 text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        
        {/* Company Milestones */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Our Journey</h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-800 transform md:translate-x-px"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="relative"
                >
                  <div className={`md:w-1/2 ${idx % 2 === 0 ? 'md:ml-auto md:pl-8' : 'md:pr-8'}`}>
                    <div className="p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800">
                      <div className="text-matsource-400 font-bold mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                      <p className="text-gray-400">{milestone.description}</p>
                    </div>
                  </div>
                  
                  <div className={`absolute top-6 ${idx % 2 === 0 ? 'md:left-1/2 left-0' : 'md:left-1/2 left-0'} w-4 h-4 rounded-full bg-matsource-500 transform -translate-x-1/2 border-2 border-gray-900`}></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="text-gray-400 mb-6">
              Have questions about how Matsource can help your service business? We&apos;d love to hear from you.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-matsource-400 mt-1 mr-3" />
                <div>
                  <p className="font-medium">Headquarters</p>
                  <p className="text-gray-400">101 Innovation Drive, Suite 500</p>
                  <p className="text-gray-400">San Francisco, CA 94107</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-matsource-400 mr-3" />
                <p>contact@matsource.io</p>
              </div>
              
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-matsource-400 mr-3" />
                <p>(415) 555-0123</p>
              </div>
              
              <div className="flex items-center">
                <Building className="w-5 h-5 text-matsource-400 mr-3" />
                <p>Mon-Fri: 9AM - 6PM PST</p>
              </div>
            </div>
          </div>
          
          <div>
            <Link
              href="/get-started"
              className="block w-full bg-primary hover:bg-primary/90 px-6 py-4 rounded-lg text-white font-medium transition-colors text-center mb-6"
            >
              Schedule a Demo
            </Link>
            
            <div className="p-6 bg-gray-800/70 rounded-xl">
              <h3 className="text-xl font-bold mb-4">We&apos;re Hiring!</h3>
              <p className="text-gray-400 mb-4">
                Join our mission to transform service businesses with AI. We&apos;re looking for passionate people to join our growing team.
              </p>
              <Link 
                href="/careers"
                className="text-matsource-400 hover:text-matsource-300 transition-colors inline-flex items-center"
              >
                View open positions
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
          </div>
        </motion.div>
      </div>
    </div>
  );
} 