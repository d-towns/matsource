"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    name: "Michael Johnson",
    company: "Johnson HVAC",
    text: "Our calendar went from half-full to completely booked in just 3 weeks. The AI handles everything so perfectly that customers think they're talking to a human.",
    image: "/images/testimonials/michael-johnson.jpg"
  },
  {
    name: "Sarah Rodriguez",
    company: "Metro Electric",
    text: "We're saving thousands on marketing while booking 35+ qualified appointments each month. The leads are pre-qualified, so our close rate has doubled.",
    image: "/images/testimonials/sarah-rodriguez.jpg"
  },
  {
    name: "David Smith",
    company: "Smith Plumbing",
    text: "I was skeptical at first, but the results speak for themselves. 42 booked appointments last month, and we didn't pay a dime until they were confirmed.",
    image: "/images/testimonials/david-smith.jpg"
  }
];

export default function SocialProofSection() {
  return (
    <section className="py-16 bg-gray-900/50">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Service Businesses Are Transforming Their Growth
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-400">{testimonial.company}</p>
                </div>
              </div>
              <p className="text-gray-300 italic">&quot;{testimonial.text}&quot;</p>
            </motion.div>
          ))}
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 mt-16 opacity-70">
          <Image src="/images/logos/service-titan.png" alt="ServiceTitan" width={120} height={40} />
          <Image src="/images/logos/housecall-pro.png" alt="Housecall Pro" width={120} height={40} />
          <Image src="/images/logos/jobber.png" alt="Jobber" width={100} height={40} />
          <Image src="/images/logos/service-fusion.png" alt="Service Fusion" width={120} height={40} />
        </div>
      </div>
    </section>
  );
} 