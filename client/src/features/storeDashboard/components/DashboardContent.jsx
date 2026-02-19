import { StoreList } from '@/features/storeDashboard/components';

const DashboardContent = ({ stores, loading, error, onStoreClick }) => {
  return (
    <section className="px-4 md:px-6 pb-12 mt-2 animate-fade-in-up [animation-delay:500ms]">
      <div className="max-w-7xl mx-auto">
        <StoreList
          stores={stores}
          loading={loading}
          error={error}
          onStoreClick={onStoreClick}
          viewMode="grid"
        />
      </div>
    </section>
  );
};

export default DashboardContent;
