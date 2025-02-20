"use client";

import { Check } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Basic",
    price: "99",
    description: "Perfect for small service businesses getting started with AI.",
    features: [
      "Up to 1,000 voice minutes/month",
      "Basic semantic search",
      "Email support",
      "1 AI agent",
      "Standard response time",
      "Basic analytics"
    ],
    cta: "Get Started",
    href: "/signup?plan=basic"
  },
  {
    name: "Pro",
    price: "199",
    description: "Ideal for growing businesses needing advanced features.",
    features: [
      "Up to 5,000 voice minutes/month",
      "Advanced semantic search",
      "Priority email & chat support",
      "3 AI agents",
      "Faster response time",
      "Advanced analytics",
      "Custom voice prompts",
      "API access"
    ],
    cta: "Get Started",
    href: "/signup?plan=pro",
    featured: true
  },
  {
    name: "Enterprise",
    description: "Custom solutions for large-scale operations.",
    features: [
      "Unlimited voice minutes",
      "Enterprise semantic search",
      "24/7 priority support",
      "Unlimited AI agents",
      "Fastest response time",
      "Enterprise analytics",
      "Custom integrations",
      "Dedicated account manager",
      "Custom AI model training",
      "SLA guarantees"
    ],
    cta: "Contact Sales",
    href: "/contact-sales",
  }
];

export function Pricing() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-gray-300">
            Choose the plan that's right for your business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl backdrop-blur-sm border border-gray-800 flex flex-col ${
                tier.featured 
                  ? 'bg-gradient-to-b from-matsource-500/10 to-purple-900/10 ring-2 ring-matsource-500' 
                  : 'bg-gray-900/40'
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-matsource-500 to-purple-600 px-3 py-1 text-sm font-medium text-white text-center">
                  Most Popular
                </div>
              )}

              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-white mb-2">{tier.name}</h3>
                {tier.price ? (
                  <div className="mt-4 flex items-baseline text-white">
                    <span className="text-4xl font-bold tracking-tight">${tier.price}</span>
                    <span className="ml-1 text-xl font-semibold">/month</span>
                  </div>
                ) : (
                  <div className="mt-4 flex items-baseline text-white">
                    <span className="text-4xl font-bold tracking-tight">Custom</span>
                  </div>
                )}
                <p className="mt-6 text-gray-300">{tier.description}</p>

                <ul className="mt-6 space-y-4 flex-grow">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex text-gray-300">
                      <Check className="h-5 w-5 flex-shrink-0 text-matsource-500" />
                      <span className="ml-3">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={tier.href}
                  className={`mt-8 block w-full rounded-full px-6 py-3 text-center text-sm font-semibold leading-6 text-white transition-colors self-end ${
                    tier.featured
                      ? 'bg-matsource-500 hover:bg-matsource-400'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 