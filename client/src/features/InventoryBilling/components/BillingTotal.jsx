"use client";

import { useBillPayment } from "../hooks";
import { useBillingContext } from "../context/billingContext";
import { CreditCard, Banknote, Smartphone } from "lucide-react";

export const BillingTotal = () => {
  const { billedProducts, clearBill } = useBillingContext();
  const {
    paymentMethod,
    setPaymentMethod,
    isProcessing,
    handlePayment,
    totalAmount,
    itemCount,
  } = useBillPayment();

  const paymentMethods = [
    { id: "cash", label: "Cash", icon: Banknote },
    { id: "card", label: "Card", icon: CreditCard },
    { id: "upi", label: "UPI", icon: Smartphone },
  ];

  return (
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
        <div className="flex justify-between items-center border-t border-blue-200 pt-2 md:pt-3 mt-2 md:mt-3">
          <span className="text-base md:text-lg font-medium text-gray-700">
            Total Amount:
          </span>
          <span className="text-2xl md:text-3xl font-bold text-blue-600">
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
              onClick={() => setPaymentMethod(id)}
              className={`flex flex-col items-center justify-center p-2 md:p-4 rounded-lg border-2 transition-all ${
                paymentMethod === id
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <Icon size={20} className="md:w-6 md:h-6 mb-1 md:mb-2" />
              <span className="text-xs md:text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
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
  );
};
