'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useStoreDashboard } from '@/features/storeDashboard/hooks/useStoreDashboard';
import { STATS_CONFIG } from '@/features/storeDashboard/constants';
import {
  DashboardHeader,
  StatsBar,
  SearchFiltersSection,
  DashboardContent,
  MobileStorePanel,
} from '@/features/storeDashboard/components';

/**
 * Store Dashboard Page
 */
const StoreDashboard = () => {
  const router = useRouter();
  const { stores, loading, error, filters, updateFilters, refreshStores } = useStoreDashboard();

  const handleStoreClick = (store) => {
    router.push(`/storeDashboard/${store._id}`);
  };

  const handleCreateStore = () => {
    router.push('/createStore');
  };

  // Build stats array from config
  const stats = STATS_CONFIG.map((statConfig) => {
    let value;
    if (loading) {
      value = '...';
    } else {
      switch (statConfig.key) {
        case 'total':
          value = stores.length;
          break;
        case 'active':
          value = stores.length;
          break;
        case 'retail':
          value = stores.filter(s => s.businessType === 'retail').length;
          break;
        case 'wholesale':
          value = stores.filter(s => s.businessType === 'wholesale').length;
          break;
        default:
          value = 0;
      }
    }
    return { label: statConfig.label, value };
  });

  return (
    <div className="flex flex-col relative selection:bg-blue-500/20 antialiased">
      <main className="relative z-10">

        {/* ── Header ── */}
        <DashboardHeader onCreateStore={handleCreateStore} />

        {/* ── Mobile Store Panel ── */}
        <div className="px-4 md:px-6 md:hidden">
          <MobileStorePanel
            filters={filters}
            updateFilters={updateFilters}
            refreshStores={refreshStores}
            stats={stats}
          />
        </div>

        {/* ── Stats Bar — desktop only ── */}
        <StatsBar stats={stats} />

        {/* ── Search & Filters ── */}
        <SearchFiltersSection
          filters={filters}
          updateFilters={updateFilters}
          refreshStores={refreshStores}
        />

        {/* ── Store List ── */}
        <DashboardContent
          stores={stores}
          loading={loading}
          error={error}
          onStoreClick={handleStoreClick}
        />

      </main>
    </div>
  );
};

export default StoreDashboard;
