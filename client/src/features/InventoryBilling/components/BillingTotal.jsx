"use client";

import { useState } from "react";
import { useBillPayment } from "../hooks";
import { useBillingContext } from "../context/billingContext";
import { CreditCard, Banknote, Smartphone } from "lucide-react";
import UpiQrModal from "./UpiQrModal";

export const BillingTotal = () => {
  const { billedProducts, clearBill, currentStore, discount, setDiscount } = useBillingContext();
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

  const handleApplyDiscount = () => {
    const val = parseFloat(discountValue);
    if (!isNaN(val)) {
      setDiscount({ type: localDiscountType, value: val });
    } else {
      setDiscount({ type: "fixed", value: 0 });
    }
  };

  const paymentMethods = [
    { id: "cash", label: "Cash", icon: Banknote },
    { id: "card", label: "Card", icon: CreditCard },
    { id: "upi", label: "UPI", icon: Smartphone },
  ];

  // When UPI button is clicked, select it AND show the QR popup
  const handleMethodClick = (id) => {
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
          <p className="block text-sm font-medium text-gray-700 mb-2 md:mb-3">
            Payment Method
          </p>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {paymentMethods.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleMethodClick(id)}
                className={`relative flex flex-col items-center justify-center p-2 md:p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === id
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <Icon size={20} className="md:w-6 md:h-6 mb-1 md:mb-2" />
                <span className="text-xs md:text-sm font-medium">{label}</span>

                {/* UPI badge hint */}
                {id === "upi" && currentStore?.settings?.upiId && (
                  <span
                    className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 rounded-full border-2 border-white"
                    style={{ background: "#22c55e" }}
                    title="UPI QR ready"
                  />
                )}
              </button>
            ))}
          </div>

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
