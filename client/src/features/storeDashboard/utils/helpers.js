/**
 * Utility helper functions for Store Dashboard
 */

/**
 * Filter stores based on search query and filters
 */
export const filterStores = (stores, filters) => {
  let filtered = [...stores];

  // Filter by search
  if (filters.search) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter(store => 
      store.name.toLowerCase().includes(query) ||
      store.phone.includes(query) ||
      store.email?.toLowerCase().includes(query) ||
      store.address?.city?.toLowerCase().includes(query)
    );
  }

  // Filter by business type
  if (filters.businessType && filters.businessType !== 'all') {
    filtered = filtered.filter(store => store.businessType === filters.businessType);
  }

  return filtered;
};

/**
 * Sort stores based on sort option
 */
export const sortStores = (stores, sortBy) => {
  const sorted = [...stores];

  switch (sortBy) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'created-desc':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'created-asc':
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    default:
      return sorted;
  }
};

/**
 * Get initials from store name
 */
export const getStoreInitials = (name) => {
  if (!name) return '??';
  
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  
  return (words[0][0] + words[1][0]).toUpperCase();
};

/**
 * Format date for display
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Get random color for store card
 */
export const getStoreColor = (index) => {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#EC4899', '#14B8A6'
  ];
  return colors[index % colors.length];
};
