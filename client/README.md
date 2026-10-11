# 🛒 Vyapar Sathi – Frontend Client

> **Modern, High-Performance Progressive Web App (PWA) for Multi-Store Retail & Smart POS**  
> Built with **Next.js 16 (App Router), React 19, Tailwind CSS, Dexie.js, Chart.js, and WebSockets**.

---

## 📖 Overview

**Frontend-Vyapar-Sathi** is the responsive, production-ready web and mobile interface of the **Vyapar Sathi** retail ecosystem. It provides store managers and billing staff with a lightning-fast Point-of-Sale (POS) experience, camera-based barcode scanning, offline-resilient local persistence, multi-store dashboard analytics, and an integrated real-time **AI Voice & Chat Copilot**.

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

## ⚙️ Environment Variables

Create `.env.local` inside `client/`:

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

### 1. Installation
```bash
cd client
npm install
```

### 2. Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Production Build & Start
```bash
npm run build
npm run start
```

### 4. Running Tests & Linting
```bash
npm test
npm run test:coverage
npm run lint
```
