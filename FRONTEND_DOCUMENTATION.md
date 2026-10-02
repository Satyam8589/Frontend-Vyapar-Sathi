# 1. Frontend Overview
Frontend-Vyapar-Sathi is the user-facing web application for the VyaparSathi platform. It provides a responsive, intuitive dashboard for store owners to manage inventory, record sales, view analytics, and interact with the AI Copilot.

# 2. Technology Stack
- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit (RTK)
- **Form Handling & Validation**: React Hook Form with Zod
- **Icons**: Lucide React
- **API Client**: Axios

# 3. Folder & Page Structure
- `src/app/`: Next.js App Router structure defining pages and layouts.
  - `(auth)/`: Login and registration routes.
  - `(store)/storeDashboard/[storeId]/`: Main dashboard routes specific to a selected store.
- `src/components/`: Reusable, generic UI components (buttons, modals, tables, Navbar, Sidebar).
- `src/features/`: Domain-specific components and hooks (e.g., `features/purchase`, `features/seller`, `features/buyer`).
- `src/store/`: Redux store configuration and slices.
- `src/hooks/`: Custom React hooks (e.g., `usePurchasePage`, `useSellerPage`).

# 4. UI/UX Structure & Flows
- **Authentication**: Login and registration pages with Zod validation.
- **Dashboard**: High-level overview of store performance, quick links, and recent transactions.
- **Product Management**: Data tables to view stock, and modals to add/edit products and categories.
- **Purchase Management**: Interface to record incoming stock from sellers. Modals for data entry (`PurchaseFormModal`).
- **Sales/POS UI**: Point of Sale interface to select products, calculate totals, and record customer payments.
- **Seller & Buyer Management**: Manage contact information and transaction history for suppliers and customers.
- **Payment & Expense**: UI to record business expenses and track outstanding payments.
- **Profit & Loss / Analytics**: Charts and tables displaying profit/loss and sales trends over time.

# 5. API Integration & State Management
- **State Management**: Redux Toolkit manages global state such as authenticated user data and the currently active store.
- **API Integration**: Axios is configured to communicate with the Node.js backend. Custom hooks (like `usePurchasePage`) encapsulate the data fetching and mutation logic, often utilizing Redux actions.

# 6. Responsive Design
Tailwind CSS utility classes are utilized throughout the application to ensure it is usable on both mobile devices and large desktop monitors, which is critical for varied in-store environments.

# 7. Error & Loading States
Components utilize loading spinners or skeletons while fetching data. Error messages from API responses are caught and displayed to the user via toast notifications or inline error text on forms.

# 8. Environment Variables
- `NEXT_PUBLIC_API_URL`: The base URL of the Node.js backend API.

# 9. Installation & Running
1. `cd Frontend-Vyapar-Sathi/client`
2. `npm install`
3. Configure `.env.local` file.
4. `npm run dev`

# 10. Limitations & Future Scope
- **Limitations**: Requires constant network connection to operate; no offline mode.
- **Future Scope**:
  - Implement PWA (Progressive Web App) features for basic offline POS operations.
  - Add end-to-end testing (e.g., Cypress).
  - Implement a dark mode theme toggle.
