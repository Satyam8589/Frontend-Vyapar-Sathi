/**
 * Constants for Store Dashboard Feature
 */

// Store Dashboard View Options
export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list'
};

// Sort Options
export const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'created-desc', label: 'Newest First' },
  { value: 'created-asc', label: 'Oldest First' }
];

// Filter Options
export const BUSINESS_TYPE_FILTERS = [
  { value: 'all', label: 'All Types' },
  { value: 'retail', label: 'Retail' },
  { value: 'wholesale', label: 'Wholesale' },
  { value: 'both', label: 'Both' },
  { value: 'service', label: 'Service' },
  { value: 'other', label: 'Other' }
];

// Store Card Colors
export const STORE_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // yellow
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#14B8A6', // teal
];
