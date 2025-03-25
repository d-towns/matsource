'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Blog } from '@/lib/models/blog';
import BlogCard from './BlogCard';

export default function BlogSection({ allPosts }: { allPosts: Blog[] }) {
  return (
    <motion.section
      className="py-24 px-4 md:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold text-left mb-4 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            Latest Insights
          </h2>
          <p className="  text-left w-full mx-auto">
            Stay informed about the latest developments in AI technology and how it's transforming businesses.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {allPosts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>
      </div>
    </motion.section>
  );
} 