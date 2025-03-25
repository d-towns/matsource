import { FeatureHero } from "@/components/feature-page/FeatureHero";
import { FeatureSection } from "@/components/feature-page/FeatureSection";
import { FeatureCTA } from "@/components/feature-page/FeatureCTA";
import { FeatureFAQ, FAQItem } from "@/components/feature-page/FeatureFAQ";

const voiceFeatureSections = [
  {
    title: "Virtual Receptionist",
    description: "An AI voice agent handling reception work improves efficiency by instantly answering calls, reducing wait times, and handling multiple inquiries simultaneously. It ensures 24/7 availability, providing consistent and accurate information without breaks or fatigue.",
    image: "https://zazznpnzzmueacffwutq.supabase.co/storage/v1/object/public/blog-images//virtual-receptionist.jpg",
    alt: "AI voice system answering customer calls",
    bulletPoints: [
      "24/7 automated call answering with natural-sounding voice",
      "Intelligent routing based on customer needs",
      "Multilingual support for diverse customer base"
    ]
  },
  {
    title: "Appointment Setter",
    description: "An AI appointment setter voice agent streamlines scheduling by quickly handling inbound calls, reducing wait times for customers. It ensures accuracy by integrating with calendars, preventing double bookings and scheduling conflicts. The AI operates 24/7, allowing customers to book, reschedule, or cancel appointments at their convenience. Additionally, it enhances efficiency and cost savings by automating routine scheduling tasks, freeing up human staff for more complex interactions.",
    image: "https://zazznpnzzmueacffwutq.supabase.co/storage/v1/object/public/blog-images//google_calendar.jpg",
    alt: "Automated customer outreach system",
    bulletPoints: [
      "Schedule confirmation calls reduce no-shows by up to 35%",
      "Post-service follow-ups improve customer satisfaction",
      "Seasonal maintenance reminders generate repeat business"
    ]
  },
  {
    title: "Lead Qualifier",
    description: "An AI-powered inbound voice agent for lead qualification efficiently filters inquiries by asking key questions and assessing potential customers based on predefined criteria. It saves businesses time by identifying high-intent leads and forwarding only the most relevant prospects to sales teams. The AI can handle large call volumes, ensuring that every lead is evaluated consistently and objectively without human bias. By automating the qualification process, companies can focus their efforts on closing deals rather than manually sorting through unqualified leads.",
    image: "https://zazznpnzzmueacffwutq.supabase.co/storage/v1/object/public/blog-images//sales-funnel.jpg",
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
        title="Inbound Voice AI Agents"
        subtitle="Automate your customer interactions"
        description="Handle customer inquiries and streamline your business operations with intelligent AI voice technology"
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