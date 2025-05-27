"use client";

import { Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { BookDemoButton } from "./BookDemoButton";
import Link from "next/link";

// Pricing plans config
const pricingPlans = [
  {
    name: "Starter",
    price: "$249 / mo",
    minutes_included: "1,000 pooled",
    concurrent_calls: "Up to 5",
    perfect_for: "Solo & 1-truck shops",
    features: [
      "24 / 7 Voice-AI receptionist",
      "Google & Outlook calendar booking",
      "ServiceTitan / Jobber sync",
      "300-min free trial",
      "Overage: $0.09 / min"
    ],
    cta: "Get Started"
  },
  {
    name: "Growth",
    price: "$579 / mo",
    minutes_included: "3,500 pooled",
    concurrent_calls: "Up to 5 (add more @ $7/line)",
    perfect_for: "5-15 tech teams",
    features: [
      "Everything in Starter",
      "SMS / email follow-ups",
      "Call analytics dashboard",
      "Cost-Saver voice toggle (-$0.03 / min)",
      "Overage: $0.09 / min"
    ],
    cta: "Start Free Trial"
  },
  {
    name: "Scale",
    price: "$1,199 / mo",
    minutes_included: "10,000 pooled",
    concurrent_calls: "Up to 8 (add more @ $7/line)",
    perfect_for: "Multi-truck ops",
    features: [
      "Everything in Growth",
      "Multi-location routing",
      "Spanish voice included",
      "Priority support SLA",
      "Overage: $0.09 / min"
    ],
    cta: "Start Free Trial"
  },
  {
    name: "Enterprise",
    price: "Custom",
    minutes_included: "Unlimited*",
    concurrent_calls: "Unlimited",
    perfect_for: "Franchises & partners",
    features: [
      "Outcome-based pricing ($12 / booked job after first 100)",
      "Smart-Quote & parts-procurement AI",
      "Dedicated account manager",
      "Custom SIP trunk / BYO numbers",
      "Volume minute discounts & on-prem options"
    ],
    cta: "Contact Sales"
  }
];

// PlanCard subcomponent
function PlanCard({ plan, isBestValue = false }: { plan: typeof pricingPlans[number], isBestValue?: boolean }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
      className={`flex flex-col bg-white rounded-3xl shadow-lg overflow-visible border font-sans relative items-center justify-center transition-all duration-300
        ${isBestValue ? 'border-4 border-primary shadow-xl scale-105 z-10' : 'border-gray-100'}
      `}
      aria-label={isBestValue ? 'Best Value Plan' : undefined}
    >
      {/* Best Value Badge */}
      {isBestValue && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30">
          <span className="inline-block bg-primary text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg ring-4 ring-primary/20 pointer-events-none">Best Value</span>
        </div>
      )}
      <div className="p-8 flex flex-col flex-1 items-center text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        {/* Large Price */}
        <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">{plan.price}</div>
        {/* Perfect For - larger and more distinct */}
        <div className="mb-4 text-base md:text-lg text-gray-700 font-semibold">{plan.perfect_for}</div>
        <div className="mb-2 text-gray-700 text-lg font-semibold">{plan.minutes_included} <span className="text-xs font-normal text-gray-400">min included</span></div>
        <div className="mb-4 text-gray-700 text-base">{plan.concurrent_calls} <span className="text-xs font-normal text-gray-400">concurrent</span></div>
        <ul className="mb-6 space-y-2 text-left w-full max-w-xs mx-auto">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center text-gray-600 text-sm">
              <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-auto w-full">
          {plan.cta === 'Contact Sales' ? (
            <Link href="/contact">
              <button className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition">{plan.cta}</button>
            </Link>
          ) : (
            <Link href="/get-started">
              <button className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-900 transition flex items-center justify-center">
                {plan.cta}
                <Rocket className="w-4 h-4 ml-2" />
              </button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function Pricing() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <section className="py-12 md:py-20 overflow-hidden font-sans">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center mb-8 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="text-black dark:text-white">Our</span>
            <span className="text-primary ml-4">Pricing</span>
          </h2>
        </motion.div>

        {/* Plan Cards Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 "
        >
          {pricingPlans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} isBestValue={plan.name === 'Growth'} />
          ))}
        </motion.div>

        {/* Discovery Call CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 rounded-3xl border shadow-md p-8 flex flex-col md:flex-row justify-between items-center bg-white"
        >
          <h3 className="text-2xl font-bold mb-4 md:mb-0">Book Your AI Voice Agent Discovery Call Today.</h3>
          <BookDemoButton />
        </motion.div>
      </div>
    </section>
  );
} 