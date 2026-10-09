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

    const getProductQuantity = (p) => {
      const q = p?.quantity ?? p?.qty ?? 0;
      const val = Number(q);
      return isNaN(val) ? 0 : val;
    };

    const getProductSellingPrice = (p) => {
      const price = p?.sellingPrice ?? p?.price ?? p?.salesPrice ?? p?.mrp ?? p?.costPrice ?? 0;
      const val = Number(price);
      return isNaN(val) ? 0 : val;
    };

    const lowStockCount = products.filter(
      (p) => {
        const qty = getProductQuantity(p);
        return qty <= threshold && qty > 0;
      }
    ).length;

    const outOfStockCount = products.filter(
      (p) => getProductQuantity(p) === 0
    ).length;

    const totalValue = products.reduce(
      (acc, p) => acc + (getProductSellingPrice(p) * getProductQuantity(p)),
      0
    );

    const formattedValue = isNaN(totalValue) ? 0 : totalValue;

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
        value: `${currencySymbol}${formattedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
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
