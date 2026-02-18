# Toast Notification System

This project now includes a comprehensive toast notification system using `react-hot-toast` to provide real-time feedback to users.

## 📦 Installation

The toast library is already installed and configured.

```bash
npm install react-hot-toast
```

## 🚀 Setup

The toast system is globally configured in:
- **Provider**: `src/app/providers.jsx` - Contains the `<Toaster />` component
- **Utilities**: `src/utils/toast.js` - Contains helper functions for showing toasts

## 📚 Usage

### Import the Toast Utilities

```javascript
import { showSuccess, showError, showWarning, showInfo, showLoading } from '@/utils/toast';
```

### Available Functions

#### 1. Success Toast
```javascript
showSuccess('Operation completed successfully!');
```

#### 2. Error Toast
```javascript
showError('Something went wrong!');
```

#### 3. Warning Toast
```javascript
showWarning('Please check your input.');
```

#### 4. Info Toast
```javascript
showInfo('This is an informational message.');
```

#### 5. Loading Toast
```javascript
const toastId = showLoading('Processing...');
// Later dismiss it
dismissToast(toastId);
```

#### 6. Promise Toast
For async operations, automatically shows loading → success/error:
```javascript
import { showPromise } from '@/utils/toast';

showPromise(
  apiCall(),
  {
    loading: 'Saving data...',
    success: 'Data saved successfully!',
    error: 'Failed to save data.'
  }
);
```

### Custom Options

All toast functions accept custom options as a second parameter:

```javascript
showSuccess('Custom toast!', {
  duration: 6000,
  position: 'bottom-center',
  style: {
    background: '#333',
    color: '#fff',
  },
});
```

## 📍 Where Toasts Are Already Integrated

### Authentication (`features/auth`)
- ✅ Login success/error
- ✅ Signup success/error
- ✅ Google login success/error
- ✅ Logout confirmation

### Store Management (`features/createStore`)
- ✅ Store creation success/error
- ✅ Form validation warnings

### Inventory Management (`features/inventory`)
- ✅ Product added successfully
- ✅ Product updated successfully
- ✅ Product deleted successfully
- ✅ Failed operations errors

### Store Dashboard (`features/storeDashboard`)
- ✅ Store fetching errors

## 🎨 Customization

You can customize the default toast appearance in `src/utils/toast.js`:

```javascript
const defaultOptions = {
  duration: 4000,
  position: 'top-right',
  style: {
    background: '#fff',
    color: '#0f172a',
    padding: '16px',
    borderRadius: '12px',
    // ... more styles
  },
};
```

## 🔧 Advanced Usage

### Dismiss Toasts Programmatically

```javascript
import { dismissToast } from '@/utils/toast';

// Dismiss a specific toast
dismissToast(toastId);

// Dismiss all toasts
dismissToast();
```

### Custom Toast with JSX

```javascript
import toast from 'react-hot-toast';

toast.custom((t) => (
  <div className="custom-toast">
    <h3>Custom Toast</h3>
    <button onClick={() => toast.dismiss(t.id)}>Close</button>
  </div>
));
```

## 📖 Examples from the Codebase

### Auth Hook Example
```javascript
// src/features/auth/hooks/useAuth.js
const login = async (payload) => {
  try {
    await withLoading(() => loginWithEmail(payload));
    showSuccess('Welcome back! Login successful.');
    router.push('/storeDashboard');
  } catch (err) {
    showError(getAuthErrorMessage(err));
    throw err;
  }
};
```

### Inventory Context Example
```javascript
// src/features/inventory/context/inventoryContext.jsx
const addProduct = async (productData) => {
  try {
    // ... add product logic
    showSuccess(`Product "${productData.name}" added successfully!`);
    return { success: true, data: newProduct };
  } catch (err) {
    const errorMessage = err?.message || 'Failed to add product';
    showError(errorMessage);
    return { success: false, error: errorMessage };
  }
};
```

## 🎯 Best Practices

1. **Use specific messages**: Instead of generic "Success", use "Product added successfully"
2. **Include entity names**: `Store "${storeName}" created successfully` is better than "Store created"
3. **Keep messages concise**: Toast messages should be easy to read at a glance
4. **Don't overuse**: Show toasts for important actions, not every small interaction
5. **Error messages should be helpful**: Tell users what went wrong and potentially how to fix it

## 🌐 Toast Positions

Available positions:
- `top-left`
- `top-center`
- `top-right` (default)
- `bottom-left`
- `bottom-center`
- `bottom-right`

Change the global position in `src/app/providers.jsx`:
```javascript
<Toaster position="bottom-right" />
```

## 🎨 Styling with Tailwind

Since this project uses Tailwind CSS, you can use Tailwind classes in custom styles:

```javascript
showSuccess('Success!', {
  className: 'bg-gradient-to-r from-blue-500 to-purple-500',
});
```

## 📚 Documentation

For more advanced features, check the official documentation:
https://react-hot-toast.com/
