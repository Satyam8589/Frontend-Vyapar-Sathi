# Create Store Feature

This feature module handles store creation functionality in the Vyapar Sathi application. This is a focused module for **creating new stores only**. Store management, viewing, and editing features will be in the dashboard module.

## 📁 Folder Structure

```
createStore/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   └── Textarea.jsx
│   ├── steps/          # Form step components
│   │   ├── BasicInfoStep.jsx
│   │   ├── AddressStep.jsx
│   │   ├── BusinessDetailsStep.jsx
│   │   └── ReviewStep.jsx
│   ├── FormStepIndicator.jsx
│   ├── FormNavigation.jsx
│   └── StoreForm.jsx   # Main form component
├── context/            # React context providers
│   └── CreateStoreContext.jsx
├── hooks/              # Custom React hooks
│   └── useCreateStore.js
├── services/           # API service functions
│   └── storeService.js
├── constants/          # Constants and enums
│   └── index.js
├── utils/              # Helper functions
│   └── helpers.js
└── index.js           # Central exports
```

## 🚀 Features

### Services (`services/storeService.js`)
API function for store creation:
- `createStore(storeData)` - Create a new store
- `validateStoreData(storeData)` - Validate store data

### Context (`context/CreateStoreContext.jsx`)
Global state management for store creation:
- Form data management
- Multi-step form state (4 steps)
- Loading and error states
- Form validation
- Submit handling
- Auto-navigation between steps

### Hooks (`hooks/useCreateStore.js`)
Custom hooks for store creation:
- `useCreateStore()` - Simple store creation hook
- `useStoreValidation()` - Form validation helper

### Components
**Main Components:**
- `StoreForm.jsx` - Multi-step form container
- `FormStepIndicator.jsx` - Visual progress indicator
- `FormNavigation.jsx` - Navigation buttons

**Form Steps:**
- `BasicInfoStep.jsx` - Store name, phone, email
- `AddressStep.jsx` - Complete address details
- `BusinessDetailsStep.jsx` - Business type and settings
- `ReviewStep.jsx` - Review and submit

**UI Components:**
- `Input.jsx` - Text input with validation
- `Select.jsx` - Dropdown select
- `Textarea.jsx` - Multi-line text input
- `Button.jsx` - Reusable button component

### Constants (`constants/index.js`)
- Business types (retail, wholesale, both, service, other)
- Currency options (INR, USD, EUR, GBP)
- All Indian states
- Form steps configuration
- Validation patterns
- Error/success messages

### Utils (`utils/helpers.js`)
Helper functions for:
- Phone number formatting/validation
- Email validation
- Address formatting and auto-generation
- Form validation
- Data sanitization

## 💻 Usage

### Basic Usage (Page is already set up!)

The create store page is already fully integrated. Just navigate to `/createStore` route.

```jsx
// app/createStore/page.jsx (Already implemented)
import { CreateStoreProvider } from '@/features/createStore/context/CreateStoreContext';
import StoreForm from '@/features/createStore/components/StoreForm';

function CreateStorePage() {
  return (
    <CreateStoreProvider>
      <StoreForm />
    </CreateStoreProvider>
  );
}
```

### Using the Hook Directly

If you need to create a store from a different component:

```jsx
import { useCreateStore } from '@/features/createStore';

function MyComponent() {
  const { createStore, loading, error, success } = useCreateStore();
  
  const handleCreate = async (formData) => {
    const result = await createStore(formData);
    if (result.success) {
      console.log('Store created:', result.data);
    }
  };
  
  return (
    // Your component
  );
}
```

## 📋 Store Data Structure

```javascript
{
  name: string,              // Required, max 100 chars
  phone: string,             // Required, 10 digits
  email: string,             // Optional, valid email
  address: {
    street: string,
    city: string,
    state: string,
    pincode: string,         // 6 digits
    country: string,         // Default: "India"
    fullAddress: string      // Required
  },
  businessType: string,      // retail|wholesale|both|service|other
  settings: {
    lowStockThreshold: number,    // Default: 10
    expiryAlertDays: number,      // Default: 7
    currency: string               // Default: "INR"
  },
  description: string,       // Optional, max 500 chars
  logo: string              // Optional, URL
}
```

## 🔗 API Endpoints

All endpoints require authentication (Bearer token).

- `POST /api/store/create` - Create store
- `GET /api/store/all` - Get all user stores
- `GET /api/store/:storeId` - Get specific store
- `PUT /api/store/:storeId` - Update store
- `DELETE /api/store/:storeId` - Delete store

## � Form Flow

The create store form has 4 steps:

1. **Basic Information** - Store name, phone number, email (optional)
2. **Address** - Complete store address with auto-generation
3. **Business Details** - Business type, description, and settings
4. **Review** - Review all details before submission

Each step is validated before proceeding to the next. The form automatically tracks progress and allows navigation between steps.

## 🔐 Authentication

The API automatically includes the auth token from localStorage. Ensure the user is logged in before accessing create store functionality.

## ⚠️ Error Handling

All services return consistent response format:
```javascript
{
  success: boolean,
  data: object,      // On success
  error: string      // On failure
}
```

## 📝 Notes

- All form fields are validated both on frontend and backend
- Phone numbers must be 10 digits (Indian format)
- Pincode must be 6 digits
- Store names are unique per owner
- Deleted stores are soft-deleted (isActive: false)


All endpoints require authentication (Bearer token).

- `POST /api/store/create` - Create a new store
This module is focused **only on creating stores**
- Store management features (view, edit, delete) should be in the dashboard module
- All form fields are validated both on frontend and backend
- Phone numbers must be 10 digits (Indian format)
- Pincode must be 6 digits
- Store names are unique per owner
- Full address is auto-generated from address fields but can be manually edited
- Success message is shown upon creation
- Form supports step-by-step navigation with validation

## 🚀 Features Implemented

✅ Multi-step form with 4 steps  
✅ Real-time form validation  
✅ Auto-address generation  
✅ Phone number and pincode formatting  
✅ Visual progress indicator  
✅ Responsive design  
✅ Loading states  
✅ Error handling  
✅ Success notifications  
✅ Context-based state management  