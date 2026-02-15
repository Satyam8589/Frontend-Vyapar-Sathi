'use client';

import { useInventoryContext } from '../context/inventoryContext';

/**
 * Custom hook for inventory operations
 */
export const useInventory = () => {
  const context = useInventoryContext();
  
  return {
    ...context
  };
};

export default useInventory;
