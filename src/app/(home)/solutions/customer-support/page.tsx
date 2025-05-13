import { FeatureFAQ } from "@/components/feature-page/FeatureFAQ";
import { SupportMaintenanceCard } from "@/components/pricing/SupportMaintenanceCard";
import CalendarSection from "@/components/ui/CalendarSection";
import { supportMaintenanceFAQs } from "@/data/support-maintenance-faqs";
import { FeatureHero } from "@/components/feature-page/FeatureHero";
import { Separator } from "@/components/ui/separator";



export default function CustomerSupportPage() {
    return (
        <div>
            <div className="">
                <FeatureHero title="We'll support you all the way." subtitle="We offer optional support packages to help you get the most out of your AI voice agents." description="AI is evolving rapidly, and we want to make sure you're always on the cutting edge." />
                <div className="max-w-2xl mx-auto mt-20 p-8">
                    <h3 className="text-4xl font-semibold mb-4"><span className="text-primary underline">Optional</span> Support Packages</h3>
                    <SupportMaintenanceCard />
                </div>
                    <Separator className="mt-12 w-full" />
            </div>
            <div className="mt-20">
                <FeatureFAQ faqs={supportMaintenanceFAQs} title="Frequently Asked Questions" subtitle="Got questions? We've got answers." />
            </div>
            <Separator className="mt-12 w-full" />
            <CalendarSection />
        </div>
    );
}
