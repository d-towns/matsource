"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "Is it free?",
    answer: "We offer a free plan with limited credits as well as paid plans for expanded features."
  },
  {
    question: "How secure is your platform?",
    answer: "Our platform is built with enterprise-grade security practices including encryption and RBAC."
  },
  {
    question: "Can I customize the AI?",
    answer: "Yes – our platform allows you to fine-tune the AI based on your technical documentation."
  },
  {
    question: "How do I integrate Matsource?",
    answer: "Our detailed documentation guides you through step‐by‐step integration using our API."
  },
  {
    question: "What kind of support do you offer?",
    answer: "We provide email support for all plans, with priority support and dedicated account managers for enterprise customers."
  },
  {
    question: "Can I try before I buy?",
    answer: "Yes! You can start with our free tier to test our features before upgrading to a paid plan."
  }
];

export function FAQ() {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">
            Frequently asked questions
          </h2>
          <p className="text-base md:text-lg text-gray-400">
            Everything you need to know about the product and billing.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3 md:space-y-4">
          {faqs.map((faq) => (
            <Accordion key={faq.question} type="single" collapsible>
              <AccordionItem value="item-1">
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