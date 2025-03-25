'use client';

import { motion } from 'framer-motion';
import { Check, CheckCircle, CheckCircle2, X, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { BookDemoButton } from './BookDemoButton';

interface ComparisonItem {
  us: string;
  them: string;
  description: string;
}

const comparisons: ComparisonItem[] = [
  {
    us: "Experienced AI Voice Developers",
    them: "Junior / Offshore Developers",
    description: "Our team of experienced AI engineers ensures top-quality solutions."
  },
  {
    us: "Innovative Development Practices",
    them: "Outdated Technologies & Approaches",
    description: "Using cutting-edge AI technology for superior results."
  },
  {
    us: "Complete Custom Development",
    them: "Generic / Copy & Paste Solutions",
    description: "Tailored solutions designed specifically for your business needs."
  },
  {
    us: "Client-Centric Approach",
    them: "Agency-Centric Approach",
    description: "We put your business needs first."
  },
  {
    us: "Rigorous Testing and Validation",
    them: "Limited Testing or Inadequate Quality Control",
    description: "Extensive validation ensures reliable and accurate performance."
  },
  {
    us: "Partners With Leading AI Voice Platforms",
    them: "No Access To Platforms, No Support",
    description: "Full access to the best AI platforms and dedicated support."
  }
];

export default function ExpertiseSection() {
  return (
    <section className="py-24 px-4 md:px-6 lg:px-8 ">

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between">
      <h2 className="text-4xl font-bold font-sans text-left mb-8">
        Why Work with Us?
      </h2>
      <BookDemoButton />
      </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-none gap-y-4 border rounded-lg p-8 shadow-lg">
          {/* Left Column - Company Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-1 mb-4"
          >
          <h2 className="text-3xl font-bold font-sans">
              BlueAgent
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-1 mb-4"
          >

            <h3 className="text-xl mt-2 font-sans">
              Other Development Agencies
            </h3>
          </motion.div>

          {/* Comparison Items */}
          {comparisons.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="contents"
            >
              {/* Our Approach */}
              <motion.div
                className="flex items-start gap-3 py-6 border-t"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5 text-green-500" />
                <span className="text-lg">{item.us}</span>
              </motion.div>

              {/* Their Approach */}
              <motion.div
                className="flex items-start gap-3 py-6 border-t"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <XCircle className="w-6 h-6 flex-shrink-0 mt-0.5 text-red-500" />
                <span className="text-lg">{item.them}</span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 