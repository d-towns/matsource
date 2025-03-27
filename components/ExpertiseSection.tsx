'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { BookDemoButton } from './BookDemoButton';
import { Separator } from './ui/separator';

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
    <section className="py-12 md:py-24 px-4 md:px-6 lg:px-8 ">

      <div className="max-w-7xl mx-auto">
        <div className="flex w-full items-center justify-between mb-8">
          <h2 className="text-2xl md:text-4xl font-bold font-sans text-left">
            Why work with us?
          </h2>
          <BookDemoButton />
        </div>
        <div className="grid grid-cols-2 gap-x-10 gap-y-4 border rounded-lg p-8 shadow-lg">
          {/* Left Column - Company Name */}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-1 mb-4"
          >
            <h2 className="text-xl md:text-3xl font-bold font-sans">
              BlueAgent
            </h2>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-1 mb-4"
          >

            <h3 className="text-base md:text-xl mt-2 font-sans">
              Other Agencies
            </h3>
          </motion.div>
          <Separator orientation="horizontal" className="w-full col-span-2" />

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
                className="flex items-start gap-3 py-6"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5 text-green-500" />
                <span className="text-base md:text-lg">{item.us}</span>
              </motion.div>

              {/* Their Approach */}
              <motion.div 
                className="flex items-start gap-3 py-6"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <XCircle className="w-6 h-6 flex-shrink-0 mt-0.5 text-red-500" />
                <span className="text-base md:text-lg">{item.them}</span>
              </motion.div>
              {index !== comparisons.length - 1 && (
                <Separator orientation="horizontal" className="w-full col-span-2" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 