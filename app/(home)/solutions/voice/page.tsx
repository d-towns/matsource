import { FeatureHero } from "@/components/feature-page/FeatureHero";
import { FeatureSection } from "@/components/feature-page/FeatureSection";
import { FeatureCTA } from "@/components/feature-page/FeatureCTA";
import { FeatureFAQ, FAQItem } from "@/components/feature-page/FeatureFAQ";

const voiceFeatureSections = [
  {
    title: "Never Miss a Customer Call Again",
    description: "Our AI voice system answers 100% of calls, handling customer inquiries even during peak times. No more missed opportunities or frustrated customers waiting on hold.",
    image: "/images/solutions/voice-automation-1.jpg",
    alt: "AI voice system answering customer calls",
    bulletPoints: [
      "24/7 automated call answering with natural-sounding voice",
      "Intelligent routing based on customer needs",
      "Multilingual support for diverse customer base"
    ]
  },
  {
    title: "Proactive Customer Outreach",
    description: "Automatically reach out to customers for appointment confirmations, follow-ups, and maintenance reminders. Boost your retention rates while reducing the manual workload on your team.",
    image: "/images/solutions/voice-automation-2.jpg",
    alt: "Automated customer outreach system",
    bulletPoints: [
      "Schedule confirmation calls reduce no-shows by up to 35%",
      "Post-service follow-ups improve customer satisfaction",
      "Seasonal maintenance reminders generate repeat business"
    ]
  },
  {
    title: "Rich Customer Insights",
    description: "Every call is transcribed, analyzed, and integrated into your customer database. Gain valuable insights about customer preferences, common issues, and service opportunities.",
    image: "/images/solutions/voice-automation-3.jpg",
    alt: "Customer insights dashboard",
    bulletPoints: [
      "AI-generated call summaries and action items",
      "Automatic service ticket creation from conversations",
      "Trend analysis for business intelligence"
    ]
  }
];

const voiceFAQs: FAQItem[] = [
  {
    question: "Will customers know they're talking to an AI?",
    answer: "Our AI voice technology is designed to sound natural and conversational. We're transparent about the AI nature when appropriate, but the experience is so seamless that many customers won't notice the difference. For businesses preferring complete transparency, we offer customizable disclosure options."
  },
  {
    question: "How does the AI handle complex customer requests?",
    answer: "The AI is trained to handle most common service requests and questions. For complex situations beyond its capabilities, it seamlessly transfers to your human team with a complete context of the conversation, ensuring a smooth handoff without frustrating the customer."
  },
  {
    question: "How much time will this save my business?",
    answer: "Most service businesses using our voice automation save 15-20 hours per week on call handling alone. This includes answering routine inquiries, scheduling appointments, and making outbound reminder calls. Your team can focus on higher-value activities while the AI handles repetitive communication tasks."
  },
  {
    question: "Can I customize the voice and scripts?",
    answer: "Absolutely! You can select from multiple voice options or even create a custom voice that matches your brand. All scripts are fully customizable to reflect your business tone and terminology. We provide templates as starting points that you can modify to your exact needs."
  },
  {
    question: "What happens if the system goes down?",
    answer: "We've built our voice system with redundancy and 99.9% uptime guarantees. In the rare event of system issues, calls are automatically routed to your preferred backup number, ensuring you never miss important customer calls. We also provide real-time status monitoring through our dashboard."
  },
  {
    question: "Do I need special equipment to use this?",
    answer: "No special equipment is needed. Our system integrates with your existing phone system or can provide a new business number. The entire setup is cloud-based, requiring only an internet connection to manage through our web dashboard."
  }
];

export default function VoiceAutomationPage() {
  return (
    <div>
      <FeatureHero 
        title="AI Voice Automation"
        subtitle="Transform your customer interactions"
        description="Handle inbound inquiries and proactive outreach with intelligent AI voice technology tailored specifically for service businesses."
      />
      
      <div className="container mx-auto px-4">
        {voiceFeatureSections.map((section, index) => (
          <FeatureSection 
            key={index}
            index={index}
            title={section.title} 
            description={section.description}
            image={section.image}
            alt={section.alt}
            bulletPoints={section.bulletPoints}
          />
        ))}
        
        <FeatureCTA 
          title="Ready to transform your customer communications?"
          subtitle="Join service businesses saving 20+ hours per week with AI voice automation."
          statistic="35% more appointments booked"
        />
      </div>
      
      <FeatureFAQ 
        title="Voice Automation FAQ"
        subtitle="Common questions about our AI voice solution"
        faqs={voiceFAQs}
      />
    </div>
  );
} 