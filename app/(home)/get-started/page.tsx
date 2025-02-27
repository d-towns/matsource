import { GetStartedHeader } from "@/components/get-started/GetStartedHeader";
import { GetStartedBenefits } from "@/components/get-started/GetStartedBenefits";
import { GetStartedWidget } from "@/components/get-started/GetStartedWidget";
import { GetStartedFooter } from "@/components/get-started/GetStartedFooter";

export default function GetStartedPage() {
  const benefits = [
    "Priority access to our AI automation platform",
    "Early adopter pricing (up to 40% discount)",
    "Personalized onboarding and setup assistance",
    "Direct influence on feature development",
    "Unlimited support during beta period"
  ];

  return (
    <div className="min-h-screen py-20 flex flex-col items-center justify-center">
      <div className="container max-w-4xl mx-auto px-4">
        <GetStartedHeader />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
          <GetStartedBenefits benefits={benefits} />
          <GetStartedWidget />
        </div>
        
        <GetStartedFooter />
      </div>
    </div>
  );
} 