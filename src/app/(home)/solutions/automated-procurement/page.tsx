import { FeatureHero } from "@/components/feature-page/FeatureHero";
import { FeatureSection } from "@/components/feature-page/FeatureSection";
import { FeatureCTA } from "@/components/feature-page/FeatureCTA";
import { FeatureFAQ, FAQItem } from "@/components/feature-page/FeatureFAQ";

const searchFeatureSections = [
  {
    title: "Find Parts 90% Faster",
    description: "Our semantic search understands what you need even with partial information. Search across all your suppliers simultaneously, comparing prices and availability instantly.",
    image: "https://images.unsplash.com/photo-1727413434026-0f8314c037d8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Fast parts search interface",
    bulletPoints: [
      "Natural language search that understands industry terminology",
      "Find parts by description, symptoms, or partial model numbers",
      "Real-time availability and pricing from multiple suppliers"
    ]
  },
  {
    title: "Intelligent Recommendations",
    description: "Receive smart suggestions for alternative parts, compatible options, and bundled items that might be needed for the complete job, increasing your average ticket value.",
    image: "https://images.unsplash.com/photo-1648898211946-34bee731ca39?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Intelligent parts recommendations",
    bulletPoints: [
      "Alternative parts suggestions when items are unavailable",
      "Compatible accessory recommendations",
      "Bundle suggestions based on job type and history"
    ]
  },
  {
    title: "Automated Ordering",
    description: "Once you've found the parts you need, our system automatically creates purchase orders for your suppliers. This ensures timely delivery and reduces administrative overhead. The purchaing can be done via a voice AI agent calling the supplier or a browser use Ai agent sending and email or using a website",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Automated ordering system",
    bulletPoints: [
      "Human oversight is required to approve the purchase orders",
      "Once approved, AI agents automatically create purchase orders for parts needed for jobs",
      "The AI agents can also send and email or use a website to create the purchase order"
    ]
  }
];

const searchFAQs: FAQItem[] = [
  {
    question: "How accurate is the semantic search system?",
    answer: "Our semantic search system achieves over 95% accuracy in identifying the correct parts, even with partial information. The system continuously learns from searches across our network of service businesses, becoming more accurate over time. For complex or rare parts, it provides multiple options with confidence ratings."
  },
  {
    question: "Which suppliers and parts databases are supported?",
    answer: "We integrate with major retail and recycled suppliers including Car-parts.com, AutoZone, Grainger, Ferguson, and many others. Our system also connects with manufacturer-specific databases for brands like Carrier, Lennox, Kohler, and more. We can add custom supplier integrations for your specific needs."
  },
  {
    question: "How much time does this typically save per job?",
    answer: "Small service businesses report spending and average of 6.5 hours per week on purchase order processing. This is valuable time that can be used to service more customers. Our system can reduce this time by 80% or more by removing the need to make phone calls, search parts databases and manually create purchase orders."
  },
  {
    question: "Can it integrate with my existing inventory system?",
    answer: "Yes! We offer integration with popular inventory management systems like ServiceTitan, HousecallPro, and QuickBooks. This allows you to check your own inventory first before searching external suppliers, and automatically update stock levels when parts are used."
  },
  {
    question: "Is training required to use the system effectively?",
    answer: "The system is designed to be intuitive even for non-technical users. Most technicians become proficient after just 1-2 jobs. We provide brief video tutorials and a quick-start guide. Our support team is also available for live training sessions if needed."
  }
];

export default function SemanticSearchPage() {
  return (
    <div>
      <FeatureHero 
        title="Semantic Parts Search"
        subtitle="Find exactly what you need in seconds"
        description="Revolutionize how you source parts with AI-powered search that understands what you're looking for, even without exact part numbers or complete information."
      />
      
      <div className="container mx-auto px-4">
        {searchFeatureSections.map((section, index) => (
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
          title="Stop wasting time hunting for parts"
          subtitle="Join service businesses cutting parts sourcing time by 90% while reducing costly errors."
          statistic="Save 5-8 hours weekly"
        />
      </div>
      
      <FeatureFAQ 
        title="Semantic Search FAQ"
        subtitle="Common questions about our parts search system"
        faqs={searchFAQs}
      />
    </div>
  );
} 