"use client";

import { useBillPayment } from "../hooks";
import { useBillingContext } from "../context/billingContext";
import { X, Printer, Download } from "lucide-react";
import { downloadBillPDF } from "../utils/pdfGenerator";
import { showSuccess, showError } from "@/utils/toast";

export const BillPreviewModal = () => {
  const { showBillPreview, generatedBill, closeBillPreview, printBill } =
    useBillPayment();
  const { lastBillData } = useBillingContext();

  if (!showBillPreview || !generatedBill) return null;

  const { products, totalAmount, billNumber, billedAt, storeInfo } =
    generatedBill;

  const handleDownloadPDF = () => {
    if (lastBillData) {
      downloadBillPDF(lastBillData);
      showSuccess("Bill downloaded successfully!");
    } else {
      showError("Bill data not available");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b bg-green-50">
          <div>
            <h2 className="text-lg md:text-2xl font-semibold text-green-700">
              ✓ Payment Successful!
            </h2>
            <p className="text-xs md:text-sm text-gray-600 mt-1">
              Bill generated successfully
            </p>
          </div>
          <button
            onClick={closeBillPreview}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
          >
            <X size={20} className="md:w-6 md:h-6" />
          </button>
        </div>

        {/* Bill Preview */}
        <div className="p-3 md:p-6 max-h-96 overflow-y-auto">
          <div className="border border-gray-300 rounded-lg p-3 md:p-6 bg-white">
            {/* Store Info */}
            <div className="text-center border-b-2 border-dashed border-gray-300 pb-3 md:pb-4 mb-3 md:mb-4">
              <h3 className="text-lg md:text-2xl font-bold text-gray-900">
                {storeInfo?.name || "Store Name"}
              </h3>
              {storeInfo?.address && (
                <p className="text-xs md:text-sm text-gray-600 mt-1">
                  {storeInfo.address}
                </p>
              )}
              {storeInfo?.phone && (
                <p className="text-xs md:text-sm text-gray-600">
                  Phone: {storeInfo.phone}
                </p>
              )}
            </div>

            {/* Bill Info */}
            <div className="flex flex-col sm:flex-row sm:justify-between text-xs md:text-sm text-gray-600 mb-3 md:mb-4 gap-2">
              <div>
                <p>
                  <strong>Bill #:</strong> {billNumber || "N/A"}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(billedAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0">
              <table className="w-full mb-3 md:mb-4 min-w-[300px]">
                <thead className="border-b-2 border-gray-300">
                  <tr>
                    <th className="text-left py-2 text-xs md:text-sm">Item</th>
                    <th className="text-right py-2 text-xs md:text-sm">Qty</th>
                    <th className="text-right py-2 text-xs md:text-sm">
                      Price
                    </th>
                    <th className="text-right py-2 text-xs md:text-sm">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map((product) => (
                    <tr
                      key={product._id || product.name}
                      className="border-b border-gray-200"
                    >
                      <td className="py-2 text-xs md:text-sm truncate max-w-[150px]">
                        {product.name}
                      </td>
                      <td className="text-right py-2 text-xs md:text-sm">
                        {product.quantity}
                      </td>
                      <td className="text-right py-2 text-xs md:text-sm">
                        ₹{product.price.toFixed(2)}
                      </td>
                      <td className="text-right py-2 text-xs md:text-sm">
                        ₹{product.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="border-t-2 border-gray-900 pt-2 md:pt-3 mt-2 md:mt-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm md:text-base text-gray-600">
                  Total Items:
                </span>
                <span className="font-semibold text-sm md:text-base">
                  {products?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base md:text-lg font-bold text-gray-900">
                  Total Amount:
                </span>
                <span className="text-xl md:text-2xl font-bold text-green-600">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center border-t-2 border-dashed border-gray-300 pt-3 md:pt-4 mt-3 md:mt-4">
              <p className="text-xs md:text-sm text-gray-600">
                Thank you for your purchase!
              </p>
              <p className="text-xs md:text-sm text-gray-600">
                Visit us again!
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-3 md:p-6 border-t bg-gray-50 flex flex-col sm:flex-row gap-2 md:gap-3">
          <button
            onClick={handleDownloadPDF}
            className="flex-1 sm:min-w-[150px] flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm md:text-base"
          >
            <Download size={18} className="md:w-5 md:h-5" />
            Download PDF
          </button>

          <button
            onClick={printBill}
            className="flex-1 sm:min-w-[150px] flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
          >
            <Printer size={18} className="md:w-5 md:h-5" />
            Print Bill
          </button>

          <button
            onClick={closeBillPreview}
            className="flex-1 sm:min-w-[150px] px-4 md:px-6 py-2.5 md:py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm md:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
