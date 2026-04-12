import {
  AIIntelligenceSection,
  AudienceSection,
  CoreFeaturesSection,
  FinalCTASection,
  HeroSection,
  ProofMetricsSection,
  WorkflowSection,
} from "@/features/features/components";
import {
  aiHighlights,
  coreFeatures,
  proofMetrics,
  workflow,
} from "@/features/features/data/featuresContent";

export default function Page() {
  return (
    <main className="min-h-screen bg-rad-yb">
      <div className="bg-mesh-light">
        <HeroSection />
        <ProofMetricsSection items={proofMetrics} />
        <CoreFeaturesSection items={coreFeatures} />
        <AIIntelligenceSection items={aiHighlights} />
        <WorkflowSection items={workflow} />
        <AudienceSection />
        <FinalCTASection />
      </div>
    </main>
  );
}
