# Billing System - Quick Start Guide

## Integration Steps

### 1. Navigate to Billing Page

The billing page is accessible at:

```
/storeDashboard/[storeId]/billing
```

For example:

```
/storeDashboard/65abc123def456/billing
```

### 2. Add Navigation Link

Add a link to the billing page in your store dashboard. In your store dashboard page or navigation component:

```jsx
import Link from "next/link";
import { useParams } from "next/navigation";

function StoreDashboard() {
  const { storeId } = useParams();

  return (
    <Link href={`/storeDashboard/${storeId}/billing`}>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
        Open Billing System
      </button>
    </Link>
  );
}
```

Or add it to your navigation menu:

```jsx
const menuItems = [
  { label: "Dashboard", href: `/storeDashboard/${storeId}` },
  { label: "Inventory", href: `/storeDashboard/${storeId}` },
  { label: "Billing", href: `/storeDashboard/${storeId}/billing` }, // Add this
  { label: "Reports", href: `/storeDashboard/${storeId}/reports` },
];
```

### 3. Backend API Endpoints Required

Make sure your backend has these endpoints implemented:

```javascript
// Product endpoints
router.get("/product/barcode/:barcode", getProductByBarcode);
router.get("/product/search", searchProducts);
router.get("/product/all", getAllStoreProducts);

// Billing endpoints
router.post("/billing/generate", generateBill);
router.put("/product/bulk-update/:storeId", bulkUpdateInventory);
router.get("/billing/history/:storeId", getBillHistory);
```

### 4. Install Dependencies (if not already installed)

The billing system uses these packages (should already be in your project):

```bash
npm install lucide-react
# or
npm install react-icons
```

### 5. Barcode Scanner Setup

For physical barcode scanners:

- Most USB barcode scanners work as keyboard input devices
- No additional configuration needed
- Scanner will automatically input into the focused barcode field

For testing without a scanner:

- Manually type barcodes in the input field
- Press Enter to add products

### 6. Environment Variables

Ensure your API URL is configured in `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Sample Backend Implementation

### Get Product by Barcode

```javascript
// Controller: product.controller.js
exports.getProductByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;
    const { storeId } = req.query;

    const product = await Product.findOne({
      barcode,
      store: storeId,
    }).populate("store", "name address phone");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
```

### Generate Bill

```javascript
// Controller: billing.controller.js
exports.generateBill = async (req, res) => {
  try {
    const { storeId, products, totalAmount, paymentMethod, billedBy } =
      req.body;

    // Generate unique bill number
    const billCount = await Bill.countDocuments({ store: storeId });
    const billNumber =
      `BILL-${storeId.slice(-6)}-${billCount + 1}`.toUpperCase();

    // Get store info
    const store = await Store.findById(storeId);

    // Create bill
    const bill = await Bill.create({
      billNumber,
      store: storeId,
      products,
      totalAmount,
      paymentMethod,
      billedBy,
      billedAt: new Date(),
      storeInfo: {
        name: store.name,
        address: store.address,
        phone: store.phone,
      },
    });

    res.status(201).json({
      success: true,
      data: bill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
```

### Bulk Update Inventory

```javascript
// Controller: product.controller.js
exports.bulkUpdateInventory = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { products } = req.body; // [{ productId, quantityReduction }]

    // Update each product's quantity
    for (const item of products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantityReduction },
      });
    }

    res.json({
      success: true,
      message: "Inventory updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
```

## Sample Database Schema

### Bill Model

```javascript
// models/bill.model.js
const billSchema = new mongoose.Schema(
  {
    billNumber: {
      type: String,
      required: true,
      unique: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: String,
        barcode: String,
        quantity: Number,
        price: Number,
        total: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi"],
      required: true,
    },
    billedBy: {
      type: String, // Firebase UID
      required: true,
    },
    billedAt: {
      type: Date,
      default: Date.now,
    },
    storeInfo: {
      name: String,
      address: String,
      phone: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Bill", billSchema);
```

## Testing Checklist

- [ ] Can access billing page from store dashboard
- [ ] Barcode input field is auto-focused
- [ ] Can add products by barcode
- [ ] Can add products manually
- [ ] Quantity adjustment (+/-) works
- [ ] Remove product works
- [ ] Total calculation is correct
- [ ] Payment method selection works
- [ ] Payment processing succeeds
- [ ] Bill preview displays correctly
- [ ] Print functionality works
- [ ] Inventory is updated after payment
- [ ] Error messages display appropriately
- [ ] Loading states show during operations

## Common Issues & Solutions

### Issue: "Product not found"

**Solution:** Ensure the product exists in your database and has the correct barcode association

### Issue: Bill generation fails

**Solution:** Check if the backend billing endpoint is implemented and working

### Issue: Inventory not updating

**Solution:** Verify the bulk-update endpoint is correctly reducing product quantities

### Issue: Barcode scanner not working

**Solution:**

- Check if scanner is in keyboard mode
- Test by opening a text editor - scanner should type the barcode
- Ensure the billing page input is focused

## Performance Tips

1. **Lazy Loading**: Components are already lazy-loaded where appropriate
2. **Memoization**: Context values are memoized to prevent unnecessary re-renders
3. **Debouncing**: Consider adding debouncing to the search functionality if the product list is very large

## Security Considerations

1. **Authentication**: Ensure only authorized users can access the billing page
2. **Authorization**: Verify user has permission for the specific store
3. **Validation**: Backend should validate all bill data before processing
4. **Audit Trail**: Keep logs of all billing transactions

## Next Steps

After integration:

1. Test with real products and barcodes
2. Train staff on using the system
3. Set up backup procedures
4. Monitor for any errors or issues
5. Gather user feedback for improvements

## Support

For help with integration, contact the development team or refer to the main [README.md](./README.md).
