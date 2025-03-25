"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type FAQItem = {
  question: string;
  answer: React.ReactNode;
};

const faqs: FAQItem[] = [
  {
    question: "What types of AI Voice Agents do you offer?",
    answer: "We specialize in building AI Voice Agents, for either inbound or outbound calls."
  },
  {
    question: "How do you handle project timelines?",
    answer: "We create detailed project timelines with clear milestones. Our project deadlines are met by coordinating all phases of the development process."
  },
  {
    question: "How do you ensure the quality of your projects?",
    answer: (
      <>
        <p>We have a minimum 2 week testing period for our AI Voice Agents. Our packages range from 2 weeks of testing to 6 weeks of testing.</p>
        <p className="mt-4">If you opt for our maintenance package, you will receive immediate upgrades & bug fixes.</p>
      </>
    )
  },
  {
    question: "How often will I receive updates on the project?",
    answer: "We will have at least 1 call per week to discuss the status of the project during its development & testing phase."
  },
  {
    question: "What is your development process like?",
    answer: "Our process involves initial consultation, planning, design, development, testing, and deployment. We follow agile methodologies to ensure flexibility and responsiveness."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        

        <div className="max-w-7xl mx-auto"><h2 className="text-4xl font-bold mb-16">Common Questions</h2>
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`${index === faqs.length - 1 ? 'border-t border-b' : 'border-t'} border-gray-200 py-6`}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="flex justify-between items-center w-full text-left"
              >
                <h3 className="text-xl font-medium">{faq.question}</h3>
                <span className="ml-6 flex-shrink-0">
                  {openIndex === index ? (
                    <span className="text-2xl">—</span>
                  ) : (
                    <span className="text-2xl">+</span>
                  )}
                </span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="py-4 text-lg text-gray-700 space-y-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 