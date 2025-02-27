"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { 
  PhoneCall, 
  Calculator, 
  Search, 
  ShoppingCart, 
  BarChart4, 
  Bell, 
  CheckCircle2, 
  Sparkles
} from "lucide-react";
import { WaitlistWidget } from "@/components/WaitlistWidget";

const journeySteps = [
  {
    id: "incoming-call",
    title: "Never Miss a Revenue Opportunity",
    description: "Turn every incoming call into revenue. Our AI answers 100% of calls instantly, understands customer needs with 95% accuracy, and creates perfect service tickets while your competitors let calls go to voicemail.",
    icon: PhoneCall,
    color: "bg-blue-500",
    image: "/images/features/call-automation.webp"
  },
  {
    id: "estimate",
    title: "Perfect Quotes in Seconds, Not Hours",
    description: "Generate accurate, profitable work estimates in seconds. Eliminate pricing errors that cost the average service business $30K+ annually while maximizing job profitability.",
    icon: Calculator,
    color: "bg-indigo-500",
    image: "/images/features/work-estimation.webp"
  },
  {
    id: "parts-search",
    title: "Cut Parts Sourcing Time by 90%",
    description: "Our semantic search slashes parts sourcing time from hours to minutes. Find the exact right parts at the best prices across all your suppliers with a single search.",
    icon: Search,
    color: "bg-purple-500",
    image: "/images/features/parts-search.webp"
  },
  {
    id: "procurement",
    title: "Eliminate Parts Procurement Headaches",
    description: "Say goodbye to endless supplier calls and delivery coordination. Our system automatically orders from optimal suppliers, saving 5+ hours weekly while ensuring parts arrive exactly when your technicians need them.",
    icon: ShoppingCart,
    color: "bg-pink-500",
    image: "/images/features/procurement.webp"
  },
  {
    id: "notifications",
    title: "Boost Customer Satisfaction by 40%",
    description: "Delight customers with proactive updates at every stage. Reduce inbound 'where's my service tech?' calls by 75% while keeping your team perfectly coordinated with real-time notifications.",
    icon: Bell,
    color: "bg-rose-500",
    image: "/images/features/notifications.webp"
  },
  {
    id: "completion",
    title: "Increase Cash Flow & Repeat Business",
    description: "Close jobs faster with automated completion verification, instant payment processing, and intelligent follow-up scheduling. Increase your repeat business rate by 35% through perfectly-timed maintenance reminders.",
    icon: CheckCircle2,
    color: "bg-orange-500",
    image: "/images/features/completion.webp"
  },
  {
    id: "analytics",
    title: "Unlock Hidden Profit Opportunities",
    description: "Transform data into dollars with powerful performance insights. Identify your most profitable services, optimize technician productivity, and spot revenue opportunities you're currently missing with our AI-powered analytics.",
    icon: BarChart4,
    color: "bg-amber-500",
    image: "/images/features/analytics.webp"
  }
];

const JourneyStep = ({ 
  step, 
  index, 
  isActive, 
  progress 
}: { 
  step: typeof journeySteps[0], 
  index: number, 
  isActive: boolean,
  progress: number 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" });
  
  // Only show as active if in view AND we've scrolled to this step in the journey
  const showActive = isInView && isActive;

  return (
    <div 
      ref={ref}
      className={cn(
        "relative grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-16 py-24 transition-opacity",
        isInView ? "opacity-100" : "opacity-50"
      )}
    >
      {/* Content area - takes 3 columns on desktop */}
      <div className={cn(
        "col-span-1 md:col-span-3 flex flex-col justify-center order-2 md:order-1",
        index % 2 === 0 ? "md:order-1" : "md:order-2 items-end"
      )}>
        <div className="space-y-4">
          <Badge 
            className={cn(
              "px-3 py-1 w-fit transition-colors duration-500",
              showActive ? step.color : "bg-gray-800",
              showActive ? "text-white" : "text-gray-400"
            )}
          >
            Step {index + 1}
          </Badge>
          
          <h3 className="text-2xl md:text-3xl font-bold">{step.title}</h3>
          
          <p className="text-base md:text-lg text-gray-400 max-w-md">
            {step.description}
          </p>
        </div>
      </div>
      
      {/* Image/visual area - takes 2 columns on desktop */}
      <div className={cn(
        "col-span-1 md:col-span-2 flex items-center justify-center order-1 md:order-2",
        index % 2 === 0 ? "md:order-2" : "md:order-1"
      )}>
        <div className="relative w-full aspect-video md:aspect-square rounded-xl overflow-hidden border border-gray-800 shadow-lg">
          <div className={cn(
            "absolute inset-0 flex items-center justify-center bg-gradient-to-br",
            showActive 
              ? `from-${step.color.split('-')[1]}-900/20 to-${step.color.split('-')[1]}-500/5` 
              : "from-gray-900/20 to-gray-800/5"
          )}>
            <step.icon 
              className={cn(
                "w-16 h-16 transition-colors duration-500", 
                showActive ? `text-${step.color.split('-')[1]}-500` : "text-gray-700"
              )}
            />
          </div>
          {/* If you have actual images, you can use this instead of the icon background */}
          {/* <Image
            src={step.image}
            alt={step.title}
            fill
            className="object-cover"
          /> */}
        </div>
      </div>
    </div>
  );
};

export function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const { scrollYProgress } = useScroll({ 
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Update active step based on scroll position
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(value => {
      // Save the overall progress
      setScrollProgress(value);
      
      // Calculate which step should be active based on scroll progress
      const stepIndex = Math.min(
        Math.floor(value * journeySteps.length),
        journeySteps.length - 1
      );
      
      setActiveStep(stepIndex);
    });
    
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Calculate how much of the current step is complete (for partial line filling)
  const getCurrentStepProgress = () => {
    const stepsCount = journeySteps.length;
    const stepSize = 1 / stepsCount;
    const currentStepStart = activeStep * stepSize;
    
    // How far through the current step (0-1)
    return (scrollProgress - currentStepStart) / stepSize;
  };

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            AI-Powered Growth Engine for Service Businesses
          </h2>
          <p className="text-sm md:text-lg text-gray-400">
            From first customer contact to completed job, our platform eliminates costly inefficiencies while delighting your customers at every step.
          </p>
        </div>

        {/* Journey Container */}
        <div ref={containerRef} className="relative">
          {/* The vertical timeline line */}
          <div className="absolute left-6 md:left-1/2 top-12 bottom-12 w-0.5 bg-gray-800/50">
            {/* The filled line that grows with scroll */}
            <motion.div 
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-500 via-purple-500 to-amber-500"
              style={{ 
                height: `${scrollProgress * 100}%`,
                transition: "height 0.1s ease-out" 
              }}
            />
          </div>

          {/* Steps */}
          <div className="relative z-10 space-y-0 pl-12 md:pl-0">
            {journeySteps.map((step, index) => (
              <JourneyStep 
                key={step.id}
                step={step}
                index={index}
                isActive={index <= activeStep}
                progress={index === activeStep ? getCurrentStepProgress() : 1}
              />
            ))}
          </div>
        </div>
        
        {/* Final CTA */}
        <div className="text-center mt-24">
          <div className="inline-flex items-center justify-center gap-2 mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500 text-white px-4 py-2 rounded-full">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Automation</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Join Service Leaders Increasing Revenue by 35%+
          </h3>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Elite service businesses are already using Matsource to outperform competitors. Will you be next?
          </p>
          <WaitlistWidget />
        </div>
      </div>
    </section>
  );
} 