"use client";

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
    <section id="faq" className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-300">
            Still have questions?{" "}
            <a 
              href="mailto:hello@matsource.com" 
              className="text-matsource-500 hover:text-matsource-400 underline transition-colors"
            >
              Reach out to us
            </a>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="relative rounded-2xl backdrop-blur-sm border border-gray-800 bg-gray-900/40 p-6 hover:bg-gray-900/60 transition-colors group"
            >
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-matsource-500 transition-colors">
                  {faq.question}
                </h3>
                <p className="text-gray-300">
                  {faq.answer}
                </p>
              </div>
              
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-matsource-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 