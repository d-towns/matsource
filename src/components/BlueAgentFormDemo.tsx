'use client';

import { motion } from 'framer-motion';
import { Phone, ArrowRight, Zap } from 'lucide-react';
import { useEffect } from 'react';

export default function BlueAgentFormDemo() {
  useEffect(() => {
    // Load the BlueAgent script if it hasn't been loaded already
    if (!document.querySelector('script[src="https://blueagent.co/loader.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://blueagent.co/loader.js';
      script.setAttribute('data-form-id', '977ef56f-048b-45a7-bd25-1ac9bc744782');
      document.head.appendChild(script);
    }
  }, []);

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <ArrowRight className="w-6 h-6 text-indigo-600" />
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold font-sans mb-4">
            See It In Action
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            This is an example of the smart contact forms you can embed on your website. 
            When a visitor fills this out, our AI instantly calls them back to book the appointment.
          </p>
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Live Demo Form</span>
          </div>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Get Your Free Quote
              </h3>
              <p className="text-gray-600">
                Fill out the form below and we'll call you back within minutes to discuss your project
              </p>
            </div>
            
            {/* BlueAgent Form */}
            <div id="blueagent-form-root"></div>
          </div>
        </motion.div>

        {/* Features Below Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Instant Callback</h4>
            <p className="text-sm text-gray-600">AI calls back within 30 seconds of form submission</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Smart Qualification</h4>
            <p className="text-sm text-gray-600">AI asks the right questions to qualify leads</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
              <ArrowRight className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Direct Booking</h4>
            <p className="text-sm text-gray-600">Appointments go straight to your calendar</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 