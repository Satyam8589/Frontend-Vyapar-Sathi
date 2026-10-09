"use client";

import { ArrowLeft, Package, ShoppingCart, MapPin, Phone, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useManualProductAdd } from "../hooks";

export const BillingHeader = ({ storeId, storeName, currentStore, isMobile }) => {
  const router = useRouter();
  const { setIsModalOpen } = useManualProductAdd();

  const name = currentStore?.name || currentStore?.storeName || storeName || "Vyapar Sakha Store";

  const formatAddress = (store) => {
    if (!store) return "";
    let addr = store.address || store.location || store.fullAddress || "";
    let pincode = store.pincode || store.pinCode || store.zipCode || "";

    if (typeof addr === "object" && addr !== null) {
      if (addr.pincode) pincode = addr.pincode;
      if (addr.fullAddress) {
        addr = addr.fullAddress;
      } else {
        const parts = [addr.street, addr.city, addr.state, addr.country].filter((v) => Boolean(v) && v !== "N/A");
        addr = parts.join(", ");
      }
    }

    addr = String(addr || "").trim();
    pincode = String(pincode || "").trim();

    if (addr && pincode && !addr.includes(pincode)) {
      return `${addr} - ${pincode}`;
    }
    return addr || (pincode ? `PIN: ${pincode}` : "");
  };

  const storeAddressStr = formatAddress(currentStore);
  const storePhone = currentStore?.phone || currentStore?.mobile || currentStore?.contact || currentStore?.owner?.phone || "";
  const storeEmail = currentStore?.email || currentStore?.owner?.email || "";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3.5 md:p-4 mb-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-start md:items-center gap-3">
          {!isMobile && (
            <button
              onClick={() => router.push(`/storeDashboard/${storeId}`)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors flex-shrink-0 text-slate-700 mt-0.5 md:mt-0"
              title="Back to Dashboard"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg md:text-xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
                <ShoppingCart size={20} className="text-indigo-600" />
                <span>{name}</span>
              </h1>
              <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                Billing System
              </span>
            </div>

            {/* Store Address, PIN, Phone & Email Line */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 font-medium mt-1">
              {storeAddressStr && (
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-indigo-500 shrink-0" />
                  <span>{storeAddressStr}</span>
                </span>
              )}

              {storePhone && (
                <span className="flex items-center gap-1">
                  <Phone size={13} className="text-indigo-500 shrink-0" />
                  <span>{storePhone}</span>
                </span>
              )}

              {storeEmail && (
                <span className="flex items-center gap-1">
                  <Mail size={13} className="text-indigo-500 shrink-0" />
                  <span>{storeEmail}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs md:text-sm font-bold text-white transition-all hover:bg-indigo-700 shadow-xs"
          >
            <Package size={16} />
            Add Product Manually
          </button>
        </div>
      </div>
    </div>
  );
};
