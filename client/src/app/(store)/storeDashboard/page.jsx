'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import PageLoader from '@/components/PageLoader';

/**
 * Store Dashboard Page
 */
const StoreDashboard = () => {
  const router = useRouter();
  const [loaderMessage, setLoaderMessage] = useState('');
  const loaderTimerRef = useRef(null);
  const storeTimerRef = useRef(null);
  const { stores, loading, error, filters, updateFilters, refreshStores } = useStoreDashboard();

  // Clean up timers if component unmounts before 1s (fast navigation)
  useEffect(() => {
    return () => {
      if (loaderTimerRef.current) clearTimeout(loaderTimerRef.current);
      if (storeTimerRef.current) clearTimeout(storeTimerRef.current);
    };
  }, []);

  const handleStoreClick = async (store) => {
    let loaderTriggered = false;
    const startTime = Date.now();

    // Start 1s timer to decide if we show loader
    storeTimerRef.current = setTimeout(() => {
      setLoaderMessage('Opening store...');
      loaderTriggered = true;
    }, 1000);

    // Initial navigation request
    router.push(`/storeDashboard/${store._id}`);

    // If loader appears, ensure it stays for at least 2 seconds
    if (loaderTriggered) {
      const elapsed = Date.now() - startTime;
      const remainingForMinDisplay = 3000 - elapsed; // 1s wait + 2s display = 3s total
      if (remainingForMinDisplay > 0) {
        await new Promise(r => setTimeout(r, remainingForMinDisplay));
      }
    }
  };

  const handleCreateStore = async () => {
    let loaderTriggered = false;
    const startTime = Date.now();

    // Start 1s timer to decide if we show loader
    loaderTimerRef.current = setTimeout(() => {
      setLoaderMessage('Setting up your store form...');
      loaderTriggered = true;
    }, 1000);

    // Initial navigation request
    router.push('/createStore');

    // If loader appears, ensure it stays for at least 2 seconds
    if (loaderTriggered) {
      const elapsed = Date.now() - startTime;
      const remainingForMinDisplay = 3000 - elapsed; // 1s wait + 2s display = 3s total
      if (remainingForMinDisplay > 0) {
        await new Promise(r => setTimeout(r, remainingForMinDisplay));
      }
    }
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

      {/* Page navigation loader — shown when Create New Store is clicked */}
      {loaderMessage && <PageLoader message={loaderMessage} />}

      <main className="relative z-10">

        {/* ── Header ── */}
        <DashboardHeader 
          onCreateStore={handleCreateStore}
          filters={filters}
          updateFilters={updateFilters}
          refreshStores={refreshStores}
          stats={stats}
        />

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
