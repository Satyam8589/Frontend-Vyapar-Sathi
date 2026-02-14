# Store Dashboard Feature

This feature module handles the display and management of all stores for the logged-in user.

## Overview

The Store Dashboard provides:
- Grid/List view of all user stores
- Search and filter functionality
- Statistics overview
- Quick navigation to create new stores
- Store selection for detailed view

## Structure

```
storeDashboard/
├── components/          # UI Components
│   ├── StoreCard.jsx   # Individual store card component
│   ├── StoreList.jsx   # Store list/grid container
│   └── index.js        # Component exports
├── constants/          # Feature constants
│   └── index.js       # View modes, filters, sort options
├── context/           # React Context
│   └── StoreDashboardContext.jsx  # Global state management
├── hooks/             # Custom React hooks
│   └── useStoreDashboard.js  # Dashboard logic hook
├── services/          # API services
│   └── storeDashboardService.js  # API calls
├── types/            # TypeScript/JSDoc types
│   └── index.js      # Type definitions
├── utils/            # Helper functions
│   └── helpers.js    # Utility functions
├── index.js          # Main exports
└── README.md         # This file
```

## Usage

### Basic Usage (with Hook)

```jsx
import { useStoreDashboard } from '@/features/storeDashboard';

function MyComponent() {
  const {
    stores,
    loading,
    error,
    filters,
    updateFilters,
    refreshStores
  } = useStoreDashboard();

  return (
    <div>
      {stores.map(store => (
        <div key={store._id}>{store.name}</div>
      ))}
    </div>
  );
}
```

### With Context Provider

```jsx
import { StoreDashboardProvider, useStoreDashboardContext } from '@/features/storeDashboard';

function App() {
  return (
    <StoreDashboardProvider>
      <Dashboard />
    </StoreDashboardProvider>
  );
}

function Dashboard() {
  const { stores, loading } = useStoreDashboardContext();
  // ... component logic
}
```

### Using Components

```jsx
import { StoreList, StoreCard } from '@/features/storeDashboard/components';

function MyDashboard() {
  const { stores, loading, error } = useStoreDashboard();

  return (
    <StoreList
      stores={stores}
      loading={loading}
      error={error}
      onStoreClick={(store) => console.log(store)}
      viewMode="grid"
    />
  );
}
```

## API Integration

### Endpoints Used

- `GET /api/store/all` - Fetch all stores for the user
- `GET /api/store/:storeId` - Fetch single store details

### Response Format

```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "store123",
      "name": "My Store",
      "phone": "1234567890",
      "email": "store@example.com",
      "address": {
        "fullAddress": "123 Main St",
        "city": "Mumbai",
        "state": "MH",
        "pincode": "400001"
      },
      "businessType": "retail",
      "description": "Store description",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Stores fetched successfully"
}
```

## Features

### Search & Filters

- **Search**: Filter by store name, phone, email, or city
- **Business Type**: Filter by retail, wholesale, both, service, or other
- **Sort**: By name (A-Z, Z-A) or creation date (newest/oldest)

### View Modes

- **Grid View**: Card-based layout for visual browsing
- **List View**: Compact list for quick scanning (TODO)

### Statistics

- Total Stores count
- Active stores count
- Stores by business type (Retail/Wholesale)

## Components

### StoreCard

Displays individual store information in a card format.

**Props:**
- `store` (object): Store data
- `index` (number): Index for color variation
- `onClick` (function): Click handler

### StoreList

Container component for displaying stores in grid or list view.

**Props:**
- `stores` (array): Array of store objects
- `loading` (boolean): Loading state
- `error` (string): Error message
- `onStoreClick` (function): Store click handler
- `viewMode` (string): 'grid' or 'list'

## Hooks

### useStoreDashboard

Main hook for dashboard functionality.

**Returns:**
- `stores`: Filtered and sorted stores
- `allStores`: All stores (unfiltered)
- `loading`: Loading state
- `error`: Error message
- `filters`: Current filters
- `updateFilters(filters)`: Update filters
- `resetFilters()`: Reset all filters
- `refreshStores()`: Refresh store list
- `fetchStores()`: Manually fetch stores

## Utilities

### Helper Functions

- `filterStores(stores, filters)`: Filter stores by search and business type
- `sortStores(stores, sortBy)`: Sort stores
- `getStoreInitials(name)`: Get store initials for avatar
- `getStoreColor(index)`: Get color for store card
- `formatDate(date)`: Format date for display

## Future Enhancements

- [ ] Store analytics and metrics
- [ ] Bulk operations (archive, delete)
- [ ] Export store list
- [ ] Advanced filters (date range, location)
- [ ] Store performance indicators
- [ ] Favorites/pinned stores
- [ ] Recent stores section
- [ ] Store templates

## Related Features

- `createStore` - Create new store
- `auth` - User authentication (required)

## Dependencies

- React hooks (useState, useCallback, useEffect)
- Next.js (Image, useRouter)
- Axios (API calls)
- Context API (state management)
