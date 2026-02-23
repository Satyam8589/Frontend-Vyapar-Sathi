"use client";

import { useState, useEffect } from "react";
import { getBillHistory } from "../services/billingService";
import { downloadBillPDF } from "../utils/pdfGenerator";
import { useParams } from "next/navigation";
import { showError } from "@/utils/toast";
import {
  Calendar,
  User,
  CreditCard,
  Package,
  ChevronDown,
  ChevronUp,
  FileText,
  Download,
  History,
} from "lucide-react";

export const BillHistory = () => {
  const params = useParams();
  const storeId = params.storeId;

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false); // Collapsible state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [expandedBill, setExpandedBill] = useState(null);

  // Fetch bill history only when opened
  const fetchBills = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getBillHistory(storeId, pagination.limit, page);
      setBills(response.bills || []);
      setPagination(response.pagination || pagination);
    } catch (error) {
      console.error("Failed to fetch bill history:", error);
      showError("Failed to load bill history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId && isOpen && bills.length === 0) {
      fetchBills(1);
    }
  }, [storeId, isOpen]);

  const toggleBillExpansion = (billId) => {
    setExpandedBill(expandedBill === billId ? null : billId);
  };

  const toggleHistorySection = () => {
    setIsOpen(!isOpen);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handleDownloadBill = (bill) => {
    downloadBillPDF(bill);
  };

  return (
    <div className="bg-white rounded-lg shadow-md mt-6 md:mt-8">
      {/* Collapsible Header */}
      <button
        onClick={toggleHistorySection}
        className="w-full px-4 md:px-6 py-3 md:py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-200"
      >
        <div className="flex items-center gap-2 md:gap-3">
          <History
            size={20}
            className="md:w-6 md:h-6 text-blue-600 flex-shrink-0"
          />
          <div className="text-left">
            <h2 className="text-base md:text-xl font-semibold text-gray-800">
              Bill History
            </h2>
            <p className="text-xs md:text-sm text-gray-500">
              {isOpen && !loading
                ? `${pagination.total || 0} total bills`
                : "Click to view past bills"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronUp size={20} className="md:w-6 md:h-6 text-gray-600" />
          ) : (
            <ChevronDown size={20} className="md:w-6 md:h-6 text-gray-600" />
          )}
        </div>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div>
          {(() => {
            if (loading && bills.length === 0) {
              return (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              );
            }

            if (!loading && bills.length === 0) {
              return (
                <div className="p-8 text-center">
                  <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No Bills Yet
                  </h3>
                  <p className="text-gray-500">
                    Bills will appear here once you complete payments
                  </p>
                </div>
              );
            }

            return (
              <>
                {/* Bills List - Scrollable after 5 bills */}
                <div className="max-h-[600px] overflow-y-auto">
                  <div className="divide-y divide-gray-200">
                    {bills.map((bill) => (
                      <div
                        key={bill._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* Bill Summary */}
                        <div
                          className="w-full px-3 md:px-6 py-3 md:py-4 cursor-pointer"
                          onClick={() => toggleBillExpansion(bill._id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              toggleBillExpansion(bill._id);
                            }
                          }}
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 md:gap-4 mb-2">
                                <span className="text-xs md:text-sm font-mono text-gray-600 truncate">
                                  #{bill._id.slice(-8)}
                                </span>
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    bill.paymentStatus === "paid"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {bill.paymentStatus}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 text-xs md:text-sm">
                                <div className="flex items-center gap-1 md:gap-2 text-gray-600 truncate">
                                  <Calendar
                                    size={14}
                                    className="md:w-4 md:h-4 flex-shrink-0"
                                  />
                                  <span className="truncate text-xs md:text-sm">
                                    {formatDate(bill.updatedAt)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 md:gap-2 text-gray-600 truncate">
                                  <User
                                    size={14}
                                    className="md:w-4 md:h-4 flex-shrink-0"
                                  />
                                  <span className="truncate text-xs md:text-sm">
                                    {bill.user?.name || "N/A"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 md:gap-2 text-gray-600">
                                  <Package
                                    size={14}
                                    className="md:w-4 md:h-4 flex-shrink-0"
                                  />
                                  <span className="text-xs md:text-sm">
                                    {bill.products.length} items
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 md:gap-2 text-gray-600">
                                  <CreditCard
                                    size={14}
                                    className="md:w-4 md:h-4 flex-shrink-0"
                                  />
                                  <span className="font-semibold text-green-600 text-xs md:text-sm">
                                    ₹{bill.totalPrice.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end md:self-auto md:ml-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadBill(bill);
                                }}
                                className="p-1.5 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Download PDF"
                              >
                                <Download size={18} className="md:w-5 md:h-5" />
                              </button>
                              {expandedBill === bill._id ? (
                                <ChevronUp
                                  size={18}
                                  className="md:w-5 md:h-5 text-gray-400"
                                />
                              ) : (
                                <ChevronDown
                                  size={18}
                                  className="md:w-5 md:h-5 text-gray-400"
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Bill Details (Expanded) */}
                        {expandedBill === bill._id && (
                          <div className="px-3 md:px-6 pb-3 md:pb-4 bg-gray-50">
                            <div className="bg-white rounded-lg p-3 md:p-4 border border-gray-200">
                              <h4 className="font-medium text-gray-700 mb-2 md:mb-3 text-sm md:text-base">
                                Bill Items:
                              </h4>
                              <div className="space-y-2">
                                {bill.products.map((item) => (
                                  <div
                                    key={
                                      item.product?._id ||
                                      `${bill._id}-${item._id}`
                                    }
                                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0 gap-1 sm:gap-2"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-gray-800 text-sm md:text-base truncate">
                                        {item.product?.name ||
                                          "Unknown Product"}
                                      </p>
                                      {item.product?.barcode && (
                                        <p className="text-xs text-gray-500">
                                          Barcode: {item.product.barcode}
                                        </p>
                                      )}
                                    </div>
                                    <div className="text-left sm:text-right">
                                      <p className="text-xs md:text-sm text-gray-600">
                                        {item.quantity} × ₹
                                        {item.price.toFixed(2)}
                                      </p>
                                      <p className="font-medium text-gray-800 text-sm md:text-base">
                                        ₹
                                        {(item.price * item.quantity).toFixed(
                                          2,
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="mt-4 pt-4 border-t-2 border-gray-200">
                                <div className="flex justify-between items-center">
                                  <span className="text-lg font-semibold text-gray-700">
                                    Total:
                                  </span>
                                  <span className="text-2xl font-bold text-green-600">
                                    ₹{bill.totalPrice.toFixed(2)}
                                  </span>
                                </div>
                              </div>

                              {bill.paymentId && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <p className="text-xs text-gray-500">
                                    Payment ID: {bill.paymentId}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="border-t border-gray-200 px-3 md:px-6 py-3 md:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-xs md:text-sm text-gray-600">
                      Page {pagination.page} of {pagination.totalPages}
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => fetchBills(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="flex-1 sm:flex-initial px-3 md:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => fetchBills(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="flex-1 sm:flex-initial px-3 md:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};
