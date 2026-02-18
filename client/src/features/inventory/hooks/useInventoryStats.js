import { useMemo } from 'react';
import { INVENTORY_DEFAULTS } from '@/features/inventory/constants';
import { useInventoryContext } from '@/features/inventory/context/inventoryContext';

/**
 * Custom hook for calculating inventory statistics
 * Handles all stats-related calculations
 */
export const useInventoryStats = () => {
  const { products, currentStore, loading } = useInventoryContext();

  // Get configuration from store or use defaults
  const threshold = currentStore?.settings?.lowStockThreshold || INVENTORY_DEFAULTS.LOW_STOCK_THRESHOLD;
  const currencySymbol = currentStore?.settings?.currency === 'INR'
    ? '₹'
    : currentStore?.settings?.currency || INVENTORY_DEFAULTS.CURRENCY_SYMBOL;

  // Calculate stats using useMemo for performance
  const stats = useMemo(() => {
    if (loading || !products) {
      return [
        { label: 'Total Products', value: '...', color: 'blue' },
        { label: 'Low Stock', value: '...', color: 'amber' },
        { label: 'Out of Stock', value: '...', color: 'red' },
        { label: 'Total Value', value: '...', color: 'emerald' },
      ];
    }

    const lowStockCount = products.filter(
      (p) => (p.quantity || p.qty) <= threshold && (p.quantity || p.qty) > 0
    ).length;

    const outOfStockCount = products.filter(
      (p) => (p.quantity || p.qty) === 0
    ).length;

    const totalValue = products.reduce(
      (acc, p) => acc + p.price * (p.quantity || p.qty || 0),
      0
    );

    return [
      {
        label: 'Total Products',
        value: products.length.toString(),
        color: 'blue',
      },
      {
        label: 'Low Stock',
        value: lowStockCount.toString(),
        color: 'amber',
      },
      {
        label: 'Out of Stock',
        value: outOfStockCount.toString(),
        color: 'red',
      },
      {
        label: 'Total Value',
        value: `${currencySymbol}${totalValue.toLocaleString()}`,
        color: 'emerald',
      },
    ];
  }, [products, loading, threshold, currencySymbol]);

  return {
    stats,
    threshold,
    currencySymbol,
  };
};

export default useInventoryStats;
