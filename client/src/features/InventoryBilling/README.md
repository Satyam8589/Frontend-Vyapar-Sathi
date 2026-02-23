# Inventory Billing System

## Overview

The Inventory Billing System is a comprehensive point-of-sale (POS) solution integrated into the Vyapar-Sathi application. It allows store billers to create bills by scanning barcodes or manually adding products from the store's inventory.

## Features

### 1. **Barcode Scanning**

- Real-time barcode input (supports barcode scanners)
- Manual barcode entry with keyboard
- Automatic product lookup from store inventory
- Duplicate product handling (increments quantity)

### 2. **Manual Product Addition**

- Search products by name or barcode
- Browse complete store inventory
- Select and add products with custom quantities
- Visual stock availability indicators

### 3. **Bill Management**

- Real-time bill calculation
- Product quantity adjustment (+ / -)
- Individual product removal
- Clear entire bill option
- Stock limit validation

### 4. **Payment Processing**

- Multiple payment methods (Cash, Card, UPI)
- One-click payment completion
- Automatic inventory update
- Bill generation with unique bill number

### 5. **Bill Preview & Printing**

- Professional bill preview
- Print-ready bill format
- Store information header
- Itemized product list
- Total amount summary

## File Structure

```
InventoryBilling/
├── components/
│   ├── BarcodeInput.jsx           # Barcode scanning input
│   ├── BilledProductsList.jsx     # Current bill items display
│   ├── BillingTotal.jsx           # Payment summary & controls
│   ├── ManualProductModal.jsx     # Manual product selection
│   ├── BillPreviewModal.jsx       # Bill preview after payment
│   ├── BillingHeader.jsx          # Page header
│   ├── BillingActions.jsx         # Quick action buttons
│   └── index.js                   # Component exports
├── context/
│   └── billingContext.jsx         # Global billing state management
├── hooks/
│   ├── useBarcodeScanner.js       # Barcode scanning logic
│   ├── useManualProductAdd.js     # Manual product addition logic
│   ├── useBillPayment.js          # Payment processing logic
│   └── index.js                   # Hook exports
├── services/
│   └── billingService.js          # API communication layer
└── index.js                       # Feature exports
```

## Usage

### Accessing the Billing Page

Navigate to:

```
/storeDashboard/[storeId]/billing
```

### Basic Workflow

1. **Scan or Enter Product**
   - Use a barcode scanner or type the barcode manually
   - Press Enter or click "Add" to add the product

2. **Adjust Quantities**
   - Use + / - buttons to adjust quantities
   - Or type directly in the quantity field

3. **Add Additional Products**
   - Keep scanning/adding products as needed
   - Or use "Add Product Manually" for browsing

4. **Select Payment Method**
   - Choose: Cash, Card, or UPI

5. **Complete Payment**
   - Click "Complete Payment"
   - Bill is generated and inventory is updated automatically

6. **Print Bill**
   - Bill preview appears after successful payment
   - Click "Print Bill" to print

## Components

### BarcodeInput

Handles barcode scanning and manual entry:

- Auto-focus for barcode scanners
- Enter key support
- Loading states

### BilledProductsList

Displays current bill items:

- Product details
- Quantity controls
- Price calculations
- Remove product option

### BillingTotal

Payment summary and actions:

- Total amount display
- Payment method selection
- Clear bill option
- Complete payment button

### ManualProductModal

Product selection interface:

- Search functionality
- Product list with details
- Quantity selector
- Add to bill button

### BillPreviewModal

Post-payment bill display:

- Professional bill format
- Store information
- Itemized list
- Print functionality

## Context & State Management

### BillingContext

Central state management for:

- Current store details
- Billed products list
- Loading states
- Error handling
- Product operations (add, remove, update)
- Bill processing

## Hooks

### useBarcodeScanner

Manages barcode scanning:

- Input handling
- Enter key detection
- Loading states

### useManualProductAdd

Handles manual product selection:

- Search filtering
- Product selection
- Quantity management
- Modal state

### useBillPayment

Payment processing:

- Payment method selection
- Bill generation
- Inventory updates
- Print bill generation

## API Services

### billingService.js

**Functions:**

- `getProductByBarcode(barcode, storeId)` - Fetch product by barcode
- `searchProductInStore(searchTerm, storeId)` - Search products
- `generateBill(billData)` - Create and save bill
- `updateInventoryAfterSale(storeId, products)` - Update inventory
- `getStoreProducts(storeId)` - Fetch all store products
- `getBillHistory(storeId, limit)` - Fetch bill history

## Backend API Requirements

The billing system expects these endpoints:

```
GET  /product/barcode/:barcode?storeId=:storeId
GET  /product/search?query=:query&storeId=:storeId
POST /billing/generate
PUT  /product/bulk-update/:storeId
GET  /product/all?storeId=:storeId
GET  /billing/history/:storeId?limit=:limit
```

## Bill Data Structure

```javascript
{
  storeId: String,
  products: [
    {
      productId: String,
      name: String,
      barcode: String,
      quantity: Number,
      price: Number,
      total: Number
    }
  ],
  totalAmount: Number,
  paymentMethod: String, // 'cash' | 'card' | 'upi'
  billedBy: String,      // User UID
  billedAt: String       // ISO timestamp
}
```

## Features to Implement on Backend

1. **Barcode Product Lookup**
   - Search product by barcode in store inventory
   - Return product details with stock quantity

2. **Bill Generation**
   - Create unique bill number
   - Save bill to database
   - Return bill with all details

3. **Inventory Update**
   - Reduce product quantities after sale
   - Update stock levels
   - Handle out-of-stock scenarios

4. **Bill History**
   - Store all bills with timestamps
   - Support pagination
   - Filter by date/store

## Keyboard Shortcuts

- **Enter** - Add product after scanning/entering barcode
- **Tab** - Navigate between fields
- **Escape** - Close modals

## Responsive Design

The billing system is fully responsive:

- **Desktop**: 3-column layout (inputs + products | actions + total)
- **Tablet**: 2-column layout
- **Mobile**: Single column, stacked layout

## Error Handling

- Product not found alerts
- Stock limit warnings
- Network error messages
- Validation error displays

## Future Enhancements

1. Discount application
2. Tax calculations
3. Customer information capture
4. Receipt email/SMS
5. Return/refund handling
6. Daily sales reports
7. Shift management
8. Multiple currency support
9. Loyalty points integration
10. Offline mode support

## Testing

To test the billing system:

1. Navigate to a store's billing page
2. Use test barcodes (if available in your inventory)
3. Test manual product addition
4. Verify quantity adjustments
5. Test payment flow
6. Verify bill generation
7. Check inventory updates

## Troubleshooting

**Barcode not working?**

- Ensure the barcode exists in your inventory
- Check if it's associated with the current store
- Verify barcode scanner configuration

**Products not loading?**

- Check network connection
- Verify store ID is correct
- Check browser console for errors

**Payment failing?**

- Ensure all products have valid prices
- Check backend API is running
- Verify authentication token

## Support

For issues or feature requests, contact the development team or create an issue in the project repository.

---

**Version:** 1.0.0  
**Last Updated:** February 23, 2026  
**Developed for:** Vyapar-Sathi Platform
