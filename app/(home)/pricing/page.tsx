import Link from "next/link";
import { Pricing } from "@/components/Pricing";
import { Metadata } from "next";
import { CheckCircle } from "lucide-react";
import { FAQ } from "@/components/FAQ";

export const metadata: Metadata = {
  title: "Pricing | Matsource",
  description: "Simple, transparent pricing for our AI Voice Agent solutions. Start automating your business communications today.",
};

export default function PricingPage() {
  // Testimonial items
  const testimonials = [
    {
      quote: "The ROI on Matsource's voice agents was immediate. We've reduced our call handling costs by 60% while improving customer satisfaction.",
      author: "Sarah Johnson",
      company: "TechSolutions Inc."
    },
    {
      quote: "Our customers can't tell they're speaking with an AI. The voice quality and natural conversation flow is remarkable.",
      author: "Michael Rodriguez",
      company: "ServicePro Industries"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-x-hidden">
      {/* Header */}
      <div className="pt-20 pb-10 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Transform Your Business
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Our AI Voice Agents provide enterprise-grade call automation at a fraction of the cost of human agents.
          </p>
        </div>
      </div>

      <main>
        {/* Pricing Component */}
        <Pricing />

        {/* Why Choose Us */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Businesses Choose Matsource</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Cost Effective",
                  description: "Save up to 80% compared to human agents while maintaining 24/7 availability"
                },
                {
                  title: "Human-Like Conversations",
                  description: "Our AI agents pass the Turing test with over 96% of callers"
                },
                {
                  title: "Seamless Integration",
                  description: "Works with your existing phone system, CRM, and business workflows"
                }
              ].map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-md">
                  <div className="flex flex-col h-full">
                    <div className="mb-6">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xl">★</span>
                      ))}
                    </div>
                    <blockquote className="text-gray-700 italic mb-6 flex-grow">
                      "{testimonial.quote}"
                    </blockquote>
                    <div>
                      <p className="font-bold">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <FAQ />

        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <p className="mb-4 text-gray-600">Still have questions?</p>
            <Link 
              href="/contact" 
              className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90 transition-colors"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 md:py-12 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center mb-4 sm:mb-0">
              <span className="text-3xl mr-2" role="img" aria-label="Construction Worker">
                👷‍♂️
              </span>
              <span className="text-base md:text-lg font-bold">Matsource</span>
            </div>
            <nav className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm md:text-base">
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>
          <div className="mt-4 md:mt-6 text-center text-xs md:text-sm text-gray-500">
            © {new Date().getFullYear()} Matsource. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
} 