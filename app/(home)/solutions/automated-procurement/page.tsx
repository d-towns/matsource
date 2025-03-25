import { FeatureHero } from "@/components/feature-page/FeatureHero";
import { FeatureSection } from "@/components/feature-page/FeatureSection";
import { FeatureCTA } from "@/components/feature-page/FeatureCTA";
import { FeatureFAQ, FAQItem } from "@/components/feature-page/FeatureFAQ";

const searchFeatureSections = [
  {
    title: "Find Parts 90% Faster",
    description: "Our semantic search understands what you need even with partial information. Search across all your suppliers simultaneously, comparing prices and availability instantly.",
    image: "/images/solutions/semantic-search-1.jpg",
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
    image: "/images/solutions/semantic-search-2.jpg",
    alt: "Intelligent parts recommendations",
    bulletPoints: [
      "Alternative parts suggestions when items are unavailable",
      "Compatible accessory recommendations",
      "Bundle suggestions based on job type and history"
    ]
  },
  {
    title: "Visual Part Recognition",
    description: "Upload a photo of a broken or worn part, and our AI will identify it and find matching replacements. Perfect for situations where part numbers are missing or unreadable.",
    image: "/images/solutions/semantic-search-3.jpg",
    alt: "Visual part recognition system",
    bulletPoints: [
      "Camera-based part identification",
      "Works with damaged or partial components",
      "Matches against vast database of service parts"
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
    answer: "We integrate with major suppliers including NAPA, AutoZone, Grainger, Ferguson, and many others. Our system also connects with manufacturer-specific databases for brands like Carrier, Lennox, Kohler, and more. We can add custom supplier integrations for your specific needs."
  },
  {
    question: "How much time does this typically save per job?",
    answer: "Service businesses report saving 15-25 minutes per job on parts sourcing. For businesses completing 20 jobs per week, that's 5-8 hours saved weekly just on finding parts. This time saving increases significantly for complex repairs requiring multiple components."
  },
  {
    question: "Can it integrate with my existing inventory system?",
    answer: "Yes! We offer integration with popular inventory management systems like ServiceTitan, HousecallPro, and QuickBooks. This allows you to check your own inventory first before searching external suppliers, and automatically update stock levels when parts are used."
  },
  {
    question: "How does the photo recognition feature work?",
    answer: "Simply take a clear photo of the part needing replacement. Our AI analyzes the image, identifying key characteristics and matching it against our extensive parts database. The system works best with adequate lighting and minimal background clutter, but can handle real-world conditions in service environments."
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