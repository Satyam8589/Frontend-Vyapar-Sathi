"use client";

import { useBillPayment } from "../hooks";
import { useBillingContext } from "../context/billingContext";
import { useAuthContext } from "@/features/auth/context/AuthContext";
import { X, Printer, Download, CheckCircle2, ShieldCheck, Receipt } from "lucide-react";
import { downloadBillPDF, printBillPDF } from "../utils/pdfGenerator";
import { showSuccess, showError } from "@/utils/toast";

/**
 * Convert number to Indian Rupee Words
 */
const numberToWords = (amount) => {
  const num = Math.floor(Math.abs(amount || 0));
  if (num === 0) return "Zero Rupees Only";

  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const convertGroup = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
    if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " " + convertGroup(n % 100) : "");
    if (n < 100000) return convertGroup(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + convertGroup(n % 1000) : "");
    if (n < 10000000) return convertGroup(Math.floor(n / 100000)) + " Lakh" + (n % 100000 !== 0 ? " " + convertGroup(n % 100000) : "");
    return convertGroup(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 !== 0 ? " " + convertGroup(n % 10000000) : "");
  };

  return `${convertGroup(num)} Rupees Only`;
};

export const BillPreviewModal = () => {
  const { showBillPreview, generatedBill, closeBillPreview } = useBillPayment();
  const { lastBillData, currentStore } = useBillingContext();
  const { user: authUser } = useAuthContext();

  if (!showBillPreview || (!generatedBill && !lastBillData)) return null;

  const bill = lastBillData || generatedBill || {};
  const { products, totalAmount, billNumber, billedAt, customerPhone } = bill;
  const paymentMethod = (bill.paymentMethod || bill.paymentMode || (bill.paymentId ? bill.paymentId.split("-")[0] : null) || "CASH").toUpperCase();

  const isValid = (val) => {
    if (val === null || val === undefined) return false;
    const s = String(val).trim();
    return s !== "" && s !== "N/A" && s !== "n/a" && s !== "undefined" && s !== "null";
  };

  const formatStoreAddressWithPin = (store) => {
    if (!store) return "";
    let addr = store.address || store.location || store.fullAddress || "";
    let pincode = store.pincode || store.pinCode || store.zipCode || store.zip || "";

    if (typeof addr === "object" && addr !== null) {
      if (addr.pincode) pincode = addr.pincode;
      if (addr.fullAddress) {
        addr = addr.fullAddress;
      } else {
        const parts = [addr.street, addr.city, addr.state, addr.country].filter(isValid);
        addr = parts.join(", ");
      }
    }

    addr = String(addr || "").trim();
    pincode = String(pincode || "").trim();

    if (isValid(addr) && isValid(pincode) && !addr.includes(pincode)) {
      return `${addr} - ${pincode}`;
    }
    if (isValid(addr)) return addr;
    if (isValid(pincode)) return `PIN: ${pincode}`;
    return "";
  };

  const storeInfo = bill.storeInfo || bill.store || currentStore || {};
  const storeName = storeInfo?.name || storeInfo?.storeName || currentStore?.name || "Vyapar Sakha Store";
  const storeAddressStr = formatStoreAddressWithPin(storeInfo) || formatStoreAddressWithPin(currentStore);
  const storePhone = storeInfo?.phone || storeInfo?.mobile || storeInfo?.contact || storeInfo?.owner?.phone || currentStore?.phone || authUser?.phone || "";
  const storeEmail = storeInfo?.email || storeInfo?.owner?.email || currentStore?.email || authUser?.email || "";
  const storeGstin = storeInfo?.gstin || storeInfo?.gstNumber || currentStore?.gstin || "";

  const customerName = bill.customerName || bill.customer?.name || bill.buyer?.name || "Walk-in Customer";
  const rawPhone = bill.customerPhone || customerPhone || bill.customer?.phone || bill.buyer?.phone || "";
  const rawEmail = bill.customerEmail || bill.customer?.email || bill.buyer?.email || "";

  const handleDownloadPDF = () => {
    if (bill) {
      const fullBillData = {
        ...bill,
        storeInfo: storeInfo || currentStore,
        currentStore: currentStore,
      };
      downloadBillPDF(fullBillData);
      showSuccess("Tax Invoice PDF downloaded!");
    } else {
      showError("Bill data not available");
    }
  };

  const handlePrintPDF = () => {
    if (bill) {
      const fullBillData = {
        ...bill,
        storeInfo: storeInfo || currentStore,
        currentStore: currentStore,
      };
      printBillPDF(fullBillData);
    } else {
      showError("Bill data not available");
    }
  };

  const formattedDate = billedAt
    ? new Date(billedAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleString("en-IN");

  const grandTotal = Number(totalAmount || 0);
  const totalQty = products?.reduce((sum, p) => sum + Number(p.quantity || 1), 0) || 0;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto select-none">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-md">
              <CheckCircle2 className="h-5 w-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold leading-tight">Payment Completed</h2>
              <p className="text-xs text-emerald-100 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>GST Tax Invoice Generated</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeBillPreview}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Bill Content (Digital Thermal / A4 Paper Invoice Card) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-100/60">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 text-slate-800 space-y-4">
            
            {/* Store Branding & Header */}
            <div className="text-center border-b border-slate-200 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider mb-1.5">
                <Receipt className="h-3 w-3 text-amber-400" />
                <span>Official Tax Invoice</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{storeName}</h3>
              {isValid(storeAddressStr) && <p className="text-xs text-slate-500 font-medium mt-0.5">{storeAddressStr}</p>}
              {(isValid(storePhone) || isValid(storeEmail) || isValid(storeGstin)) && (
                <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center justify-center flex-wrap gap-x-2">
                  {isValid(storePhone) && <span>Phone: <strong className="text-slate-700">{storePhone}</strong></span>}
                  {isValid(storePhone) && isValid(storeEmail) && <span>•</span>}
                  {isValid(storeEmail) && <span>Email: <strong className="text-slate-700">{storeEmail}</strong></span>}
                  {(isValid(storePhone) || isValid(storeEmail)) && isValid(storeGstin) && <span>•</span>}
                  {isValid(storeGstin) && <span>GSTIN: <strong className="text-slate-700">{storeGstin}</strong></span>}
                </p>
              )}
            </div>

            {/* Invoice Meta Data Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Invoice Details</p>
                <p className="font-bold text-slate-900 mt-0.5">#{billNumber || (bill._id ? String(bill._id).slice(-8) : "N/A")}</p>
                <p className="text-slate-600 mt-0.5">{formattedDate}</p>
                <p className="text-slate-600 font-medium">Mode: <span className="font-bold text-slate-900">{paymentMethod || "CASH"}</span></p>
                {isValid(storePhone) && (
                  <p className="text-slate-600 mt-0.5">Store Ph: <span className="font-semibold text-slate-800">{storePhone}</span></p>
                )}
                {isValid(storeEmail) && (
                  <p className="text-slate-600 mt-0.5">Store Email: <span className="font-semibold text-slate-800">{storeEmail}</span></p>
                )}
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Billed To</p>
                <p className="font-bold text-slate-900 mt-0.5">{customerName}</p>
                {isValid(rawPhone) && (
                  <p className="text-slate-600 mt-0.5">Ph: {rawPhone}</p>
                )}
                {isValid(rawEmail) && (
                  <p className="text-slate-600 mt-0.5">{rawEmail}</p>
                )}
                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  ✓ PAID
                </span>
              </div>
            </div>

            {/* Itemized Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider">
                    <th className="py-2 text-left">Item Description</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Rate</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products?.map((product, idx) => (
                    <tr key={product._id || idx} className="hover:bg-slate-50/60">
                      <td className="py-2.5 font-medium text-slate-900">
                        {product.name || product.title}
                      </td>
                      <td className="py-2.5 text-center text-slate-600">{product.quantity}</td>
                      <td className="py-2.5 text-right text-slate-600">₹{(product.price || 0).toFixed(2)}</td>
                      <td className="py-2.5 text-right font-bold text-slate-900">₹{((product.total || product.quantity * product.price) || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary & Total in Words */}
            {(() => {
              const subtotalVal = products?.reduce((sum, p) => sum + Number((p.price || 0) * (p.quantity || 1)), 0) || Number(bill?.subtotal || grandTotal);
              const discVal = (typeof bill.discount === "object" && bill.discount?.amount) ||
                (typeof bill.discount === "object" && bill.discount?.type === "percent" ? (subtotalVal * (bill.discount?.value || 0)) / 100 : (bill.discount?.value || 0)) ||
                (typeof bill.discount === "number" ? bill.discount : 0) ||
                (typeof bill.discountAmount === "number" ? bill.discountAmount : 0) ||
                (subtotalVal > grandTotal + 0.01 ? subtotalVal - grandTotal : 0);

              const finalGrandTotal = Math.max(0, subtotalVal - discVal);

              return (
                <div className="border-t border-slate-200 pt-3 space-y-1.5">
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Total Items ({products?.length || 0}):</span>
                    <span className="font-semibold text-slate-800">{totalQty} Units</span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-slate-800">₹{subtotalVal.toFixed(2)}</span>
                  </div>

                  {discVal > 0 && (
                    <div className="flex justify-between items-center text-xs text-emerald-600 font-bold">
                      <span>Discount Applied:</span>
                      <span>- ₹{discVal.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm font-bold text-slate-900 pt-1.5 border-t border-slate-100">
                    <span>Grand Total:</span>
                    <span className="text-xl font-black text-emerald-600">₹{finalGrandTotal.toFixed(2)}</span>
                  </div>

                  {/* Total Amount in Words Banner */}
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200/60 text-xs">
                    <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">Amount in Words:</span>
                    <p className="font-semibold text-emerald-900 mt-0.5">{numberToWords(finalGrandTotal)}</p>
                  </div>
                </div>
              );
            })()}

            {/* Terms & Conditions & Authorized Signatory Block */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pt-3 border-t border-slate-200 text-xs">
              <div className="text-[10px] text-slate-500 space-y-0.5 max-w-sm">
                <p className="font-bold text-slate-700">Terms & Conditions:</p>
                <p>1. All sales are final. Goods once sold will not be returned.</p>
                <p>2. Payments received via cash/UPI/card as indicated.</p>
                <p>3. This is an official computer-generated tax invoice.</p>
              </div>

              <div className="text-center w-full sm:w-auto min-w-[170px] flex flex-col items-center self-end">
                <img
                  src="/stamp.png"
                  alt="Official Store Stamp"
                  className="w-24 h-24 object-contain -mb-1 opacity-90 transition-transform hover:scale-105"
                />
                <div className="border-t border-slate-300 w-full pt-1">
                  <p className="font-bold text-xs text-slate-900">For VyparSakha</p>
                  <p className="text-[10px] text-slate-500 font-medium">Authorized Signatory</p>
                </div>
              </div>
            </div>

            {/* Footer Compliance Notice */}
            <div className="text-center text-[10px] text-slate-400 border-t border-dashed border-slate-200 pt-2 space-y-0.5">
              <p className="font-medium text-slate-600">Thank you for shopping with {storeName}! Visit again!</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition shadow-md shadow-indigo-600/20"
          >
            <Download size={16} />
            <span>Download Official Invoice PDF</span>
          </button>

          <button
            type="button"
            onClick={handlePrintPDF}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-sm transition shadow-md"
          >
            <Printer size={16} />
            <span>Print Receipt</span>
          </button>

          <button
            type="button"
            onClick={closeBillPreview}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
