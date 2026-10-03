"use client";

import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { getSellers } from "@/features/seller/services/sellerService";
import { getStoreProducts } from "@/features/inventory/services/inventoryService";

const EMPTY_ITEM = {
  product: "",
  quantity: 1,
  purchasePrice: 0,
  discount: 0,
  tax: 0,
  subtotal: 0
};

export default function PurchaseFormModal({ isOpen, onClose, onSubmit, loading, storeId }) {
  const [mounted, setMounted] = useState(false);
  
  // Data for selects
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
  
  // Form State
  const [seller, setSeller] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState([{ ...EMPTY_ITEM, id: Date.now() }]);
  
  const [overallDiscount, setOverallDiscount] = useState(0);
  const [overallTax, setOverallTax] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [notes, setNotes] = useState("");
  
  const [errors, setErrors] = useState({});

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen && storeId) {
      loadDependencies();
      resetForm();
    }
  }, [isOpen, storeId]);

  const loadDependencies = async () => {
    try {
      setFetchingData(true);
      const [sellersResult, productsResult] = await Promise.allSettled([
        getSellers(storeId, { limit: 100 }),
        getStoreProducts(storeId)
      ]);

      if (sellersResult.status === "fulfilled") {
        const sellersRes = sellersResult.value;
        setSellers(Array.isArray(sellersRes) ? sellersRes : sellersRes?.sellers || sellersRes?.data || []);
      } else {
        console.error("Failed to load sellers", sellersResult.reason);
        setSellers([]);
      }

      if (productsResult.status === "fulfilled") {
        const productsRes = productsResult.value;
        const storeProducts = Array.isArray(productsRes)
          ? productsRes
          : productsRes?.products || productsRes?.data || [];
        setProducts(storeProducts);
      } else {
        console.error("Failed to load store products", productsResult.reason);
        setProducts([]);
      }
    } finally {
      setFetchingData(false);
    }
  };

  const generateInvoiceNumber = () => {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `PUR-${datePart}-${randomPart}`;
  };

  const resetForm = () => {
    setSeller("");
    setInvoiceNumber(generateInvoiceNumber());
    setPurchaseDate(new Date().toISOString().split('T')[0]);
    setItems([{ ...EMPTY_ITEM, id: Date.now() }]);
    setOverallDiscount(0);
    setOverallTax(0);
    setPaidAmount(0);
    setNotes("");
    setErrors({});
  };

  const validate = () => {
    const e = {};
    if (!seller) e.seller = "Seller is required";
    if (!invoiceNumber.trim()) e.invoiceNumber = "Invoice number is required";
    if (!purchaseDate) e.purchaseDate = "Purchase date is required";
    
    if (items.length === 0) e.items = "At least one item is required";
    items.forEach((item, index) => {
      if (!item.product) e[`item_${index}_product`] = "Product required";
      if (item.quantity <= 0) e[`item_${index}_quantity`] = "Invalid qty";
      if (item.purchasePrice < 0) e[`item_${index}_price`] = "Invalid price";
    });

    return e;
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    let numVal = value;
    if (["quantity", "purchasePrice", "discount", "tax"].includes(field)) {
       numVal = parseFloat(value) || 0;
    }
    newItems[index][field] = numVal;

    // If product changed, auto-fill price from product object
    if (field === "product") {
      const selectedProduct = products.find(p => p._id === value);
      if (selectedProduct) {
        newItems[index].purchasePrice =
          selectedProduct.buyingPrice ?? selectedProduct.purchasePrice ?? 0;
      }
    }

    // Calculate item subtotal
    const { quantity, purchasePrice, discount, tax } = newItems[index];
    const base = quantity * purchasePrice;
    const discounted = base - discount;
    const taxed = discounted + tax;
    newItems[index].subtotal = Math.max(0, taxed);

    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { ...EMPTY_ITEM, id: Date.now() }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // Calculations
  const calcSubtotal = () => items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  const calcGrandTotal = () => Math.max(0, calcSubtotal() - overallDiscount + overallTax);
  const calcDue = () => Math.max(0, calcGrandTotal() - paidAmount);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload = {
      seller,
      invoiceNumber,
      purchaseDate,
      items: items.map(({ product, quantity, purchasePrice, discount, tax, subtotal }) => ({
        product, quantity, purchasePrice, discount, tax, subtotal
      })),
      subtotal: calcSubtotal(),
      discount: overallDiscount,
      tax: overallTax,
      grandTotal: calcGrandTotal(),
      paidAmount,
      notes
    };

    onSubmit(payload);
  };

  if (!mounted || !isOpen) return null;

  const inputClass = (field) =>
    `w-full px-3 py-2 rounded border text-sm text-slate-800 bg-white transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
      errors[field] ? "border-red-400" : "border-slate-200"
    }`;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={!loading ? onClose : undefined} />

      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center justify-between flex-shrink-0 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Add New Purchase</h2>
            <p className="text-xs text-slate-500">Record a new purchase invoice</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 bg-white rounded-lg shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          {fetchingData ? (
            <div className="flex justify-center p-8 text-blue-500">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Top Meta Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Seller *</label>
                  <select 
                    className={inputClass("seller")} 
                    value={seller} 
                    onChange={e => setSeller(e.target.value)}
                  >
                    <option value="">Select Seller</option>
                    {sellers.map(s => <option key={s._id} value={s._id}>{s.name} ({s.businessName})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Invoice Number *</label>
                  <input 
                    type="text" 
                    className={`${inputClass("invoiceNumber")} bg-slate-100 cursor-not-allowed`} 
                    value={invoiceNumber} 
                    readOnly
                    placeholder="INV-XXXX"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Purchase Date *</label>
                  <input 
                    type="date" 
                    className={inputClass("purchaseDate")} 
                    value={purchaseDate} 
                    onChange={e => setPurchaseDate(e.target.value)} 
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-4 py-3 bg-slate-100 border-b flex justify-between items-center">
                  <h3 className="font-semibold text-sm text-slate-800">Purchase Items</h3>
                  <button 
                    onClick={addItem}
                    className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
                  >
                    + Add Item
                  </button>
                </div>
                <div className="p-4 space-y-3">
                  {items.map((item, index) => (
                    <div key={item.id} className="flex gap-2 items-start p-3 bg-slate-50 border border-slate-100 rounded-lg">
                      <div className="w-1/3">
                        <select 
                          className={inputClass(`item_${index}_product`)} 
                          value={item.product}
                          onChange={e => handleItemChange(index, "product", e.target.value)}
                        >
                          <option value="">Select Product</option>
                          {products.map(p => (
                            <option key={p._id} value={p._id}>
                              {p.name}{p.sku ? ` (${p.sku})` : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-24">
                        <input type="number" min="1" placeholder="Qty" className={inputClass(`item_${index}_quantity`)} value={item.quantity || ""} onChange={e => handleItemChange(index, "quantity", e.target.value)} />
                      </div>
                      <div className="w-24">
                        <input type="number" min="0" placeholder="Price" className={inputClass(`item_${index}_price`)} value={item.purchasePrice || ""} onChange={e => handleItemChange(index, "purchasePrice", e.target.value)} />
                      </div>
                      <div className="w-20">
                        <input type="number" min="0" placeholder="Disc" className={inputClass(`item_${index}_discount`)} value={item.discount || ""} onChange={e => handleItemChange(index, "discount", e.target.value)} />
                      </div>
                      <div className="w-20">
                        <input type="number" min="0" placeholder="Tax" className={inputClass(`item_${index}_tax`)} value={item.tax || ""} onChange={e => handleItemChange(index, "tax", e.target.value)} />
                      </div>
                      <div className="w-24 font-semibold text-sm flex items-center justify-end px-2 pt-2 text-slate-700">
                        ₹{(item.subtotal || 0).toFixed(2)}
                      </div>
                      <button 
                        onClick={() => removeItem(index)}
                        className="mt-1 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                        title="Remove"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                  {errors.items && <p className="text-red-500 text-xs px-2">{errors.items}</p>}
                </div>
              </div>

              {/* Bottom Totals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Remarks</label>
                    <textarea 
                      className={inputClass("notes")} 
                      rows={3} 
                      value={notes} 
                      onChange={e => setNotes(e.target.value)} 
                      placeholder="Add any notes here..."
                    />
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal:</span>
                    <span className="font-semibold text-slate-800">₹{calcSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Overall Discount (-):</span>
                    <input type="number" min="0" className="w-24 px-2 py-1 text-right border rounded" value={overallDiscount || ""} onChange={e => setOverallDiscount(parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Overall Tax (+):</span>
                    <input type="number" min="0" className="w-24 px-2 py-1 text-right border rounded" value={overallTax || ""} onChange={e => setOverallTax(parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="pt-2 border-t flex justify-between text-base font-bold text-slate-900">
                    <span>Grand Total:</span>
                    <span>₹{calcGrandTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2">
                    <span className="text-slate-600 font-medium">Amount Paid:</span>
                    <input type="number" min="0" max={calcGrandTotal()} className="w-24 px-2 py-1 text-right border rounded font-medium text-emerald-600" value={paidAmount || ""} onChange={e => setPaidAmount(parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="pt-2 border-t flex justify-between text-sm font-bold text-rose-600">
                    <span>Amount Due:</span>
                    <span>₹{calcDue().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || fetchingData}
            className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {loading ? "Saving..." : "Save Purchase"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
