# Real-Time Billing Sync Feature

## Overview

The Real-Time Billing Sync feature allows you to scan barcodes on your mobile phone and see the products appear instantly on your laptop/desktop screen in the billing page. This eliminates the need to manually refresh the page and enables a seamless multi-device billing workflow.

## How It Works

The feature uses **Firebase Firestore** for real-time synchronization between devices. When you scan a product on your phone, it's immediately saved to Firestore, and any device listening to that billing session will receive the update instantly.

## Setup

### Prerequisites

1. **Firebase Project**: Ensure you have a Firebase project set up with Firestore enabled
2. **Environment Variables**: Make sure your `.env` file has the Firebase configuration:
   ```env
   NEXT_PUBLIC_API_KEY=your_api_key
   NEXT_PUBLIC_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_PROJECT_ID=your_project_id
   NEXT_PUBLIC_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_APP_ID=your_app_id
   NEXT_PUBLIC_MEASUREMENT_ID=your_measurement_id
   ```

### Firestore Security Rules

Add the following security rules to your Firestore to allow read/write access to billing sessions:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /billingSessions/{sessionId} {
      // Allow authenticated users to read and write their store's sessions
      allow read, write: if request.auth != null;
    }
  }
}
```

## Usage

### Step 1: Enable Real-Time Sync (Laptop/Desktop)

1. Navigate to the billing page for your store
2. Look for the **"Real-Time Sync"** section at the top of the page
3. Click the **"Enable Sync"** button (green button with Wi-Fi icon)
4. The sync status will change from "Disconnected" to "Connected"

### Step 2: Get Mobile Scan URL

Once sync is enabled, you'll see a **"Show QR Code"** button. Click it to:

1. **Option 1 - Scan QR Code**:
   - Open your phone's camera app
   - Point it at the QR code displayed on the screen
   - Tap the link that appears
   - This will open the billing page in "Mobile Scanning Mode"

2. **Option 2 - Copy URL**:
   - Click the "Copy" button below the QR code
   - Send the URL to your phone via WhatsApp, Email, SMS, etc.
   - Open the link on your phone

### Step 3: Start Scanning on Mobile

1. Once the mobile page loads, you'll see "Mobile Scanning Mode" indicator at the top
2. Use the barcode scanner on your phone to scan products
3. Each scanned product will:
   - Be added to your phone's local bill
   - **Instantly sync to the laptop/desktop** via Firestore
   - Appear in the billing list without any refresh

### Step 4: Complete Payment (Laptop/Desktop)

1. Watch as products appear in real-time on your laptop
2. Review the bill, adjust quantities if needed
3. Enter customer phone number (optional for WhatsApp)
4. Select payment method
5. Click "Complete Payment"

### Step 5: Disable Sync (Optional)

When you're done with multi-device scanning:

- Click the **"Disable Sync"** button (red button with Wi-Fi Off icon)
- This will stop real-time synchronization

## Features

### Real-Time Sync Indicator

The sync indicator shows the current connection status:

- **🔴 Disconnected** (Gray dot): Sync is disabled
- **🟡 Connecting** (Yellow pulsing dot): Establishing connection
- **🟢 Connected** (Green dot): Ready to receive scans
- **🔵 Syncing** (Blue pulsing dot): Receiving a scanned product

### QR Code Modal

The QR code modal provides:

- Large QR code for easy scanning
- Step-by-step instructions
- Copyable URL for sharing via messaging apps
- Tips for alternative sharing methods

### Mobile Scanning Mode

When accessing the billing page via the sync URL, mobile mode:

- Shows a "Mobile Scanning Mode" badge at the top
- Automatically enables sync for that session
- Sends all scanned products to Firestore for instant sync
- Works with both barcode scanning and manual product addition

## Architecture

### Components

1. **billingSyncService.js**: Core sync logic using Firestore
   - `subscribeToBillingSession()`: Listen for scanned products
   - `addScannedProduct()`: Add product to sync session
   - `generateMobileScanURL()`: Create mobile scan link
   - `isMobileMode()`: Detect mobile scanning mode
   - `getSessionIdFromURL()`: Extract session ID from URL

2. **BillingSyncIndicator.jsx**: UI component for sync controls
   - Enable/Disable sync button
   - Connection status indicator
   - QR code modal
   - URL copy functionality

3. **billingContext.jsx**: Enhanced with sync state
   - Real-time listener subscription
   - Automatic product addition from sync
   - Session management
   - Duplicate prevention

### Data Flow

```
Mobile Phone                    Firestore                    Laptop/Desktop
    |                              |                              |
    | 1. Scan barcode              |                              |
    |----------------------------->|                              |
    |                              |                              |
    |                              | 2. Real-time update          |
    |                              |----------------------------->|
    |                              |                              |
    |                              |                              | 3. Add to bill
    |                              |                              | automatically
```

## Session Management

- **Session ID**: A unique identifier for each billing session
  - Format: `session_[timestamp]_[random]`
  - Example: `session_1708698234567_abc123`

- **Session Document**: Stored in Firestore at `/billingSessions/{storeId}_{sessionId}`
  - Contains: storeId, cartId, lastScannedProduct, lastUpdated

- **Automatic Cleanup**: Sessions can be manually cleared or will expire based on Firestore TTL settings

## Troubleshooting

### Products not appearing on laptop

1. **Check sync status**: Ensure it shows "Connected" (green dot)
2. **Verify session**: Make sure both devices are using the same session ID
3. **Check Firebase**: Verify Firestore is enabled and security rules allow access
4. **Check network**: Ensure both devices have internet connection

### QR Code not working

1. **Ensure sync is enabled**: Click "Enable Sync" before showing QR code
2. **Try copying URL**: Use the "Copy" button and send via messaging app
3. **Check URL format**: URL should include `?session=...&mode=mobile`

### Duplicate products appearing

- The system has built-in duplicate prevention
- If duplicates still appear, try disabling and re-enabling sync

### Mobile mode not activating

1. **Check URL parameters**: URL must include `mode=mobile` parameter
2. **Clear browser cache**: Try opening in incognito/private mode
3. **Verify session parameter**: URL must include `session=...` parameter

## Security Considerations

1. **Authentication Required**: Users must be logged in to use sync
2. **Store Isolation**: Products are verified to belong to the current store
3. **Session-based**: Each billing session has a unique ID
4. **Firestore Rules**: Implement proper security rules to restrict access

## Performance

- **Real-time updates**: Typically < 500ms latency
- **Offline support**: Products are added locally even if sync temporarily fails
- **Bandwidth**: Minimal - only scanned product data is synced
- **Scalability**: Can handle multiple devices scanning simultaneously

## Future Enhancements

- [ ] Session expiration after inactivity
- [ ] Multi-user collaboration (multiple staff scanning)
- [ ] Sync history/audit log
- [ ] Offline queue with auto-sync when connection restored
- [ ] Push notifications on desktop when products are scanned

## Support

For issues or questions:

1. Check Firestore console for session documents
2. Review browser console for sync-related logs
3. Verify Firebase configuration in environment variables
4. Check Firestore security rules

---

**Happy Scanning!** 🎉
