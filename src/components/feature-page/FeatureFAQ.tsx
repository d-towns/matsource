"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FeatureFAQProps {
  title: string;
  subtitle: string;
  faqs: FAQItem[];
}

export function FeatureFAQ({ title, subtitle, faqs }: FeatureFAQProps) {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">
            {title}
          </h2>
          <p className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3 md:space-y-4">
          {faqs.map((faq, index) => (
            <Accordion key={index} type="single" collapsible>
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger className="text-base md:text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm md:text-base text-gray-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
} 