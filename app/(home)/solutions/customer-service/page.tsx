import { FeatureHero } from "@/components/feature-page/FeatureHero";
import { FeatureSection } from "@/components/feature-page/FeatureSection";
import { FeatureCTA } from "@/components/feature-page/FeatureCTA";
import { FeatureFAQ, FAQItem } from "@/components/feature-page/FeatureFAQ";

const customerServiceSections = [
  {
    title: "Automated Service Updates",
    description: "Keep customers informed at every stage with personalized, automated updates about their service appointments, parts status, and completion estimates.",
    image: "/images/solutions/customer-service-1.jpg",
    alt: "Automated service updates interface",
    bulletPoints: [
      "Proactive scheduling confirmations reduce no-shows by 35%",
      "Real-time technician arrival updates improve customer satisfaction",
      "Automatic completion notifications with invoice details"
    ]
  },
  {
    title: "Smart Customer Portal",
    description: "Give customers 24/7 access to their service history, upcoming appointments, and documentation through a branded portal customized for your business.",
    image: "/images/solutions/customer-service-2.jpg",
    alt: "Customer service portal",
    bulletPoints: [
      "Self-service appointment scheduling and modification",
      "Secure storage for warranties, manuals, and service records",
      "Maintenance reminder system for repeat business"
    ]
  },
  {
    title: "Feedback & Review Management",
    description: "Automatically collect customer feedback, respond to reviews, and turn satisfied customers into powerful advocates for your business.",
    image: "/images/solutions/customer-service-3.jpg",
    alt: "Customer feedback dashboard",
    bulletPoints: [
      "Automated post-service satisfaction surveys",
      "Smart routing of negative feedback for immediate resolution",
      "Review generation system for major platforms (Google, Yelp, etc.)"
    ]
  }
];

const customerServiceFAQs: FAQItem[] = [
  {
    question: "How will these features improve my customer satisfaction?",
    answer: "Service businesses using our customer service features report an average 40% increase in customer satisfaction scores. The biggest improvements come from proactive communication (customers always knowing what's happening), reduced wait times, and the convenience of self-service options for simple tasks like scheduling."
  },
  {
    question: "Will this reduce phone calls to my office?",
    answer: "Yes! Businesses typically see a 60-70% reduction in 'where's my technician?' and 'when will my parts arrive?' calls. The automated update system keeps customers informed proactively, while the self-service portal handles routine inquiries without requiring staff intervention."
  },
  {
    question: "How do customers react to automated communications?",
    answer: "Customer response is overwhelmingly positive when implementations are done right. Our system uses conversational language and appropriate timing to avoid feeling impersonal. Customers appreciate the increased transparency and consistency, with 92% preferring automated updates to no updates at all."
  },
  {
    question: "Can I customize the communications to match my brand voice?",
    answer: "Absolutely. All automated messages, from text alerts to emails and voice calls, are fully customizable to match your brand's tone and style. We provide templates as starting points, but you can modify every aspect to ensure communications feel authentic to your business."
  },
  {
    question: "How does the review management system work?",
    answer: "After service completion, customers automatically receive a satisfaction survey. Happy customers are prompted to share their experience on review platforms of your choice. Negative feedback is routed to your team for immediate resolution before it becomes a public review. This approach has helped businesses increase their positive reviews by 3-4x."
  },
  {
    question: "Do I need technical expertise to manage these features?",
    answer: "No technical expertise is required. The entire system is managed through an intuitive dashboard designed for busy service businesses. Initial setup takes about 30 minutes with the guidance of our support team, and day-to-day operations require minimal oversight as the system runs automatically."
  }
];

export default function CustomerServicePage() {
  return (
    <div>
      <FeatureHero 
        title="AI-Powered Customer Service"
        subtitle="Delight your customers with exceptional service"
        description="Automate customer communications, provide self-service options, and turn satisfied customers into advocates for your business."
      />
      
      <div className="container mx-auto px-4">
        {customerServiceSections.map((section, index) => (
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
          title="Elevate your customer experience"
          subtitle="Join service businesses increasing customer satisfaction by 40% while reducing support workload."
          statistic="60% fewer support calls"
        />
      </div>
      
      <FeatureFAQ 
        title="Customer Service FAQ"
        subtitle="Common questions about our customer service automation"
        faqs={customerServiceFAQs}
      />
    </div>
  );
} 