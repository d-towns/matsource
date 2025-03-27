import { FeatureFAQ } from "@/components/feature-page/FeatureFAQ";
import { SupportMaintenanceCard } from "@/components/pricing/SupportMaintenanceCard";
import CalendarSection from "@/components/ui/CalendarSection";
import { BookDemoButton } from "@/components/BookDemoButton";
import { supportMaintenanceFAQs } from "@/data/support-maintenance-faqs";



export default function CustomerSupportPage() {
  return (
    <div>
        <div className="my-20">
            <div className="max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="text-6xl text-center font-semibold mb-12">We'll <span></span>support you <br/> all the way.</h2>
          <BookDemoButton />
            </div> 
          <p className="text-center text-gray-600 mb-12"></p>
          <div className="max-w-2xl mx-auto">
            <h3 className="text-4xl font-semibold mb-4">Optional Support Packages</h3>
            <SupportMaintenanceCard />
          </div>
        </div>
        <div className="my-20">
            <FeatureFAQ faqs={supportMaintenanceFAQs} title="Frequently Asked Questions" subtitle="Got questions? We've got answers." />
        </div>
        <CalendarSection />
    </div>
  );
}
