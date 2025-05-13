import { Metadata } from "next";
import LandingHero from "@/components/landing/LandingHero";
import SocialProofSection from "@/components/landing/SocialProofSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import LimitedOfferBanner from "@/components/landing/LimitedOfferBanner";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "Get 20-50 Booked Appointments with Our AI | Matsource",
  description: "Transform your service business with AI appointment scheduling that guarantees results or you don't pay.",
  openGraph: {
    title: "Get 20-50 Booked Appointments with Our AI | Matsource",
    description: "Transform your service business with AI appointment scheduling that guarantees results or you don't pay.",
    images: [{ url: "/images/landing/appointments-og.jpg" }],
  },
};

export default function AIAppointmentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-900">
      <LandingHero 
        headline="Get 20-50 Booked Appointments on Your Calendar with Our AI or You Don't Pay!"
        subheadline="Never Pay for Marketing Agencies or Leads Ever Again"
        ctaText="Click Here to Claim Your Spot, Limited Spaces Available"
      />
      
      <LimitedOfferBanner 
        message="Only 15 spots remaining this month"
        expiryDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)} // 7 days from now
      />
      
      <SocialProofSection />
      
      <BenefitsSection benefits={[
        {
          title: "Fully Automated Booking",
          description: "Our AI handles all customer inquiries and schedules appointments without human intervention",
          icon: "Calendar"
        },
        {
          title: "24/7 Availability",
          description: "Never miss another opportunity with round-the-clock appointment scheduling",
          icon: "Clock"
        },
        {
          title: "Qualified Appointments Only",
          description: "Our AI pre-qualifies leads, ensuring only serious prospects make it to your calendar",
          icon: "CheckCircle"
        },
        {
          title: "Zero Upfront Cost",
          description: "You only pay when we deliver confirmed appointments - no risk to you",
          icon: "DollarSign"
        }
      ]} />
      
      <LandingFooter />
    </div>
  );
} 