"use client";

import { useRouter } from "next/navigation";
import { useInventoryContext } from "@/features/inventory/context/inventoryContext";
import StoreSettingsModal from "@/features/inventory/components/StoreSettingsModal";

/**
 * Store Settings Page - Store Details (Left) + UPI Settings (Right)
 */
const StoreSettingsPage = () => {
  const { currentStore, setCurrentStore } = useInventoryContext();
  const router = useRouter();

  if (!currentStore) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading store details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Store Settings
        </h1>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Store Details Card */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg overflow-hidden sticky top-8 h-fit">
              {/* Store Details Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
                <h2 className="text-lg font-bold text-gray-900">
                  Store Details
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Information &amp; Overview
                </p>
              </div>

              {/* Store Details Content */}
              <div className="p-6 space-y-6">
                {/* Identity */}
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                    <span className="relative z-10">
                      {currentStore.name?.substring(0, 2).toUpperCase() || "ST"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      {currentStore.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {currentStore.businessType || "Retail"}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* About */}
                {currentStore.description && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">
                      About
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-200">
                      {currentStore.description}
                    </p>
                  </div>
                )}

                {/* Contact */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-3">
                    Contact
                  </h4>
                  <div className="space-y-2">
                    {currentStore.phone && (
                      <DetailRow
                        icon={
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        }
                        label="Phone"
                        value={currentStore.phone}
                        color="blue"
                      />
                    )}
                    <DetailRow
                      icon={
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      }
                      label="Email"
                      value={currentStore.email || "Not provided"}
                      color="indigo"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-3">
                    Address
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex gap-3 mb-3">
                      <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-blue-600 shadow-sm border border-gray-100 flex-shrink-0">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <circle cx="12" cy="10" r="3" strokeWidth={2} />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-600 mb-0.5">
                          Location
                        </p>
                        <p className="text-sm text-gray-800 leading-relaxed">
                          {currentStore.address?.fullAddress ||
                            `${currentStore.address?.city}, ${currentStore.address?.state}`}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Pincode</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {currentStore.address?.pincode || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Country</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {currentStore.address?.country || "India"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Settings Summary */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-3">
                    Settings
                  </h4>

                  {/* Currency */}
                  <div className="bg-amber-50 rounded-lg p-3 flex items-center justify-between border border-amber-200 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-white border border-amber-200 flex items-center justify-center text-amber-600 font-bold text-sm">
                        {currentStore.settings?.currency === "INR"
                          ? "₹"
                          : currentStore.settings?.currency}
                      </div>
                      <p className="text-sm font-semibold text-gray-700">
                        Currency
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-amber-700">
                      {currentStore.settings?.currency || "INR"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <ConfigCard
                      label="Low Stock Alert"
                      value={`${currentStore.settings?.lowStockThreshold || 10}`}
                      suffix="units"
                      color="amber"
                    />
                    <ConfigCard
                      label="Expiry Alert"
                      value={`${currentStore.settings?.expiryAlertDays || 7}`}
                      suffix="days"
                      color="emerald"
                    />
                  </div>

                  {/* UPI Status */}
                  <div
                    className={`rounded-lg p-3 flex items-center justify-between border ${
                      currentStore.settings?.upiId
                        ? "bg-indigo-50 border-indigo-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-8 w-8 rounded-lg border flex items-center justify-center text-sm ${
                          currentStore.settings?.upiId
                            ? "bg-white border-indigo-200 text-indigo-600"
                            : "bg-white border-gray-200 text-gray-400"
                        }`}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          className="h-4 w-4"
                          strokeWidth={2}
                        >
                          <rect x="3" y="3" width="7" height="7" rx="1" />
                          <rect x="14" y="3" width="7" height="7" rx="1" />
                          <rect x="14" y="14" width="7" height="7" rx="1" />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 14h7v7H3z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          UPI Payment
                        </p>
                        {currentStore.settings?.upiId && (
                          <p className="text-xs font-mono text-indigo-500">
                            {currentStore.settings.upiId}
                          </p>
                        )}
                      </div>
                    </div>
                    {currentStore.settings?.upiId ? (
                      <span className="text-xs font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                        ✓ Active
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-gray-500">
                        Not set
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      router.push(
                        `/storeDashboard/${currentStore._id}/ai-dashboard`,
                      )
                    }
                    className="mt-3 w-full rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-black text-indigo-700 transition-colors hover:bg-indigo-100"
                  >
                    Open AI Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: UPI Settings Card */}
          <div className="lg:col-span-1">
            <StoreSettingsModal
              store={currentStore}
              onStoreUpdated={(updatedStore) => {
                setCurrentStore(updatedStore);
              }}
              isModal={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Sub-components ─────────────────────────────────────────── */

const DetailRow = ({ icon, label, value, color }) => {
  const themes = { blue: "text-blue-600", indigo: "text-indigo-600" };
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
      <div
        className={`h-8 w-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0 ${themes[color]}`}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {icon}
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-gray-800 truncate">{value}</p>
      </div>
    </div>
  );
};

const ConfigCard = ({ label, value, suffix, color }) => {
  const colors = {
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <div
      className={`${colors[color]} p-3 rounded-lg border flex flex-col items-center justify-center text-center gap-1`}
    >
      <p className="text-xs font-medium opacity-75">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-bold">{value}</span>
        <span className="text-xs opacity-60">{suffix}</span>
      </div>
    </div>
  );
};

export default StoreSettingsPage;
