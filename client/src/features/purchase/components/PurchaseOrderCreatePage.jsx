"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuthContext as useAuth } from "@/features/auth/context/AuthContext";
import { useInventoryContext } from "@/features/inventory/context/inventoryContext";
import AddProductModal from "@/features/inventory/components/AddProductModal";
import { getSellers } from "@/features/seller/services/sellerService";
import { getStoreProducts, searchStoreProducts, addProduct as directAddProduct } from "@/features/inventory/services/inventoryService";
import { createPurchaseOrder } from "../services/purchaseOrderService";
import { 
  ArrowLeft, FileText, Plus, Trash2, Search, XCircle, AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";

const currencyFormat = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount || 0);
};

const EMPTY_ITEM = {
  product: "",
  name: "",
  sku: "",
  quantity: 1,
  purchasePrice: 0,
  discount: 0,
  tax: 0,
  subtotal: 0
};

export default function PurchaseOrderCreatePage() {
  const { storeId } = useParams();
  const navigate = useRouter();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);

  // Form State
  const [sellerId, setSellerId] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([]);
  const [pendingItem, setPendingItem] = useState({ ...EMPTY_ITEM });
  const [selectedProductId, setSelectedProductId] = useState("");

  const [errors, setErrors] = useState({});

  const handleNewProduct = async (productData) => {
    try {
      let createdProduct = null;

      if (contextAddProduct) {
        try {
          const result = await contextAddProduct({
            ...productData,
            store: storeId,
            storeId: storeId,
          });
          if (result?.success && result.data) {
            createdProduct = result.data;
          }
        } catch (ctxErr) {
          console.warn("Context addProduct failed:", ctxErr);
        }
      }

      if (!createdProduct) {
        const rawRes = await directAddProduct({
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

        setProducts((current) => [normalizedProduct, ...current.filter((item) => (item._id || item.id) !== prodId)]);

        const price = normalizedProduct.buyingPrice ?? normalizedProduct.purchasePrice ?? Number(productData.buyingPrice) ?? 0;
        const qty = Number(productData.quantity || productData.qty) > 0 ? Number(productData.quantity || productData.qty) : 1;

        const newItem = {
          ...EMPTY_ITEM,
          product: prodId,
          name: normalizedProduct.name,
          sku: normalizedProduct.sku || "",
          quantity: qty,
          purchasePrice: price,
          discount: 0,
          tax: 0,
          subtotal: qty * price,
        };

        setSelectedProductId(prodId);
        setPendingItem(newItem);

        setItems((prevItems) => {
          const exists = prevItems.some((item) => (item.product?._id || item.product) === prodId);
          if (exists) return prevItems;
          return [...prevItems, newItem];
        });

        setProductSearch("");
        setSearchResults([]);
        setIsNewProductOpen(false);
        toast.success(`Product "${normalizedProduct.name}" added to PO items!`);
        return { success: true, data: normalizedProduct };
      }

      return { success: false, error: "Failed to create product" };
    } catch (err) {
      console.error("Error creating product:", err);
      const msg = err?.response?.data?.message || err?.message || "Failed to create product";
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  useEffect(() => {
    loadDependencies();
    setPoNumber(generatePONumber());
  }, [storeId]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const query = productSearch.trim();
      if (!query) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      try {
        const results = await searchStoreProducts(query, storeId);
        setSearchResults(results);
      } catch (err) {
        toast.error("Failed to search products");
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [productSearch, storeId]);

  const loadDependencies = async () => {
    try {
      const [sellersResult, productsResult] = await Promise.allSettled([
        getSellers(storeId, { limit: 100 }),
        getStoreProducts(storeId)
      ]);

      if (sellersResult.status === "fulfilled") {
        setSellers(sellersResult.value?.sellers || sellersResult.value?.data || []);
      }
      if (productsResult.status === "fulfilled") {
        setProducts(productsResult.value?.products || productsResult.value?.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const generatePONumber = () => {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `PO-${datePart}-${randomPart}`;
  };

  const handleProductSelect = (productId) => {
    setSelectedProductId(productId);
    const selectedProduct = products.find(p => p._id === productId) || searchResults.find(p => p._id === productId);
    if (selectedProduct) {
      const price = selectedProduct.buyingPrice ?? selectedProduct.purchasePrice ?? 0;
      setPendingItem(prev => ({
        ...prev,
        product: productId,
        name: selectedProduct.name,
        sku: selectedProduct.sku,
        quantity: 1,
        purchasePrice: price,
        discount: 0,
        tax: 0,
        subtotal: price
      }));
    }
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

  const addPendingItem = () => {
    if (!selectedProductId) return;
    
    // Check if duplicate
    const existingIndex = items.findIndex(item => item.product === selectedProductId);
    if (existingIndex >= 0) {
      const newItems = [...items];
      const existing = newItems[existingIndex];
      const newQty = existing.quantity + (pendingItem.quantity || 1);
      
      existing.quantity = newQty;
      const base = newQty * existing.purchasePrice;
      existing.subtotal = Math.max(0, base - existing.discount + existing.tax);
      
      setItems(newItems);
    } else {
      setItems([...items, { ...pendingItem }]);
    }
    
    setPendingItem({ ...EMPTY_ITEM });
    setSelectedProductId("");
    setProductSearch("");
    setSearchResults([]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calcSubtotal = () => items.reduce((sum, item) => sum + (item.quantity * item.purchasePrice), 0);
  const calcDiscount = () => items.reduce((sum, item) => sum + (item.discount || 0), 0);
  const calcTax = () => items.reduce((sum, item) => sum + (item.tax || 0), 0);
  const calcGrandTotal = () => items.reduce((sum, item) => sum + (item.subtotal || 0), 0);

  const validate = () => {
    const e = {};
    if (!sellerId) e.sellerId = "Supplier is required";
    if (!poNumber.trim()) e.poNumber = "PO Number is required";
    if (!orderDate) e.orderDate = "Order Date is required";
    if (items.length === 0) e.items = "Add at least one item";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const payload = {
        sellerId,
        poNumber,
        orderDate,
        expectedDeliveryDate: expectedDeliveryDate || null,
        notes,
        items: items.map(i => ({
          productId: i.product,
          quantity: i.quantity,
          purchasePrice: i.purchasePrice,
          discount: i.discount,
          tax: i.tax
        }))
      };

      const res = await createPurchaseOrder(storeId, payload);
      toast.success("Purchase Order created successfully");
      navigate(`/storeDashboard/${storeId}/purchases/orders/${res.data._id}`);
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || "Failed to create Purchase Order" });
      toast.error("Failed to create Purchase Order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 mb-20">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/storeDashboard/${storeId}/purchases/orders`}
          className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Plus className="h-6 w-6 text-indigo-600" />
            Create Purchase Order
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Draft a new purchase order for a supplier
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Order Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Supplier *</label>
              <select
                value={sellerId}
                onChange={e => { setSellerId(e.target.value); setErrors({...errors, sellerId: null}); }}
                className={`w-full border ${errors.sellerId ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none`}
              >
                <option value="">Select Supplier</option>
                {sellers.map(s => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
              {errors.sellerId && <p className="text-red-500 text-xs mt-1">{errors.sellerId}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">PO Number *</label>
              <input
                type="text"
                value={poNumber}
                onChange={e => { setPoNumber(e.target.value); setErrors({...errors, poNumber: null}); }}
                className={`w-full border ${errors.poNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none`}
              />
              {errors.poNumber && <p className="text-red-500 text-xs mt-1">{errors.poNumber}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Order Date *</label>
              <input
                type="date"
                value={orderDate}
                onChange={e => { setOrderDate(e.target.value); setErrors({...errors, orderDate: null}); }}
                className={`w-full border ${errors.orderDate ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none`}
              />
              {errors.orderDate && <p className="text-red-500 text-xs mt-1">{errors.orderDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Expected Delivery Date</label>
              <input
                type="date"
                value={expectedDeliveryDate}
                onChange={e => setExpectedDeliveryDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="font-bold text-gray-900">Order Items *</h3>
            <button
              type="button"
              onClick={() => setIsNewProductOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors border border-indigo-200 shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              + New Product
            </button>
          </div>
          
          {/* Add Item Form */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
              <div className="md:col-span-2 relative">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Search Product</label>
                  <button
                    type="button"
                    onClick={() => setIsNewProductOpen(true)}
                    className="text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    + New Product
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    placeholder="Type to search..."
                    className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  {isSearching && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                {/* Search Results Dropdown */}
                {productSearch && searchResults.length > 0 && !selectedProductId && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {searchResults.map(p => (
                      <div
                        key={p._id}
                        onClick={() => handleProductSelect(p._id)}
                        className="px-4 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                      >
                        <div className="font-semibold text-sm text-slate-800">{p.name}</div>
                        <div className="text-xs text-slate-500 flex gap-2">
                          <span>SKU: {p.sku || '-'}</span>
                          <span>Stock: {p.stock ?? p.quantity ?? 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* No products found */}
                {!isSearching && productSearch.trim() && searchResults.length === 0 && !selectedProductId && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl p-3 text-center">
                    <p className="text-xs text-slate-600 mb-2">No product found matching "{productSearch}"</p>
                    <button
                      type="button"
                      onClick={() => setIsNewProductOpen(true)}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-700 transition"
                    >
                      + Add New Product
                    </button>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Qty</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={pendingItem.quantity}
                  onChange={e => handlePendingItemChange("quantity", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Price</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={pendingItem.purchasePrice}
                  onChange={e => handlePendingItemChange("purchasePrice", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Total</label>
                <div className="px-3 py-2 text-sm font-bold text-slate-800 bg-white border border-slate-200 rounded-lg">
                  {currencyFormat(pendingItem.subtotal)}
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={addPendingItem}
                  disabled={!selectedProductId || pendingItem.quantity <= 0}
                  className="w-full px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Add
                </button>
              </div>
            </div>
          </div>

          {/* Items Table */}
          {errors.items && <p className="text-red-500 text-sm font-medium mb-3">⚠ {errors.items}</p>}
          <div className="border border-gray-200 rounded-lg overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 w-10 text-center">#</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">Qty</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.length === 0 ? (
                  <tr><td colSpan="6" className="p-4 text-center text-gray-400">No items added yet. Search and add products above.</td></tr>
                ) : (
                  items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-center text-gray-500">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">SKU: {item.sku}</div>
                      </td>
                      <td className="px-4 py-3 text-right">{currencyFormat(item.purchasePrice)}</td>
                      <td className="px-4 py-3 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-right font-semibold text-indigo-700">{currencyFormat(item.subtotal)}</td>
                      <td className="px-4 py-3 text-center">
                        <button type="button" onClick={() => removeItem(idx)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary & Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Additional Notes</h3>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any special instructions for the supplier..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            ></textarea>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">{currencyFormat(calcSubtotal())}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Total Discount</span>
                <span className="font-medium">-{currencyFormat(calcDiscount())}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Total Tax</span>
                <span className="font-medium">{currencyFormat(calcTax())}</span>
              </div>
              <div className="pt-4 mt-2 border-t flex justify-between items-center">
                <span className="font-bold text-gray-900">Grand Total</span>
                <span className="text-xl font-black text-indigo-700">{currencyFormat(calcGrandTotal())}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 border-t pt-6 pb-6">
          {errors.submit && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg text-sm font-medium">
              <AlertCircle className="h-4 w-4" /> {errors.submit}
            </div>
          )}
          <Link
            href={`/storeDashboard/${storeId}/purchases/orders`}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-bold shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? "Creating..." : "Save Purchase Order"}
          </button>
        </div>
      </form>

      <AddProductModal
        isOpen={isNewProductOpen}
        onClose={() => setIsNewProductOpen(false)}
        onAction={handleNewProduct}
        loading={loading}
      />
    </div>
  );
}





