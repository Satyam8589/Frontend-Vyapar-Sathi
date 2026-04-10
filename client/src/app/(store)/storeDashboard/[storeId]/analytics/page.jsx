"use client";

import { useRouter, useParams } from "next/navigation";
import {
  AnalyticsDashboardContent,
  AnalyticsFilters,
  AnalyticsHeader,
  useAnalyticsDashboard,
} from "@/features/analyticsDashboard";

const AnalyticsPage = () => {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId;

  const analytics = useAnalyticsDashboard(storeId);

  return (
    <main className="min-h-screen px-2 py-3 sm:px-3 md:px-4 lg:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:gap-4 md:gap-6">
        <AnalyticsHeader
          store={analytics.store}
          onBack={() => router.push(`/storeDashboard/${storeId}`)}
          onAiDashboard={() =>
            router.push(`/storeDashboard/${storeId}/ai-dashboard`)
          }
          onRefresh={analytics.refresh}
          refreshing={
            analytics.loading.store ||
            analytics.loading.summary ||
            analytics.loading.trend
          }
        />

        <AnalyticsFilters
          rangeDays={analytics.rangeDays}
          onRangeChange={analytics.setRangeDays}
          store={analytics.store}
        />

        <AnalyticsDashboardContent
          store={analytics.store}
          summary={analytics.summary}
          trend={analytics.trend}
          categories={analytics.categories}
          topProducts={analytics.topProducts}
          slowMoving={analytics.slowMoving}
          productOverview={analytics.productOverview}
          loading={analytics.loading}
          error={analytics.error}
          selectedProductId={analytics.selectedProductId}
          selectedProduct={analytics.selectedProduct}
          onSelectProduct={analytics.setSelectedProductId}
        />
      </div>
    </main>
  );
};

export default AnalyticsPage;
