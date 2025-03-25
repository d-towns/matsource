import { FeatureHero } from "@/components/feature-page/FeatureHero";
import { FeatureSection } from "@/components/feature-page/FeatureSection";
import { FeatureCTA } from "@/components/feature-page/FeatureCTA";
import { FeatureFAQ, FAQItem } from "@/components/feature-page/FeatureFAQ";

const voiceFeatureSections = [
  {
    title: "Instant Follow-Ups",
    description: "AI voice agents provide instant follow-ups after a user signs up, ensuring quick engagement and personalized responses. These agents can answer common questions, confirm details, and guide users through the next steps in real time.",
    image: "https://zazznpnzzmueacffwutq.supabase.co/storage/v1/object/public/blog-images//virtual-receptionist.jpg",
    alt: "AI voice system answering customer calls",
    bulletPoints: [
      "Natural language processing for human-like interactions",
      "Real-time response to common questions and concerns",
      "Improved customer experience and higher conversion rates",
      "Automated and streamlined follow-up process"
    ]
  },
  {
    title: "Lead Reactivation",
    description: "Outbound AI voice agents for lead reactivation engage past prospects who showed interest but never converted. These agents make personalized calls, rekindling interest by offering updates, special offers, or addressing previous objections.",
    image: "https://zazznpnzzmueacffwutq.supabase.co/storage/v1/object/public/blog-images//google_calendar.jpg",
    alt: "Automated customer outreach system",
    bulletPoints: [
      "Automated follow-ups with dormant leads",
      "Personalized offers and updates",
      "Efficient reconnection without overwhelming sales teams",
      "Increased conversion rates from existing databases"
    ]
  },
  {
    title: "Lead Qualifier",
    description: "The AI agent engages prospects in natural conversation, asking key qualifying questions to assess their needs and intent. It then categorizes leads based on their responses, ensuring only high-quality prospects are passed to human sales teams.",
    image: "https://zazznpnzzmueacffwutq.supabase.co/storage/v1/object/public/blog-images//sales-funnel.jpg",
    alt: "Customer insights dashboard",
    bulletPoints: [
      "Automated lead qualification process",
      "Natural conversation flow with key qualifying questions",
      "Smart lead categorization and routing",
      "Increased efficiency for sales teams"
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
        title="Outbound Voice AI Agents"
        subtitle="Automate your customer interactions"
        description="Automate follow-ups, reminders, and lead qualification with intelligent AI voice agents"
      />
      
      <div className="container mx-auto px-4">
        <h2 className="text-4xl text-center font-bold mb-4">Many Use Cases</h2>
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