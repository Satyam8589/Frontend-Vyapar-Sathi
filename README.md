# 🛒 Vyapar Sathi – Frontend Client

> **Modern, High-Performance Progressive Web App (PWA) for Multi-Store Retail & Smart POS**  
> Built with **Next.js 16 (App Router), React 19, Tailwind CSS, Dexie.js, Chart.js, and WebSockets**.

---

## 📖 Overview

**Frontend-Vyapar-Sathi** is the responsive, production-ready web and mobile interface of the **Vyapar Sathi** retail ecosystem. It provides store managers and billing staff with an lightning-fast Point-of-Sale (POS) experience, camera-based barcode scanning, offline-resilient local persistence, multi-store dashboard analytics, and an integrated real-time **AI Voice & Chat Copilot**.

---

## ✨ Key Features & Capabilities

- **🚀 Next.js 16 App Router & React 19**: Ultra-fast Server-Side Rendering (SSR) and Client-Side Hydration with optimal caching.
- **📱 PWA & Offline Support**:
  - Registered Service Worker via `next-pwa` for desktop and mobile home screen installation.
  - Client-side data caching with **Dexie.js (IndexedDB)** for uninterrupted billing even during network drops.
- **⚡ Smart POS & Barcode Scanner**:
  - Live camera barcode and QR scanning powered by `html5-qrcode`.
  - Instant scan-to-cart, quantity adjustments, tax calculations, and discount rules.
  - Dynamic store-specific UPI QR code generation via `react-qr-code`.
  - Instant PDF invoice generation and thermal receipt printing using `jspdf`.
- **🏪 Multi-Store Architecture**:
  - Quick store switcher interface for owners managing multiple business outlets.
  - Zero cross-store state mixing, isolated route hierarchy `/(store)/storeDashboard/[storeId]`.
- **🎙️ Real-Time AI Copilot & Voice Assistant**:
  - Markdown-rendered AI Copilot chat with syntax highlighting (`react-markdown`, `remark-gfm`).
  - Interactive **Voice Assistant (`VoiceBot.jsx`)** streaming bi-directional audio/text via WebSockets.
- **📊 Business Analytics & Financial Insights**:
  - Interactive sales graphs, revenue trends, and category performance charts via **Chart.js** & **react-chartjs-2**.
  - One-click export of sales and inventory data to Excel (`xlsx`) and PDF.
- **🔔 Live Alerts & Push Notifications**:
  - Web push notifications delivered via **Pusher Beams** (`@pusher/push-notifications-web`).
  - Interactive swipe-to-close toasts with sound alerts (`react-hot-toast`).
- **👥 Staff & Permissions Management**:
  - Role-based UI guards (Owner, Manager, Cashier).
  - Invite token acceptance flow for onboarding team members.

---

## 🛠️ Tech Stack

| Domain | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Modern React framework with hybrid rendering |
| **UI Library** | React 19 | Declarative user interfaces |
| **Styling** | Tailwind CSS 3.4 | Utility-first, responsive design system |
| **Icons** | Lucide React | Clean, lightweight SVG icon set |
| **Data Fetching** | Axios | REST API client with interceptors |
| **Authentication** | Firebase Client SDK 12.x | Google Auth & Email/Password session management |
| **Local Storage / Offline** | Dexie.js 4.x (IndexedDB) | Client-side database for offline persistence |
| **Charts & Graphs** | Chart.js 4.x & React-Chartjs-2 | Visualizing financial trends and category share |
| **Barcode / QR** | `html5-qrcode` & `react-qr-code` | Camera scanning and payment QR generation |
| **Document Export** | `jspdf` & `xlsx` | Invoices, receipts, and Excel spreadsheet downloads |
| **Push Notifications** | `@pusher/push-notifications-web` | Real-time push messaging |
| **Testing** | Jest 30 & React Testing Library | Component and hook unit testing |

---

## 📂 Project Structure

