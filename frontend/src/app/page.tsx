import { Navbar } from "@/components/home/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustBar } from "@/components/home/TrustBar";
import { PlatformOverview } from "@/components/home/PlatformOverview";
import { AiInsightsShowcase } from "@/components/home/AiInsightsShowcase";
import { AnalyticsShowcase } from "@/components/home/AnalyticsShowcase";
import { PredictionsShowcase } from "@/components/home/PredictionsShowcase";
import { WorkflowAutomation } from "@/components/home/WorkflowAutomation";
import { SecurityGovernance } from "@/components/home/SecurityGovernance";
import { ArchitectureShowcase } from "@/components/home/ArchitectureShowcase";
import { OperationsCenter } from "@/components/home/OperationsCenter";
import { WhyThisPlatform } from "@/components/home/WhyThisPlatform";
import { EngineeringHighlights } from "@/components/home/EngineeringHighlights";
import { Testimonials } from "@/components/home/Testimonials";
import { MetricsSection } from "@/components/home/MetricsSection";
import { FinalCta } from "@/components/home/FinalCta";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black font-sans antialiased selection:bg-blue-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <TrustBar />
        <PlatformOverview />
        <AiInsightsShowcase />
        <AnalyticsShowcase />
        <PredictionsShowcase />
        <WorkflowAutomation />
        <SecurityGovernance />
        <ArchitectureShowcase />
        <OperationsCenter />
        <WhyThisPlatform />
        <EngineeringHighlights />
        <Testimonials />
        <MetricsSection />
        <FinalCta />
      </main>
    </div>
  );
}
