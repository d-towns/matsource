"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function LandingFooter() {
  return (
    <motion.footer
      className="bg-gray-900/80 border-t border-gray-800 py-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center text-sm text-gray-500">
          <p className="mb-4">
            &copy; {new Date().getFullYear()} Matsource, Inc. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-gray-400 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
} 