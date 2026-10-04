"use client";

import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { getSellers } from "@/features/seller/services/sellerService";
import { getStoreProducts, searchStoreProducts } from "@/features/inventory/services/inventoryService";
import { useInventoryContext } from "@/features/inventory/context/inventoryContext";
import AddProductModal from "@/features/inventory/components/AddProductModal";

const EMPTY_ITEM = {
  product: "",
  quantity: 1,
  purchasePrice: 0,
  discount: 0,
  tax: 0,
  subtotal: 0
};

export default function PurchaseFormModal({ isOpen, onClose, onSubmit, loading, storeId, initialData = null }) {
  const { addProduct } = useInventoryContext();
  const [mounted, setMounted] = useState(false);

  // Data for selects
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [newProductItemIndex, setNewProductItemIndex] = useState(null);

  // Form State
  const [seller, setSeller] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState([]);
  const [pendingItem, setPendingItem] = useState({ ...EMPTY_ITEM });
  const [selectedProductId, setSelectedProductId] = useState("");

  const [overallDiscount, setOverallDiscount] = useState(0);
  const [overallTax, setOverallTax] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [notes, setNotes] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen && storeId) {
      loadDependencies();
      if (initialData) {
        setSeller(initialData.seller?._id || initialData.seller || "");
        setInvoiceNumber(initialData.invoiceNumber || generateInvoiceNumber());
        setPurchaseDate(
          initialData.purchaseDate
            ? new Date(initialData.purchaseDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0]
        );

        const loadedItems = (initialData.items || []).map((item, idx) => ({
          ...item,
          product: item.product?._id || item.product,
          id: item._id || Date.now() + idx
        }));
        setItems(loadedItems);

        setOverallDiscount(initialData.discount || 0);
        setOverallTax(initialData.tax || 0);
        setPaidAmount(initialData.paidAmount || 0);
        setNotes(initialData.notes || "");

        setPendingItem({ ...EMPTY_ITEM });
        setSelectedProductId("");
        setProductSearch("");
        setErrors({});
      } else {
        resetForm();
      }
    }
  }, [isOpen, storeId, initialData]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const query = productSearch.trim();
      if (!query) {
        setSearchResults([]);
        setSearchError("");
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      setSearchError("");
      try {
        const results = await searchStoreProducts(query, storeId);
        setSearchResults(results);
      } catch (err) {
        setSearchError("Unable to load products. Please try again.");
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [productSearch, storeId]);

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
    setItems([]);
    setPendingItem({ ...EMPTY_ITEM });
    setSelectedProductId("");
    setProductSearch("");
    setIsSearching(false);
    setSearchError("");
    setSearchResults([]);
    setIsNewProductOpen(false);
    setNewProductItemIndex(null);
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

  const handlePendingItemChange = (field, value) => {
    let numVal = value;
    if (["quantity", "purchasePrice", "discount", "tax"].includes(field)) {
      numVal = parseFloat(value) || 0;
    }
    const newPending = { ...pendingItem, [field]: numVal };

    const { quantity, purchasePrice, discount, tax } = newPending;
    const base = (quantity || 0) * (purchasePrice || 0);
    const discounted = base - (discount || 0);
    const taxed = discounted + (tax || 0);
    newPending.subtotal = Math.max(0, taxed);

    setPendingItem(newPending);
  };

  const handleProductSelect = (productId) => {
    setSelectedProductId(productId);
    const selectedProduct = products.find(p => p._id === productId) || searchResults.find(p => p._id === productId);
    if (selectedProduct) {
      const price = selectedProduct.buyingPrice ?? selectedProduct.purchasePrice ?? 0;
      handlePendingItemChange("purchasePrice", price);
      // Ensure other fields are reset
      setPendingItem(prev => ({
        ...prev,
        product: productId,
        quantity: 1,
        purchasePrice: price,
        discount: 0,
        tax: 0,
        subtotal: price
      }));
    } else {
      setPendingItem({ ...EMPTY_ITEM, product: productId });
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    let numVal = value;
    if (["quantity", "purchasePrice", "discount", "tax"].includes(field)) {
      numVal = parseFloat(value) || 0;
    }
    newItems[index][field] = numVal;

    // Calculate item subtotal
    const { quantity, purchasePrice, discount, tax } = newItems[index];
    const base = quantity * purchasePrice;
    const discounted = base - discount;
    const taxed = discounted + tax;
    newItems[index].subtotal = Math.max(0, taxed);

    setItems(newItems);
  };

  const addPendingItem = () => {
    if (!selectedProductId) return;

    // Check if duplicate
    const existingIndex = items.findIndex(item => item.product === selectedProductId);
    if (existingIndex >= 0) {
      // Increase quantity
      const newItems = [...items];
      const existing = newItems[existingIndex];
      const newQty = existing.quantity + (pendingItem.quantity || 1);

      existing.quantity = newQty;
      // Recalculate subtotal
      const base = newQty * existing.purchasePrice;
      const discounted = base - existing.discount;
      const taxed = discounted + existing.tax;
      existing.subtotal = Math.max(0, taxed);

      setItems(newItems);
    } else {
      // Add new
      setItems([...items, { ...pendingItem, id: Date.now() }]);
    }

    // Reset pending
    setSelectedProductId("");
    setPendingItem({ ...EMPTY_ITEM });
    setProductSearch("");
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const visibleProducts = productSearch.trim() ? searchResults : products;

  const openNewProduct = () => {
    setIsNewProductOpen(true);
  };

  const handleNewProduct = async (productData) => {
    try {
      let createdProduct = null;

      // 1. Try via inventory context if available
      if (addProduct) {
        try {
          const result = await addProduct({
            ...productData,
            store: storeId,
            storeId: storeId,
          });
          if (result?.success && result.data) {
            createdProduct = result.data;
          }
        } catch (ctxErr) {
          console.warn("Context addProduct failed, trying direct service:", ctxErr);
        }
      }

      // 2. Fallback to direct inventoryService if needed
      if (!createdProduct) {
        const rawRes = await inventoryService.addProduct({
          ...productData,
          store: storeId,
          storeId: storeId,
        });
        createdProduct = rawRes?.data || rawRes;
      }

      if (createdProduct && (createdProduct._id || createdProduct.id)) {
        const prodId = createdProduct._id || createdProduct.id;
        const normalizedProduct = {
          ...createdProduct,
          _id: prodId,
        };

        // Update local products list so dropdown immediately reflects the new item
        setProducts((current) => [normalizedProduct, ...current.filter((item) => (item._id || item.id) !== prodId)]);

        // Calculate default purchase price & quantity
        const price = normalizedProduct.buyingPrice ?? normalizedProduct.purchasePrice ?? Number(productData.buyingPrice) ?? 0;
        const qty = Number(productData.quantity || productData.qty) > 0 ? Number(productData.quantity || productData.qty) : 1;

        const newItem = {
          ...EMPTY_ITEM,
          id: Date.now(),
          product: prodId,
          quantity: qty,
          purchasePrice: price,
          discount: 0,
          tax: 0,
          subtotal: qty * price,
        };

        // Auto-select in pending item area
        setSelectedProductId(prodId);
        setPendingItem(newItem);

        // Auto-add to the Purchase Items table
        setItems((prevItems) => {
          const exists = prevItems.some((item) => (item.product?._id || item.product) === prodId);
          if (exists) return prevItems;
          return [...prevItems, newItem];
        });

        // Clear search so it doesn't filter out the new product
        setProductSearch("");
        setSearchResults([]);
        setIsNewProductOpen(false);

        return { success: true, data: normalizedProduct };
      }

      return { success: false, error: "Failed to create product" };
    } catch (err) {
      console.error("Error creating new product:", err);
      const msg = err?.response?.data?.message || err?.message || "Failed to create product";
      return { success: false, error: msg };
    }
  };

  // Calculations
  const calcSubtotal = () => items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  const calcGrandTotal = () => Math.max(0, calcSubtotal() - overallDiscount + overallTax);
  const calcDue = () => Math.max(0, calcGrandTotal() - paidAmount);

  const handleSubmit = async (e) => {
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

    try {
      setErrors({});
      await onSubmit(payload);
      // Success toast is handled by usePurchasePage hook
    } catch (err) {
      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.message || err?.message || "";

      let userMsg;
      if (status === 401 || status === 403) {
        userMsg = "Your session has expired. Please log in again.";
      } else if (status === 409 || serverMsg.toLowerCase().includes("duplicate") || serverMsg.toLowerCase().includes("already exists")) {
        userMsg = "A purchase with this invoice number already exists. Please use a different invoice number.";
      } else if (status === 400) {
        userMsg = serverMsg || "Please check the purchase details and try again.";
      } else if (status >= 500) {
        userMsg = "Unable to save purchase. Please try again.";
      } else {
        userMsg = serverMsg || "Unable to save purchase. Please try again.";
      }

      setErrors({ submit: userMsg });
      import('@/utils/toast').then(({ showError }) => {
        showError(userMsg);
      }).catch(() => { });
    }
  };

  if (!mounted || !isOpen) return null;

  const inputClass = (field) =>
    `w-full px-3 py-2 rounded border text-sm text-slate-800 bg-white transition-all outline-none focus:ring-2 focus:ring-blue-500 ${errors[field] ? "border-red-400" : "border-slate-200"
    }`;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={!loading ? onClose : undefined} />

      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center justify-between flex-shrink-0 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{initialData ? "Edit Purchase" : "Add New Purchase"}</h2>
            <p className="text-xs text-slate-500">{initialData ? "Update existing purchase invoice" : "Record a new purchase invoice"}</p>
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

              {/* Product Search & Select */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                {/* <div className="px-4 py-3 bg-slate-100 border-b flex justify-between items-center">
                  <h3 className="font-semibold text-sm text-slate-800">Search & Select Product</h3>
                  <button
                    type="button"
                    onClick={openNewProduct}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg text-xs font-bold transition-colors border border-blue-200 shadow-sm"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                    + New Product
                  </button>
                </div> */}
                <div className="p-4 space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="search"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search product by name, SKU, barcode..."
                      className="flex-1 px-3 py-2 rounded border border-slate-200 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      className={`${inputClass("productSelect")} flex-1`}
                      value={selectedProductId}
                      onChange={e => handleProductSelect(e.target.value)}
                    >
                      <option value="">Select a Product</option>
                      {visibleProducts.map(p => (
                        <option key={p._id} value={p._id}>
                          {p.name}{p.sku ? ` (${p.sku})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {isSearching && (
                    <p className="text-xs text-blue-600">Searching products...</p>
                  )}
                  {searchError && (
                    <p className="text-xs text-red-600">{searchError}</p>
                  )}
                  {!isSearching && !searchError && productSearch.trim() && visibleProducts.length === 0 && (
                    <div className="bg-amber-50 p-6 border border-amber-200 rounded-lg flex flex-col items-center justify-center text-center space-y-4">
                      <div className="text-amber-800 font-medium">
                        <p className="text-base mb-1">No product found</p>
                        <p className="text-sm opacity-80">The product you're looking for doesn't exist in your Product Master.</p>
                      </div>
                      <button
                        type="button"
                        onClick={openNewProduct}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add New Product
                      </button>
                    </div>
                  )}

                  {selectedProductId && (() => {
                    const p = products.find(prod => prod._id === selectedProductId) || searchResults.find(prod => prod._id === selectedProductId);
                    if (!p) return null;
                    return (
                      <div className="space-y-4">
                        {/* Selected Product Card */}
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-slate-700">
                          <div className="font-semibold text-blue-900 text-base">{p.name}</div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                            <div><span className="text-slate-500 block text-xs">SKU</span> {p.sku || 'N/A'}</div>
                            <div><span className="text-slate-500 block text-xs">Barcode</span> {p.barcode || 'N/A'}</div>
                            <div><span className="text-slate-500 block text-xs">Current Stock</span> <span className="font-medium text-slate-900">{p.quantity || 0}</span></div>
                            <div><span className="text-slate-500 block text-xs">Purchase Price</span> <span className="font-medium text-slate-900">₹{p.buyingPrice ?? p.purchasePrice ?? 0}</span></div>
                          </div>
                        </div>

                        {/* Enter Purchase Details */}
                        <div className="flex flex-wrap items-end gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg">
                          <div className="w-24">
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Qty</label>
                            <input type="number" min="1" className={inputClass("pending_qty")} value={pendingItem.quantity || ""} onChange={e => handlePendingItemChange("quantity", e.target.value)} />
                          </div>
                          <div className="w-28">
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Price (₹)</label>
                            <input type="number" min="0" className={inputClass("pending_price")} value={pendingItem.purchasePrice || ""} onChange={e => handlePendingItemChange("purchasePrice", e.target.value)} />
                          </div>
                          <div className="w-24">
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Disc (₹)</label>
                            <input type="number" min="0" className={inputClass("pending_disc")} value={pendingItem.discount || ""} onChange={e => handlePendingItemChange("discount", e.target.value)} />
                          </div>
                          <div className="w-24">
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Tax (₹)</label>
                            <input type="number" min="0" className={inputClass("pending_tax")} value={pendingItem.tax || ""} onChange={e => handlePendingItemChange("tax", e.target.value)} />
                          </div>
                          <div className="flex-1 min-w-[120px] text-right">
                            <div className="text-xs font-semibold text-slate-500 mb-1">Subtotal</div>
                            <div className="font-bold text-lg text-slate-800">₹{(pendingItem.subtotal || 0).toFixed(2)}</div>
                          </div>
                          <button
                            type="button"
                            onClick={addPendingItem}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded shadow-sm transition"
                          >
                            + Add Item
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Added Items Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-4 py-3 bg-slate-100 border-b">
                  <h3 className="font-semibold text-sm text-slate-800">Added Purchase Items ({items.length})</h3>
                </div>
                <div className="p-4 space-y-3">
                  {items.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-sm">
                      No items added yet. Search and select a product above.
                    </div>
                  ) : items.map((item, index) => {
                    const p = products.find(prod => prod._id === item.product) || searchResults.find(prod => prod._id === item.product);
                    return (
                      <div key={item.id} className="flex gap-3 items-center p-3 bg-slate-50 border border-slate-100 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-slate-800 truncate">{p ? p.name : "Unknown Product"}</div>
                          <div className="text-xs text-slate-500">{p?.sku ? `SKU: ${p.sku}` : ""}</div>
                        </div>
                        <div className="w-20">
                          <input type="number" min="1" className={inputClass(`item_${index}_quantity`)} value={item.quantity || ""} onChange={e => handleItemChange(index, "quantity", e.target.value)} title="Quantity" />
                        </div>
                        <div className="w-24">
                          <input type="number" min="0" className={inputClass(`item_${index}_price`)} value={item.purchasePrice || ""} onChange={e => handleItemChange(index, "purchasePrice", e.target.value)} title="Price" />
                        </div>
                        <div className="w-20">
                          <input type="number" min="0" className={inputClass(`item_${index}_discount`)} value={item.discount || ""} onChange={e => handleItemChange(index, "discount", e.target.value)} title="Discount" />
                        </div>
                        <div className="w-20">
                          <input type="number" min="0" className={inputClass(`item_${index}_tax`)} value={item.tax || ""} onChange={e => handleItemChange(index, "tax", e.target.value)} title="Tax" />
                        </div>
                        <div className="w-24 font-bold text-sm text-right text-slate-800">
                          ₹{(item.subtotal || 0).toFixed(2)}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                          title="Remove Item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    );
                  })}
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
        <div className="px-6 py-4 bg-white border-t border-slate-100 rounded-b-2xl flex-shrink-0">
          {errors.submit && (
            <div className="mb-3 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
              ⚠ {errors.submit}
            </div>
          )}
          <div className="flex justify-end gap-3">
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
              {loading ? "Saving..." : (initialData ? "Update Purchase" : "Save Purchase")}
            </button>
          </div>
        </div>
      </div>
      <AddProductModal
        isOpen={isNewProductOpen}
        onClose={() => {
          setIsNewProductOpen(false);
          setNewProductItemIndex(null);
        }}
        onAction={handleNewProduct}
        loading={loading}
      />
    </div>,
    document.body
  );
}
