"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";

const blogPosts = [
  {
    title: "How AI is Revolutionizing the Service Industry",
    description: "Explore the transformative impact of artificial intelligence on service businesses and how it's reshaping customer expectations.",
    image: "/images/blog/ai-revolution.jpg",
    category: "Industry Insights",
    author: "Michael Chen",
    date: "May 15, 2023",
    readTime: "8 min read",
    slug: "ai-revolutionizing-service-industry",
    featured: true
  },
  {
    title: "5 Ways to Reduce No-Shows with Automated Reminders",
    description: "Learn how automated reminder systems can drastically cut down on appointment no-shows and increase your business efficiency.",
    image: "/images/blog/reduce-no-shows.jpg",
    category: "Best Practices",
    author: "Sarah Johnson",
    date: "June 3, 2023",
    readTime: "6 min read",
    slug: "reduce-no-shows-automated-reminders",
    featured: false
  },
  {
    title: "Streamlining Parts Procurement: A Guide for Auto Shops",
    description: "Discover how auto repair shops are cutting costs and saving time by implementing AI-powered parts procurement systems.",
    image: "/images/blog/parts-procurement.jpg",
    category: "Auto Repair",
    author: "David Rodriguez",
    date: "June 21, 2023",
    readTime: "7 min read",
    slug: "streamlining-parts-procurement",
    featured: false
  },
  {
    title: "The Future of Customer Communication in Skilled Trades",
    description: "Explore how technology is transforming how service businesses communicate with customers and what it means for your business.",
    image: "/images/blog/customer-communication.jpg",
    category: "Industry Insights",
    author: "Jennifer Williams",
    date: "July 8, 2023",
    readTime: "9 min read",
    slug: "future-customer-communication",
    featured: false
  },
  {
    title: "Maximizing Technician Productivity with Smart Scheduling",
    description: "Learn how AI scheduling can optimize your technicians' routes and time, increasing jobs completed per day while reducing burnout.",
    image: "/images/blog/technician-productivity.jpg",
    category: "Best Practices",
    author: "Robert Thompson",
    date: "July 25, 2023",
    readTime: "5 min read",
    slug: "maximizing-technician-productivity",
    featured: false
  },
  {
    title: "How Voice AI is Transforming Customer Service",
    description: "Discover how service businesses are using voice AI to handle customer calls more efficiently while improving satisfaction.",
    image: "/images/blog/voice-ai.jpg",
    category: "Technology",
    author: "Michael Chen",
    date: "August 10, 2023",
    readTime: "7 min read",
    slug: "voice-ai-transforming-customer-service",
    featured: false
  }
];

export default function BlogPage() {
  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
              Matsource Blog
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Insights, trends, and strategies to help service businesses thrive in the digital age
          </p>
        </motion.div>
        
        {/* Featured Post */}
        {featuredPost && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden mb-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-64 md:h-auto">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-matsource-500 text-white">
                    Featured
                  </Badge>
                </div>
              </div>
              
              <div className="p-8 flex flex-col justify-center">
                <Badge className="bg-gray-800 text-white w-fit mb-4">
                  {featuredPost.category}
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">{featuredPost.title}</h2>
                <p className="text-gray-400 mb-6">{featuredPost.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {featuredPost.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {featuredPost.readTime}
                  </div>
                </div>
                
                <Link 
                  href={`/blog/${featuredPost.slug}`}
                  className="text-matsource-400 hover:text-matsource-300 transition-colors inline-flex items-center group"
                >
                  Read article
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
        )}
        
        {/* Regular Posts */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {regularPosts.map((post) => (
            <motion.div 
              key={post.slug}
              variants={item}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-all"
            >
              <div className="relative h-48">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gray-800 text-white">
                    {post.category}
                  </Badge>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h3>
                <p className="text-gray-400 mb-4 text-sm line-clamp-3">{post.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {post.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {post.readTime}
                  </div>
                </div>
                
                <Link 
                  href={`/blog/${post.slug}`}
                  className="text-matsource-400 hover:text-matsource-300 transition-colors text-sm inline-flex items-center"
                >
                  Read article
                  <motion.span 
                    className="ml-2"
                    initial={{ x: 0 }}
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <ArrowRight className="w-3 h-3" />
                  </motion.span>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16 p-8 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Subscribe to our newsletter</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Get the latest industry insights, tips, and strategies delivered directly to your inbox.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button className="bg-primary hover:bg-primary/90 px-6 py-2 rounded-lg text-white font-medium transition-colors">
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 