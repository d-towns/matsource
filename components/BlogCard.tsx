'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Blog } from '@/lib/models/blog';

export default function BlogCard({ post, index }: { post: Blog, index: number }) {
  return (
<motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`${post.featured ? 'lg:col-span-3 lg:gap-8' : ''}`}
            >
              <Link href={`/blog/${post.slug}`} className="block group">
                <motion.div
                  className={`relative overflow-hidden rounded-2xl bg-white shadow-lg ${
                    post.featured ? 'h-[300px] lg:h-[400px]' : 'h-[240px]'
                  }`}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <Image
                    src={post.images[0]}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    quality={90}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl md:text-2xl font-bold mb-2 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-200 text-sm line-clamp-2">
                      {post.subtitle}
                    </p>
                    <motion.div 
                      className="mt-4 inline-flex items-center font-medium"
                      whileHover={{ x: 5 }}
                    >
                      Read More
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
  );
}