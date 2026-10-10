import { useState, useRef } from "react";
import { useBillPayment } from "../hooks";
import { useBillingContext } from "../context/billingContext";
import { getBuyers } from "@/features/buyer/services/buyerService";
import UpiQrModal from "./UpiQrModal";

import { User, Phone, Mail, Search, CheckCircle, X } from "lucide-react";

export const BillingTotal = () => {
  const {
    billedProducts,
    clearBill,
    storeId,
    currentStore,
    discount,
    setDiscount,
    customerDetails,
    setCustomerDetails,
  } = useBillingContext();
  const {
    paymentMethod,
    setPaymentMethod,
    isProcessing,
    handlePayment,
    totalAmount,
    itemCount,
  } = useBillPayment();

  const [showUpiModal, setShowUpiModal] = useState(false);
  const [discountValue, setDiscountValue] = useState(discount.value || "");
  const [localDiscountType, setLocalDiscountType] = useState(discount.type || "fixed");

  // Live customer search state
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeoutRef = useRef(null);

  const handleCustomerInputChange = (field, value) => {
    setCustomerDetails((prev) => ({
      ...prev,
      [field]: value,
      buyerId: field === 'name' || field === 'phone' || field === 'email' ? null : prev.buyerId,
    }));

    const searchVal = value.trim();
    if (searchVal.length >= 2 && storeId) {
      setIsSearching(true);
      setShowDropdown(true);

      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const data = await getBuyers(storeId, { search: searchVal, limit: 5 });
          const list = data?.buyers || data?.data?.buyers || (Array.isArray(data) ? data : []);
          setSearchResults(list);
        } catch (err) {
          console.warn("[CUSTOMER_SEARCH] Failed to search buyers from backend:", err);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleSelectBuyer = (buyer) => {
    setCustomerDetails({
      buyerId: buyer._id,
      name: buyer.name || "",
      phone: buyer.phone || "",
      email: buyer.email || "",
    });
    setSearchResults([]);
    setShowDropdown(false);
  };

  const handleClearBuyer = () => {
    setCustomerDetails({
      buyerId: null,
      name: "",
      phone: "",
      email: "",
    });
    setSearchResults([]);
    setShowDropdown(false);
  };

  const handleApplyDiscount = () => {
    const val = parseFloat(discountValue);
    if (!isNaN(val)) {
      setDiscount({ type: localDiscountType, value: val });
    } else {
      setDiscount({ type: "fixed", value: 0 });
    }
  };

  const handleMethodChange = (event) => {
    const id = event.target.value;
    setPaymentMethod(id);
    if (id === "upi" && billedProducts.length > 0) {
      setShowUpiModal(true);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
          Payment Summary
        </h2>

        {/* Customer Information Inputs with Live Backend Autocomplete */}
        <div className="relative mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-blue-600" />
              <span>Customer Info (Billed To)</span>
            </label>
            {customerDetails?.buyerId && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                ✓ Existing Buyer
                <button
                  type="button"
                  onClick={handleClearBuyer}
                  className="ml-1 text-emerald-900 hover:text-red-600 font-black"
                  title="Clear"
                >
                  ✕
                </button>
              </span>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              value={customerDetails?.name || ""}
              onChange={(e) => handleCustomerInputChange("name", e.target.value)}
              placeholder="Customer Name (e.g. Satyam Singh)"
              className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="tel"
              value={customerDetails?.phone || ""}
              onChange={(e) => handleCustomerInputChange("phone", e.target.value)}
              placeholder="Phone (+91...)"
              className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              value={customerDetails?.email || ""}
              onChange={(e) => handleCustomerInputChange("email", e.target.value)}
              placeholder="Email Address"
              className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Autocomplete Dropdown List from Backend */}
          {showDropdown && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-200 z-50 max-h-48 overflow-y-auto">
              {isSearching ? (
                <div className="p-3 text-xs text-slate-400 font-medium text-center flex items-center justify-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  Searching saved buyers...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-3 text-xs text-slate-400 font-medium text-center">
                  No saved buyer found. New customer will be created on checkout.
                </div>
              ) : (
                <div>
                  <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Select Saved Buyer
                  </div>
                  {searchResults.map((b) => (
                    <button
                      key={b._id}
                      type="button"
                      onClick={() => handleSelectBuyer(b)}
                      className="w-full px-3 py-2 text-left hover:bg-emerald-50 transition-colors flex items-center justify-between border-b border-slate-50 last:border-0"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900">{b.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {b.phone || "No phone"} {b.email ? `• ${b.email}` : ""}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Select
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Total Display */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm md:text-base text-gray-600">
              Total Items:
            </span>
            <span className="font-semibold text-gray-900">{itemCount}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm md:text-base text-gray-600">
              Subtotal:
            </span>
            <span className="font-semibold text-gray-900">
              ₹{billedProducts.reduce((sum, p) => sum + (p.price || p.sellingPrice || 0) * (p.billedQuantity || 1), 0).toFixed(2)}
            </span>
          </div>

          {/* Discount Input Section */}
          <div className="mt-4 pt-4 border-t border-blue-200">
            <label className="block text-xs font-bold text-blue-800 uppercase tracking-widest mb-2">
              Add Discount
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-3 pr-10 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center bg-blue-50 rounded border border-blue-100 p-0.5">
                  <button
                    onClick={() => setLocalDiscountType("percent")}
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                      localDiscountType === "percent"
                        ? "bg-blue-600 text-white"
                        : "text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    %
                  </button>
                  <button
                    onClick={() => setLocalDiscountType("fixed")}
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                      localDiscountType === "fixed"
                        ? "bg-blue-600 text-white"
                        : "text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    ₹
                  </button>
                </div>
              </div>
              <button
                onClick={handleApplyDiscount}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold uppercase rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply
              </button>
            </div>
            {discount.value > 0 && (
              <div className="flex justify-between items-center mt-3 text-sm text-green-700 font-medium">
                <span>Applied Discount:</span>
                <span>
                  -{discount.type === "percent" ? `${discount.value}%` : `₹${discount.value}`}
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center border-t border-blue-200 pt-2 md:pt-4 mt-4 md:mt-5">
            <span className="text-base md:text-lg font-bold text-gray-800">
              Total Payable:
            </span>
            <span className="text-2xl md:text-3xl font-black text-blue-600">
              ₹{totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-4 md:mb-6">
          <label
            htmlFor="payment-method"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Payment Method
          </label>
          <select
            id="payment-method"
            value={paymentMethod}
            onChange={handleMethodChange}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
          </select>

          {/* Hint when UPI selected but no ID */}
          {paymentMethod === "upi" && !currentStore?.settings?.upiId && (
            <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
              <span>⚠️</span> No UPI ID set — ask owner to add in Store Settings.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
          <button
            onClick={clearBill}
            disabled={billedProducts.length === 0 || isProcessing}
            className="flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
          >
            Clear Bill
          </button>

          <button
            onClick={handlePayment}
            disabled={billedProducts.length === 0 || isProcessing}
            className="flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-sm md:text-base"
          >
            {isProcessing ? "Processing..." : "Complete Payment"}
          </button>
        </div>

        {billedProducts.length === 0 && (
          <p className="text-center text-sm text-gray-400 mt-3">
            Add products to enable payment
          </p>
        )}
      </div>

      {/* UPI QR Popup — dynamic QR generated from UPI ID + bill total */}
      <UpiQrModal
        isOpen={showUpiModal}
        onClose={() => setShowUpiModal(false)}
        totalAmount={totalAmount}
        upiId={currentStore?.settings?.upiId || null}
        upiName={currentStore?.settings?.upiName || null}
        storeName={currentStore?.name}
      />
    </>
  );
};
