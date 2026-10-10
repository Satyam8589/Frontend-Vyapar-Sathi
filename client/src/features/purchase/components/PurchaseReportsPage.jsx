"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePurchaseReports } from "../hooks/usePurchaseReports";

const currencyFormat = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v || 0);

export default function PurchaseReportsPage() {
  const router = useRouter();
  const { storeId, reportData, loading, error, filters, setFilters, fetchReports } = usePurchaseReports();
  const [activeTab, setActiveTab] = useState("transactions");
  const [storeName] = useState("Store Reports"); // Would normally fetch from context
  
  useEffect(() => {
    // Generate initial report
    fetchReports(filters);
  }, []);

  const handleGenerate = () => {
    fetchReports(filters);
  };

  const handleReset = () => {
    const defaultFilters = { startDate: '', endDate: '', supplierId: '', productId: '', paymentStatus: '', returnStatus: '' };
    setFilters(defaultFilters);
    fetchReports(defaultFilters);
  };

  const exportCSV = () => {
    if (!reportData?.transactions?.length) return;
    
    const headers = ["Invoice", "Date", "Supplier", "Subtotal", "Discount", "Tax", "Grand Total", "Paid", "Due", "Returned", "Status"];
    const rows = reportData.transactions.map(t => [
      t.invoiceNumber,
      new Date(t.purchaseDate).toLocaleDateString(),
      t.supplierName || 'N/A',
      t.subTotal,
      t.discountAmount,
      t.taxAmount,
      t.grandTotal,
      t.paidAmount,
      t.dueAmount,
      t.returnedAmount,
      t.paymentStatus
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "purchase_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printReport = () => {
    window.print();
  };

  const summary = reportData?.summary || {
    totalPurchase: 0, purchaseOrders: 0, amountPaid: 0, amountDue: 0, returnedAmount: 0, netPurchase: 0, averagePurchase: 0
  };

  return (
    <div className="min-h-screen pb-12 print-container">
      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .print-container, .print-container * { visibility: visible; }
          .print-container { position: absolute; left: 0; top: 0; width: 100%; padding: 0 !important; }
          .no-print { display: none !important; }
          .print-header { display: block !important; margin-bottom: 2rem; border-bottom: 2px solid #ccc; padding-bottom: 1rem; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd !important; padding: 8px !important; }
        }
        .print-header { display: none; }
      `}} />

      <div className="w-full px-4 py-6 max-w-7xl mx-auto">
        
        {/* Header - No Print */}
        <section className="mb-6 animate-fade-in-up no-print">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Purchase Reports</h1>
              <p className="text-sm text-slate-500 font-medium">Generate, view, and export purchase analytics</p>
            </div>
            <div className="flex gap-2">
              <button onClick={exportCSV} className="px-4 py-2 font-bold bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Export CSV
              </button>
              <button onClick={printReport} className="px-4 py-2 font-bold bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition">
                Print PDF
              </button>
            </div>
          </div>
        </section>

        {/* Print Only Header */}
        <div className="print-header">
          <h1 className="text-3xl font-black">VYAPARSATHI</h1>
          <h2 className="text-xl font-bold mt-2">PURCHASE REPORT</h2>
          <p className="text-sm mt-1">Store: {storeName}</p>
          <p className="text-sm">Generated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Error */}
        {error && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-xl no-print">{error}</div>}

        {/* Filters - No Print */}
        <section className="mb-6 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">From Date</label>
            <input type="date" value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})} className="w-full p-2 border rounded-lg bg-slate-50" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">To Date</label>
            <input type="date" value={filters.endDate} onChange={e => setFilters({...filters, endDate: e.target.value})} className="w-full p-2 border rounded-lg bg-slate-50" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Payment Status</label>
            <select value={filters.paymentStatus} onChange={e => setFilters({...filters, paymentStatus: e.target.value})} className="w-full p-2 border rounded-lg bg-slate-50">
              <option value="">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
          <div className="md:col-span-3 flex justify-end gap-2 mt-2">
            <button onClick={handleReset} className="px-4 py-2 font-bold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">Reset</button>
            <button onClick={handleGenerate} disabled={loading} className="px-6 py-2 font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </section>

        {/* Summary Widgets */}
        <section className="mb-8 grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            { label: 'Total Purchase', val: currencyFormat(summary.totalPurchase), color: 'text-blue-600' },
            { label: 'Orders', val: summary.purchaseOrders, color: 'text-slate-700' },
            { label: 'Paid', val: currencyFormat(summary.amountPaid), color: 'text-emerald-600' },
            { label: 'Due', val: currencyFormat(summary.amountDue), color: 'text-rose-600' },
            { label: 'Returned', val: currencyFormat(summary.returnedAmount), color: 'text-amber-600' },
            { label: 'Net Purchase', val: currencyFormat(summary.netPurchase), color: 'text-indigo-600' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">{item.label}</span>
              <span className={`text-lg sm:text-xl font-black ${item.color}`}>{item.val}</span>
            </div>
          ))}
        </section>

        {/* Tabs - No Print */}
        <div className="flex gap-2 border-b border-slate-200 mb-6 no-print overflow-x-auto">
          {["transactions", "supplier", "product", "monthly", "return"].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-bold text-sm capitalize ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Data Tables */}
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-bold animate-pulse">Generating Report...</div>
        ) : !reportData ? (
          <div className="p-12 text-center text-slate-500 font-bold">Click Generate Report</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
            {/* TRANSACTIONS TAB */}
            {(activeTab === "transactions" || document.body.classList.contains('printing')) && (
              <div className="print-section">
                <h3 className="text-lg font-bold p-4 print-header">PURCHASE TRANSACTIONS</h3>
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                    <tr>
                      <th className="p-4">Invoice</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Supplier</th>
                      <th className="p-4 text-right">Total</th>
                      <th className="p-4 text-right">Paid</th>
                      <th className="p-4 text-right">Due</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reportData.transactions.length === 0 && <tr><td colSpan="7" className="p-4 text-center">No records found.</td></tr>}
                    {reportData.transactions.map((t, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-4 font-bold">{t.invoiceNumber}</td>
                        <td className="p-4">{new Date(t.purchaseDate).toLocaleDateString()}</td>
                        <td className="p-4">{t.supplierName}</td>
                        <td className="p-4 text-right font-bold">{currencyFormat(t.grandTotal)}</td>
                        <td className="p-4 text-right text-emerald-600">{currencyFormat(t.paidAmount)}</td>
                        <td className="p-4 text-right text-rose-600">{currencyFormat(t.dueAmount)}</td>
                        <td className="p-4 uppercase text-xs font-bold">{t.paymentStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* SUPPLIER TAB */}
            {activeTab === "supplier" && (
              <div>
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                    <tr>
                      <th className="p-4">Supplier</th>
                      <th className="p-4 text-right">Orders</th>
                      <th className="p-4 text-right">Gross Purchase</th>
                      <th className="p-4 text-right">Net Purchase</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reportData.supplierReport.length === 0 && <tr><td colSpan="4" className="p-4 text-center">No records found.</td></tr>}
                    {reportData.supplierReport.map((s, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-4 font-bold">{s.supplierName}</td>
                        <td className="p-4 text-right">{s.purchaseOrders}</td>
                        <td className="p-4 text-right font-bold">{currencyFormat(s.grossPurchase)}</td>
                        <td className="p-4 text-right font-bold text-indigo-600">{currencyFormat(s.netPurchase)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* PRODUCT TAB */}
            {activeTab === "product" && (
              <div>
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                    <tr>
                      <th className="p-4">Product</th>
                      <th className="p-4">SKU</th>
                      <th className="p-4 text-right">Purchased Qty</th>
                      <th className="p-4 text-right">Returned Qty</th>
                      <th className="p-4 text-right">Net Qty</th>
                      <th className="p-4 text-right">Purchase Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reportData.productReport.length === 0 && <tr><td colSpan="6" className="p-4 text-center">No records found.</td></tr>}
                    {reportData.productReport.map((p, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-4 font-bold">{p.productName}</td>
                        <td className="p-4 text-slate-500">{p.sku}</td>
                        <td className="p-4 text-right">{p.purchasedQuantity}</td>
                        <td className="p-4 text-right text-rose-500">{p.returnedQuantity}</td>
                        <td className="p-4 text-right font-bold text-indigo-600">{p.netQuantity}</td>
                        <td className="p-4 text-right font-bold">{currencyFormat(p.purchaseValue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* MONTHLY TAB */}
            {activeTab === "monthly" && (
              <div>
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                    <tr>
                      <th className="p-4">Month/Year</th>
                      <th className="p-4 text-right">Orders</th>
                      <th className="p-4 text-right">Gross Purchase</th>
                      <th className="p-4 text-right">Net Purchase</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reportData.monthlyReport.length === 0 && <tr><td colSpan="4" className="p-4 text-center">No records found.</td></tr>}
                    {reportData.monthlyReport.map((m, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-4 font-bold">{m._id.month}/{m._id.year}</td>
                        <td className="p-4 text-right">{m.purchaseOrders}</td>
                        <td className="p-4 text-right font-bold">{currencyFormat(m.grossPurchase)}</td>
                        <td className="p-4 text-right font-bold text-indigo-600">{currencyFormat(m.netPurchase)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* RETURN TAB */}
            {activeTab === "return" && (
              <div>
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                    <tr>
                      <th className="p-4">Return ID</th>
                      <th className="p-4">Invoice</th>
                      <th className="p-4">Product</th>
                      <th className="p-4 text-right">Qty</th>
                      <th className="p-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reportData.returnReport.length === 0 && <tr><td colSpan="5" className="p-4 text-center">No records found.</td></tr>}
                    {reportData.returnReport.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-4 font-bold">{r.returnId}</td>
                        <td className="p-4 text-slate-500">{r.invoiceNumber}</td>
                        <td className="p-4">{r.productName}</td>
                        <td className="p-4 text-right">{r.returnedQuantity}</td>
                        <td className="p-4 text-right font-bold text-rose-600">{currencyFormat(r.returnAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {/* Footer for print */}
        <div className="print-header mt-8 text-center text-xs text-slate-500">
          Generated by VyaparSathi
        </div>

      </div>
    </div>
  );
}
