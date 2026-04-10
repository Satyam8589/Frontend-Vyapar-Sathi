import AnalyticsSummaryGrid from "./AnalyticsSummaryGrid";
import CategorySection from "./sections/CategorySection";
import EmptyState from "./EmptyState";
import ProductOverviewSection from "./sections/ProductOverviewSection";
import SlowMovingSection from "./sections/SlowMovingSection";
import TopProductsSection from "./sections/TopProductsSection";
import TrendSection from "./sections/TrendSection";

const AnalyticsDashboardContent = ({
  store,
  summary,
  trend,
  categories,
  topProducts,
  slowMoving,
  productOverview,
  loading,
  error,
  selectedProductId,
  selectedProduct,
  onSelectProduct,
}) => {
  const primaryLoading = loading.store && loading.summary && loading.trend;

  if (primaryLoading) {
    return (
      <div className="space-y-3 sm:space-y-5 md:space-y-6">
        <EmptyState
          title="Loading analytics dashboard"
          description="Sales, category, and product analytics are being prepared for this store."
        />
      </div>
    );
  }

  const allCriticalFailed = error.store && error.summary && error.trend;

  if (allCriticalFailed) {
    return (
      <EmptyState
        title="Analytics unavailable"
        description="The analytics API could not return dashboard data for this store right now."
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      <AnalyticsSummaryGrid summary={summary} store={store} />

      <TrendSection trend={trend} loading={loading.trend} error={error.trend} />

      <CategorySection
        categories={categories}
        loading={loading.categories}
        error={error.categories}
        store={store}
      />

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 xl:grid-cols-2">
        <TopProductsSection
          topProducts={topProducts}
          loading={loading.topProducts}
          error={error.topProducts}
          onSelectProduct={onSelectProduct}
          selectedProductId={selectedProductId}
          store={store}
        />
        <SlowMovingSection
          slowMoving={slowMoving}
          loading={loading.slowMoving}
          error={error.slowMoving}
        />
      </div>

      <ProductOverviewSection
        productOverview={productOverview}
        loading={loading.productOverview}
        error={error.productOverview}
        selectedProduct={selectedProduct}
        store={store}
      />
    </div>
  );
};

export default AnalyticsDashboardContent;