```text
Frontend-Vyapar-Sathi/
└── client/
    ├── public/                         # Static assets, icons, manifest.json
    ├── src/
    │   ├── app/                        # Next.js App Router
    │   │   ├── (auth)/                 # Authentication routes (Login, Register)
    │   │   ├── (store)/                # Store-scoped layouts & pages
    │   │   │   ├── createStore/        # Store onboarding & setup
    │   │   │   └── storeDashboard/[storeId]/ # Store Management Portal
    │   │   │       ├── [productId]/    # Deep-dive product details & stock ledger
    │   │   │       ├── ai-dashboard/   # AI forecasts, restock tips & copilot chat
    │   │   │       ├── analytics/      # Financial reports, charts & profit/loss
    │   │   │       ├── automations/    # Store rules, triggers & automated workflows
    │   │   │       ├── billing/        # Smart POS Billing & Live Barcode Scanner
    │   │   │       ├── billing-history/# Transaction history, invoices & refunds
    │   │   │       ├── buyers/         # Customer directory & credit (Khata) book
    │   │   │       ├── purchases/      # Supplier purchase orders & GRN records
    │   │   │       ├── sellers/        # Vendor directory & ledger
    │   │   │       ├── settings/       # Store profile, taxes, invoice customization
    │   │   │       └── staff/          # Team members, invitations & role permissions
    │   │   ├── about/                  # About Vyapar Sathi
    │   │   ├── documents/              # User documentation & POS user guides
    │   │   ├── invite/                 # Employee invitation acceptance workflow
    │   │   ├── layout.js               # Root layout, fonts, and meta tags
    │   │   ├── page.js                 # Landing page & feature showcase
    │   │   ├── providers.jsx           # Firebase Auth, Toast & Query providers
    │   │   └── ServiceWorkerRegistrar.jsx # PWA service worker handler
    │   ├── components/                 # Reusable UI component library
    │   │   ├── Guard/                  # Role & Auth route protection guards
    │   │   ├── ui/                     # Buttons, modals, badges, inputs
    │   │   ├── Navbar.js               # Responsive navigation with store switcher
    │   │   ├── Footer.js               # Global footer
    │   │   ├── PageLoader.jsx          # Smooth transition skeletons
    │   │   ├── SwipeToCloseToast.jsx   # Interactive notification cards
    │   │   ├── VoiceBot.jsx            # Real-time WebSocket voice assistant
    │   │   └── VoiceBotWrapper.jsx     # Floating voice assistant launcher
    │   ├── features/                   # Domain-focused feature modules & forms
    │   ├── hooks/                      # Custom React hooks (billing, scanner, etc.)
    │   ├── servies/                    # API client services & interceptors
    │   ├── utils/                      # Currency formatters, date helpers, math
    │   └── costant/                    # Application constants & navigation links
    ├── next.config.mjs                 # Next.js configuration (PWA, rewrites)
    ├── tailwind.config.js              # Theme colors, breakpoints, animations
    └── package.json
```

---

## 📱 Page & Feature Walkthrough

### 1. Point of Sale (POS) & Billing (`/storeDashboard/[storeId]/billing`)
- Camera-driven barcode scanning with immediate sound feedback.
- Manual barcode entry and quick product search.
- Dynamic cart calculations: Subtotal, CGST/SGST tax split, and custom discounts.
- Payment selection: Cash, UPI (renders instant QR code), or Card.
- Direct thermal printing or instant PDF download.

### 2. Multi-Store Dashboard (`/storeDashboard/[storeId]`)
- Real-time revenue indicators, daily order count, average order value.
- Visual alerts for critical stockouts and items nearing expiration date.
- One-click navigation to stock entries, procurement, and staff actions.

### 3. AI Copilot & Voice Bot (`/storeDashboard/[storeId]/ai-dashboard`)
- Natural language queries: *"Which items should I reorder this week?"*, *"Show me top profit margin products"*.
- Floating Voice Assistant (`VoiceBot.jsx`) enabling hands-free POS queries while working at the counter.

### 4. Supply Chain & Khata (`/buyers`, `/sellers`, `/purchases`)
- Customer credit tracking (Udhar / Khata management) with transaction history.
- Supplier invoices and Goods Received Note (GRN) reconciliation.

---

## ⚙️ Environment Variables

Create `.env.local` inside `Frontend-Vyapar-Sathi/client/`:

```env
# Backend REST API Base URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# FastAPI AI Copilot HTTP URL
NEXT_PUBLIC_AI_URL=http://localhost:8000

# AI Copilot Voice WebSocket URL
NEXT_PUBLIC_AI_WS_URL=ws://localhost:8000

# Firebase Client Configuration
NEXT_PUBLIC_API_KEY=AIzaSy...
NEXT_PUBLIC_AUTH_DOMAIN=vyapar-sathi-xxxx.firebaseapp.com
NEXT_PUBLIC_PROJECT_ID=vyapar-sathi-xxxx
NEXT_PUBLIC_STORAGE_BUCKET=vyapar-sathi-xxxx.firebasestorage.app
NEXT_PUBLIC_MESSAGING_SENDER_ID=692983627093
NEXT_PUBLIC_APP_ID=1:692983627093:web:...
NEXT_PUBLIC_MEASUREMENT_ID=G-1NNPS5B6G0

# Pusher Beams (Push Notifications)
NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID=be4228c4-3829-4723-a544-2cbdbee5493d
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.x or v20.x LTS
- **npm** or **pnpm** / **yarn**

### 2. Installation
```bash
cd Frontend-Vyapar-Sathi/client
npm install
```

### 3. Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Production Build & Start
```bash
npm run build
npm run start
```

### 5. Running Tests & Linting
```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint source code
npm run lint
```

---

## 💡 Best Practices Implemented

- **Component Isolation**: Clean separation between shared UI elements (`components/ui`) and store modules (`app/(store)`).
- **Graceful Offline Fallback**: Critical catalog data cached via IndexedDB so users can check prices and prepare orders without internet.
- **Responsive Touch-Friendly UI**: Optimized for mobile screens, tablets, POS terminals, and widescreen desktop monitors.